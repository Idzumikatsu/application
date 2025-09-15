import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders Login button', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const button = screen.getByRole('button', { name: /войти/i });
    expect(button).toBeTruthy();
  });
});