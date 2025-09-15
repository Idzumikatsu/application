// Utility functions for the CRM application

// Format date to readable string
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
};

// Format time to readable string
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

// Format datetime to readable string
export const formatDateTime = (dateTimeString: string | Date): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get status color based on status
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'scheduled':
    case 'available':
      return '#1976d2'; // Blue
    case 'completed':
    case 'attended':
      return '#388e3c'; // Green
    case 'cancelled':
    case 'missed':
    case 'blocked':
      return '#d32f2f'; // Red
    case 'in_progress':
    case 'booked':
      return '#f57c00'; // Orange
    case 'postponed':
      return '#7b1fa2'; // Purple
    case 'confirmed':
      return '#0288d1'; // Light Blue
    default:
      return '#9e9e9e'; // Gray
  }
};

// Get status text based on status
export const getStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'Запланирован';
    case 'completed':
      return 'Завершен';
    case 'cancelled':
      return 'Отменен';
    case 'missed':
      return 'Пропущен';
    case 'available':
      return 'Доступен';
    case 'booked':
      return 'Забронирован';
    case 'blocked':
      return 'Заблокирован';
    case 'in_progress':
      return 'В процессе';
    case 'postponed':
      return 'Перенесен';
    case 'confirmed':
      return 'Подтвержден';
    case 'attended':
      return 'Посетил';
    default:
      return status;
  }
};

// Calculate age from birth date
export const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'RUB'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Check if date is in the past
export const isPastDate = (date: string | Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

// Check if date is today
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const compareDate = new Date(date);
  return today.getDate() === compareDate.getDate() &&
         today.getMonth() === compareDate.getMonth() &&
         today.getFullYear() === compareDate.getFullYear();
};

// Get days until date
export const getDaysUntil = (date: string | Date): number => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Download file
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};