# ABIDINE VPS Migration

## Goal

Move the multiplayer backend from the Cloudflare Workers/Durable Objects runtime to an independently hosted Linux VPS. Keep the current production deployment unchanged until the replacement passes acceptance tests.

## Current architecture findings

- The game server entry point is `server/worker.ts`.
- The authoritative simulation, accounts, moderation, voice relay, and HTTP/WebSocket routing are currently hosted inside a Cloudflare Durable Object named `World`.
- Persistence is coupled to the Durable Object SQLite storage API through `server/sql-files.ts`.
- The ingress IP currently comes from `CF-Connecting-IP` in `server/network.ts`.
- The current deploy workflow runs `wrangler deploy`; this is not a VPS deployment.
- The existing client protocol and shared game logic should be preserved where possible.

## Proposed first deployment

- Provider candidate: Hetzner Cloud.
- Initial region: Nuremberg, Germany (evaluate network latency from Algeria and other target regions before committing; Helsinki is a fallback).
- Operating system: Ubuntu LTS.
- Runtime: supported Node.js LTS, managed by systemd or Docker Compose.
- TLS/reverse proxy: Caddy or Nginx.
- WebSocket transport: Node HTTP server plus the `ws` package already present in dependencies.
- Persistence: durable local database/storage with scheduled off-server backups. The migration must preserve account password hashes, profile tokens, player inventories, properties, world state, bans, and required moderation/analytics records.
- Secrets: environment variables on the VPS; never commit credentials.

A single European VPS is the first independent region, not a global multi-region deployment. Add more regions only after measuring latency, concurrency, and state synchronization requirements.

## Migration work plan

1. Implement a Node.js server adapter for HTTP, game WebSockets, and voice WebSockets.
2. Replace the Durable Object lifecycle and storage calls with a persistent Node-compatible storage adapter. Do not emulate Cloudflare APIs in production.
3. Preserve the existing message protocol and game simulation.
4. Add health/status endpoints, graceful shutdown, rate limiting, trusted-proxy IP handling, TLS instructions, and backup/restore scripts.
5. Add a separate VPS deployment workflow; keep the Cloudflare workflow intact until cutover is explicitly approved.
6. Add automated checks for account registration/login, reconnects, multiplayer state replication, voice ticket flow, persistence across restart, moderation, and health checks.
7. Deploy to a staging VPS and test from outside the host before changing any client server URL.
8. Only after successful acceptance tests, plan a controlled client cutover with a rollback path.

## Acceptance gates

- `/health` returns success over HTTPS.
- `/api/status` returns the ABIDINE server identity and expected protocol version.
- Account registration and login work, and credentials remain valid after restart.
- Two or more clients can join, move, chat, and receive replicated state.
- Voice WebSocket ticket flow works or is explicitly disabled until validated.
- World, profiles, bans, and moderation state survive a server restart.
- Backups can be restored to a clean staging instance.
- No production client is redirected until all required checks pass.

## Owner actions required before paid provisioning

The repository can be prepared without purchasing infrastructure. Creating the actual VPS requires the owner to sign in to the chosen provider, complete identity/payment checks, select a plan, and provide the server IP/domain through a secure configuration process. Never share provider passwords or API tokens in chat or commit them to Git.
