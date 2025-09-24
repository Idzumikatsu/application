import { unauthenticatedClient as apiClient, default as httpClient } from './httpClient';
import { User, UserRole } from '../types';

// Используем неаутентифицированный клиент из httpClient для аутентификационных запросов
// Это предотвращает конфликты с интерцепторами авторизации

// Функция для получения токена из localStorage
const getToken = () => {
  try {
    const token = localStorage.getItem('accessToken');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Функция для сохранения токенов
const saveTokens = (accessToken: string, refreshToken?: string) => {
  try {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Функция для очистки токенов
const clearTokens = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Функция для получения refresh токена
const getRefreshToken = () => {
  try {
    return localStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// Интерцепторы теперь находятся только в httpClient.ts, чтобы избежать дублирования

// Типы для аутентификации
export interface LoginRequest {
  email: string;
  password: string;
}

// Основной интерфейс для ответа от сервера
export interface LoginResponseFromServer {
  token: string;
  refreshToken?: string;
  type: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  expiresIn?: number;
}

// Интерфейс для использования во всем приложении
export interface LoginResponse {
  token: string;
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
  };
}

// Интерфейс для запроса обновления токена
export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// Сервисы аутентификации
export const authService = {
  // Логин пользователя
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with credentials:', credentials.email);
      const response = await apiClient.post<LoginResponseFromServer>('/api/auth/login', credentials);

      const { token: accessToken, refreshToken, id, firstName, lastName, email, role } = response.data;

      if (accessToken) {
        console.log('Login successful, saving tokens');
        saveTokens(accessToken, refreshToken);
      }

      return {
        token: accessToken,
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenType: response.data.type,
        user: {
          id: id,
          username: firstName, // For compatibility with existing code
          email: email,
          roles: [role] // Convert single role to array for compatibility
        }
      };
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Обновление токенов
  async refreshToken(): Promise<RefreshResponse> {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // Если refresh токен недоступен, очищаем все токены и выбрасываем ошибку
        clearTokens();
        throw new Error('No refresh token available');
      }

      console.log('Refreshing token...');
      const response = await apiClient.post('/api/auth/refresh', {
        refreshToken: refreshToken,
      });

      if (response.data.token && response.data.refreshToken) {
        console.log('Token refreshed successfully');
        saveTokens(response.data.token, response.data.refreshToken);
      } else {
        // Если сервер не вернул новые токены, очищаем существующие
        clearTokens();
        throw new Error('Invalid refresh response');
      }

      // Маппим ответ в нужный формат
      return {
        accessToken: response.data.token,
        refreshToken: response.data.refreshToken,
        tokenType: 'Bearer'
      };
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      clearTokens();
      throw new Error('Token refresh failed: ' + (error.response?.data?.message || error.message));
    }
  },

  // Логаут
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      window.location.href = '/login';
    }
  },

  // Проверка валидности токена
  isAuthenticated(): boolean {
    const token = getToken();
    if (!token) {
      return false;
    }

    try {
      // Декодируем JWT токен для проверки срока действия
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  },

  // Получение текущего пользователя
  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get('/api/users/me');
      // Маппим ответ сервера к интерфейсу User
      const userData = response.data;
      return {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        telegramUsername: userData.telegramUsername,
        telegramChatId: undefined, // Не возвращается из /api/users/me
        role: userData.role as UserRole, // Приводим к UserRole enum
        isActive: userData.isActive,
        dateOfBirth: undefined, // Не возвращается из /api/users/me
        token: undefined // Не возвращается из /api/users/me
      };
    } catch (error: any) {
      console.error('Error getting current user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  // Проверка роли пользователя
  async hasRole(role: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      // Сравниваем строковое значение роли
      return user && user.role && user.role.toString() === role;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  },

  // Дополнительные методы для совместимости
  getToken(): string | null {
    return getToken();
  },

  setToken(token: string): void {
    saveTokens(token);
  },

  async validateToken(): Promise<boolean> {
    try {
      await apiClient.get('/api/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  },

  async getValidToken(): Promise<string | null> {
    if (this.isAuthenticated()) {
      return this.getToken();
    }
    // Если токен не валиден, но есть refresh токен, пробуем обновить
    if (getRefreshToken()) {
      try {
        await this.refreshToken();
        return this.getToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }
    return null;
  },

  // API client для использования в других сервисах
  getApiClient: () => httpClient,
};

export default authService;