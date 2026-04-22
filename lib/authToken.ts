/** Bearer handoff from main site (cross-port cookie is unreliable on localhost). */
export const AUTH_TOKEN_KEY = "arzepak_auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}
