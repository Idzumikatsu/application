import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock для react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
}));

// Mock для компонентов, которые могут вызывать ошибки при рендеринге
jest.mock('../components/Navbar', () => () => <div>Navbar</div>);
jest.mock('../components/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../pages/LoginPage', () => () => <div>LoginPage</div>);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Navbar')).toBeInTheDocument();
  });

  it('contains main application structure', () => {
    render(<App />);
    expect(screen.getByText('Navbar')).toBeInTheDocument();
    // Добавьте дополнительные проверки по мере необходимости
  });
});