// Test data constants based on V2__seed_data.sql
export const TEST_DATA = {
  USERS: {
    ADMIN: {
      email: 'admin@englishschool.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    },
    MANAGER: {
      email: 'manager@englishschool.com',
      password: 'manager123',
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER'
    },
    TEACHERS: {
      JOHN_SMITH: {
        email: 'john.smith@englishschool.com',
        password: 'teacher123',
        firstName: 'John',
        lastName: 'Smith',
        role: 'TEACHER',
        id: 3 // Based on insertion order in seed file
      },
      SARAH_JOHNSON: {
        email: 'sarah.johnson@englishschool.com',
        password: 'teacher123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'TEACHER',
        id: 4
      }
    }
  },

  STUDENTS: {
    ALICE_BROWN: {
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice.brown@example.com',
      phone: '+1234567890',
      telegramUsername: 'alice_brown',
      dateOfBirth: '1995-05-15',
      assignedTeacherId: 3, // John Smith
      package: {
        totalLessons: 10,
        remainingLessons: 8
      }
    },
    BOB_WILSON: {
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson@example.com',
      phone: '+0987654321',
      telegramUsername: 'bob_wilson',
      dateOfBirth: '1998-08-22',
      assignedTeacherId: 4, // Sarah Johnson
      package: {
        totalLessons: 5,
        remainingLessons: 5
      }
    },
    CAROL_DAVIS: {
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@example.com',
      phone: '+1122334455',
      telegramUsername: 'carol_davis',
      dateOfBirth: '1993-12-01',
      assignedTeacherId: 3, // John Smith
      package: {
        totalLessons: 20,
        remainingLessons: 15
      }
    }
  },

  AVAILABILITY_SLOTS: {
    JOHN_SMITH: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '10:00:00',
        duration: 60,
        booked: false
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '11:00:00',
        duration: 60,
        booked: false
      },
      {
        date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        time: '14:00:00',
        duration: 60,
        booked: false
      }
    ],
    SARAH_JOHNSON: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '09:00:00',
        duration: 60,
        booked: false
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '15:00:00',
        duration: 60,
        booked: false
      },
      {
        date: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
        time: '16:00:00',
        duration: 60,
        booked: false
      }
    ]
  },

  LESSONS: {
    SCHEDULED: [
      {
        student: 'Alice Brown',
        teacher: 'John Smith',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '10:00:00',
        duration: 60,
        status: 'SCHEDULED',
        confirmed: true
      },
      {
        student: 'Bob Wilson',
        teacher: 'Sarah Johnson',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '09:00:00',
        duration: 60,
        status: 'SCHEDULED',
        confirmed: true
      }
    ]
  },

  GROUP_LESSONS: [
    {
      teacher: 'John Smith',
      topic: 'Business English Conversation',
      date: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
      time: '18:00:00',
      duration: 90,
      maxStudents: 10,
      currentStudents: 0,
      status: 'SCHEDULED'
    },
    {
      teacher: 'Sarah Johnson',
      topic: 'Grammar Workshop',
      date: new Date(Date.now() + 120 * 60 * 60 * 1000), // 5 days from now
      time: '17:00:00',
      duration: 60,
      maxStudents: 8,
      currentStudents: 0,
      status: 'SCHEDULED'
    }
  ],

  NOTIFICATIONS: [
    {
      recipient: 'admin@englishschool.com',
      type: 'SYSTEM_MESSAGE',
      title: 'System Started',
      message: 'CRM System has been successfully initialized with seed data',
      status: 'SENT'
    },
    {
      recipient: 'alice.brown@example.com',
      type: 'LESSON_SCHEDULED',
      title: 'Lesson Scheduled',
      message: 'Your lesson with John Smith has been scheduled for tomorrow at 10:00',
      status: 'SENT'
    }
  ]
};

// Helper functions for test data
export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const getTimeInFuture = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

export const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const formatTimeForInput = (time: string) => {
  return time.substring(0, 5); // HH:MM format
};