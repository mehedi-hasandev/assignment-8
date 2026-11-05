const configuredApiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL;

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
