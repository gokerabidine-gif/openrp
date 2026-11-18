const configuredServer = import.meta.env.VITE_SERVER_URL?.trim();
const serverBase = configuredServer || location.origin;

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
