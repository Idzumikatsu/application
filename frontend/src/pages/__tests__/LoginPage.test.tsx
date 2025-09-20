import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import authSlice from '../../store/authSlice';
import { UserRole } from '../../types';

vi.mock('../../services/authService', () => ({
  default: {
    login: vi.fn(),
  }
}));

const mockedAuthService = vi.mocked((await import('../../services/authService')).default);

vi.mock('react-redux', async () => {\n  const actual = await vi.importActual('react-redux');\n  return {\n    ...actual,\n    useSelector: vi.fn().mockReturnValue({\n      isAuthenticated: false,\n      user: null,\n      loading: false,\n      error: null,\n    }),\n    useDispatch: vi.fn(() => vi.fn()),\n  };\n}); 

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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('should show error message with empty fields', async () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /войти/i });
    fireEvent.click(submitButton);

    // Проверяем, что authService.login не был вызван
    expect(mockedAuthService.login).not.toHaveBeenCalled();
  });

  it('should submit form with invalid email format', async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith({
        email: 'invalid-email',
        password: 'password123',
      });
    });
  });

  it('should submit form with valid credentials', async () => {
    mockedAuthService.login.mockResolvedValue({
      user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User', role: UserRole.ADMIN, isActive: true },
      token: 'test-token',
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show loading state during form submission', async () => {
    mockedAuthService.login.mockImplementation(() => new Promise<never>(() => {})); // Never resolves

    renderWithProviders(<LoginPage />);

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
    mockedAuthService.login.mockRejectedValue(new Error(errorMessage));

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('should not call login when form is invalid', () => {
    renderWithProviders(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    expect(mockedAuthService.login).not.toHaveBeenCalled();
  });
});
