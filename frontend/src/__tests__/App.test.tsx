import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authSlice from '../store/authSlice';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

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
    expect(screen.getByText('LoginPage')).toBeTruthy();
  });

  it('renders without crashing', () => {
    renderWithProviders(<App />);

    // Базовый тест на отсутствие ошибок рендеринга
    expect(screen.getByText('LoginPage')).toBeTruthy();
  });
});