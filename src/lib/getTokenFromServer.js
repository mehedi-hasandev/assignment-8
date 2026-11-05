import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenFromServer = async (requestHeaders) => {
  const incomingHeaders = requestHeaders ?? (await headers());
  const session = await auth.api.getSession({ headers: incomingHeaders });

  if (!session) {
    return null;
  }

  const jwtToken = await auth.api.getToken({ headers: incomingHeaders });
  const token = jwtToken?.token;

  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Could not retrieve an authenticated JWT.");
  }

  return token;
};