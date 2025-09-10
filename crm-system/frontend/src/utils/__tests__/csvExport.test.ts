import { exportToCSV } from '../exportUtils';
import { CalendarEvent } from '../../types';

// Мокаем jsPDF до импорта exportUtils
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 595
      }
    },
    setFontSize: jest.fn(),
    text: jest.fn(),
    save: jest.fn()
  }));
});

jest.mock('jspdf-autotable', () => jest.fn());

// Полифил для TextEncoder
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
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
    global.URL.createObjectURL = jest.fn(() => 'blob:test');
    global.URL.revokeObjectURL = jest.fn();
    global.Blob = jest.fn(() => ({})) as any;
    
    const mockLink = {
      href: '',
      download: '',
      click: jest.fn(),
      style: {}
    };
    
    global.document.createElement = jest.fn(() => mockLink as any);
    global.document.body.appendChild = jest.fn();
    global.document.body.removeChild = jest.fn();
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