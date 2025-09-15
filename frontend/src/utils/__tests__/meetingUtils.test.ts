import { generateMeetingLink, isValidMeetingLink, formatMeetingTime, createMeetingDescription } from '../meetingUtils';

describe('meetingUtils', () => {
  describe('generateMeetingLink', () => {
    it('should generate a valid meeting link with prefix', () => {
      const link = generateMeetingLink('test-meeting');
      expect(link).toMatch(/^https:\/\/meet\.crm-school\.com\/test-meeting-[a-z0-9]{12}$/);
    });

    it('should generate a meeting link without prefix', () => {
      const link = generateMeetingLink();
      expect(link).toMatch(/^https:\/\/meet\.crm-school\.com\/[a-z0-9]{12}$/);
    });

    it('should generate unique meeting IDs', () => {
      const link1 = generateMeetingLink('test');
      const link2 = generateMeetingLink('test');
      expect(link1).not.toBe(link2);
    });
  });

  describe('isValidMeetingLink', () => {
    it('should validate correct meeting link', () => {
      const isValid = isValidMeetingLink('https://meet.crm-school.com/test-meeting-abc123');
      expect(isValid).toBe(true);
    });

    it('should invalidate incorrect URL format', () => {
      const isValid = isValidMeetingLink('not-a-url');
      expect(isValid).toBe(false);
    });

    it('should invalidate HTTP URL', () => {
      const isValid = isValidMeetingLink('http://meet.crm-school.com/test-meeting');
      expect(isValid).toBe(false);
    });

    it('should invalidate URL without https', () => {
      const isValid = isValidMeetingLink('meet.crm-school.com/test-meeting');
      expect(isValid).toBe(false);
    });

    it('should invalidate URL with wrong domain', () => {
      const isValid = isValidMeetingLink('https://wrong-domain.com/test-meeting');
      expect(isValid).toBe(false);
    });

    it('should invalidate empty string', () => {
      const isValid = isValidMeetingLink('');
      expect(isValid).toBe(false);
    });

    it('should invalidate null', () => {
      const isValid = isValidMeetingLink(null as any);
      expect(isValid).toBe(false);
    });

    it('should invalidate undefined', () => {
      const isValid = isValidMeetingLink(undefined as any);
      expect(isValid).toBe(false);
    });
  });

  describe('formatMeetingTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatMeetingTime(date);
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should use Moscow timezone', () => {
      const date = new Date('2024-01-15T14:30:00Z'); // UTC
      const formatted = formatMeetingTime(date);
      // Moscow time is UTC+3, so 14:30 UTC = 17:30 MSK
      expect(formatted).toBe('17:30');
    });
  });

  describe('createMeetingDescription', () => {
    it('should create formatted description', () => {
      const description = createMeetingDescription(
        'Test Meeting',
        'This is a test meeting',
        'https://meet.crm-school.com/test'
      );
      
      expect(description).toContain('Test Meeting');
      expect(description).toContain('This is a test meeting');
      expect(description).toContain('https://meet.crm-school.com/test');
      expect(description).toContain('Ссылка для подключения:');
    });

    it('should include current date', () => {
      const currentDate = new Date().toLocaleDateString('ru-RU');
      const description = createMeetingDescription('Test', 'Desc', 'https://test.com');
      expect(description).toContain(`Время: ${currentDate}`);
    });
  });
});