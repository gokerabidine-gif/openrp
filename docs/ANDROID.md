# Android client preparation

OpenRP is a browser-first multiplayer game. The Android client is a packaged web client; the authoritative game world, accounts, HTTP API and WebSocket sessions remain on a reachable OpenRP server.

## Multiplayer server

The Android build defaults to the public server at `https://openrp.dev`. To use a separately hosted server, set `VITE_SERVER_URL` to its HTTPS origin before building. The client converts HTTPS to WSS for its game and voice WebSocket connections.

The server must allow the Android WebView origin in its `ALLOWED_ORIGINS` setting. For a Capacitor app the origin is commonly `https://localhost`; confirm the origin used by the chosen Capacitor configuration and include it in the server allowlist. Do not expose private Wrangler secrets in client build variables.

## Build the web payload

Requirements: Node.js 22.12 or newer.

```sh
npm ci
npm run build:android
```

This creates the static web payload in `dist/`. It is **not an APK** by itself. It does not contain the Android native wrapper or a bundled multiplayer server.

## Native APK status

A native Android package still requires the Capacitor Android project, Android SDK/Gradle, a configured application ID and signing settings. The game server must remain deployed separately (for example on Cloudflare Workers with Durable Objects). Do not attempt to run the Cloudflare Worker or Durable Object inside the Android app.

## Device checks before release

- Verify login, guest entry and account persistence against the selected server.
- Verify game and voice WebSockets reconnect after background/resume.
- Test movement, look, fire, interact, reload and menu controls in landscape.
- Test Android back navigation, safe areas, keyboard/chat input and microphone permission.
- Test on a physical Android device at low graphics quality and check thermal/performance behavior.
