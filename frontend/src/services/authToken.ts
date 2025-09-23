class AuthTokenService {
    private readonly TOKEN_KEY = 'authToken';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    getTokenExpiration(): Date | null {
        try {
            const token = this.getToken();
            if (!token) return null;
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            return new Date(payload.exp * 1000);
        } catch {
            return null;
        }
    }

    isTokenExpired(): boolean {
        const expiration = this.getTokenExpiration();
        if (!expiration) return true;
        return expiration.getTime() < Date.now();
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        return !this.isTokenExpired();
    }

    getPayload(): any | null {
        try {
            const token = this.getToken();
            if (!token) return null;
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch {
            return null;
        }
    }
}

const authTokenService = new AuthTokenService();
export default authTokenService;
