import { LessonPackage, PackageStatus, PackageType, PackageOperationType } from '../types/packageTypes';

export const getPackageStatusColor = (status: PackageStatus): string => {
  switch (status) {
    case PackageStatus.ACTIVE:
      return 'success';
    case PackageStatus.EXPIRED:
      return 'error';
    case PackageStatus.SUSPENDED:
      return 'warning';
    case PackageStatus.PENDING:
      return 'info';
    default:
      return 'default';
  }
};

export const getPackageStatusText = (status: PackageStatus): string => {
  switch (status) {
    case PackageStatus.ACTIVE:
      return 'Активен';
    case PackageStatus.EXPIRED:
      return 'Истек';
    case PackageStatus.SUSPENDED:
      return 'Приостановлен';
    case PackageStatus.PENDING:
      return 'Ожидает';
    default:
      return 'Неизвестно';
  }
};

export const getPackageTypeText = (type: PackageType): string => {
  switch (type) {
    case PackageType.INDIVIDUAL:
      return 'Индивидуальный';
    case PackageType.GROUP:
      return 'Групповой';
    case PackageType.MIXED:
      return 'Смешанный';
    default:
      return 'Неизвестно';
  }
};

export const getOperationTypeText = (type: PackageOperationType): string => {
  switch (type) {
    case PackageOperationType.CREATE:
      return 'Создание';
    case PackageOperationType.RENEW:
      return 'Продление';
    case PackageOperationType.DEDUCT:
      return 'Списание';
    case PackageOperationType.SUSPEND:
      return 'Приостановка';
    case PackageOperationType.ACTIVATE:
      return 'Активация';
    case PackageOperationType.EXPIRED:
      return 'Истечение';
    case PackageOperationType.MANUAL_ADJUSTMENT:
      return 'Корректировка';
    default:
      return 'Неизвестно';
  }
};

export const getOperationTypeColor = (type: PackageOperationType): string => {
  switch (type) {
    case PackageOperationType.CREATE:
      return 'success';
    case PackageOperationType.RENEW:
      return 'info';
    case PackageOperationType.DEDUCT:
      return 'warning';
    case PackageOperationType.SUSPEND:
      return 'error';
    case PackageOperationType.ACTIVATE:
      return 'success';
    case PackageOperationType.EXPIRED:
      return 'error';
    case PackageOperationType.MANUAL_ADJUSTMENT:
      return 'secondary';
    default:
      return 'default';
  }
};

export const isPackageExpiring = (packageData: LessonPackage, daysThreshold: number = 7): boolean => {
  if (packageData.status !== PackageStatus.ACTIVE) return false;
  
  const validUntil = new Date(packageData.validUntil);
  const today = new Date();
  const diffTime = validUntil.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= daysThreshold && diffDays >= 0;
};

export const isPackageLowBalance = (packageData: LessonPackage, threshold: number = 3): boolean => {
  if (packageData.status !== PackageStatus.ACTIVE) return false;
  return packageData.remainingLessons <= threshold;
};

export const calculatePackageUsagePercentage = (packageData: LessonPackage): number => {
  if (packageData.totalLessons === 0) return 0;
  const used = packageData.totalLessons - packageData.remainingLessons;
  const percentage = (used / packageData.totalLessons) * 100;
  return Math.max(0, Math.min(100, Math.round(percentage)));
};

export const formatPackagePrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatPackageValidity = (validFrom: string, validUntil: string): string => {
  const from = new Date(validFrom).toLocaleDateString('ru-RU');
  const until = new Date(validUntil).toLocaleDateString('ru-RU');
  return `${from} - ${until}`;
};

export const getDaysUntilExpiration = (validUntil: string): number => {
  const expirationDate = new Date(validUntil);
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const canDeductLessons = (packageData: LessonPackage, lessons: number = 1): boolean => {
  return packageData.status === PackageStatus.ACTIVE && 
         packageData.remainingLessons >= lessons;
};

export const getPackageProgressColor = (percentage: number): string => {
  if (percentage >= 90) return 'error';
  if (percentage >= 70) return 'warning';
  return 'success';
};

export const generatePackageName = (templateName: string, studentName: string): string => {
  return `${templateName} - ${studentName}`;
};

export const validatePackageDates = (validFrom: string, validUntil: string): boolean => {
  const from = new Date(validFrom);
  const until = new Date(validUntil);
  return until > from;
};

export const calculatePackageValue = (totalLessons: number, pricePerLesson: number): number => {
  return totalLessons * pricePerLesson;
};

export const sortPackages = (packages: LessonPackage[], sortBy: string, direction: 'asc' | 'desc' = 'asc'): LessonPackage[] => {
  const sorted = [...packages].sort((a, b) => {
    let valueA: any, valueB: any;

    switch (sortBy) {
      case 'studentName':
        valueA = a.student?.firstName || '';
        valueB = b.student?.firstName || '';
        break;
      case 'remainingLessons':
        valueA = a.remainingLessons;
        valueB = b.remainingLessons;
        break;
      case 'validUntil':
        valueA = new Date(a.validUntil);
        valueB = new Date(b.validUntil);
        break;
      case 'packageName':
        valueA = a.packageName;
        valueB = b.packageName;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      default:
        valueA = a.id;
        valueB = b.id;
    }

    if (typeof valueA === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return direction === 'asc' 
        ? valueA - valueB
        : valueB - valueA;
    }
  });

  return sorted;
};