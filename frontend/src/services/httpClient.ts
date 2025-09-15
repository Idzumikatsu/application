import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AuthService from './authService';

class HttpClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: (value?: any) => void; reject: (error?: any) => void }> = [];

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add a request interceptor
    this.client.interceptors.request.use(
      (config: any) => {
        console.log('🚀 HTTP Request Interceptor:', config.url);
        const token = AuthService.getToken();
        console.log('🔑 Token from localStorage:', token ? 'PRESENT' : 'NOT FOUND');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Authorization header added');
        } else {
          console.log('❌ No token available, request will be unauthenticated');
        }
        return config;
      },
      (error: any) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    this.client.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Если уже идет обновление токена, добавляем запрос в очередь
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = AuthService.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const newToken = await AuthService.refreshToken();
            AuthService.setToken(newToken);
            
            // Повторяем оригинальный запрос с новым токеном
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Выполняем все запросы из очереди
            this.failedQueue.forEach((promise) => promise.resolve());
            this.failedQueue = [];
            this.isRefreshing = false;
            
            return this.client(originalRequest);
          } catch (refreshError) {
            // Если обновление токена не удалось, очищаем аутентификацию
            this.failedQueue.forEach((promise) => promise.reject(refreshError));
            this.failedQueue = [];
            this.isRefreshing = false;
            
            AuthService.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }
}

const httpClient = new HttpClient(process.env.REACT_APP_API_BASE_URL || '/api');

export default httpClient;