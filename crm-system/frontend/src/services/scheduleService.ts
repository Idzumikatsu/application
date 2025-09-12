/**
 * Сервис для работы с расписанием уроков и слотами доступности
 */

import httpClient from './httpClient';
import {
  Lesson,
  GroupLesson,
  AvailabilitySlot,
  CalendarEvent,
  LessonStatus,
  AvailabilitySlotStatus
} from '../types';

/**
 * Получает уроки преподавателя за указанный период
 * @param teacherId - ID преподавателя
 * @param startDate - начальная дата периода
 * @param endDate - конечная дата периода
 * @returns Массив уроков
 */
export const getTeacherLessons = async (
  teacherId: number,
  startDate: string,
  endDate: string
): Promise<Lesson[]> => {
  try {
    const response = await httpClient.get(`/teachers/${teacherId}/lessons`, {  // backend: /api/teachers/{teacherId}/lessons
      params: { startDate, endDate }
    });
    return response.data as Lesson[];
  } catch (error) {
    console.error('Ошибка получения уроков преподавателя:', error);
    throw error;
  }
};

/**
 * Получает групповые уроки преподавателя за указанный период
 * @param teacherId - ID преподавателя
 * @param startDate - начальная дата периода
 * @param endDate - конечная дата периода
 * @returns Массив групповых уроков
 */
export const getTeacherGroupLessons = async (
  teacherId: number,
  startDate: string,
  endDate: string
): Promise<GroupLesson[]> => {
  try {
    const response = await httpClient.get(`/teachers/${teacherId}/group-lessons`, {  // backend: /api/teachers/{teacherId}/group-lessons
      params: { startDate, endDate }
    });
    return response.data as GroupLesson[];
  } catch (error) {
    console.error('Ошибка получения групповых уроков преподавателя:', error);
    throw error;
  }
};

/**
 * Получает все события календаря для пользователя
 * @param userId - ID пользователя
 * @param startDate - начальная дата периода
 * @param endDate - конечная дата периода
 * @returns Массив событий календаря
 */
export const getCalendarEvents = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> => {
  try {
    const [lessons, groupLessons, availabilitySlots] = await Promise.all([
      getTeacherLessons(userId, startDate, endDate),
      getTeacherGroupLessons(userId, startDate, endDate),
      getTeacherAvailability(userId, startDate, endDate)
    ]);

    const events: CalendarEvent[] = [];

    // Конвертируем уроки в события календаря
    lessons.forEach(lesson => {
      const startDate = new Date(`${lesson.scheduledDate}T${lesson.scheduledTime}`);
      const endDate = new Date(startDate.getTime() + lesson.durationMinutes * 60000);
      
      events.push({
        id: `lesson-${lesson.id}`,
        title: `Урок: ${lesson.student?.firstName} ${lesson.student?.lastName}`,
        start: startDate,
        end: endDate,
        type: 'lesson',
        status: lesson.status,
        resource: {
          description: lesson.notes || '',
          meetingLink: '',
          studentId: lesson.studentId,
          lessonId: lesson.id
        }
      });
    });

    // Конвертируем групповые уроки в события календаря
    groupLessons.forEach(groupLesson => {
      const startDate = new Date(`${groupLesson.scheduledDate}T${groupLesson.scheduledTime}`);
      const endDate = new Date(startDate.getTime() + groupLesson.durationMinutes * 60000);
      
      events.push({
        id: `group-lesson-${groupLesson.id}`,
        title: `Групповой урок: ${groupLesson.lessonTopic}`,
        start: startDate,
        end: endDate,
        type: 'group-lesson',
        status: groupLesson.status,
        resource: {
          description: groupLesson.description || '',
          meetingLink: groupLesson.meetingLink || '',
          lessonId: groupLesson.id
        }
      });
    });

    // Конвертируем слоты доступности в события календаря
    availabilitySlots.forEach(slot => {
      const startDate = new Date(`${slot.slotDate}T${slot.slotTime}`);
      const endDate = new Date(startDate.getTime() + slot.durationMinutes * 60000);
      
      events.push({
        id: `availability-${slot.id}`,
        title: 'Доступность',
        start: startDate,
        end: endDate,
        type: 'availability',
        status: slot.status,
        resource: {
          description: `Длительность: ${slot.durationMinutes} минут`,
          meetingLink: '',
          slotId: slot.id
        }
      });
    });

    return events;
  } catch (error) {
    console.error('Ошибка получения событий календаря:', error);
    throw error;
  }
};

/**
 * Получает слоты доступности преподавателя
 * @param teacherId - ID преподавателя
 * @param startDate - начальная дата периода
 * @param endDate - конечная дата периода
 * @returns Массив слотов доступности
 */
export const getTeacherAvailability = async (
  teacherId: number,
  startDate: string,
  endDate: string
): Promise<AvailabilitySlot[]> => {
  try {
    const response = await httpClient.get(`/teachers/${teacherId}/availability`, {  // backend: /api/teachers/{teacherId}/availability
      params: { startDate, endDate }
    });
    return response.data as AvailabilitySlot[];
  } catch (error) {
    console.error('Ошибка получения слотов доступности:', error);
    throw error;
  }
};

/**
 * Создает новый урок
 * @param lessonData - данные урока
 * @returns Созданный урок
 */
export const createLesson = async (lessonData: Partial<Lesson>): Promise<Lesson> => {
  try {
    const response = await httpClient.post('/lessons', lessonData);  // backend: /api/lessons
    return response.data as Lesson;
  } catch (error) {
    console.error('Ошибка создания урока:', error);
    throw error;
  }
};

/**
 * Обновляет урок
 * @param lessonId - ID урока
 * @param lessonData - данные для обновления
 * @returns Обновленный урок
 */
export const updateLesson = async (lessonId: number, lessonData: Partial<Lesson>): Promise<Lesson> => {
  try {
    const response = await httpClient.put(`/lessons/${lessonId}`, lessonData);  // backend: /api/lessons/{id}
    return response.data as Lesson;
  } catch (error) {
    console.error('Ошибка обновления урока:', error);
    throw error;
  }
};

/**
 * Удаляет урок
 * @param lessonId - ID урока
 */
export const deleteLesson = async (lessonId: number): Promise<void> => {
  try {
    await httpClient.delete(`/lessons/${lessonId}`);  // backend: /api/lessons/{id}
  } catch (error) {
    console.error('Ошибка удаления урока:', error);
    throw error;
  }
};

/**
 * Создает слот доступности
 * @param slotData - данные слота
 * @returns Созданный слот
 */
export const createAvailabilitySlot = async (slotData: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> => {
  try {
    const response = await httpClient.post('/teachers/availability', slotData);  // backend: /api/teachers/availability
    return response.data as AvailabilitySlot;
  } catch (error) {
    console.error('Ошибка создания слота доступности:', error);
    throw error;
  }
};

/**
 * Обновляет слот доступности
 * @param slotId - ID слота
 * @param slotData - данные для обновления
 * @returns Обновленный слот
 */
export const updateAvailabilitySlot = async (
  slotId: number,
  slotData: Partial<AvailabilitySlot>
): Promise<AvailabilitySlot> => {
  try {
    const response = await httpClient.put(`/availability-slots/${slotId}`, slotData);  // backend: /api/availability-slots/{id}
    return response.data as AvailabilitySlot;
  } catch (error) {
    console.error('Ошибка обновления слота доступности:', error);
    throw error;
  }
};

/**
 * Удаляет слот доступности
 * @param slotId - ID слота
 */
export const deleteAvailabilitySlot = async (slotId: number): Promise<void> => {
  try {
    await httpClient.delete(`/availability-slots/${slotId}`);  // backend: /api/availability-slots/{id}
  } catch (error) {
    console.error('Ошибка удаления слота доступности:', error);
    throw error;
  }
};

/**
 * Обновляет событие календаря
 * @param eventId - ID события
 * @param eventData - данные для обновления
 * @returns Обновленное событие
 */
export const updateCalendarEvent = async (
  eventId: string,
  eventData: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
  try {
    const [type, id] = eventId.split('-');
    
    switch (type) {
      case 'lesson':
        const lesson = await updateLesson(parseInt(id), {
          scheduledDate: eventData.start?.toISOString().split('T')[0],
          scheduledTime: eventData.start?.toTimeString().split(' ')[0],
          durationMinutes: eventData.end && eventData.start
            ? Math.round((eventData.end.getTime() - eventData.start.getTime()) / 60000)
            : undefined,
          notes: eventData.resource?.description,
          status: eventData.status as LessonStatus
        });
        return {
          ...eventData as CalendarEvent,
          id: eventId,
          resource: { ...eventData.resource, lessonId: lesson.id }
        };

      case 'availability':
        const slot = await updateAvailabilitySlot(parseInt(id), {
          slotDate: eventData.start?.toISOString().split('T')[0],
          slotTime: eventData.start?.toTimeString().split(' ')[0],
          durationMinutes: eventData.end && eventData.start 
            ? Math.round((eventData.end.getTime() - eventData.start.getTime()) / 60000)
            : undefined,
          status: eventData.status as AvailabilitySlotStatus
        });
        return {
          ...eventData as CalendarEvent,
          id: eventId,
          resource: { ...eventData.resource, slotId: slot.id }
        };

      default:
        throw new Error('Неизвестный тип события');
    }
  } catch (error) {
    console.error('Ошибка обновления события календаря:', error);
    throw error;
  }
};

/**
 * Удаляет событие календаря
 * @param eventId - ID события
 */
export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  try {
    const [type, id] = eventId.split('-');
    
    switch (type) {
      case 'lesson':
        await deleteLesson(parseInt(id));
        break;

      case 'availability':
        await deleteAvailabilitySlot(parseInt(id));
        break;

      default:
        throw new Error('Неизвестный тип события');
    }
  } catch (error) {
    console.error('Ошибка удаления события календаря:', error);
    throw error;
  }
};

/** Duplicate functions removed - already declared above with correct endpoints **/

/**
 * Проверяет конфликты расписания
 * @param teacherId - ID преподавателя
 * @param start - время начала
 * @param end - время окончания
 * @param excludeEventId - ID события для исключения (при редактировании)
 * @returns Массив конфликтующих событий
 */
export const checkScheduleConflicts = async (
  teacherId: number,
  start: Date,
  end: Date,
  excludeEventId?: string
): Promise<CalendarEvent[]> => {
  try {
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    const events = await getCalendarEvents(teacherId, startDate, endDate);
    
    return events.filter(event => {
      if (excludeEventId && event.id === excludeEventId) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      return (
        (start < eventEnd && end > eventStart) ||
        (eventStart < end && eventEnd > start)
      );
    });
  } catch (error) {
    console.error('Ошибка проверки конфликтов:', error);
    throw error;
  }
};
