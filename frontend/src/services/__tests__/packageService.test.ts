import { vi } from 'vitest';
import packageService from '../packageService';
import httpClient from '../httpClient';
import {
  PackageType,
  PackageStatus,
  LessonPackage,
  PackageCreateRequest
} from '../../types/packageTypes';

// Mock the httpClient
vi.mock('../httpClient');

describe('PackageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPackage: LessonPackage = {
    id: 1,
    studentId: 123,
    packageType: PackageType.INDIVIDUAL,
    packageName: 'Standard Package',
    totalLessons: 10,
    remainingLessons: 8,
    price: 5000,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    status: PackageStatus.ACTIVE,
    autoRenew: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    student: {
      id: 123,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    }
  };

  // Package templates management - REMOVED (not implemented in backend)

  // Student packages management
  describe('Student packages management', () => {
    it('should get student packages', async () => {
      const mockResponse = { data: [mockPackage] };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getStudentPackages(123);

      expect(httpClient.get).toHaveBeenCalledWith('/students/123/lesson-packages');
      expect(result).toEqual([mockPackage]);
    });

    it('should get package by id', async () => {
      const mockResponse = { data: mockPackage };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getPackageById(1);

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/1');
      expect(result).toEqual(mockPackage);
    });

    it('should create package', async () => {
      const packageData: PackageCreateRequest = {
        studentId: 123,
        packageTemplateId: 1,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        autoRenew: false
      };
      const mockResponse = { data: mockPackage };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.createPackage(packageData);

      expect(httpClient.post).toHaveBeenCalledWith('/managers/lesson-packages', packageData); // corrected path
      expect(result).toEqual(mockPackage);
    });

    it('should update package', async () => {
      const packageData = { autoRenew: true };
      const mockResponse = { data: mockPackage };
      (httpClient.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.updatePackage(1, packageData);

      expect(httpClient.put).toHaveBeenCalledWith('/lesson-packages/1', packageData);
      expect(result).toEqual(mockPackage);
    });

    it('should delete package', async () => {
      (httpClient.delete as jest.Mock).mockResolvedValue({});

      await packageService.deletePackage(1);

      expect(httpClient.delete).toHaveBeenCalledWith('/lesson-packages/1');
    });


  });



  // REMOVED sections for methods not implemented in backend:
  // - Bulk operations (bulkAssignPackages, bulkRenewPackages)
  // - Package operations history (getPackageOperations, getStudentPackageOperations)
  // - Statistics (getPackageStats, getPackageUsageStats)

  // Notifications
  describe('Notifications', () => {
    it('should get expiring packages', async () => {
      const mockResponse = { data: [mockPackage] };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getExpiringPackages(7);

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/expiring', {
        params: expect.any(URLSearchParams)
      });
      expect(result).toEqual([mockPackage]);
    });

    it('should get low balance packages', async () => {
      const mockResponse = { data: [mockPackage] };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getLowBalancePackages(3);

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/low-balance', {
        params: expect.any(URLSearchParams)
      });
      expect(result).toEqual([mockPackage]);
    });
  });

  // Integration with lessons
  describe('Integration with lessons', () => {
    it('should get packages for lesson deduction', async () => {
      const mockResponse = { data: [mockPackage] };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getPackagesForLessonDeduction(123);

      expect(httpClient.get).toHaveBeenCalledWith('/students/123/packages-for-deduction');
      expect(result).toEqual([mockPackage]);
    });

    it('should auto deduct lesson', async () => {
      const mockResponse = { data: mockPackage };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.autoDeductLesson(1, 456);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/1/auto-deduct', { lessonId: 456 });
      expect(result).toEqual(mockPackage);
    });
  });

  // Error handling
  describe('Error handling', () => {
    it('should handle errors in getStudentPackages', async () => {
      const error = new Error('Network error');
      (httpClient.get as jest.Mock).mockRejectedValue(error);

      await expect(packageService.getStudentPackages(123)).rejects.toThrow('Network error');
    });

    it('should handle errors in createPackage', async () => {
      const error = new Error('Validation error');
      (httpClient.post as jest.Mock).mockRejectedValue(error);
      const packageData: PackageCreateRequest = {
        studentId: 123,
        packageTemplateId: 1,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        autoRenew: false
      };

      await expect(packageService.createPackage(packageData)).rejects.toThrow('Validation error');
    });
  });
});
