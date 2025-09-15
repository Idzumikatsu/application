import httpClient from './httpClient';
import { LoginRequest, LoginResponse, User } from '../types';

class AuthService {
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🚀 Авторизация:', credentials.email);
      const response = await httpClient.post('/api/auth/signin', credentials);
      console.log('✅ Ответ API:', response.data);

      // Проверяем структуру ответа от сервера
      const data = response.data as any;
      console.log('🔍 Структура ответа сервера:', Object.keys(data));

      // Проверяем наличие токена
      if (!data.token) {
        console.error('❌ Токен отсутствует в ответе сервера');
        throw new Error('Некорректный ответ от сервера: отсутствует токен');
      }

      // Проверяем наличие данных пользователя
      if (!data.id || !data.email || !data.role) {
        console.error('❌ Данные пользователя отсутствуют в ответе сервера');
        console.error('🔍 Фактическая структура данных:', data);
        throw new Error('Некорректный ответ от сервера: отсутствуют данные пользователя');
      }

      return {
        token: data.token,
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          isActive: true // Assume active since login succeeded
        }
      };
    } catch (error: any) {
      console.error('❌ Ошибка авторизации:', error.response?.data || error.message || error);
      
      // Добавляем больше информации об ошибке
      if (error.response) {
        console.error('🔍 Статус ошибки:', error.response.status);
        console.error('🔍 Заголовки ошибки:', error.response.headers);
        console.error('🔍 Данные ошибки:', error.response.data);
      }
      
      throw error;
    }
  }

  public async validateToken(): Promise<boolean> {
    try {
      const response = await httpClient.get<{ valid: boolean }>('/api/auth/validate');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  public async refreshToken(): Promise<string> {
    const response = await httpClient.post<{ token: string }>('/api/auth/refresh');
    return response.data.token;
  }

  public async getCurrentUser(): Promise<User> {
    console.log('👤 getCurrentUser called');
    try {
      const response = await httpClient.get<User>('/api/users/me');
      console.log('✅ getCurrentUser success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ getCurrentUser failed:', error.response?.status, error.response?.data || error.message);
      throw error;
    }
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Проверяем, не истек ли токен
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  public getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }

  public shouldRefreshToken(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return false;
    
    const timeUntilExpiration = expiration - Date.now();
    
    // Обновляем токен за 5 минут до истечения, но только если токен еще действителен
    return timeUntilExpiration > 0 && timeUntilExpiration < 5 * 60 * 1000;
  }
}

const authService = new AuthService();
export default authService;
