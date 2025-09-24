import * as React from 'react'; // Wait, no, this is JS file, but TS.

import { vi, type MockedFunction } from 'vitest';
import { default as httpClient } from '../httpClient';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';

vi.mock('../httpClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

// Typing for mocked httpClient methods
const mockedHttpClient = {
  get: vi.mocked(httpClient.get) as MockedFunction<(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>>,
  post: vi.mocked(httpClient.post) as MockedFunction<(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse>>,
  put: vi.mocked(httpClient.put) as MockedFunction<(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse>>,
  delete: vi.mocked(httpClient.delete) as MockedFunction<(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>>,
};

import packageService from '../packageService';
import {
  PackageType,
  PackageStatus,
  LessonPackage,
  PackageCreateRequest
} from '../../types/packageTypes';

describe('PackageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  const mockResponse: AxiosResponse<LessonPackage[]> = {
    data: [mockPackage],
    status: 200,
    statusText: 'OK',
    headers: {} as any,
    config: {
      headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
    },
  };

  // For single:
  const singleResponse: AxiosResponse<LessonPackage> = {
    data: mockPackage,
    status: 200,
    statusText: 'OK',
    headers: {} as any,
    config: {
      headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
    },
  };

  // For delete:
  const deleteResponse: AxiosResponse = {
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {} as any,
    config: {
      headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
    },
  };

  // Package templates management - REMOVED (not implemented in backend)

  // Student packages management
  describe('Student packages management', () => {
    it('should get student packages', async () => {
      mockedHttpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await packageService.getStudentPackages(123);

      expect(mockedHttpClient.get).toHaveBeenCalledWith('/students/123/lesson-packages');
      expect(result).toEqual([mockPackage]);
    });

    it('should get package by id', async () => {
      mockedHttpClient.get.mockResolvedValue(singleResponse);

      const result = await packageService.getPackageById(1);

      expect(mockedHttpClient.get).toHaveBeenCalledWith('/lesson-packages/1');
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
      mockedHttpClient.post.mockResolvedValue(singleResponse);

      const result = await packageService.createPackage(packageData);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/managers/lesson-packages', packageData); // corrected path
      expect(result).toEqual(mockPackage);
    });

    it('should update package', async () => {
      const packageData = { autoRenew: true };
      mockedHttpClient.put.mockResolvedValue(singleResponse);

      const result = await packageService.updatePackage(1, packageData);

      expect(mockedHttpClient.put).toHaveBeenCalledWith('/lesson-packages/1', packageData);
      expect(result).toEqual(mockPackage);
    });

    it('should delete package', async () => {
      mockedHttpClient.delete.mockResolvedValue(deleteResponse);

      await packageService.deletePackage(1);

      expect(mockedHttpClient.delete).toHaveBeenCalledWith('/lesson-packages/1');
    });
  });

  // REMOVED sections for methods not implemented in backend:
  // - Bulk operations (bulkAssignPackages, bulkRenewPackages)
  // - Package operations history (getPackageOperations, getStudentPackageOperations)
  // - Statistics (getPackageStats, getPackageUsageStats)

  // Notifications
  describe('Notifications', () => {
    it('should get expiring packages', async () => {
      mockedHttpClient.get.mockResolvedValue(mockResponse);

      const result = await packageService.getExpiringPackages(7);

      expect(mockedHttpClient.get).toHaveBeenCalledWith('/lesson-packages/expiring', {
        params: expect.any(URLSearchParams)
      });
      expect(result).toEqual([mockPackage]);
    });

    it('should get low balance packages', async () => {
      mockedHttpClient.get.mockResolvedValue(mockResponse);

      const result = await packageService.getLowBalancePackages(3);

      expect(mockedHttpClient.get).toHaveBeenCalledWith('/lesson-packages/low-balance', {
        params: expect.any(URLSearchParams)
      });
      expect(result).toEqual([mockPackage]);
    });
  });

  // Integration with lessons
  describe('Integration with lessons', () => {
    it('should get packages for lesson deduction', async () => {
      mockedHttpClient.get.mockResolvedValue(mockResponse);

      const result = await packageService.getPackagesForLessonDeduction(123);

      expect(mockedHttpClient.get).toHaveBeenCalledWith('/students/123/packages-for-deduction');
      expect(result).toEqual([mockPackage]);
    });

    it('should auto deduct lesson', async () => {
      mockedHttpClient.post.mockResolvedValue(singleResponse);

      const result = await packageService.autoDeductLesson(1, 456);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/lesson-packages/1/auto-deduct', { lessonId: 456 });
      expect(result).toEqual(mockPackage);
    });
  });

  // Error handling
  describe('Error handling', () => {
    it('should handle errors in getStudentPackages', async () => {
      const error = new Error('Network error');
      mockedHttpClient.get.mockRejectedValue(error);

      await expect(packageService.getStudentPackages(123)).rejects.toThrow('Network error');
    });

    it('should handle errors in createPackage', async () => {
      const error = new Error('Validation error');
      mockedHttpClient.post.mockRejectedValue(error);
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
