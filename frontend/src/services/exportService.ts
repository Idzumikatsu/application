import httpClient from './httpClient';
import { ExportOptions, ExportResult, Student, FilterCriteria, SortCriteria } from '../types';

class ExportService {
  // Student data export
  public async exportStudents(
    options: ExportOptions,
    students?: Student[]
  ): Promise<ExportResult> {
    const response = await httpClient.post<ExportResult>('/export/students', {
      options,
      data: students
    });
    return response.data;
  }

  // Lesson data export
  public async exportLessons(
    options: ExportOptions,
    filters?: FilterCriteria[],
    sort?: SortCriteria[]
  ): Promise<ExportResult> {
    const response = await httpClient.post<ExportResult>('/export/lessons', {
      options,
      filters,
      sort
    });
    return response.data;
  }

  // Teacher data export
  public async exportTeachers(
    options: ExportOptions,
    filters?: FilterCriteria[],
    sort?: SortCriteria[]
  ): Promise<ExportResult> {
    const response = await httpClient.post<ExportResult>('/export/teachers', {
      options,
      filters,
      sort
    });
    return response.data;
  }

  // Package data export
  public async exportPackages(
    options: ExportOptions,
    filters?: FilterCriteria[],
    sort?: SortCriteria[]
  ): Promise<ExportResult> {
    const response = await httpClient.post<ExportResult>('/export/packages', {
      options,
      filters,
      sort
    });
    return response.data;
  }

  // Financial data export
  public async exportFinancial(
    options: ExportOptions,
    startDate: string,
    endDate: string,
    filters?: FilterCriteria[]
  ): Promise<ExportResult> {
    const response = await httpClient.post<ExportResult>('/export/financial', {
      options,
      startDate,
      endDate,
      filters
    });
    return response.data;
  }

  // Attendance data export
  public async exportAttendance(
    options: ExportOptions,
    startDate: string,
    endDate: string,
    filters?: FilterCriteria[]
  ): Promise<ExportResult> {
    const response = await httpClient.post<ExportResult>('/export/attendance', {
      options,
      startDate,
      endDate,
      filters
    });
    return response.data;
  }

  // Download exported file
  public async downloadExport(fileId: string): Promise<Blob> {
    const response = await httpClient.get(`/export/download/${fileId}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  }

  // Get export history
  public async getExportHistory(): Promise<any[]> {
    const response = await httpClient.get<any[]>('/export/history');
    return response.data;
  }

  // Delete exported file
  public async deleteExport(fileId: string): Promise<void> {
    await httpClient.delete(`/export/${fileId}`);
  }

  // Helper methods for file download
  public downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  public getFormatMimeType(format: string): string {
    switch (format) {
      case 'csv': return 'text/csv';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'pdf': return 'application/pdf';
      default: return 'application/octet-stream';
    }
  }

  public getFormatExtension(format: string): string {
    switch (format) {
      case 'csv': return '.csv';
      case 'xlsx': return '.xlsx';
      case 'pdf': return '.pdf';
      default: return '.bin';
    }
  }

  // Generate default file name
  public generateFileName(entityType: string, format: string): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${entityType}_export_${timestamp}${this.getFormatExtension(format)}`;
  }
}

export default new ExportService();