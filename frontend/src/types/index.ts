// Type definitions for the CRM application

// Base entity interface
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// User roles
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

// User interface
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  telegramUsername?: string;
  telegramChatId?: string;
  role: UserRole;
  isActive: boolean;
  dateOfBirth?: string;
  token?: string;
}

// Student interface
export interface Student extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  telegramUsername?: string;
  telegramChatId?: string;
  dateOfBirth?: string;
  assignedTeacherId?: number;
}

// Teacher interface (extends User)
export interface Teacher extends User {
  specialization?: string;
  bio?: string;
  hourlyRate?: number;
}

// Lesson statuses
export enum LessonStatus {
  SCHEDULED = 'SCHEDULED',
  CONDUCTED = 'CONDUCTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED',
}

// Lesson interface
export interface Lesson extends BaseEntity {
  studentId: number;
  teacherId: number;
  slotId?: number;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  durationMinutes: number;
  status: LessonStatus;
  cancellationReason?: string;
  cancelledBy?: string;
  notes?: string;
  confirmedByTeacher: boolean;
  student?: Student;
  teacher?: Teacher;
}

// Lesson status history interface
export interface LessonStatusHistory extends BaseEntity {
  lessonId: number;
  oldStatus: LessonStatus;
  newStatus: LessonStatus;
  changedBy: string;
  changedById: number;
  changeReason?: string;
  automated: boolean;
}

// Lesson status statistics interface
export interface LessonStatusStats {
  scheduled: number;
  conducted: number;
  completed: number;
  cancelled: number;
  missed: number;
  total: number;
}

// Lesson status change request interface
export interface LessonStatusChangeRequest {
  newStatus: LessonStatus;
  reason?: string;
  deductPackage?: boolean;
}

// Group lesson statuses
export enum GroupLessonStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

// Group lesson interface
export interface GroupLesson extends BaseEntity {
  teacherId: number;
  teacherName?: string;
  lessonTopic: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  durationMinutes: number;
  maxStudents?: number;
  currentStudents: number;
  status: GroupLessonStatus;
  description?: string;
  meetingLink?: string;
  teacher?: Teacher;
}

// Registration statuses
export enum RegistrationStatus {
  REGISTERED = 'REGISTERED',
  ATTENDED = 'ATTENDED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
}

// Group lesson registration interface
export interface GroupLessonRegistration extends BaseEntity {
  groupLessonId: number;
  groupLessonTopic?: string;
  studentId: number;
  studentName?: string;
  studentEmail?: string;
  registrationStatus: RegistrationStatus;
  registeredAt?: string;
  attended: boolean;
  attendanceConfirmedAt?: string;
  cancellationReason?: string;
}

// Availability slot statuses
export enum AvailabilitySlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
}

// Availability slot interface
export interface AvailabilitySlot extends BaseEntity {
  teacherId: number;
  slotDate: string; // YYYY-MM-DD
  slotTime: string; // HH:MM
  durationMinutes: number;
  isBooked: boolean;
  status: AvailabilitySlotStatus;
  teacher?: Teacher;
}

// Lesson package interface
export interface LessonPackage extends BaseEntity {
  studentId: number;
  totalLessons: number;
  remainingLessons: number;
  student?: Student;
}

// Notification statuses
export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

// Notification types
export enum NotificationType {
  LESSON_SCHEDULED = 'LESSON_SCHEDULED',
  LESSON_CANCELLED = 'LESSON_CANCELLED',
  LESSON_REMINDER = 'LESSON_REMINDER',
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  GROUP_LESSON_SCHEDULED = 'GROUP_LESSON_SCHEDULED',
  GROUP_LESSON_CANCELLED = 'GROUP_LESSON_CANCELLED',
  GROUP_LESSON_REMINDER = 'GROUP_LESSON_REMINDER',
  PACKAGE_ENDING_SOON = 'PACKAGE_ENDING_SOON',
  PAYMENT_DUE = 'PAYMENT_DUE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
  FEEDBACK_REQUEST = 'FEEDBACK_REQUEST',
}

// Notification interface
export interface Notification extends BaseEntity {
  recipientId: number;
  recipientType: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  sentAt?: string;
  readAt?: string;
  relatedEntityId?: number;
  priority: number;
}

// Package notification interface
export interface PackageNotification extends BaseEntity {
  studentId: number;
  packageId: number;
  notificationType: 'PACKAGE_LOW_BALANCE' | 'PACKAGE_EXPIRING' | 'PACKAGE_EXPIRED';
  title: string;
  message: string;
  status: NotificationStatus;
  sentAt?: string;
  readAt?: string;
  student?: Student;
  package?: LessonPackage;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

// Pagination interfaces
export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Filter interfaces
export interface FilterCriteria {
  field: string;
  operator: string;
  value: any;
}

export interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchRequest {
  filters?: FilterCriteria[];
  sort?: SortCriteria[];
  page?: number;
  size?: number;
}

// Error interfaces
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
}

export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

// Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

// File upload interfaces
export interface FileUploadRequest {
  file: File;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
}

// Settings interfaces
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    telegram: boolean;
    push: boolean;
  };
  timezone: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultTimezone: string;
  defaultLanguage: string;
  supportedLanguages: string[];
}

// Statistics interfaces
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalManagers: number;
  activeStudents: number;
  activeTeachers: number;
  lessonsToday: number;
  lessonsThisWeek: number;
  studentsEndingSoon: Array<{
    studentId: number;
    studentName: string;
    teacherName: string;
    remainingLessons: number;
    totalLessons: number;
    packageEndDate: string;
  }>;
  lastUpdated: string;
  scheduledLessons?: number;
  completedLessons?: number;
  cancelledLessons?: number;
  upcomingLessons?: number;
  availableSlots?: number;
  bookedSlots?: number;
  unreadNotifications?: number;
}

export interface TeacherStats {
  totalLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  missedLessons: number;
  averageRating?: number;
  totalStudents: number;
  upcomingLessons: number;
}

export interface StudentStats {
  totalLessons: number;
  completedLessons: number;
  missedLessons: number;
  remainingLessons: number;
  nextLessonDate?: string;
  totalPackages: number;
}

// Calendar interfaces
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
  type: 'lesson' | 'group-lesson' | 'availability' | 'other';
  status: string;
  color?: string;
}

export interface CalendarViewSettings {
  view: 'day' | 'week' | 'month';
  date: Date;
  showWeekends: boolean;
  showTime: boolean;
}

// Export interfaces
export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  columns: string[];
  filters?: FilterCriteria[];
  sort?: SortCriteria[];
  includeHeaders: boolean;
  fileName: string;
}

export interface ExportResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  expiresAt: string;
}

// Report interfaces
export interface ReportRequest {
  type: 'lessons' | 'students' | 'teachers' | 'revenue' | 'attendance';
  startDate: string;
  endDate: string;
  filters?: FilterCriteria[];
  format: 'csv' | 'xlsx' | 'pdf';
}

export interface ReportResult {
  reportId: string;
  reportName: string;
  generatedAt: string;
  fileSize: number;
  downloadUrl: string;
  expiresAt: string;
}
