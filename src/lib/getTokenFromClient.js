import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
  const { data, error } = await authClient.token();

  if (error) {
    throw new Error(error.message || "Could not retrieve your session token.");
  }

  const token = data?.token;

  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return token;
};