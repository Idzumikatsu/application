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

      // Сохраняем токены
      this.setToken(data.token);
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
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
      throw new Error(`Login failed: ${error.message}`);
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
      throw new Error(`Failed to fetch current user: ${error.message}`);
    }
  }

  public async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpClient.post('/auth/refresh', { refreshToken });
      const data = response.data as any;

      if (!data.token || !data.refreshToken) {
        throw new Error('Некорректный ответ от сервера при обновлении токена');
      }

      // Обновляем токены
      this.setToken(data.token);
      this.setRefreshToken(data.refreshToken);

      return {
        token: data.token,
        refreshToken: data.refreshToken,
      };
    } catch (error: any) {
      // Если refresh токен недействителен, очищаем все токены
      this.clearTokens();
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  public logout(): void {
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private getToken(): string | undefined {
    return localStorage.getItem('token') || undefined;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getRefreshToken(): string | undefined {
    return localStorage.getItem('refreshToken') || undefined;
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public async getValidToken(): Promise<string> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Нет токена аутентификации');
    }

    // Проверяем, истек ли токен
    if (this.isTokenExpired(token)) {
      try {
        // Пытаемся обновить токен
        const { token: newToken } = await this.refreshToken();
        return newToken;
      } catch (error) {
        // Если обновить не удалось, выходим из системы
        this.logout();
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
      }
    }

    return token;
  }

  public getUserRole(): string | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  public getUserId(): number | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  }

  public getEmail(): string | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch {
      return null;
    }
  }

  public getTokenExpiration(): Date | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}

export default new AuthService();