import { exportToCSV } from '../exportUtils';
import { CalendarEvent } from '../../types';
import { vi } from 'vitest';

// Полифил для TextEncoder
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

describe('exportUtils - exportToCSV', () => {
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Test Lesson',
      start: new Date('2024-01-15T10:00:00'),
      end: new Date('2024-01-15T11:00:00'),
      type: 'lesson',
      status: 'scheduled',
      resource: {
        description: 'Test description',
        meetingLink: 'https://meet.crm-school.com/test'
      }
    },
    {
      id: '2',
      title: 'Group Lesson',
      start: new Date('2024-01-16T14:00:00'),
      end: new Date('2024-01-16T15:30:00'),
      type: 'group-lesson',
      status: 'confirmed'
    }
  ];

  beforeEach(() => {
    // Мокаем DOM функции
    window.URL.createObjectURL = vi.fn(() => 'blob:test');
    window.URL.revokeObjectURL = vi.fn();
    window.Blob = vi.fn(() => ({} as Blob));
    document.createElement = vi.fn(() => ({ download: '', href: '', click: vi.fn() } as any));
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not throw when called', () => {
    expect(() => exportToCSV(mockEvents, 'test-schedule')).not.toThrow();
  });

  it('should handle events without resource description', () => {
    const eventsWithoutDescription: CalendarEvent[] = [
      {
        id: '1',
        title: 'Test Lesson',
        start: new Date('2024-01-15T10:00:00'),
        end: new Date('2024-01-15T11:00:00'),
        type: 'lesson',
        status: 'scheduled'
      }
    ];

    expect(() => exportToCSV(eventsWithoutDescription)).not.toThrow();
  });

  it('should handle events with quotes in title', () => {
    const eventsWithQuotes: CalendarEvent[] = [
      {
        id: '1',
        title: 'Test "Lesson" with quotes',
        start: new Date('2024-01-15T10:00:00'),
        end: new Date('2024-01-15T11:00:00'),
        type: 'lesson',
        status: 'scheduled',
        resource: {
          description: 'Test "description" with quotes'
        }
      }
    ];

    expect(() => exportToCSV(eventsWithQuotes)).not.toThrow();
  });

  it('should call document.createElement with "a"', () => {
    exportToCSV(mockEvents);
    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  it('should call URL.createObjectURL', () => {
    exportToCSV(mockEvents);
    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});