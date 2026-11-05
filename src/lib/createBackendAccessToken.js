import "server-only";
import { createHmac } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 15 * 60;

function encodeSegment(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function createBackendAccessToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required to authenticate with the API server.");
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    id: user.id,
    userId: user.id,
    email: user.email,
    name: user.name,
    iat: issuedAt,
    exp: issuedAt + TOKEN_LIFETIME_SECONDS,
  };
  const unsignedToken = `${encodeSegment({ alg: "HS256", typ: "JWT" })}.${encodeSegment(payload)}`;
  const signature = createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}
