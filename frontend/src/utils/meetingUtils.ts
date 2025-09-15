/**
 * Утилиты для работы с видеоконференциями
 */

/**
 * Генерирует уникальную ссылку для видеоконференции
 * @param prefix - префикс для ссылки (опционально)
 * @returns Ссылка на видеоконференцию
 */
export const generateMeetingLink = (prefix?: string): string => {
  const baseUrl = 'https://meet.crm-school.com';
  const meetingId = generateMeetingId();
  return `${baseUrl}/${prefix ? `${prefix}-` : ''}${meetingId}`;
};

/**
 * Генерирует уникальный ID для встречи
 * @returns Уникальный идентификатор встречи
 */
const generateMeetingId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Проверяет валидность ссылки на видеоконференцию
 * @param link - ссылка для проверки
 * @returns true если ссылка валидна
 */
export const isValidMeetingLink = (link: string): boolean => {
  try {
    const url = new URL(link);
    return url.protocol === 'https:' && url.hostname.includes('crm-school.com');
  } catch {
    return false;
  }
};

/**
 * Форматирует время для отображения в календаре встреч
 * @param date - дата и время
 * @returns Отформатированная строка времени
 */
export const formatMeetingTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow'
  });
};

/**
 * Создает описание встречи для календаря
 * @param title - заголовок встречи
 * @param description - описание встречи
 * @param meetingLink - ссылка на встречу
 * @returns Форматированное описание
 */
export const createMeetingDescription = (
  title: string,
  description: string,
  meetingLink: string
): string => {
  return `
${title}

${description}

Ссылка для подключения: ${meetingLink}

Время: ${new Date().toLocaleDateString('ru-RU')}
  `.trim();
};