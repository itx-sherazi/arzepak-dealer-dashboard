import { getStoredToken } from "./authToken";

import { apiUrl } from "./env";

const BASE = apiUrl;

export const fetcher = (url: string) => {
  const token = getStoredToken();
  return fetch(`${BASE}${url}`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(r => r.json());
};
