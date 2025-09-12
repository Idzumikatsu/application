import httpClient from '../httpClient';
import authService from '../authService';
import { LoginRequest, User, UserRole } from '../../types';

// Mock httpClient
jest.mock('../httpClient');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          refreshToken: 'test-refresh-token',
          user: { id: 1, email: 'test@example.com' } as User
        }
      };

      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await authService.login(credentials);

      expect(httpClient.post).toHaveBeenCalledWith('/api/auth/signin', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const error = new Error('Login failed');
      (httpClient.post as jest.Mock).mockRejectedValue(error);

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
    });
  });

  describe('validateToken', () => {
    it('should return true for valid token', async () => {
      const mockResponse = { data: { valid: true } };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.validateToken();

      expect(httpClient.get).toHaveBeenCalledWith('/api/auth/validate');
      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      (httpClient.get as jest.Mock).mockRejectedValue(new Error('Invalid token'));

      const result = await authService.validateToken();

      expect(result).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = { data: { token: 'new-token' } };
      (httpClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.refreshToken();

      expect(httpClient.post).toHaveBeenCalledWith('/api/auth/refresh');
      expect(result).toBe('new-token');
    });

    it('should handle refresh token error', async () => {
      (httpClient.post as jest.Mock).mockRejectedValue(new Error('Refresh failed'));

      await expect(authService.refreshToken()).rejects.toThrow('Refresh failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true
      } as User;
      const mockResponse = { data: mockUser };
      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(httpClient.get).toHaveBeenCalledWith('/api/users/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle get current user error', async () => {
      (httpClient.get as jest.Mock).mockRejectedValue(new Error('Failed to get user'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Failed to get user');
    });
  });

  describe('logout', () => {
    it('should remove tokens from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', () => {
      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return false for expired token', () => {
      // Create expired token (expired 1 hour ago)
      const expiredToken = createTestToken(Date.now() - 3600000);
      localStorage.setItem('token', expiredToken);

      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return true for valid token', () => {
      // Create valid token (expires in 1 hour)
      const validToken = createTestToken(Date.now() + 3600000);
      localStorage.setItem('token', validToken);

      const result = authService.isAuthenticated();
      expect(result).toBe(true);
    });

    it('should return false for invalid token format', () => {
      localStorage.setItem('token', 'invalid-token-format');

      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('token management', () => {
    it('should get and set token', () => {
      authService.setToken('test-token');
      expect(authService.getToken()).toBe('test-token');
    });

    it('should get and set refresh token', () => {
      authService.setRefreshToken('test-refresh-token');
      expect(authService.getRefreshToken()).toBe('test-refresh-token');
    });

    it('should return null for non-existent token', () => {
      expect(authService.getToken()).toBeNull();
    });

    it('should return null for non-existent refresh token', () => {
      expect(authService.getRefreshToken()).toBeNull();
    });
  });

  describe('getTokenExpiration', () => {
    it('should return null when no token', () => {
      expect(authService.getTokenExpiration()).toBeNull();
    });

    it('should return expiration time for valid token', () => {
      const expirationTime = Date.now() + 3600000;
      const token = createTestToken(expirationTime);
      localStorage.setItem('token', token);

      const result = authService.getTokenExpiration();
      expect(result).toBe(expirationTime);
    });

    it('should return null for invalid token format', () => {
      localStorage.setItem('token', 'invalid-token');
      expect(authService.getTokenExpiration()).toBeNull();
    });
  });

  describe('shouldRefreshToken', () => {
    it('should return false when no token', () => {
      expect(authService.shouldRefreshToken()).toBe(false);
    });

    it('should return false when token has more than 5 minutes left', () => {
      const expirationTime = Date.now() + 3600000; // 1 hour left
      const token = createTestToken(expirationTime);
      localStorage.setItem('token', token);

      expect(authService.shouldRefreshToken()).toBe(false);
    });

    it('should return true when token has less than 5 minutes left', () => {
      const expirationTime = Date.now() + 240000; // 4 minutes left
      const token = createTestToken(expirationTime);
      localStorage.setItem('token', token);

      expect(authService.shouldRefreshToken()).toBe(true);
    });

    it('should return false for expired token', () => {
      const expirationTime = Date.now() - 3600000; // 1 hour expired (more than 5 minutes)
      const token = createTestToken(expirationTime);
      localStorage.setItem('token', token);

      expect(authService.shouldRefreshToken()).toBe(false);
    });
  });
});

// Helper function to create test JWT tokens
function createTestToken(expirationTime: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp: expirationTime / 1000 }));
  const signature = btoa('test-signature');
  
  return `${header}.${payload}.${signature}`;
}
