import packageService from '../packageService';
import httpClient from '../httpClient';
import {
  PackageType,
  PackageStatus,
  LessonPackage,
  PackageTemplate,
  PackageOperationType,
  PackageStats,
  PackageFilter,
  PackageCreateRequest,
  PackageRenewRequest,
  PackageDeductRequest,
  BulkPackageAssignment,
  PackageSearchResponse
} from '../../types/packageTypes';

// Mock the httpClient
jest.mock('../httpClient');

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

  const mockTemplate: PackageTemplate = {
    id: 1,
    name: 'Standard Package',
    description: '10 individual lessons',
    packageType: PackageType.INDIVIDUAL,
    lessonCount: 10,
    price: 5000,
    validityDays: 365,
    isActive: true,
    autoRenew: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockPackageOperation = {
    id: 1,
    packageId: 1,
    operationType: PackageOperationType.DEDUCT,
    lessonsChanged: -1,
    previousBalance: 8,
    newBalance: 7,
    performedBy: 'admin',
    performedById: 1,
    notes: 'Lesson deduction',
    createdAt: '2024-01-15T00:00:00Z'
  };

  const mockPackageStats: PackageStats = {
    totalPackages: 100,
    activePackages: 75,
    expiringPackages: 5,
    expiredPackages: 20,
    totalRevenue: 500000,
    averagePackageValue: 5000,
    mostPopularPackage: 'Standard Package',
    usageRate: 75,
    packagesByType: {
      [PackageType.INDIVIDUAL]: 60,
      [PackageType.GROUP]: 30,
      [PackageType.MIXED]: 10
    },
    revenueByMonth: [
      { month: '2024-01', revenue: 50000, packages: 10 },
      { month: '2024-02', revenue: 45000, packages: 9 }
    ]
  };

  // Package templates management
  describe('Package templates management', () => {
    it('should get package templates', async () => {
      const mockResponse = { data: [mockTemplate] };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getPackageTemplates();

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/templates');
      expect(result).toEqual([mockTemplate]);
    });

    it('should get package template by id', async () => {
      const mockResponse = { data: mockTemplate };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getPackageTemplateById(1);

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/templates/1');
      expect(result).toEqual(mockTemplate);
    });

    it('should create package template', async () => {
      const templateData = { name: 'New Template', lessonCount: 5 };
      const mockResponse = { data: mockTemplate };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.createPackageTemplate(templateData);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/templates', templateData);
      expect(result).toEqual(mockTemplate);
    });

    it('should update package template', async () => {
      const templateData = { name: 'Updated Template' };
      const mockResponse = { data: mockTemplate };
      (httpClient.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.updatePackageTemplate(1, templateData);

      expect(httpClient.put).toHaveBeenCalledWith('/lesson-packages/templates/1', templateData);
      expect(result).toEqual(mockTemplate);
    });

    it('should delete package template', async () => {
      (httpClient.delete as jest.Mock).mockResolvedValue({});

      await packageService.deletePackageTemplate(1);

      expect(httpClient.delete).toHaveBeenCalledWith('/lesson-packages/templates/1');
    });
  });

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

    it('should search packages', async () => {
      const filters: PackageFilter = { status: PackageStatus.ACTIVE };
      const mockSearchResponse: PackageSearchResponse = {
        content: [mockPackage],
        totalElements: 1,
        totalPages: 1,
        page: 0,
        size: 20
      };
      const mockResponse = { data: mockSearchResponse };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.searchPackages(filters);

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/search', {
        params: expect.any(URLSearchParams)
      });
      expect(result).toEqual(mockSearchResponse);
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

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages', packageData);
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

    it('should renew package', async () => {
      const renewData: PackageRenewRequest = { packageId: 1 };
      const mockResponse = { data: mockPackage };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.renewPackage(renewData);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/renew', renewData);
      expect(result).toEqual(mockPackage);
    });

    it('should deduct lessons', async () => {
      const deductData: PackageDeductRequest = { packageId: 1, lessons: 1 };
      const mockResponse = { data: mockPackage };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.deductLessons(deductData);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/deduct', deductData);
      expect(result).toEqual(mockPackage);
    });

    it('should suspend package', async () => {
      const mockResponse = { data: mockPackage };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.suspendPackage(1);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/1/suspend');
      expect(result).toEqual(mockPackage);
    });

    it('should activate package', async () => {
      const mockResponse = { data: mockPackage };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.activatePackage(1);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/1/activate');
      expect(result).toEqual(mockPackage);
    });
  });

  // Bulk operations
  describe('Bulk operations', () => {
    it('should bulk assign packages', async () => {
      const assignment: BulkPackageAssignment = {
        studentIds: [1, 2, 3],
        packageTemplateId: 1,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        autoRenew: false,
        notifyStudents: true
      };
      const mockResponse = { data: { assignedCount: 3 } };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.bulkAssignPackages(assignment);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/bulk-assign', assignment);
      expect(result).toBe(3);
    });

    it('should bulk renew packages', async () => {
      const packageIds = [1, 2, 3];
      const renewData = { autoRenew: true };
      const mockResponse = { data: { renewedCount: 3 } };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.bulkRenewPackages(packageIds, renewData);

      expect(httpClient.post).toHaveBeenCalledWith('/lesson-packages/bulk-renew', {
        packageIds,
        ...renewData
      });
      expect(result).toBe(3);
    });
  });

  // Package operations history
  describe('Package operations history', () => {
    it('should get package operations', async () => {
      const mockResponse = { data: [mockPackageOperation] };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getPackageOperations(1);

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/1/operations');
      expect(result).toEqual([mockPackageOperation]);
    });

    it('should get student package operations', async () => {
      const mockResponse = { data: [mockPackageOperation] };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getStudentPackageOperations(123);

      expect(httpClient.get).toHaveBeenCalledWith('/students/123/package-operations');
      expect(result).toEqual([mockPackageOperation]);
    });
  });

  // Statistics
  describe('Statistics', () => {
    it('should get package stats', async () => {
      const mockResponse = { data: mockPackageStats };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getPackageStats();

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/stats');
      expect(result).toEqual(mockPackageStats);
    });

    it('should get package usage stats', async () => {
      const mockResponse = { data: { usage: 'data' } };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await packageService.getPackageUsageStats('2024-01-01', '2024-12-31');

      expect(httpClient.get).toHaveBeenCalledWith('/lesson-packages/usage-stats', {
        params: expect.any(URLSearchParams)
      });
      expect(result).toEqual({ usage: 'data' });
    });
  });

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
    it('should handle errors in getPackageTemplates', async () => {
      const error = new Error('Network error');
      (httpClient.get as jest.Mock).mockRejectedValue(error);

      await expect(packageService.getPackageTemplates()).rejects.toThrow('Network error');
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