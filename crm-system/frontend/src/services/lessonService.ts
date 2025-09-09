import httpClient from './httpClient';
import { Lesson, GroupLesson, GroupLessonRegistration, LessonStatus, GroupLessonStatus } from '../types';

class LessonService {
  // Individual lessons
  public async getTeacherLessons(teacherId: number, startDate?: string, endDate?: string): Promise<Lesson[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get<Lesson[]>(`/teachers/${teacherId}/lessons`, { params });
    return response.data;
  }

  public async getStudentLessons(studentId: number, startDate?: string, endDate?: string): Promise<Lesson[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get<Lesson[]>(`/students/${studentId}/lessons`, { params });
    return response.data;
  }

  public async getLessonById(id: number): Promise<Lesson> {
    const response = await httpClient.get<Lesson>(`/lessons/${id}`);
    return response.data;
  }

  public async createLesson(lessonData: Partial<Lesson>): Promise<Lesson> {
    const response = await httpClient.post<Lesson>('/lessons', lessonData);
    return response.data;
  }

  public async updateLesson(id: number, lessonData: Partial<Lesson>): Promise<Lesson> {
    const response = await httpClient.put<Lesson>(`/lessons/${id}`, lessonData);
    return response.data;
  }

  public async deleteLesson(id: number): Promise<void> {
    await httpClient.delete(`/lessons/${id}`);
  }

  public async completeLesson(id: number): Promise<Lesson> {
    const response = await httpClient.post<Lesson>(`/lessons/${id}/complete`);
    return response.data;
  }

  public async cancelLesson(id: number, reason: string, cancelledBy: string): Promise<Lesson> {
    const params = new URLSearchParams();
    params.append('reason', reason);
    params.append('cancelledBy', cancelledBy);
    
    const response = await httpClient.post<Lesson>(`/lessons/${id}/cancel`, null, { params });
    return response.data;
  }

  public async markLessonAsMissed(id: number): Promise<Lesson> {
    const response = await httpClient.post<Lesson>(`/lessons/${id}/mark-as-missed`);
    return response.data;
  }

  // Group lessons
  public async getTeacherGroupLessons(teacherId: number, page: number = 0, size: number = 10, startDate?: string, endDate?: string): Promise<{content: GroupLesson[], totalElements: number}> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get<{content: GroupLesson[], totalElements: number}>(`/teachers/${teacherId}/group-lessons`, { params });
    return response.data;
  }

  public async getStudentGroupLessons(studentId: number, page: number = 0, size: number = 10, startDate?: string, endDate?: string): Promise<{content: GroupLesson[], totalElements: number}> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get<{content: GroupLesson[], totalElements: number}>(`/students/${studentId}/group-lessons`, { params });
    return response.data;
  }

  public async getGroupLessonById(id: number): Promise<GroupLesson> {
    const response = await httpClient.get<GroupLesson>(`/group-lessons/${id}`);
    return response.data;
  }

  public async createGroupLesson(groupLessonData: Partial<GroupLesson>): Promise<GroupLesson> {
    const response = await httpClient.post<GroupLesson>('/teachers/group-lessons', groupLessonData);
    return response.data;
  }

  public async updateGroupLesson(id: number, groupLessonData: Partial<GroupLesson>): Promise<GroupLesson> {
    const response = await httpClient.put<GroupLesson>(`/group-lessons/${id}`, groupLessonData);
    return response.data;
  }

  public async deleteGroupLesson(id: number): Promise<void> {
    await httpClient.delete(`/group-lessons/${id}`);
  }

  public async confirmGroupLesson(id: number): Promise<GroupLesson> {
    const response = await httpClient.post<GroupLesson>(`/group-lessons/${id}/confirm`);
    return response.data;
  }

  public async startGroupLesson(id: number): Promise<GroupLesson> {
    const response = await httpClient.post<GroupLesson>(`/group-lessons/${id}/start`);
    return response.data;
  }

  public async completeGroupLesson(id: number): Promise<GroupLesson> {
    const response = await httpClient.post<GroupLesson>(`/group-lessons/${id}/complete`);
    return response.data;
  }

  public async cancelGroupLesson(id: number): Promise<GroupLesson> {
    const response = await httpClient.post<GroupLesson>(`/group-lessons/${id}/cancel`);
    return response.data;
  }

  public async postponeGroupLesson(id: number): Promise<GroupLesson> {
    const response = await httpClient.post<GroupLesson>(`/group-lessons/${id}/postpone`);
    return response.data;
  }

  // Group lesson registrations
  public async getGroupLessonRegistrations(groupLessonId: number): Promise<GroupLessonRegistration[]> {
    const response = await httpClient.get<GroupLessonRegistration[]>(`/group-lessons/${groupLessonId}/registrations`);
    return response.data;
  }

  public async getStudentRegistrations(studentId: number, page: number = 0, size: number = 10): Promise<{content: GroupLessonRegistration[], totalElements: number}> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await httpClient.get<{content: GroupLessonRegistration[], totalElements: number}>(`/students/${studentId}/registrations`, { params });
    return response.data;
  }

  public async registerForGroupLesson(slotId: number, studentId: number): Promise<GroupLessonRegistration> {
    const response = await httpClient.post<GroupLessonRegistration>('/bookings', { slotId, studentId });
    return response.data;
  }

  public async unregisterFromGroupLesson(registrationId: number, reason: string): Promise<GroupLessonRegistration> {
    const params = new URLSearchParams();
    params.append('reason', reason);
    
    const response = await httpClient.post<GroupLessonRegistration>(`/registrations/${registrationId}/cancel`, null, { params });
    return response.data;
  }

  public async markRegistrationAsAttended(registrationId: number): Promise<GroupLessonRegistration> {
    const response = await httpClient.post<GroupLessonRegistration>(`/registrations/${registrationId}/attend`);
    return response.data;
  }

  public async markRegistrationAsMissed(registrationId: number): Promise<GroupLessonRegistration> {
    const response = await httpClient.post<GroupLessonRegistration>(`/registrations/${registrationId}/miss`);
    return response.data;
  }

  // Helper methods
  public getLessonStatusText(status: LessonStatus): string {
    switch (status) {
      case LessonStatus.SCHEDULED: return 'Запланирован';
      case LessonStatus.COMPLETED: return 'Завершен';
      case LessonStatus.CANCELLED: return 'Отменен';
      case LessonStatus.MISSED: return 'Пропущен';
      default: return 'Неизвестно';
    }
  }

  public getGroupLessonStatusText(status: GroupLessonStatus): string {
    switch (status) {
      case GroupLessonStatus.SCHEDULED: return 'Запланирован';
      case GroupLessonStatus.CONFIRMED: return 'Подтвержден';
      case GroupLessonStatus.IN_PROGRESS: return 'В процессе';
      case GroupLessonStatus.COMPLETED: return 'Завершен';
      case GroupLessonStatus.CANCELLED: return 'Отменен';
      case GroupLessonStatus.POSTPONED: return 'Перенесен';
      default: return 'Неизвестно';
    }
  }
}

export default new LessonService();