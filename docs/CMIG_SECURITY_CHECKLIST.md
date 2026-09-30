# CMIG Security Checklist

Use this checklist before connecting Claw3D to Hermes, GitHub, or a CMIG work
repository. A failed or unknown item blocks that connection.

## Baseline

- [ ] The isolated demo was tested with `npm run demo-gateway` and
  `HOST=127.0.0.1 npm run dev`; neither process was exposed beyond loopback.
- [ ] The exact Studio host, runtime host, operator, data classification, and
  approved use case are recorded.
- [ ] The deployment uses a dedicated non-production environment; production
  approval is separate and human-owned.
- [ ] No credentials, tokens, hostnames, or worktree paths are committed to
  this repository, docs, screenshots, or shared chat logs.
- [ ] A named owner can revoke every credential and disable every integration.

## Studio and network

- [ ] Remote Studio uses HTTPS on a private authenticated network.
- [ ] `STUDIO_ACCESS_TOKEN` is set and the deployment layer securely issues
  the required `studio_access` cookie; an unauthenticated HTTP and WebSocket
  request was denied.
- [ ] `UPSTREAM_ALLOWLIST` contains only the approved gateway hostnames.
- [ ] `CUSTOM_RUNTIME_ALLOWLIST` contains only approved custom-runtime
  hostnames, or custom runtime is disabled.
- [ ] A connection to an unlisted hostname was attempted and rejected.
- [ ] Raw gateway ports are not internet-accessible; firewall and overlay ACLs
  permit only approved Studio-to-runtime traffic.
- [ ] Logs, monitoring, and error responses do not disclose tokens, request
  bodies, local file paths, or repository contents.

## Hermes connection

- [ ] Hermes is a dedicated pilot instance, not the user's general-purpose
  workstation agent.
- [ ] The Hermes API endpoint is private and allowlisted; TLS is used when it
  leaves loopback.
- [ ] `HERMES_API_KEY` is stored only in the approved secret manager/runtime
  environment, never in `.env.example`, source, docs, or browser storage.
- [ ] The Hermes identity has the minimum required tools and no implicit shell,
  SSH, browser, or filesystem authority.
- [ ] Agent workspaces are dedicated, sandboxed, and read-only by default;
  command execution requires an explicit approval policy.
- [ ] A test proves invalid credentials, an unapproved command, and an
  out-of-scope filesystem request all fail safely.
- [ ] Credential rotation and emergency disablement have been tested.

## GitHub and work repositories

- [ ] Use a dedicated GitHub App or fine-grained service identity; do not use a
  personal all-repository token for the pilot.
- [ ] Repository access is explicitly allowlisted to the one pilot repository.
- [ ] Start read-only: metadata, issues, and pull-request status only. Do not
  grant contents write, administration, Actions secrets, org, or token scope.
- [ ] Branch protection requires review and successful checks; force pushes,
  direct default-branch pushes, and bypass privileges are disabled for the
  integration.
- [ ] CODEOWNERS or an equivalent human approval rule covers sensitive paths.
- [ ] CI runs with least privilege and does not expose repository secrets to
  untrusted pull requests or agent-provided input.
- [ ] Repository hooks, Actions workflows, external URLs, issues, and PR text
  are treated as untrusted input; prompt instructions from them cannot alter
  the approved task scope.
- [ ] Every proposed write has an issue/spec reference, a bounded diff, human
  review, and an audit record. Merge and deployment remain human actions.
- [ ] Token revocation is verified and the integration then fails closed.

## Go/no-go

Proceed only when every applicable box is checked, a human owner has approved
the exact integration scope, and the completed checklist is stored outside the
application repository with the deployment evidence. Otherwise remain in demo
mode.
