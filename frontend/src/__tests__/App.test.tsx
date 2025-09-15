import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authReducer from '../store/authSlice';
import { vi } from 'vitest';

// Mock для react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    Routes: actual.Routes,
    Route: actual.Route,
    Navigate: actual.Navigate,
    BrowserRouter: actual.BrowserRouter,
  };
});

vi.mock('../components/Navbar', () => ({
  default: () => <div>Navbar</div>
}));
vi.mock('../components/Sidebar', () => ({
  default: () => <div>Sidebar</div>
}));
vi.mock('../pages/LoginPage', () => ({
  default: () => <div>LoginPage</div>
}));
vi.mock('../components/AuthErrorHandler', () => ({
  default: () => <div>AuthErrorHandler</div>
}));
vi.mock('../components/LessonStatus/LessonStatusAutomation', () => ({
  default: () => <div>LessonStatusAutomation</div>
}));
vi.mock('../components/NotificationPanel', () => ({
  default: () => <div>NotificationPanel</div>
}));

// Mock для сервисов
vi.mock('../services/authService', () => ({
  default: {
    getToken: vi.fn(() => null),
    getCurrentUser: vi.fn(),
    shouldRefreshToken: vi.fn(() => false),
    refreshToken: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
  }
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