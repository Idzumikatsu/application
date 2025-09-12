import httpClient from './httpClient';
import { LoginRequest, LoginResponse, User } from '../types';

class AuthService {
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/api/auth/signin', credentials);
    return response.data;
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
    const response = await httpClient.get<User>('/api/users/me');
    return response.data;
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
