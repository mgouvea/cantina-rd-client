const TOKEN_KEY = "access_token";
const TOKEN_EXPIRY_KEY = "access_token_expiry";
const TOKEN_DURATION_MS = 48 * 60 * 60 * 1000;

export const authStorage = {
  setToken: (token: string): void => {
    if (typeof window !== "undefined" && token.length > 0) {
      const expiryTime = Date.now() + TOKEN_DURATION_MS;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (!token || !expiry) {
        return null;
      }

      if (Date.now() > parseInt(expiry, 10)) {
        authStorage.removeToken();
        return null;
      }

      return token;
    }
    return null;
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  },
};
