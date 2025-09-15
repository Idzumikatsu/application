import { exportToCSV } from '../exportUtils';
import { CalendarEvent } from '../../types';
import { vi } from 'vitest';
import * as util from 'util'; // For TextEncoder if needed

// Мокаем jsPDF до импорта exportUtils
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 595
      }
    },
    setFontSize: vi.fn(),
    text: vi.fn(),
    save: vi.fn()
  }))
}));

jest.mock('jspdf-autotable', () => vi.fn());

// Полифил для TextEncoder
if (typeof TextEncoder === 'undefined') {
  window.TextEncoder = util.TextEncoder;
}

describe('CSV Export', () => {
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
    (window.URL.createObjectURL as unknown as jest.Mock) = jest.fn(() => 'blob:test');
    (window.URL.revokeObjectURL as unknown as jest.Mock) = jest.fn();
    (window.Blob as unknown as jest.Mock) = jest.fn(() => ({}));
    
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
      style: {}
    };
    
    global.document.createElement = vi.fn(() => mockLink as any);
    global.document.body.appendChild = vi.fn();
    global.document.body.removeChild = vi.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(global.document.createElement).toHaveBeenCalledWith('a');
  });

  it('should call URL.createObjectURL', () => {
    exportToCSV(mockEvents);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});