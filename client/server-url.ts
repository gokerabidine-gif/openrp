const configuredServer = import.meta.env.VITE_SERVER_URL?.trim();
// A packaged WebView has a local origin, not the origin serving the game server.
// Keep browser development on its current origin, but route Android builds to
// the public OpenRP server unless an operator supplies VITE_SERVER_URL.
const serverBase =
  configuredServer || (import.meta.env.MODE === 'android' ? 'https://openrp.dev' : location.origin);

/** Resolve HTTP endpoints against the configured multiplayer server. */
export function serverHttpUrl(path: string): string {
  return new URL(path, serverBase).toString();
}

/** Resolve a WebSocket endpoint against the configured multiplayer server. */
export function serverWebSocketUrl(path: string): string {
  const url = new URL(path, serverBase);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}
