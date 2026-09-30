# CMIG Isolated Pilot

## Decision

Run the first CMIG pilot in **Demo backend** mode only. It is a local UI and
protocol exercise, not a Hermes, GitHub, OpenClaw, or CMIG OS integration.

The bundled demo gateway listens on `127.0.0.1` and uses synthetic agents,
chat, sessions, and files held only in its process memory. It makes no Hermes
or GitHub request and needs no credential.

## Safe local/demo startup

Prerequisite: use the repository's existing dependencies. This pilot does not
require `npm install`, a `.env` file, or any credential configuration.

In two local terminals, run:

```bash
npm run demo-gateway
```

```bash
HOST=127.0.0.1 npm run dev
```

Open `http://localhost:3000`, select **Demo backend**, and connect to
`ws://localhost:18789`. Do not set `HOST=0.0.0.0`, do not use a tunnel, and do
not expose either port to a LAN, Tailscale, or the public internet.

Stop both processes when the demo is complete. Demo-created agents and files
are not durable; that is desirable for this pilot.

## Running without Hermes or GitHub

- Do not run `npm run hermes-adapter`; it expects a Hermes HTTP API and may use
  `HERMES_API_KEY`.
- Do not add `HERMES_*`, `CLAW3D_GATEWAY_TOKEN`, GitHub tokens, SSH settings,
  or work-repository paths to `.env` or Studio settings.
- Do not authenticate the GitHub CLI while using the demo. GitHub-facing UI
  reads the local CLI/session and repository remote when it is available.
- Do not create agents, workspaces, or approval policies against an actual
  gateway. Demo-mode mutations affect only the mock adapter's memory.

## Current security boundaries

| Boundary | Pilot position |
| --- | --- |
| Browser to Studio | Loopback only; no remote users. |
| Studio to runtime | Demo gateway only at `ws://localhost:18789`. |
| Runtime actions | Synthetic data only; no worktree, shell, GitHub, or Hermes access. |
| Secrets | None configured. Do not use `.env` as a pilot artifact. |
| Persistence | Studio can retain local preferences; demo runtime data disappears at stop. |

Treat a future real connection as higher risk: Studio persists gateway settings
on the host and currently loads an upstream URL/token into browser memory at
runtime. OpenClaw-backed agent creation and permission changes can create or
modify gateway-host workspaces and policies. The Studio proxy can also reach a
configured upstream runtime. These are outside the isolated pilot.

## Controls required before remote deployment

All items below are required before putting Studio or any runtime beyond one
machine:

1. Bind Studio to a private, authenticated network only; use HTTPS and set
   `STUDIO_ACCESS_TOKEN`. Provision the `studio_access` cookie in the
   deployment/auth layer before relying on the gate.
2. Set `UPSTREAM_ALLOWLIST` to the exact approved gateway hostnames. If direct
   custom runtimes are enabled, set `CUSTOM_RUNTIME_ALLOWLIST` to the exact
   approved hostnames too; do not use wildcards or an empty production list.
3. Keep the gateway private (loopback or private overlay). Do not expose a raw
   WebSocket gateway publicly. Use separate pilot credentials with minimal
   scope and rotation/revocation ownership.
4. Disable or block SSH-backed gateway-host operations unless separately
   approved. Do not mount developer home directories or unrestricted worktrees
   into any agent runtime.
5. Place agent workspaces in a dedicated pilot directory. Start with
   read-only access, sandboxed sessions, explicit command approval, and a
   deny-by-default tool policy; prove each escalation independently.
6. Put CMIG deployment behind branch protection, required checks, code-owner
   review, a separate staging environment, audit logs, and explicit human
   production approval. No agent receives standing merge or production access.
7. Re-test access control, allowlist rejection, token handling, WebSocket
   authorization, rate limits, and error redaction from an untrusted browser
   before release.

## Phased CMIG OS linking path

| Phase | Scope | Exit evidence |
| --- | --- | --- |
| 0 — demo | This local demo only. | Office renders and synthetic interactions work with no credentials. |
| 1 — read-only CMIG OS | A narrow CMIG OS status adapter using mock or sanitized, read-only data. No repository or task mutation. | Data contract, allowlist, authentication boundary, and negative-access tests reviewed. |
| 2 — isolated work repo | One non-production repository, one scoped service account, read-only metadata first. | Repository allowlist, least-privilege token, branch protections, audit trail, and revocation test pass. |
| 3 — approved actions | Explicitly approved issue/PR workflows with human approval before writes, merges, or deployments. | End-to-end staging test proves approval, logging, rollback, and denied-action behavior. |
| 4 — broader CMIG OS | Add repositories or workflows one at a time under the same controls. | A separate security review and owner approval for each added boundary. |

CMIG OS should remain the control-plane record for approvals and status; Claw3D
should display and request bounded actions, not become an unrestricted source
of authority.
