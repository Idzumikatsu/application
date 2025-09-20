import httpClient from './httpClient';
import { LoginRequest, LoginResponse, User } from '../types';

class AuthService {
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await httpClient.post('/auth/login', credentials);
      const data = response.data as any;

      if (!data.token || !data.id || !data.email || !data.role) {
        throw new Error('Некорректный ответ от сервера: отсутствуют данные для аутентификации');
      }

      return {
        token: data.token,
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          isActive: true,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  public async validateToken(): Promise<boolean> {
    try {
      const response = await httpClient.get<{ valid: boolean }>('/auth/validate');
      return response.data.valid;
    } catch {
      return false;
    }
  }

  public async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get<User>('/users/me');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  public logout(): void {
    localStorage.removeItem('token');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Проверяем, что токен является JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid JWT token format');
        return false;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Проверяем, что токен не истек
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        console.warn('Token has expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}

const authService = new AuthService();
export default authService;