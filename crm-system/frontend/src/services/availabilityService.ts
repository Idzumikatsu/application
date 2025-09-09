import httpClient from './httpClient';
import { AvailabilitySlot, AvailabilitySlotStatus } from '../types';

class AvailabilityService {
  public async getTeacherAvailability(teacherId: number, startDate?: string, endDate?: string): Promise<AvailabilitySlot[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get<AvailabilitySlot[]>(`/teachers/${teacherId}/availability`, { params });
    return response.data;
  }

  public async getAvailabilitySlotById(id: number): Promise<AvailabilitySlot> {
    const response = await httpClient.get<AvailabilitySlot>(`/availability-slots/${id}`);
    return response.data;
  }

  public async createAvailabilitySlot(slotData: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
    const response = await httpClient.post<AvailabilitySlot>('/teachers/availability', slotData);
    return response.data;
  }

  public async updateAvailabilitySlot(id: number, slotData: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
    const response = await httpClient.put<AvailabilitySlot>(`/availability-slots/${id}`, slotData);
    return response.data;
  }

  public async deleteAvailabilitySlot(id: number): Promise<void> {
    await httpClient.delete(`/availability-slots/${id}`);
  }

  public async getFutureAvailableSlots(teacherId: number): Promise<AvailabilitySlot[]> {
    const response = await httpClient.get<AvailabilitySlot[]>(`/teachers/${teacherId}/availability/future-available`);
    return response.data;
  }

  public async getFutureBookedSlots(teacherId: number): Promise<AvailabilitySlot[]> {
    const response = await httpClient.get<AvailabilitySlot[]>(`/teachers/${teacherId}/availability/future-booked`);
    return response.data;
  }

  public async getSlotsByDate(teacherId: number, date: string): Promise<AvailabilitySlot[]> {
    const response = await httpClient.get<AvailabilitySlot[]>(`/teachers/${teacherId}/availability/date/${date}`);
    return response.data;
  }

  public async bookSlot(slotId: number, studentId: number): Promise<AvailabilitySlot> {
    const response = await httpClient.post<AvailabilitySlot>(`/bookings/slots/${slotId}`, { studentId });
    return response.data;
  }

  public async cancelBooking(slotId: number): Promise<void> {
    await httpClient.delete(`/bookings/slots/${slotId}`);
  }

  public async isSlotAvailableForBooking(slotId: number): Promise<boolean> {
    const response = await httpClient.get<boolean>(`/bookings/slots/${slotId}/available`);
    return response.data;
  }

  public async isSlotBookedByStudent(slotId: number, studentId: number): Promise<boolean> {
    const response = await httpClient.get<boolean>(`/bookings/slots/${slotId}/student/${studentId}`);
    return response.data;
  }

  // Helper methods
  public getSlotStatusText(status: AvailabilitySlotStatus): string {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE: return 'Доступен';
      case AvailabilitySlotStatus.BOOKED: return 'Забронирован';
      case AvailabilitySlotStatus.BLOCKED: return 'Заблокирован';
      default: return 'Неизвестно';
    }
  }

  public getSlotStatusColor(status: AvailabilitySlotStatus): string {
    switch (status) {
      case AvailabilitySlotStatus.AVAILABLE: return 'success';
      case AvailabilitySlotStatus.BOOKED: return 'warning';
      case AvailabilitySlotStatus.BLOCKED: return 'error';
      default: return 'default';
    }
  }
}

export default new AvailabilityService();