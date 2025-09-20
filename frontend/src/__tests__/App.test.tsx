import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authSlice from '../store/authSlice';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock для react-redux\nvi.mock('react-redux', () => ({\n  useSelector: vi.fn().mockReturnValue({\n    isAuthenticated: false,\n    user: null,\n    loading: false,\n    error: null,\n  }),\n  useDispatch: vi.fn(() => vi.fn()),\n}));

// Mock для react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  it('renders login page when not authenticated', () => {
    renderWithProviders(<App />);

    // Проверяем, что отображается компонент логина
    expect(screen.getByText('CRM Система')).toBeTruthy();
    expect(screen.getByText('Онлайн школа английского языка')).toBeTruthy();
  });

  it('renders without crashing', () => {
    renderWithProviders(<App />);

    // Базовый тест на отсутствие ошибок рендеринга
    expect(screen.getByText('CRM Система')).toBeTruthy();
  });
});