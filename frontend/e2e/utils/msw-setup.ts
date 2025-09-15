import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  // Mock auth API
  http.post('http://localhost:3000/api/auth/login', ({ request }) => {
    const body = JSON.parse(request.body as string);
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com', role: 'ADMIN' }
      });
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // Mock users API
  http.get('http://localhost:3000/api/users', () => {
    return HttpResponse.json([
      { id: 1, email: 'test@example.com', role: 'ADMIN', isActive: true }
    ]);
  }),

  // Mock other API calls (lessons, etc.)
  http.all('http://localhost:3000/api/*', () => {
    return HttpResponse.json({ message: 'Mocked API response' });
  })
);

export function setupMSW() {
  if (process.env.CI) {
    server.listen({ onUnhandledRequest: 'bypass' });
    return server;
  }
  return null;
}

export function teardownMSW(server) {
  if (server) {
    server.close();
  }
}