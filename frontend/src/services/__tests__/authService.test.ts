import { vi, type MockedFunction } from 'vitest';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import httpClient from '../httpClient';
import authService from '../authService';
import { LoginRequest, User, UserRole } from '../../types';

vi.mock('../httpClient', () => {
  // Create a more complete mock that mimics axios behavior
  const createMockClient = () => ({
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  });

  const mockClient = createMockClient();
  
  return {
    default: mockClient,
    unauthenticatedClient: mockClient,
  };
});

// Typing for mocked httpClient methods
const mockedHttpClient = {
  post: vi.mocked(httpClient.post) as MockedFunction<(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse>>,
  get: vi.mocked(httpClient.get) as MockedFunction<(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>>,
};

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockApiResponse = {
        data: {
          token: 'test-token',
          refreshToken: 'refresh-test-token',
          type: 'Bearer',
          id: 1,
          firstName: 'testuser',
          lastName: 'User',
          email: 'test@example.com',
          role: 'ADMIN'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: { 'Content-Type': 'application/json' } as any,
        },
      };

      mockedHttpClient.post.mockResolvedValue(mockApiResponse);

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await authService.login(credentials);

      expect(mockedHttpClient.post).toHaveBeenCalledWith('/api/auth/login', credentials);
      expect(result).toEqual({
        token: 'test-token',
        accessToken: 'test-token',
        refreshToken: 'refresh-test-token',
        tokenType: 'Bearer',
        user: {
          id: 1,
          username: 'testuser', // firstName is used as username
          email: 'test@example.com',
          roles: ['ADMIN'] // role is converted to array
        }
      });
    });

    it('should handle login error', async () => {
      const error = new Error('Login failed');
      mockedHttpClient.post.mockRejectedValue(error);

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
    });
  });

  describe('validateToken', () => {
    it('should return true for valid token', async () => {
      const mockResponse = {
        data: { valid: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: { 'Content-Type': 'application/json' } as any,
        },
      };
      mockedHttpClient.get.mockResolvedValue(mockResponse);

      const result = await authService.validateToken();

      expect(mockedHttpClient.get).toHaveBeenCalledWith('/api/auth/validate');
      expect(result).toBe(true);
    });

    it('should return false when validation fails', async () => {
      mockedHttpClient.get.mockRejectedValue(new Error('Invalid token'));

      const result = await authService.validateToken();
      expect(result).toBe(false);
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
      const mockResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: { 'Content-Type': 'application/json' } as any,
        },
      };
      mockedHttpClient.get.mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(mockedHttpClient.get).toHaveBeenCalledWith('/api/users/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle get current user error', async () => {
      mockedHttpClient.get.mockRejectedValue(new Error('Failed to get user'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Failed to get user');
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', async () => {
      localStorage.setItem('accessToken', 'test-token');
      
      // Mock the logout API call to resolve immediately
      mockedHttpClient.post.mockResolvedValue({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: { 'Content-Type': 'application/json' } as any,
        },
      });

      await authService.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', () => {
      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return false for expired token', () => {
      const expiredToken = createTestToken(Date.now() - 3600000);
      localStorage.setItem('token', expiredToken);

      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return true for valid token', () => {
      const validToken = createTestToken(Date.now() + 3600000);
      localStorage.setItem('accessToken', validToken);

      const result = authService.isAuthenticated();
      expect(result).toBe(true);
    });

    it('should return false for invalid token format', () => {
      localStorage.setItem('accessToken', 'invalid-token-format');
      const result = authService.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('token management', () => {
    it('should get and set token', () => {
      authService.setToken('test-token');
      expect(authService.getToken()).toBe('test-token');
    });

    it('should return null for non-existent token', () => {
      expect(authService.getToken()).toBeNull();
    });
  });
});

function createTestToken(expirationTime: number): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { exp: Math.floor(expirationTime / 1000) };
  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));
  const signature = 'signature';
  return `${base64Header}.${base64Payload}.${signature}`;
}
