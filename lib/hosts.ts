/**
 * Local aliases: browsers / Supabase Site URL often use 127.0.0.1
 * while WEB_HOST is configured as "localhost".
 */
export function normalizeHostname(hostHeader: string): string {
  const raw = hostHeader.trim().toLowerCase();

  // IPv6 Host header: [::1]:3002 or [::1]
  if (raw.startsWith("[")) {
    const end = raw.indexOf("]");
    const ipv6 = end !== -1 ? raw.slice(1, end) : raw;
    if (ipv6 === "::1") return "localhost";
    return ipv6;
  }

  // Bare IPv6 loopback without brackets (rare)
  if (raw === "::1" || raw.startsWith("::1:")) {
    return "localhost";
  }

  // hostname:port or ipv4:port
  const hostname = raw.split(":")[0] ?? "";
  if (hostname === "127.0.0.1") {
    return "localhost";
  }
  return hostname;
}

/** Canonical app origin for redirects (magic link, auth callback, middleware). */
export function getAppOrigin(fallbackProtocol = "http:", fallbackPort?: string): string {
  const fromEnv =
    process.env.APP_ORIGIN?.trim() ||
    process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();

  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const appHost = process.env.APP_HOST?.trim() || "app.localhost";
  const port =
    fallbackPort && fallbackPort !== "80" && fallbackPort !== "443"
      ? `:${fallbackPort}`
      : "";

  return `${fallbackProtocol}//${appHost}${port}`;
}

export function isSafeAppPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}
