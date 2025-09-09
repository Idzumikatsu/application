import httpClient from './httpClient';
import {
  LessonPackage,
  PackageTemplate,
  PackageOperation,
  PackageStats,
  BulkPackageAssignment,
  PackageFilter,
  PackageCreateRequest,
  PackageRenewRequest,
  PackageDeductRequest,
  PackageSearchResponse
} from '../types/packageTypes';

class PackageService {
  // Package templates management
  public async getPackageTemplates(): Promise<PackageTemplate[]> {
    const response = await httpClient.get<PackageTemplate[]>('/lesson-packages/templates');
    return response.data;
  }

  public async getPackageTemplateById(id: number): Promise<PackageTemplate> {
    const response = await httpClient.get<PackageTemplate>(`/lesson-packages/templates/${id}`);
    return response.data;
  }

  public async createPackageTemplate(templateData: Partial<PackageTemplate>): Promise<PackageTemplate> {
    const response = await httpClient.post<PackageTemplate>('/lesson-packages/templates', templateData);
    return response.data;
  }

  public async updatePackageTemplate(id: number, templateData: Partial<PackageTemplate>): Promise<PackageTemplate> {
    const response = await httpClient.put<PackageTemplate>(`/lesson-packages/templates/${id}`, templateData);
    return response.data;
  }

  public async deletePackageTemplate(id: number): Promise<void> {
    await httpClient.delete(`/lesson-packages/templates/${id}`);
  }

  // Student packages management
  public async getStudentPackages(studentId: number): Promise<LessonPackage[]> {
    const response = await httpClient.get<LessonPackage[]>(`/students/${studentId}/lesson-packages`);
    return response.data;
  }

  public async getPackageById(packageId: number): Promise<LessonPackage> {
    const response = await httpClient.get<LessonPackage>(`/lesson-packages/${packageId}`);
    return response.data;
  }

  public async searchPackages(filters: PackageFilter, page: number = 0, size: number = 20): Promise<PackageSearchResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.packageType) params.append('packageType', filters.packageType);
    if (filters.studentId) params.append('studentId', filters.studentId.toString());
    if (filters.validFrom) params.append('validFrom', filters.validFrom);
    if (filters.validUntil) params.append('validUntil', filters.validUntil);
    if (filters.search) params.append('search', filters.search);
    
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await httpClient.get<PackageSearchResponse>('/lesson-packages/search', { params });
    return response.data;
  }

  public async createPackage(packageData: PackageCreateRequest): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>('/lesson-packages', packageData);
    return response.data;
  }

  public async updatePackage(id: number, packageData: Partial<LessonPackage>): Promise<LessonPackage> {
    const response = await httpClient.put<LessonPackage>(`/lesson-packages/${id}`, packageData);
    return response.data;
  }

  public async deletePackage(id: number): Promise<void> {
    await httpClient.delete(`/lesson-packages/${id}`);
  }

  public async renewPackage(renewData: PackageRenewRequest): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>('/lesson-packages/renew', renewData);
    return response.data;
  }

  public async deductLessons(deductData: PackageDeductRequest): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>('/lesson-packages/deduct', deductData);
    return response.data;
  }

  public async suspendPackage(packageId: number): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>(`/lesson-packages/${packageId}/suspend`);
    return response.data;
  }

  public async activatePackage(packageId: number): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>(`/lesson-packages/${packageId}/activate`);
    return response.data;
  }

  // Bulk operations
  public async bulkAssignPackages(assignment: BulkPackageAssignment): Promise<number> {
    const response = await httpClient.post<{ assignedCount: number }>('/lesson-packages/bulk-assign', assignment);
    return response.data.assignedCount;
  }

  public async bulkRenewPackages(packageIds: number[], renewData: Partial<PackageRenewRequest>): Promise<number> {
    const response = await httpClient.post<{ renewedCount: number }>('/lesson-packages/bulk-renew', {
      packageIds,
      ...renewData
    });
    return response.data.renewedCount;
  }

  // Package operations history
  public async getPackageOperations(packageId: number): Promise<PackageOperation[]> {
    const response = await httpClient.get<PackageOperation[]>(`/lesson-packages/${packageId}/operations`);
    return response.data;
  }

  public async getStudentPackageOperations(studentId: number): Promise<PackageOperation[]> {
    const response = await httpClient.get<PackageOperation[]>(`/students/${studentId}/package-operations`);
    return response.data;
  }

  // Statistics
  public async getPackageStats(): Promise<PackageStats> {
    const response = await httpClient.get<PackageStats>('/lesson-packages/stats');
    return response.data;
  }

  public async getPackageUsageStats(startDate: string, endDate: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    const response = await httpClient.get('/lesson-packages/usage-stats', { params });
    return response.data;
  }

  // Notifications
  public async getExpiringPackages(daysThreshold: number = 7): Promise<LessonPackage[]> {
    const params = new URLSearchParams();
    params.append('daysThreshold', daysThreshold.toString());

    const response = await httpClient.get<LessonPackage[]>('/lesson-packages/expiring', { params });
    return response.data;
  }

  public async getLowBalancePackages(threshold: number = 3): Promise<LessonPackage[]> {
    const params = new URLSearchParams();
    params.append('threshold', threshold.toString());

    const response = await httpClient.get<LessonPackage[]>('/lesson-packages/low-balance', { params });
    return response.data;
  }

  // Integration with lessons
  public async getPackagesForLessonDeduction(studentId: number): Promise<LessonPackage[]> {
    const response = await httpClient.get<LessonPackage[]>(`/students/${studentId}/packages-for-deduction`);
    return response.data;
  }

  public async autoDeductLesson(packageId: number, lessonId: number): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>(`/lesson-packages/${packageId}/auto-deduct`, { lessonId });
    return response.data;
  }
}

export default new PackageService();