import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authReducer from '../store/authSlice';
import { vi } from 'vitest';

// Mock для react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Navigate: () => <div>Navigate</div>,
  useNavigate: () => jest.fn(),
}));

// Mock для компонентов, которые могут вызывать ошибки при рендеринге
vi.mock('../components/Navbar', () => () => <div>Navbar</div>);
vi.mock('../components/Sidebar', () => () => <div>Sidebar</div>);
vi.mock('../pages/LoginPage', () => () => <div>LoginPage</div>);
vi.mock('../components/AuthErrorHandler', () => () => <div>AuthErrorHandler</div>);
vi.mock('../components/LessonStatus/LessonStatusAutomation', () => () => <div>LessonStatusAutomation</div>);
vi.mock('../components/NotificationPanel', () => () => <div>NotificationPanel</div>);

// Mock для сервисов
vi.mock('../services/authService', () => ({
  getToken: jest.fn(() => null),
  getCurrentUser: jest.fn(),
  shouldRefreshToken: jest.fn(() => false),
  refreshToken: jest.fn(),
  setToken: jest.fn(),
  logout: jest.fn(),
}));

describe('App Component', () => {
  const mockStore = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      },
    },
  });

  it('renders login page when not authenticated', () => {
    render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    );
    
    // Проверяем, что отображается компонент логина
    expect(screen.getByText('LoginPage')).toBeTruthy();
  });

  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    );
    
    // Базовый тест на отсутствие ошибок рендеринга
    expect(screen.getByText('LoginPage')).toBeTruthy();
  });
});