import { Lesson, LessonStatus, LessonStatusHistory, LessonStatusChangeRequest } from '../types';
import lessonService from './lessonService';
import notificationService from './notificationService';

export interface TransitionRule {
  from: LessonStatus;
  to: LessonStatus;
  condition: (lesson: Lesson) => boolean;
  description: string;
}

export class LessonStatusTransitionService {
  private static transitionRules: TransitionRule[] = [
    {
      from: LessonStatus.SCHEDULED,
      to: LessonStatus.CONDUCTED,
      condition: (lesson: Lesson) => {
        // Автоматическое начало урока в запланированное время
        const lessonDate = new Date(`${lesson.scheduledDate}T${lesson.scheduledTime}`);
        const now = new Date();
        return now >= lessonDate && now < new Date(lessonDate.getTime() + lesson.durationMinutes * 60 * 1000);
      },
      description: 'Автоматическое начало урока в запланированное время'
    },
    {
      from: LessonStatus.CONDUCTED,
      to: LessonStatus.COMPLETED,
      condition: (lesson: Lesson) => {
        // Завершение урока по истечении времени
        const lessonDate = new Date(`${lesson.scheduledDate}T${lesson.scheduledTime}`);
        const endTime = new Date(lessonDate.getTime() + lesson.durationMinutes * 60 * 1000);
        return new Date() >= endTime;
      },
      description: 'Автоматическое завершение урока по истечении времени'
    },
    {
      from: LessonStatus.SCHEDULED,
      to: LessonStatus.CANCELLED,
      condition: (lesson: Lesson) => {
        // Автоматическая отмена если учитель не подтвердил за 1 час до урока
        const lessonDate = new Date(`${lesson.scheduledDate}T${lesson.scheduledTime}`);
        const now = new Date();
        const timeDiff = lessonDate.getTime() - now.getTime();
        return timeDiff <= 60 * 60 * 1000 && timeDiff > 0 && !lesson.confirmedByTeacher;
      },
      description: 'Автоматическая отмена из-за неподтверждения учителем'
    },
    {
      from: LessonStatus.SCHEDULED,
      to: LessonStatus.MISSED,
      condition: (lesson: Lesson) => {
        // Отметка как пропущенный через 15 минут после начала
        const lessonDate = new Date(`${lesson.scheduledDate}T${lesson.scheduledTime}`);
        const now = new Date();
        return now > new Date(lessonDate.getTime() + 15 * 60 * 1000) && lesson.status === LessonStatus.SCHEDULED;
      },
      description: 'Автоматическая отметка пропуска через 15 минут после начала'
    }
  ];

  /**
   * Проверяет и применяет автоматические переходы статусов для урока
   */
  static async checkAndApplyTransitions(lesson: Lesson): Promise<Lesson | null> {
    const applicableRule = this.transitionRules.find(rule => 
      rule.from === lesson.status && rule.condition(lesson)
    );

    if (!applicableRule) {
      return null;
    }

    try {
      // Создаем запись в истории статусов
      const statusHistory: Partial<LessonStatusHistory> = {
        oldStatus: lesson.status,
        newStatus: applicableRule.to,
        changedBy: 'system',
        changeReason: applicableRule.description,
        automated: true
      };

      // Обновляем статус урока
      const statusChangeRequest: LessonStatusChangeRequest = {
        newStatus: applicableRule.to,
        reason: applicableRule.description
      };

      const updatedLesson = await lessonService.changeLessonStatus(
        lesson.id,
        statusChangeRequest
      );

      // Создаем уведомление о смене статуса
      await this.createStatusChangeNotification(lesson, applicableRule.to, applicableRule.description);

      return updatedLesson;
    } catch (error) {
      console.error('Ошибка при автоматическом переходе статуса:', error);
      return null;
    }
  }

  /**
   * Создает уведомление о смене статуса урока
   */
  private static async createStatusChangeNotification(
    lesson: Lesson, 
    newStatus: LessonStatus,
    reason: string
  ): Promise<void> {
    const statusText = this.getStatusText(newStatus);
    
    try {
      await notificationService.createLessonStatusNotification(
        lesson.studentId,
        lesson.id,
        lesson.status,
        newStatus,
        reason
      );
    } catch (error) {
      console.error('Ошибка при создании уведомления:', error);
    }
  }

  /**
   * Получает текстовое описание статуса
   */
  private static getStatusText(status: LessonStatus): string {
    const statusMap: Record<LessonStatus, string> = {
      [LessonStatus.SCHEDULED]: 'Запланирован',
      [LessonStatus.CONDUCTED]: 'Проведен',
      [LessonStatus.COMPLETED]: 'Завершен',
      [LessonStatus.CANCELLED]: 'Отменен',
      [LessonStatus.MISSED]: 'Пропущен'
    };
    return statusMap[status];
  }

  /**
   * Запускает периодическую проверку всех уроков
   */
  static startPeriodicCheck(intervalMinutes: number = 5): NodeJS.Timeout {
    return setInterval(async () => {
      try {
        // Получаем уроки для текущего дня
        const today = new Date().toISOString().split('T')[0];
        const teacherLessons = await lessonService.getTeacherLessons(0, today, today);
        const studentLessons = await lessonService.getStudentLessons(0, today, today);
        
        // Объединяем уроки и убираем дубликаты
        const allLessons = [...teacherLessons, ...studentLessons];
        const uniqueLessons = allLessons.filter((lesson, index, self) =>
          index === self.findIndex(l => l.id === lesson.id)
        );
        for (const lesson of uniqueLessons) {
          await this.checkAndApplyTransitions(lesson);
        }
      } catch (error) {
        console.error('Ошибка при периодической проверке статусов:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Получает все правила переходов
   */
  static getTransitionRules(): TransitionRule[] {
    return this.transitionRules;
  }

  /**
   * Добавляет новое правило перехода
   */
  static addTransitionRule(rule: TransitionRule): void {
    this.transitionRules.push(rule);
  }

  /**
   * Удаляет правило перехода
   */
  static removeTransitionRule(from: LessonStatus, to: LessonStatus): void {
    this.transitionRules = this.transitionRules.filter(rule => 
      !(rule.from === from && rule.to === to)
    );
  }
}
