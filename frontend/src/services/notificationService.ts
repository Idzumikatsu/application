import httpClient from './httpClient';
import { Notification, NotificationStatus, PaginatedResponse } from '../types';

class NotificationService {
  public async getNotifications(
    recipientId: number,
    recipientType: string,
    options?: {
      statuses?: NotificationStatus[];
      types?: string[];
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
    }
  ): Promise<PaginatedResponse<Notification>> {
    const params: Record<string, any> = {};
    if (options?.statuses?.length) {
      params.statuses = options.statuses.join(',');
    }
    if (options?.types?.length) {
      params.types = options.types.join(',');
    }
    if (options?.startDate) {
      params.startDate = options.startDate;
    }
    if (options?.endDate) {
      params.endDate = options.endDate;
    }
    if (options?.page !== undefined) {
      params.page = options.page;
    }
    if (options?.size !== undefined) {
      params.size = options.size;
    }

    const response = await httpClient.get(`/notifications/recipients/${recipientId}/${recipientType}`, { params });
    const data: any = response.data ?? {};
    const content = Array.isArray(data.content) ? data.content : [];

    return {
      content,
      totalElements: typeof data.totalElements === 'number' ? data.totalElements : content.length,
      totalPages: typeof data.totalPages === 'number' ? data.totalPages : 1,
      size: typeof data.size === 'number' ? data.size : content.length,
      page: typeof data.number === 'number' ? data.number : (typeof data.page === 'number' ? data.page : 0),
    };
  }

  public async getNotificationById(id: number): Promise<Notification> {
    const response = await httpClient.get<Notification>(`/notifications/${id}`);
    return response.data;
  }

  public async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await httpClient.post<Notification>(`/notifications/${id}/mark-as-read`);
    return response.data;
  }

  public async markAllAsRead(recipientId: number, recipientType: string): Promise<void> {
    await httpClient.post(`/notifications/recipients/${recipientId}/${recipientType}/mark-all-as-read`);
  }

  public async getUnreadCount(recipientId: number, recipientType: string): Promise<number> {
    const response = await httpClient.get<number>(`/notifications/recipients/${recipientId}/${recipientType}/unread-count`);
    return response.data;
  }

  public async getPendingNotifications(recipientId: number, recipientType: string): Promise<Notification[]> {
    const response = await httpClient.get<Notification[]>(`/notifications/recipients/${recipientId}/${recipientType}/pending`);
    return response.data;
  }
}

const notificationService = new NotificationService();
export default notificationService;
