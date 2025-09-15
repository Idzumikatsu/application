import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authReducer from '../store/authSlice';

// Mock для react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Navigate: () => <div>Navigate</div>,
  useNavigate: () => jest.fn(),
}));

// Mock для компонентов, которые могут вызывать ошибки при рендеринге
jest.mock('../components/Navbar', () => () => <div>Navbar</div>);
jest.mock('../components/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../pages/LoginPage', () => () => <div>LoginPage</div>);
jest.mock('../components/AuthErrorHandler', () => () => <div>AuthErrorHandler</div>);
jest.mock('../components/LessonStatus/LessonStatusAutomation', () => () => <div>LessonStatusAutomation</div>);
jest.mock('../components/NotificationPanel', () => () => <div>NotificationPanel</div>);

// Mock для сервисов
jest.mock('../services/authService', () => ({
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