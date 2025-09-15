import { exportToCSV } from '../exportUtils';
import { CalendarEvent } from '../../types';
import { vi } from 'vitest';
import { TextEncoder } from 'util'; // Node builtin, but for browser, polyfill if needed

// Мокаем jsPDF до импорта exportUtils
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    addImage: vi.fn(),
    text: vi.fn(),
    save: vi.fn(),
    // ...other methods with vi.fn()
  }))
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

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
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: vi.fn(() => 'blob:test'),
        revokeObjectURL: vi.fn(),
      },
      writable: true
    });

    const mockBlob = {
      size: 0,
      type: '',
      arrayBuffer: vi.fn(() => Promise.resolve(new ArrayBuffer(0))),
      // Minimal Blob interface
    };
    Object.defineProperty(window, 'Blob', {
      value: vi.fn(() => mockBlob),
      writable: true
    });

    vi.spyOn(document, 'createElement').mockReturnValue({ download: '', href: '', click: vi.fn() } as any);
    vi.spyOn(document.body, 'appendChild').mockReturnValue(undefined as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue(undefined as any);
    window.TextEncoder = TextEncoder;
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