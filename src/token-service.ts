import config from './config';

const TokenService = {
  saveAuthToken(token: string): void {
    window.localStorage.setItem(config.TOKEN_KEY, token);
  },
  getAuthToken(): string | null {
    return window.localStorage.getItem(config.TOKEN_KEY);
  },
  clearAuthToken(): void {
    window.localStorage.removeItem(config.TOKEN_KEY);
  },
  hasAuthToken(): boolean {
    return !!TokenService.getAuthToken();
  },
  makeBasicAuthToken(email: string, password: string): string {
    return window.btoa(`${email}:${password}`);
  },
};

export default TokenService;
