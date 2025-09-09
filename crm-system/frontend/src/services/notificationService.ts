import httpClient from './httpClient';
import { Notification, NotificationStatus, NotificationType } from '../types';

class NotificationService {
  public async getNotifications(recipientId: number, recipientType: string): Promise<Notification[]> {
    const params = new URLSearchParams();
    params.append('recipientType', recipientType);
    
    const response = await httpClient.get<Notification[]>(`/notifications/recipients/${recipientId}`, { params });
    return response.data;
  }

  public async getNotificationById(id: number): Promise<Notification> {
    const response = await httpClient.get<Notification>(`/notifications/${id}`);
    return response.data;
  }

  public async markAsRead(id: number): Promise<Notification> {
    const response = await httpClient.post<Notification>(`/notifications/${id}/mark-as-read`);
    return response.data;
  }

  public async markAsUnread(id: number): Promise<Notification> {
    const response = await httpClient.post<Notification>(`/notifications/${id}/mark-as-unread`);
    return response.data;
  }

  public async markAllAsRead(recipientId: number, recipientType: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('recipientType', recipientType);
    
    await httpClient.post(`/notifications/recipients/${recipientId}/mark-all-as-read`, null, { params });
  }

  public async deleteNotification(id: number): Promise<void> {
    await httpClient.delete(`/notifications/${id}`);
  }

  public async deleteAllNotifications(recipientId: number, recipientType: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('recipientType', recipientType);
    
    await httpClient.delete(`/notifications/recipients/${recipientId}`, { params });
  }

  public async getUnreadCount(recipientId: number, recipientType: string): Promise<number> {
    const params = new URLSearchParams();
    params.append('recipientType', recipientType);
    
    const response = await httpClient.get<number>(`/notifications/recipients/${recipientId}/unread-count`, { params });
    return response.data;
  }

  public async getPendingNotifications(recipientId: number, recipientType: string): Promise<Notification[]> {
    const params = new URLSearchParams();
    params.append('recipientType', recipientType);
    
    const response = await httpClient.get<Notification[]>(`/notifications/recipients/${recipientId}/pending`, { params });
    return response.data;
  }

  public async getNotificationsByType(recipientId: number, recipientType: string, notificationType: NotificationType): Promise<Notification[]> {
    const params = new URLSearchParams();
    params.append('recipientType', recipientType);
    params.append('notificationType', notificationType);
    
    const response = await httpClient.get<Notification[]>(`/notifications/recipients/${recipientId}/type/${notificationType}`, { params });
    return response.data;
  }

  public async getNotificationsByStatus(recipientId: number, recipientType: string, status: NotificationStatus): Promise<Notification[]> {
    const params = new URLSearchParams();
    params.append('recipientType', recipientType);
    params.append('status', status);
    
    const response = await httpClient.get<Notification[]>(`/notifications/recipients/${recipientId}/status/${status}`, { params });
    return response.data;
  }

  // Helper methods
  public getNotificationTypeText(type: NotificationType): string {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED: return 'Урок запланирован';
      case NotificationType.LESSON_CANCELLED: return 'Урок отменен';
      case NotificationType.LESSON_REMINDER: return 'Напоминание об уроке';
      case NotificationType.LESSON_COMPLETED: return 'Урок завершен';
      case NotificationType.GROUP_LESSON_SCHEDULED: return 'Групповой урок запланирован';
      case NotificationType.GROUP_LESSON_CANCELLED: return 'Групповой урок отменен';
      case NotificationType.GROUP_LESSON_REMINDER: return 'Напоминание о групповом уроке';
      case NotificationType.PACKAGE_ENDING_SOON: return 'Пакет уроков заканчивается';
      case NotificationType.PAYMENT_DUE: return 'Оплата по расписанию';
      case NotificationType.SYSTEM_MESSAGE: return 'Системное сообщение';
      case NotificationType.FEEDBACK_REQUEST: return 'Запрос на обратную связь';
      default: return 'Уведомление';
    }
  }

  public getNotificationStatusText(status: NotificationStatus): string {
    switch (status) {
      case NotificationStatus.PENDING: return 'Ожидает отправки';
      case NotificationStatus.SENT: return 'Отправлено';
      case NotificationStatus.DELIVERED: return 'Доставлено';
      case NotificationStatus.READ: return 'Прочитано';
      case NotificationStatus.FAILED: return 'Ошибка отправки';
      default: return 'Неизвестно';
    }
  }

  public getNotificationStatusColor(status: NotificationStatus): string {
    switch (status) {
      case NotificationStatus.PENDING: return 'default';
      case NotificationStatus.SENT: return 'primary';
      case NotificationStatus.DELIVERED: return 'secondary';
      case NotificationStatus.READ: return 'success';
      case NotificationStatus.FAILED: return 'error';
      default: return 'default';
    }
  }

  public getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.LESSON_SCHEDULED:
      case NotificationType.GROUP_LESSON_SCHEDULED:
        return 'event';
      case NotificationType.LESSON_CANCELLED:
      case NotificationType.GROUP_LESSON_CANCELLED:
        return 'cancel';
      case NotificationType.LESSON_REMINDER:
      case NotificationType.GROUP_LESSON_REMINDER:
        return 'alarm';
      case NotificationType.LESSON_COMPLETED:
      case NotificationType.GROUP_LESSON_COMPLETED:
        return 'check_circle';
      case NotificationType.PACKAGE_ENDING_SOON:
        return 'warning';
      case NotificationType.PAYMENT_DUE:
        return 'payment';
      case NotificationType.SYSTEM_MESSAGE:
        return 'info';
      case NotificationType.FEEDBACK_REQUEST:
        return 'rate_review';
      default:
        return 'notifications';
    }
  }
}

export default new NotificationService();