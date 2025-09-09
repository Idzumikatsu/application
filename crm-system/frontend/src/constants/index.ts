// Constants for the CRM application

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    ME: '/api/users/me',
    ALL: '/api/users',
    BY_ID: (id: number) => `/api/users/${id}`,
  },
  TEACHERS: {
    ALL: '/api/managers/teachers',
    BY_ID: (id: number) => `/api/teachers/${id}`,
    AVAILABILITY: (id: number) => `/api/teachers/${id}/availability`,
    LESSONS: (id: number) => `/api/teachers/${id}/lessons`,
    GROUP_LESSONS: (id: number) => `/api/teachers/${id}/group-lessons`,
  },
  STUDENTS: {
    ALL: '/api/managers/students',
    BY_ID: (id: number) => `/api/students/${id}`,
    LESSONS: (id: number) => `/api/students/${id}/lessons`,
    GROUP_LESSONS: (id: number) => `/api/students/${id}/group-lessons`,
    PACKAGES: (id: number) => `/api/students/${id}/lesson-packages`,
  },
  LESSONS: {
    ALL: '/api/lessons',
    BY_ID: (id: number) => `/api/lessons/${id}`,
    COMPLETE: (id: number) => `/api/lessons/${id}/complete`,
    CANCEL: (id: number) => `/api/lessons/${id}/cancel`,
    MARK_AS_MISSED: (id: number) => `/api/lessons/${id}/mark-as-missed`,
  },
  GROUP_LESSONS: {
    ALL: '/api/group-lessons',
    BY_ID: (id: number) => `/api/group-lessons/${id}`,
    REGISTRATIONS: (id: number) => `/api/group-lessons/${id}/registrations`,
    CONFIRM: (id: number) => `/api/group-lessons/${id}/confirm`,
    START: (id: number) => `/api/group-lessons/${id}/start`,
    COMPLETE: (id: number) => `/api/group-lessons/${id}/complete`,
    CANCEL: (id: number) => `/api/group-lessons/${id}/cancel`,
    POSTPONE: (id: number) => `/api/group-lessons/${id}/postpone`,
  },
  REGISTRATIONS: {
    BY_ID: (id: number) => `/api/registrations/${id}`,
    CANCEL: (id: number) => `/api/registrations/${id}/cancel`,
    ATTEND: (id: number) => `/api/registrations/${id}/attend`,
    MISS: (id: number) => `/api/registrations/${id}/miss`,
  },
  AVAILABILITY_SLOTS: {
    ALL: '/api/availability-slots',
    BY_ID: (id: number) => `/api/availability-slots/${id}`,
    BOOK: (id: number) => `/api/bookings/slots/${id}`,
    CANCEL_BOOKING: (id: number) => `/api/bookings/slots/${id}`,
  },
  NOTIFICATIONS: {
    ALL: '/api/notifications',
    BY_ID: (id: number) => `/api/notifications/${id}`,
    RECIPIENT: (id: number, type: string) => `/api/notifications/recipients/${id}/${type}`,
    MARK_AS_READ: (id: number) => `/api/notifications/${id}/mark-as-read`,
    MARK_ALL_AS_READ: (id: number, type: string) => `/api/notifications/recipients/${id}/${type}/mark-all-as-read`,
    UNREAD_COUNT: (id: number, type: string) => `/api/notifications/recipients/${id}/${type}/unread-count`,
  },
  BOOKINGS: {
    CREATE: '/api/bookings',
    CANCEL: (id: number) => `/api/bookings/${id}/cancel`,
  },
};

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};

// Lesson statuses
export const LESSON_STATUSES = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  MISSED: 'MISSED',
};

// Group lesson statuses
export const GROUP_LESSON_STATUSES = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  POSTPONED: 'POSTPONED',
};

// Availability slot statuses
export const AVAILABILITY_SLOT_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  BLOCKED: 'BLOCKED',
};

// Registration statuses
export const REGISTRATION_STATUSES = {
  REGISTERED: 'REGISTERED',
  ATTENDED: 'ATTENDED',
  MISSED: 'MISSED',
  CANCELLED: 'CANCELLED',
};

// Notification statuses
export const NOTIFICATION_STATUSES = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED',
};

// Notification types
export const NOTIFICATION_TYPES = {
  LESSON_SCHEDULED: 'LESSON_SCHEDULED',
  LESSON_CANCELLED: 'LESSON_CANCELLED',
  LESSON_REMINDER: 'LESSON_REMINDER',
  LESSON_COMPLETED: 'LESSON_COMPLETED',
  GROUP_LESSON_SCHEDULED: 'GROUP_LESSON_SCHEDULED',
  GROUP_LESSON_CANCELLED: 'GROUP_LESSON_CANCELLED',
  GROUP_LESSON_REMINDER: 'GROUP_LESSON_REMINDER',
  PACKAGE_ENDING_SOON: 'PACKAGE_ENDING_SOON',
  PAYMENT_DUE: 'PAYMENT_DUE',
  SYSTEM_MESSAGE: 'SYSTEM_MESSAGE',
  FEEDBACK_REQUEST: 'FEEDBACK_REQUEST',
};

// Application settings
export const APP_SETTINGS = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_TIME_FORMAT: 'HH:mm',
  DEFAULT_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
  TOKEN_EXPIRATION_WARNING: 5 * 60 * 1000, // 5 minutes before expiration
  AUTO_REFRESH_INTERVAL: 30 * 1000, // 30 seconds
  NOTIFICATION_CHECK_INTERVAL: 60 * 1000, // 1 minute
};

// Colors for different statuses
export const STATUS_COLORS = {
  SCHEDULED: '#1976d2', // Blue
  COMPLETED: '#388e3c', // Green
  CANCELLED: '#d32f2f', // Red
  MISSED: '#f57c00', // Orange
  AVAILABLE: '#388e3c', // Green
  BOOKED: '#f57c00', // Orange
  BLOCKED: '#d32f2f', // Red
  IN_PROGRESS: '#7b1fa2', // Purple
  POSTPONED: '#7b1fa2', // Purple
  CONFIRMED: '#0288d1', // Light Blue
  REGISTERED: '#1976d2', // Blue
  ATTENDED: '#388e3c', // Green
  PENDING: '#1976d2', // Blue
  SENT: '#0288d1', // Light Blue
  DELIVERED: '#7b1fa2', // Purple
  READ: '#388e3c', // Green
  FAILED: '#d32f2f', // Red
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  UNAUTHORIZED: 'Не авторизован. Пожалуйста, войдите в систему.',
  FORBIDDEN: 'Доступ запрещен.',
  NOT_FOUND: 'Ресурс не найден.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  TIMEOUT: 'Время ожидания истекло.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Вы успешно вошли в систему.',
  LOGOUT_SUCCESS: 'Вы успешно вышли из системы.',
  DATA_SAVED: 'Данные успешно сохранены.',
  DATA_DELETED: 'Данные успешно удалены.',
  ACTION_COMPLETED: 'Действие успешно выполнено.',
};

// Warning messages
export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: 'У вас есть несохраненные изменения. Вы уверены, что хотите уйти?',
  DELETE_CONFIRMATION: 'Вы уверены, что хотите удалить этот элемент?',
  CANCEL_CONFIRMATION: 'Вы уверены, что хотите отменить это действие?',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
};

// Date and time formats
export const DATE_FORMATS = {
  SHORT_DATE: 'DD.MM.YYYY',
  LONG_DATE: 'D MMMM YYYY',
  WEEKDAY_DATE: 'dddd, D MMMM',
  TIME: 'HH:mm',
  DATETIME: 'DD.MM.YYYY HH:mm',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
};

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
  MAX_PAGES_IN_PAGINATION: 7,
};

// Sorting options
export const SORTING = {
  DEFAULT_SORT_FIELD: 'createdAt',
  DEFAULT_SORT_DIRECTION: 'desc',
  ALLOWED_SORT_FIELDS: ['id', 'createdAt', 'updatedAt', 'name', 'email', 'date', 'time'],
};

// Filter options
export const FILTERS = {
  DEFAULT_FILTER_OPERATOR: 'eq',
  ALLOWED_FILTER_OPERATORS: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in', 'nin'],
};

// Cache settings
export const CACHE = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  USER_DATA_TTL: 10 * 60 * 1000, // 10 minutes
  LESSON_DATA_TTL: 2 * 60 * 1000, // 2 minutes
  NOTIFICATION_DATA_TTL: 1 * 60 * 1000, // 1 minute
};