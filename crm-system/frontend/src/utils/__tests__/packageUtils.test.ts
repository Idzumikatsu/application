import { 
  calculatePackageUsagePercentage, 
  isPackageExpiring, 
  isPackageLowBalance,
  getPackageStatusColor,
  getPackageStatusText,
  formatPackagePrice,
  getDaysUntilExpiration,
  canDeductLessons,
  getPackageProgressColor
} from '../packageUtils';
import { LessonPackage, PackageStatus, PackageType } from '../../types/packageTypes';

describe('packageUtils', () => {
  const createTestPackage = (overrides: Partial<LessonPackage> = {}): LessonPackage => ({
    id: 1,
    studentId: 1,
    packageType: PackageType.INDIVIDUAL,
    packageName: 'Test Package',
    totalLessons: 10,
    remainingLessons: 5,
    price: 10000,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: PackageStatus.ACTIVE,
    autoRenew: false,
    ...overrides
  });

  describe('calculatePackageUsagePercentage', () => {
    it('should calculate percentage correctly for partial usage', () => {
      const pkg = createTestPackage({ totalLessons: 10, remainingLessons: 5 });
      const percentage = calculatePackageUsagePercentage(pkg);
      expect(percentage).toBe(50);
    });

    it('should calculate percentage correctly for full usage', () => {
      const pkg = createTestPackage({ totalLessons: 10, remainingLessons: 0 });
      const percentage = calculatePackageUsagePercentage(pkg);
      expect(percentage).toBe(100);
    });

    it('should handle zero total lessons', () => {
      const pkg = createTestPackage({ totalLessons: 0, remainingLessons: 0 });
      const percentage = calculatePackageUsagePercentage(pkg);
      expect(percentage).toBe(0);
    });

    it('should handle remaining lessons greater than total', () => {
      const pkg = createTestPackage({ totalLessons: 5, remainingLessons: 10 });
      const percentage = calculatePackageUsagePercentage(pkg);
      expect(percentage).toBe(0);
    });

    it('should handle negative remaining lessons', () => {
      const pkg = createTestPackage({ totalLessons: 5, remainingLessons: -2 });
      const percentage = calculatePackageUsagePercentage(pkg);
      expect(percentage).toBe(100);
    });
  });

  describe('isPackageExpiring', () => {
    it('should return true for package expiring within threshold', () => {
      const validUntil = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
      const pkg = createTestPackage({ validUntil });
      const isExpiring = isPackageExpiring(pkg, 7);
      expect(isExpiring).toBe(true);
    });

    it('should return false for package expiring beyond threshold', () => {
      const validUntil = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
      const pkg = createTestPackage({ validUntil });
      const isExpiring = isPackageExpiring(pkg, 7);
      expect(isExpiring).toBe(false);
    });

    it('should return false for expired package', () => {
      const validUntil = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const pkg = createTestPackage({ validUntil, status: PackageStatus.EXPIRED });
      const isExpiring = isPackageExpiring(pkg, 7);
      expect(isExpiring).toBe(false);
    });

    it('should return false for non-active package', () => {
      const pkg = createTestPackage({ status: PackageStatus.SUSPENDED });
      const isExpiring = isPackageExpiring(pkg, 7);
      expect(isExpiring).toBe(false);
    });
  });

  describe('isPackageLowBalance', () => {
    it('should return true for low balance', () => {
      const pkg = createTestPackage({ remainingLessons: 2 });
      const isLow = isPackageLowBalance(pkg, 3);
      expect(isLow).toBe(true);
    });

    it('should return false for sufficient balance', () => {
      const pkg = createTestPackage({ remainingLessons: 5 });
      const isLow = isPackageLowBalance(pkg, 3);
      expect(isLow).toBe(false);
    });

    it('should return false for non-active package', () => {
      const pkg = createTestPackage({ remainingLessons: 2, status: PackageStatus.EXPIRED });
      const isLow = isPackageLowBalance(pkg, 3);
      expect(isLow).toBe(false);
    });
  });

  describe('getPackageStatusColor', () => {
    it('should return correct color for ACTIVE status', () => {
      const color = getPackageStatusColor(PackageStatus.ACTIVE);
      expect(color).toBe('success');
    });

    it('should return correct color for EXPIRED status', () => {
      const color = getPackageStatusColor(PackageStatus.EXPIRED);
      expect(color).toBe('error');
    });

    it('should return correct color for SUSPENDED status', () => {
      const color = getPackageStatusColor(PackageStatus.SUSPENDED);
      expect(color).toBe('warning');
    });

    it('should return correct color for PENDING status', () => {
      const color = getPackageStatusColor(PackageStatus.PENDING);
      expect(color).toBe('info');
    });
  });

  describe('getPackageStatusText', () => {
    it('should return correct text for ACTIVE status', () => {
      const text = getPackageStatusText(PackageStatus.ACTIVE);
      expect(text).toBe('Активен');
    });

    it('should return correct text for EXPIRED status', () => {
      const text = getPackageStatusText(PackageStatus.EXPIRED);
      expect(text).toBe('Истек');
    });

    it('should return correct text for SUSPENDED status', () => {
      const text = getPackageStatusText(PackageStatus.SUSPENDED);
      expect(text).toBe('Приостановлен');
    });

    it('should return correct text for PENDING status', () => {
      const text = getPackageStatusText(PackageStatus.PENDING);
      expect(text).toBe('Ожидает');
    });
  });

  describe('formatPackagePrice', () => {
    it('should format price correctly in RUB', () => {
      const formatted = formatPackagePrice(10000);
      expect(formatted).toBe('10 000 ₽');
    });

    it('should format zero price correctly', () => {
      const formatted = formatPackagePrice(0);
      expect(formatted).toBe('0 ₽');
    });

    it('should format large price correctly', () => {
      const formatted = formatPackagePrice(1000000);
      expect(formatted).toBe('1 000 000 ₽');
    });
  });

  describe('getDaysUntilExpiration', () => {
    it('should calculate days until expiration correctly', () => {
      const validUntil = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
      const days = getDaysUntilExpiration(validUntil);
      expect(days).toBe(5);
    });

    it('should handle past expiration date', () => {
      const validUntil = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const days = getDaysUntilExpiration(validUntil);
      expect(days).toBe(-5);
    });
  });

  describe('canDeductLessons', () => {
    it('should return true for sufficient balance', () => {
      const pkg = createTestPackage({ remainingLessons: 5 });
      const canDeduct = canDeductLessons(pkg, 3);
      expect(canDeduct).toBe(true);
    });

    it('should return false for insufficient balance', () => {
      const pkg = createTestPackage({ remainingLessons: 2 });
      const canDeduct = canDeductLessons(pkg, 3);
      expect(canDeduct).toBe(false);
    });

    it('should return false for non-active package', () => {
      const pkg = createTestPackage({ remainingLessons: 5, status: PackageStatus.EXPIRED });
      const canDeduct = canDeductLessons(pkg, 3);
      expect(canDeduct).toBe(false);
    });
  });

  describe('getPackageProgressColor', () => {
    it('should return error color for high usage', () => {
      const color = getPackageProgressColor(95);
      expect(color).toBe('error');
    });

    it('should return warning color for medium usage', () => {
      const color = getPackageProgressColor(75);
      expect(color).toBe('warning');
    });

    it('should return success color for low usage', () => {
      const color = getPackageProgressColor(50);
      expect(color).toBe('success');
    });
  });
});