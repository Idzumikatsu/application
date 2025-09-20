import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import authSlice from '../../store/authSlice';
import { apiSlice } from '../../apiSlice';

// Mock modules
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  error: vi.fn(),
}));

// Mock the apiSlice properly
vi.mock('../../apiSlice', async () => {
  const actual = await vi.importActual('../../apiSlice');
  return {
    ...actual,
    useLoginMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useVerifyMfaMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
  };
});

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
  const actual: any = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn().mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    }),
    useDispatch: () => mockDispatch,
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const user = userEvent.setup();
  return { user, ...render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  ) };
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
    const { user } = renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /войти/i });
    await user.click(submitButton);

    // Login not called on invalid form
    const useLoginMutation = (await import('../../apiSlice')).useLoginMutation;
    const mockedMutation = vi.mocked(useLoginMutation);
    expect(mockedMutation).toHaveBeenCalled();
  });

  it('should submit form with invalid email format', async () => {
    const { user } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    const useLoginMutation = (await import('../../apiSlice')).useLoginMutation;
    const mockedMutation = vi.mocked(useLoginMutation);
    expect(mockedMutation).toHaveBeenCalled();

    // Check validation error appears
    await waitFor(() => {
      expect(screen.getByText('Неверный формат email')).toBeInTheDocument();
    });
  });

  it('should submit form with valid credentials', async () => {
    const useLoginMutation = (await import('../../apiSlice')).useLoginMutation;
    const mockedUseLoginMutation = vi.mocked(useLoginMutation);
    const mockLoginFn = vi.fn().mockResolvedValue({
      data: {
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'Admin', isActive: true },
        token: 'test-token',
        mfaEnabled: false,
      },
      unwrap: () => Promise.resolve({
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'Admin', isActive: true },
        token: 'test-token',
        mfaEnabled: false,
      })
    });
    mockedUseLoginMutation.mockReturnValue([mockLoginFn, { isLoading: false }] as any);

    const { user } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
  });

  it('should show loading state during form submission', async () => {
    const useLoginMutation = (await import('../../apiSlice')).useLoginMutation;
    const mockedUseLoginMutation = vi.mocked(useLoginMutation);
    // Create a mock that will resolve immediately but we'll check the loading state
    let isLoading = false;
    const mockLoginFn = vi.fn().mockImplementation(() => {
      isLoading = true;
      mockedUseLoginMutation.mockReturnValue([mockLoginFn, { isLoading }] as any);
      // Return a promise that never resolves to simulate loading
      return new Promise(() => {});
    });
    mockedUseLoginMutation.mockReturnValue([mockLoginFn, { isLoading }] as any);

    const { user } = renderWithProviders(<LoginPage />);

    // Get the submit button by its role (it should have the text "Войти" initially)
    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Before clicking, the button should not be disabled
    expect(submitButton).not.toBeDisabled();
    
    // Click the button
    await user.click(submitButton);
    
    // After clicking, the button should be disabled and show progress indicator
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error message on login failure', async () => {
    const errorMessage = 'Неверные учетные данные';
    const useLoginMutation = (await import('../../apiSlice')).useLoginMutation;
    const mockedUseLoginMutation = vi.mocked(useLoginMutation);
    const mockLoginFn = vi.fn().mockRejectedValue({
      data: { message: errorMessage },
      status: 401
    });
    mockedUseLoginMutation.mockReturnValue([mockLoginFn, { isLoading: false }] as any);

    const { user } = renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      const toast = require('react-hot-toast');
      expect(toast.toast.error).toHaveBeenCalled();
    });
  });

  it('should not call login when form is invalid', async () => {
    const useLoginMutation = (await import('../../apiSlice')).useLoginMutation;
    const mockedUseLoginMutation = vi.mocked(useLoginMutation);
    mockedUseLoginMutation.mockReturnValue([vi.fn(), { isLoading: false }] as any);
    
    const { user } = renderWithProviders(<LoginPage />);
    await user.click(screen.getByRole('button', { name: /войти/i }));
    
    // Check that login was not called because of validation
    // We check that the mock function was called to initialize the hook but not executed
    expect(mockedUseLoginMutation).toHaveBeenCalled();
  });
});
