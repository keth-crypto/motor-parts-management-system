

import { CONFIG } from "./config";

// Get access token
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(
    CONFIG.STORAGE_KEYS.ACCESS_TOKEN
  );

  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  return token;
};

// Get user ID from JWT
export const getUserId = (): number | null => {
  const token = getAccessToken();

  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const decodedPayloadId =
      decodedPayload.id ?? decodedPayload.userId;

    return decodedPayloadId ? Number(decodedPayloadId) : null;
  } catch {
    return null;
  }
};

// Set tokens
export const setTokens = (
  accessToken?: string,
  refreshToken?: string
): void => {
  if (typeof window === "undefined") return;

  if (
    accessToken &&
    accessToken !== "undefined" &&
    accessToken !== "null"
  ) {
    localStorage.setItem(
      CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
      accessToken
    );
  } else {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  if (
    refreshToken &&
    refreshToken !== "undefined" &&
    refreshToken !== "null"
  ) {
    localStorage.setItem(
      CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
      refreshToken
    );
  } else {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }
};

// Clear tokens
export const clearTokens = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
};

// Check authentication
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
