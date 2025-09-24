import axios from 'axios';

// API Base URL - используем текущий домен
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Создаем экземпляр axios с дефолтными настройками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    // Обновляем заголовок Authorization для всех последующих запросов
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Функция для очистки токенов
const clearTokens = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete apiClient.defaults.headers.common['Authorization'];
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

// Интерцептор для добавления токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок ответа
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Проверяем, что это 401 ошибка и не запрос на refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          console.log('Attempting token refresh...');
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          if (accessToken) {
            console.log('Token refreshed successfully');
            saveTokens(accessToken, newRefreshToken);

            // Повторяем оригинальный запрос с новым токеном
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);

          // Если refresh не удался, очищаем токены и перенаправляем на логин
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        console.log('No refresh token available');
        clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Типы для аутентификации
export interface LoginRequest {
  email: string;
  password: string;
}

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
      const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);

      const { accessToken, refreshToken, token } = response.data;

      if (accessToken || token) {
        console.log('Login successful, saving tokens');
        saveTokens(accessToken || token, refreshToken);
      }

      return response.data;
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
        throw new Error('No refresh token available');
      }

      console.log('Refreshing token...');
      const response = await axios.post<RefreshResponse>(`${API_BASE_URL}/api/auth/refresh`, {
        refreshToken: refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (accessToken && newRefreshToken) {
        console.log('Token refreshed successfully');
        saveTokens(accessToken, newRefreshToken);
      }

      return response.data;
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      clearTokens();
      throw new Error('Token refresh failed');
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
  getCurrentUser(): any {
    const token = getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user || payload.sub || null;
    } catch (error) {
      console.error('Error parsing user from token:', error);
      return null;
    }
  },

  // Проверка роли пользователя
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes(role);
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
    return null;
  },

  // API client для использования в других сервисах
  getApiClient: () => apiClient,
};

export default authService;