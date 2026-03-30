type AuthSessionInput = {
  token: string;
  role: string;
  userId?: number;
  fullName?: string;
};

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";
const PROFILE_KEY = "auth_profile";

const TOKEN_COOKIE = "px_token";
const ROLE_COOKIE = "px_role";

type AuthSnapshot = {
  token: string | null;
  role: string | null;
};

const DASHBOARD_ROLE_KEYS = new Set(["admin", "editor", "staff", "lanhdao"]);
const VIEWER_ROLE_KEYS = new Set(["viewer", "user", "nguoidung", "khach"]);

function toRoleKey(role: string): string {
  return normalizeRole(role).replace(/\s+/g, "");
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  const rawValue = cookie.slice(name.length + 1);

  try {
    return decodeURIComponent(rawValue);
  } catch {
    return rawValue;
  }
}

function setCookieValue(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; samesite=lax`;
}

function clearCookieValue(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5265";
}

export function normalizeRole(role: string): string {
  return role
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isViewerRole(role: string): boolean {
  return VIEWER_ROLE_KEYS.has(toRoleKey(role));
}

export function hasDashboardAccess(role: string): boolean {
  return DASHBOARD_ROLE_KEYS.has(toRoleKey(role));
}

export function getRedirectPathByRole(role: string): string {
  return hasDashboardAccess(role) ? "/dashboard" : "/";
}

export function setAuthSession(input: AuthSessionInput): void {
  if (typeof window === "undefined") {
    return;
  }

  const role = normalizeRole(input.role);

  localStorage.setItem(TOKEN_KEY, input.token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({
      userId: input.userId,
      fullName: input.fullName,
      role,
    }),
  );

  setCookieValue(TOKEN_COOKIE, input.token);
  setCookieValue(ROLE_COOKIE, role);
}

export function getAuthSnapshot(): AuthSnapshot {
  if (typeof window === "undefined") {
    return { token: null, role: null };
  }

  const cookieToken = getCookieValue(TOKEN_COOKIE);
  const cookieRole = getCookieValue(ROLE_COOKIE);

  if (cookieToken) {
    return {
      token: cookieToken,
      role: cookieRole,
    };
  }

  const storageToken = localStorage.getItem(TOKEN_KEY);
  const storageRole = localStorage.getItem(ROLE_KEY);

  return {
    token: storageToken,
    role: storageRole,
  };
}

export function hydrateAuthCookiesFromStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  const cookieToken = getCookieValue(TOKEN_COOKIE);

  if (cookieToken) {
    return;
  }

  const storageToken = localStorage.getItem(TOKEN_KEY);
  const storageRole = localStorage.getItem(ROLE_KEY);

  if (!storageToken) {
    return;
  }

  setCookieValue(TOKEN_COOKIE, storageToken);
  if (storageRole) {
    setCookieValue(ROLE_COOKIE, storageRole);
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(PROFILE_KEY);

  clearCookieValue(TOKEN_COOKIE);
  clearCookieValue(ROLE_COOKIE);
}
