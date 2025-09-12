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
