import httpClient from './httpClient';
import {
  LessonPackage,
  PackageCreateRequest
} from '../types/packageTypes';

class PackageService {
  // Package templates management - NOT AVAILABLE in backend, removing
  // getPackageTemplates() - templates not implemented in backend
  // getPackageTemplateById() - templates not implemented in backend
  // createPackageTemplate() - templates not implemented in backend
  // updatePackageTemplate() - templates not implemented in backend
  // deletePackageTemplate() - templates not implemented in backend

  // Student packages management
  public async getStudentPackages(studentId: number): Promise<LessonPackage[]> {
    const response = await httpClient.get<LessonPackage[]>(`/students/${studentId}/lesson-packages`);
    return response.data;
  }

  public async getPackageById(packageId: number): Promise<LessonPackage> {
    const response = await httpClient.get<LessonPackage>(`/lesson-packages/${packageId}`);
    return response.data;
  }

  public async createPackage(packageData: PackageCreateRequest): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>('/managers/lesson-packages', packageData); // backend: /api/managers/lesson-packages
    return response.data;
  }

  public async updatePackage(id: number, packageData: Partial<LessonPackage>): Promise<LessonPackage> {
    const response = await httpClient.put<LessonPackage>(`/lesson-packages/${id}`, packageData);
    return response.data;
  }

  public async deletePackage(id: number): Promise<void> {
    await httpClient.delete(`/lesson-packages/${id}`);
  }

  // Bulk operations - NOT AVAILABLE in backend, removing
  // bulkAssignPackages() - bulk operations not implemented
  // bulkRenewPackages() - bulk operations not implemented

  // Package operations - NOT AVAILABLE in backend, removing
  // getPackageOperations() - operations history not implemented
  // getStudentPackageOperations() - operations history not implemented

  // Statistics - NOT AVAILABLE in backend, removing
  // getPackageStats() - statistics not implemented
  // getPackageUsageStats() - usage statistics not implemented

  // Search packages with filters
  public async searchPackages(filters?: any): Promise<any> {
    let url = '/lesson-packages';
    const params = new URLSearchParams();

    if (filters) {
      // Add filter parameters if needed
      if (filters.studentId) params.append('studentId', filters.studentId.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.page !== undefined) params.append('page', (filters.page || 0).toString());
      if (filters.size !== undefined) params.append('size', (filters.size || 20).toString());
    }

    const config = params.toString() ? { params } : {};

    const response = await httpClient.get<any>(url, config);
    return response.data;
  }

  // Package templates - stub implementation (not implemented in backend)
  public async getPackageTemplates(): Promise<any[]> {
    // Return empty array as backend doesn't support templates
    console.warn('Package templates not supported by backend - returning empty array');
    return [];
  }

  // Package statistics - stub implementation (not implemented in backend)
  public async getPackageStats(): Promise<any> {
    // Return empty stats as backend doesn't support statistics
    console.warn('Package statistics not supported by backend - returning empty stats');
    return {
      totalPackages: 0,
      activePackages: 0,
      expiredPackages: 0,
      totalLessonsAvailable: 0,
      totalLessonsUsed: 0
    };
  }

  // Package operations - stub implementation (not implemented in backend)
  public async getPackageOperations(packageId: number): Promise<any[]> {
    // Return empty array as backend doesn't support operations history
    console.warn(`Package operations history not supported for package ${packageId} - returning empty array`);
    return [];
  }

  // Renew package - stub implementation
  public async renewPackage(renewData: any): Promise<any> {
    // This would need backend support for package renewal
    // For now, throw an error indicating it's not supported
    console.error('Package renewal is not supported by the backend API');
    throw new Error('Package renewal is not supported by the backend');
  }

  // Deduct lessons - stub implementation
  public async deductLessons(deductData: any): Promise<any> {
    // This would need backend support for lesson deduction from packages
    // For now, throw an error indicating it's not supported
    console.error('Lesson deduction is not supported by the backend API');
    throw new Error('Lesson deduction is not supported by the backend');
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

const packageService = new PackageService();
export default packageService;
