import httpClient from './httpClient';
import { LoginRequest, LoginResponse, User } from '../types';

class AuthService {
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/signin', credentials);
    return response.data;
  }

  public async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<User>('/users/me');
    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('token');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}

export default new AuthService();