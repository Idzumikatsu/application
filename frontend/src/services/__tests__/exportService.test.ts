import { vi } from 'vitest';
import type { AxiosResponse } from 'axios';
import exportService from '../exportService';
import { default as httpClient } from '../httpClient'; // Import for mocking
import { ExportOptions, ExportResult, Student, FilterCriteria, SortCriteria } from '../../types';

// Mock the httpClient
vi.mock('../httpClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  }
}));

const mockedHttpClient = vi.mocked(httpClient);

describe('ExportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockExportOptions: ExportOptions = {
    format: 'csv',
    columns: ['firstName', 'lastName', 'email'],
    includeHeaders: true,
    fileName: 'students_export.csv'
  };

  const mockExportResult: ExportResult = {
    fileId: 'export-123',
    fileName: 'students_export_2024-01-01.csv',
    fileSize: 1024,
    downloadUrl: '/export/download/export-123',
    expiresAt: '2024-01-02T00:00:00Z'
  };

  const mockStudent: Student = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockFilter: FilterCriteria = {
    field: 'status',
    operator: 'equals',
    value: 'ACTIVE'
  };

  const mockSort: SortCriteria = {
    field: 'firstName',
    direction: 'asc'
  };

  const mockResponse: AxiosResponse = {
    data: mockExportResult,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  // Student data export
  describe('Student data export', () => {
    it('should export students with data', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportStudents(mockExportOptions, [mockStudent]);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/students', {
        options: mockExportOptions,
        data: [mockStudent]
      });
      expect(result).toEqual(mockExportResult);
    });

    it('should export students without data', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportStudents(mockExportOptions);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/students', {
        options: mockExportOptions,
        data: undefined
      });
      expect(result).toEqual(mockExportResult);
    });
  });

  // Lesson data export
  describe('Lesson data export', () => {
    it('should export lessons with filters and sort', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportLessons(mockExportOptions, [mockFilter], [mockSort]);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/lessons', {
        options: mockExportOptions,
        filters: [mockFilter],
        sort: [mockSort]
      });
      expect(result).toEqual(mockExportResult);
    });

    it('should export lessons without filters and sort', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportLessons(mockExportOptions);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/lessons', {
        options: mockExportOptions,
        filters: undefined,
        sort: undefined
      });
      expect(result).toEqual(mockExportResult);
    });
  });

  // Teacher data export
  describe('Teacher data export', () => {
    it('should export teachers with filters and sort', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportTeachers(mockExportOptions, [mockFilter], [mockSort]);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/teachers', {
        options: mockExportOptions,
        filters: [mockFilter],
        sort: [mockSort]
      });
      expect(result).toEqual(mockExportResult);
    });
  });

  // Package data export
  describe('Package data export', () => {
    it('should export packages with filters and sort', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportPackages(mockExportOptions, [mockFilter], [mockSort]);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/packages', {
        options: mockExportOptions,
        filters: [mockFilter],
        sort: [mockSort]
      });
      expect(result).toEqual(mockExportResult);
    });
  });

  // Financial data export
  describe('Financial data export', () => {
    it('should export financial data with filters', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportFinancial(
        mockExportOptions,
        '2024-01-01',
        '2024-12-31',
        [mockFilter]
      );

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/financial', {
        options: mockExportOptions,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        filters: [mockFilter]
      });
      expect(result).toEqual(mockExportResult);
    });

    it('should export financial data without filters', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportFinancial(
        mockExportOptions,
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/financial', {
        options: mockExportOptions,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        filters: undefined
      });
      expect(result).toEqual(mockExportResult);
    });
  });

  // Attendance data export
  describe('Attendance data export', () => {
    it('should export attendance data with filters', async () => {
      mockedHttpClient.post.mockResolvedValue(mockResponse);

      const result = await exportService.exportAttendance(
        mockExportOptions,
        '2024-01-01',
        '2024-12-31',
        [mockFilter]
      );

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/export/attendance', {
        options: mockExportOptions,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        filters: [mockFilter]
      });
      expect(result).toEqual(mockExportResult);
    });
  });

  // Download exported file
  describe('Download exported file', () => {
    it('should download export file', async () => {
      const mockBlob = new Blob(['test content']);
      const mockBlobResponse: AxiosResponse = {
        data: mockBlob,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      mockedHttpClient.get.mockResolvedValue(mockBlobResponse);

      const result = await exportService.downloadExport('export-123');

      expect(httpClient.get).toHaveBeenCalledWith('/export/download/export-123', {
        responseType: 'blob'
      });
      expect(result).toBe(mockBlob);
    });
  });

  // Get export history
  describe('Get export history', () => {
    it('should get export history', async () => {
      const mockHistory = [{ id: 'export-123', fileName: 'test.csv' }];
      const mockResponse = { data: mockHistory };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await exportService.getExportHistory();

      expect(httpClient.get).toHaveBeenCalledWith('/export/history');
      expect(result).toEqual(mockHistory);
    });
  });

  // Delete exported file
  describe('Delete exported file', () => {
    it('should delete export file', async () => {
      (httpClient.delete as jest.Mock).mockResolvedValue({});

      await exportService.deleteExport('export-123');

      expect(httpClient.delete).toHaveBeenCalledWith('/export/export-123');
    });
  });

  // Helper methods
  describe('Helper methods', () => {
    it('should get correct mime type for format', () => {
      expect(exportService.getFormatMimeType('csv')).toBe('text/csv');
      expect(exportService.getFormatMimeType('xlsx')).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(exportService.getFormatMimeType('pdf')).toBe('application/pdf');
      expect(exportService.getFormatMimeType('unknown')).toBe('application/octet-stream');
    });

    it('should get correct extension for format', () => {
      expect(exportService.getFormatExtension('csv')).toBe('.csv');
      expect(exportService.getFormatExtension('xlsx')).toBe('.xlsx');
      expect(exportService.getFormatExtension('pdf')).toBe('.pdf');
      expect(exportService.getFormatExtension('unknown')).toBe('.bin');
    });

    it('should generate file name with correct format', () => {
      const fileName = exportService.generateFileName('students', 'csv');
      expect(fileName).toMatch(/^students_export_\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('should download blob correctly', () => {
      // Mock DOM methods
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');
      
      // Mock URL methods
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;
      
      URL.createObjectURL = jest.fn().mockReturnValue('blob:test-url');
      URL.revokeObjectURL = jest.fn();

      // Create a real DOM element instead of mocking
      const realLink = document.createElement('a');
      const clickSpy = jest.spyOn(realLink, 'click');
      
      createElementSpy.mockReturnValue(realLink);

      const blob = new Blob(['test content']);
      exportService.downloadBlob(blob, 'test.csv');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalledWith(realLink);
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(realLink);
      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');

      // Clean up
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });
  });

  // Error handling
  describe('Error handling', () => {
    it('should handle errors in exportStudents', async () => {
      const error = new Error('Export failed');
      mockedHttpClient.post.mockRejectedValue(error);

      await expect(exportService.exportStudents(mockExportOptions)).rejects.toThrow('Export failed');
    });

    it('should handle errors in downloadExport', async () => {
      const error = new Error('Download failed');
      (httpClient.get as jest.Mock).mockRejectedValue(error);

      await expect(exportService.downloadExport('export-123')).rejects.toThrow('Download failed');
    });
  });
});