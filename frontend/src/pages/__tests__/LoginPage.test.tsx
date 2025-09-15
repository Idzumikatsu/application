import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { vi } from 'vitest';

// Mock the authService and redux hooks
vi.mock('../../services/authService', () => ({
  default: {
    login: vi.fn(),
    setToken: vi.fn(),
    setRefreshToken: vi.fn(),
  },
}));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('should show error message with empty fields', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /войти/i });
    fireEvent.click(submitButton);

    // Форма не должна отправляться при пустых полях, должна показать ошибку
    expect(await screen.findByText('Введите email и пароль')).toBeInTheDocument();
    expect(vi.mocked(require('../../services/authService').default.login)).not.toHaveBeenCalled();
  });

  it('should submit form with invalid email format', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Компонент не имеет встроенной валидации email, поэтому форма будет отправлена
    await waitFor(() => {
      expect(vi.mocked(require('../../services/authService').default.login)).toHaveBeenCalledWith({
        email: 'invalid-email',
        password: 'password123',
      });
    });
  });

  it('should submit form with valid credentials', async () => {
    vi.mocked(require('../../services/authService').default.login).mockResolvedValue({
      user: { id: 1, email: 'test@example.com' },
      token: 'test-token',
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(vi.mocked(require('../../services/authService').default.login)).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show loading state during form submission', async () => {
    vi.mocked(require('../../services/authService').default.login).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should show error message on login failure', async () => {
    const errorMessage = 'Неверные учетные данные';
    vi.mocked(require('../../services/authService').default.login).mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
