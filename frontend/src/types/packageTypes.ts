// Extended types for lesson packages management

export enum PackageType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP', 
  MIXED = 'MIXED'
}

export enum PackageStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

export interface LessonPackage {
  id: number;
  studentId: number;
  packageType: PackageType;
  packageName: string;
  totalLessons: number;
  remainingLessons: number;
  price: number;
  validFrom: string;
  validUntil: string;
  status: PackageStatus;
  autoRenew: boolean;
  createdAt?: string;
  updatedAt?: string;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PackageTemplate {
  id: number;
  name: string;
  description: string;
  packageType: PackageType;
  lessonCount: number;
  price: number;
  validityDays: number;
  isActive: boolean;
  autoRenew: boolean;
  maxStudents?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum PackageOperationType {
  CREATE = 'CREATE',
  RENEW = 'RENEW',
  DEDUCT = 'DEDUCT',
  SUSPEND = 'SUSPEND',
  ACTIVATE = 'ACTIVATE',
  EXPIRED = 'EXPIRED',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT'
}

export interface PackageOperation {
  id: number;
  packageId: number;
  operationType: PackageOperationType;
  lessonsChanged: number;
  previousBalance: number;
  newBalance: number;
  performedBy: string;
  performedById: number;
  notes?: string;
  relatedLessonId?: number;
  createdAt: string;
  package?: LessonPackage;
}

export interface PackageStats {
  totalPackages: number;
  activePackages: number;
  expiringPackages: number;
  expiredPackages: number;
  totalRevenue: number;
  averagePackageValue: number;
  mostPopularPackage: string;
  usageRate: number;
  packagesByType: Record<PackageType, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    packages: number;
  }>;
}

export interface BulkPackageAssignment {
  studentIds: number[];
  packageTemplateId: number;
  validFrom: string;
  validUntil: string;
  autoRenew: boolean;
  notifyStudents: boolean;
}

export interface PackageNotificationSettings {
  notifyOnLowBalance: boolean;
  lowBalanceThreshold: number;
  notifyOnExpiration: boolean;
  daysBeforeExpiration: number;
  notifyOnAutoRenew: boolean;
  emailNotifications: boolean;
  telegramNotifications: boolean;
}

export interface PackageFilter {
  status?: PackageStatus;
  packageType?: PackageType;
  studentId?: number;
  validFrom?: string;
  validUntil?: string;
  search?: string;
}

export interface PackageCreateRequest {
  studentId: number;
  packageTemplateId: number;
  validFrom: string;
  validUntil: string;
  autoRenew: boolean;
}

export interface PackageRenewRequest {
  packageId: number;
  renewFromCurrent?: boolean;
  autoRenew?: boolean;
}

export interface PackageDeductRequest {
  packageId: number;
  lessons: number;
  lessonId?: number;
  notes?: string;
}

export interface PackageSearchResponse {
  content: LessonPackage[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}