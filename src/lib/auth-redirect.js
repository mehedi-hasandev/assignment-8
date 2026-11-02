export function getSafeReturnTo(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  try {
    const url = new URL(value, "http://booknook.local");

    if (url.origin !== "http://booknook.local") {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function getLoginUrl(returnTo) {
  return `/login?callbackUrl=${encodeURIComponent(getSafeReturnTo(returnTo))}`;
}
