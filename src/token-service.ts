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
  saveUserId(userId: string): void {
    window.localStorage.setItem('simple-budget-user-id', userId);
  },
  getUserId(): string | null {
    return window.localStorage.getItem('simple-budget-user-id');
  },
  clearUserId(): void {
    window.localStorage.removeItem('simple-budget-user-id');
  },
};

export default TokenService;
