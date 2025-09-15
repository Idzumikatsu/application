import httpClient from './httpClient';
import { Notification, PackageNotification, NotificationType } from '../types';

class NotificationService {
  // Package notifications - corrected endpoints
  public async getPackageNotifications(): Promise<PackageNotification[]> {
    const response = await httpClient.get<PackageNotification[]>('/notifications/recipients/1/ADMIN/type/PACKAGE_LOW_BALANCE'); // backend: /api/notifications/recipients/{recipientId}/{type}
    return response.data;
  }

  public async getPackageNotificationById(id: number): Promise<PackageNotification> {
    const response = await httpClient.get<PackageNotification>(`/notifications/${id}`); // backend: /api/notifications/{id}
    return response.data;
  }

  public async createPackageNotification(notificationData: Partial<PackageNotification>): Promise<PackageNotification> {
    // This functionality needs backend implementation - for now use general notifications
    const response = await httpClient.post<PackageNotification>('/notifications/recipients/1/ADMIN', notificationData);
    return response.data;
  }

  public async updatePackageNotification(id: number, notificationData: Partial<PackageNotification>): Promise<PackageNotification> {
    // Package notifications are read-only - return current state
    return this.getPackageNotificationById(id);
  }

  public async deletePackageNotification(id: number): Promise<void> {
    await httpClient.delete(`/notifications/${id}`);
  }

  public async markPackageNotificationAsRead(id: number): Promise<PackageNotification> {
    const response = await httpClient.post<PackageNotification>(`/notifications/${id}/mark-as-read`); // backend: /api/notifications/{id}/mark-as-read
    return response.data;
  }

  public async markAllPackageNotificationsAsRead(): Promise<void> {
    await httpClient.post('/notifications/mark-all-as-read'); // backend: /api/notifications/mark-all-as-read with recipient context
  }

  // General notifications - corrected endpoints
  public async getAllNotifications(): Promise<Notification[]> {
    // Backend requires recipient context - using admin as default
    const response = await httpClient.get<Notification[]>('/notifications/recipients/1/ADMIN'); // backend: /api/notifications/recipients/{recipientId}/{type}
    return response.data;
  }

  public async getNotificationById(id: number): Promise<Notification> {
    const response = await httpClient.get<Notification>(`/notifications/${id}`); // backend: /api/notifications/{id}
    return response.data;
  }

  public async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await httpClient.post<Notification>(`/notifications/${id}/mark-as-read`); // backend: /api/notifications/{id}/mark-as-read
    return response.data;
  }

  public async markAllNotificationsAsRead(): Promise<void> {
    // Backend requires recipient context for mark-all
    await httpClient.post('/notifications/recipients/1/ADMIN/mark-all-as-read'); // backend: needs recipient context
  }

  public async getUnreadNotificationsCount(): Promise<number> {
    const response = await httpClient.get<number>('/notifications/recipients/1/ADMIN/unread-count'); // backend: /api/notifications/recipients/{recipientId}/{type}/unread-count
    return response.data;
  }

  // New methods for filtering notifications by type
  public async getNotificationsByType(
    userId: number,
    userRole: string,
    notificationType: NotificationType
  ): Promise<Notification[]> {
    const response = await httpClient.get<Notification[]>(
      `/notifications/user/${userId}/role/${userRole}/type/${notificationType}`
    );
    return response.data;
  }

  public async getPendingNotifications(userId: number, userRole: string): Promise<Notification[]> {
    const response = await httpClient.get<Notification[]>(
      `/notifications/user/${userId}/role/${userRole}/status/pending`
    );
    return response.data;
  }

  // Alias methods for backward compatibility
  public async getNotifications(userId: number, userRole: string): Promise<Notification[]> {
    return this.getAllNotifications();
  }

  public async markAsRead(id: number): Promise<Notification> {
    return this.markNotificationAsRead(id);
  }

  public async markAllAsRead(userId: number, userRole: string): Promise<void> {
    return this.markAllNotificationsAsRead();
  }

  // Email notifications
  public async sendPackageEmailNotification(studentId: number, packageId: number): Promise<void> {
    await httpClient.post(`/notifications/packages/${packageId}/email`, { studentId });
  }

  public async sendPackageSmsNotification(studentId: number, packageId: number): Promise<void> {
    await httpClient.post(`/notifications/packages/${packageId}/sms`, { studentId });
  }

  public async sendPackageTelegramNotification(studentId: number, packageId: number): Promise<void> {
    await httpClient.post(`/notifications/packages/${packageId}/telegram`, { studentId });
  }

  // Notification settings
  public async getNotificationSettings(): Promise<any> {
    const response = await httpClient.get('/notifications/settings');
    return response.data;
  }

  public async updateNotificationSettings(settings: any): Promise<any> {
    const response = await httpClient.put('/notifications/settings', settings);
    return response.data;
  }

  // Lesson status change notifications
  public async createLessonStatusNotification(
    studentId: number,
    lessonId: number,
    oldStatus: string,
    newStatus: string,
    reason?: string
  ): Promise<Notification> {
    const statusTextMap: Record<string, string> = {
      'SCHEDULED': 'Запланирован',
      'CONDUCTED': 'Проведен',
      'COMPLETED': 'Завершен',
      'CANCELLED': 'Отменен',
      'MISSED': 'Пропущен'
    };

    const title = `Статус урока изменен`;
    const message = `Статус вашего урока изменен с "${statusTextMap[oldStatus]}" на "${statusTextMap[newStatus]}".${reason ? ` Причина: ${reason}` : ''}`;

    const notificationData = {
      recipientId: studentId,
      recipientType: 'STUDENT',
      notificationType: 'LESSON_COMPLETED' as const,
      title,
      message,
      status: 'PENDING' as const,
      priority: 1,
      relatedEntityId: lessonId
    };

    // В реальной реализации здесь будет вызов API
    // const response = await httpClient.post<Notification>('/notifications/lesson-status', notificationData);
    // return response.data;
    
    // Временная реализация для демонстрации
    return {
      ...notificationData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Notification;
  }

  // Helper methods
  public getNotificationTypeText(type: string): string {
    switch (type) {
      case 'PACKAGE_LOW_BALANCE': return 'Низкий баланс пакета';
      case 'PACKAGE_EXPIRING': return 'Пакет истекает';
      case 'PACKAGE_EXPIRED': return 'Пакет истек';
      case 'LESSON_SCHEDULED': return 'Урок запланирован';
      case 'LESSON_CANCELLED': return 'Урок отменен';
      case 'LESSON_REMINDER': return 'Напоминание об уроке';
      case 'LESSON_COMPLETED': return 'Урок завершен';
      case 'PAYMENT_RECEIVED': return 'Платеж получен';
      case 'SYSTEM_ALERT': return 'Системное уведомление';
      default: return 'Неизвестный тип';
    }
  }

  public getNotificationPriorityText(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'Высокий';
      case 'MEDIUM': return 'Средний';
      case 'LOW': return 'Низкий';
      default: return 'Неизвестный';
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
