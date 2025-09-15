import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom'; // Enable matchers like toBeInTheDocument
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  it('renders Login button', () => {
    const button = screen.getByRole('button', { name: /войти/i });
    expect(button).toBeInTheDocument();
  });
});