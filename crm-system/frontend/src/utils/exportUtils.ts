/**
 * Утилиты для экспорта расписания в различные форматы
 */

import { CalendarEvent } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Экспорт расписания в формат ICS (iCalendar)
 * @param events - массив событий календаря
 * @param fileName - имя файла для сохранения
 */
export const exportToICS = (events: CalendarEvent[], fileName: string = 'schedule'): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const icsContent = generateICSContent(events);
      downloadFile(icsContent, `${fileName}.ics`, 'text/calendar');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Экспорт расписания в формат PDF
 * @param events - массив событий календаря
 * @param fileName - имя файла для сохранения
 */
export const exportToPDF = (events: CalendarEvent[], fileName: string = 'schedule'): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = generatePDF(events);
      pdf.save(`${fileName}.pdf`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Генерирует содержимое ICS файла
 * @param events - массив событий календаря
 * @returns Строка с содержимым ICS
 */
const generateICSContent = (events: CalendarEvent[]): string => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CRM School//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  events.forEach((event, index) => {
    const eventId = event.id || `event-${index}`;
    const start = formatICSDate(event.start);
    const end = formatICSDate(event.end);
    const summary = escapeICSText(event.title);
    const description = event.resource?.description ? escapeICSText(event.resource.description) : '';

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${eventId}@crm-school.com`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${summary}`,
      description && `DESCRIPTION:${description}`,
      event.resource?.meetingLink && `URL:${event.resource.meetingLink}`,
      `STATUS:${event.status || 'CONFIRMED'}`,
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  return icsContent.filter(line => line !== null && line !== undefined).join('\n');
};

/**
 * Форматирует дату для ICS формата
 * @param date - дата для форматирования
 * @returns Отформатированная строка даты
 */
const formatICSDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Экранирует текст для ICS формата
 * @param text - текст для экранирования
 * @returns Экранированный текст
 */
const escapeICSText = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
};

/**
 * Генерирует PDF документ с расписанием
 * @param events - массив событий календаря
 * @returns Объект jsPDF
 */
const generatePDF = (events: CalendarEvent[]): jsPDF => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Заголовок
  pdf.setFontSize(20);
  pdf.text('Расписание уроков', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`Сгенерировано: ${new Date().toLocaleDateString('ru-RU')}`, pageWidth / 2, 30, { align: 'center' });

  // Таблица с событиями
  const tableData = events.map(event => [
    event.title,
    event.start.toLocaleDateString('ru-RU'),
    event.start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    event.end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    event.type === 'lesson' ? 'Индивидуальный' : event.type === 'group-lesson' ? 'Групповой' : 'Другое',
    event.status || '-'
  ]);

  autoTable(pdf, {
    startY: 40,
    head: [['Название', 'Дата', 'Начало', 'Конец', 'Тип', 'Статус']],
    body: tableData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  return pdf;
};

/**
 * Скачивает файл
 * @param content - содержимое файла
 * @param fileName - имя файла
 * @param mimeType - MIME тип
 */
const downloadFile = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Экспорт в CSV формат (дополнительная опция)
 * @param events - массив событий календаря
 * @param fileName - имя файла
 */
export const exportToCSV = (events: CalendarEvent[], fileName: string = 'schedule'): void => {
  const headers = ['Название', 'Дата', 'Начало', 'Конец', 'Тип', 'Статус', 'Описание'];
  const csvContent = events.map(event => [
    `"${event.title.replace(/"/g, '""')}"`,
    event.start.toLocaleDateString('ru-RU'),
    event.start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    event.end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    event.type,
    event.status || '',
    `"${(event.resource?.description || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers, ...csvContent].map(row => row.join(',')).join('\n');
  downloadFile(csv, `${fileName}.csv`, 'text/csv');
};