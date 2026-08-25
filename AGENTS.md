# AGENTS.md — Afiliantka Faceless

## Product

Dual-host Next.js platform: public bank-offers website (`WEB_HOST`) + invite-only SaaS dashboard (`APP_HOST`) for affiliates (onboarding, materials, admin).

- Spec: [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md)
- Backlog: [`ROADMAP.md`](./ROADMAP.md)
- Conventions: [`.cursor/rules/guidelines.mdc`](./.cursor/rules/guidelines.mdc)

## Stack

- Next.js App Router + TypeScript + React (Vercel)
- Sanity CMS (`sanity.config.ts`, `sanity/lib/client.ts`)
- Supabase Auth (magic link OTP), Postgres, RLS
- Vercel Blob + Google Drive (service account)
- Tailwind CSS 4, shadcn/ui, Vitest (+ CI)

## Linear

- **Team:** Dziemiano (`DZI`)
- **Project:** [Afiliantka Faceless](https://linear.app/dziemiano/project/afiliantka-faceless-db72de5feef7)
- **Project ID:** `dbce88bb-1fc2-48f2-a138-fb63feab7065`

Always create and filter issues under this project only — never other workspace projects (e.g. MTG).

## Integration branch (temporary)

| Now | Later |
|---|---|
| **Base / PR target:** `new-spec-development` | Will switch to `preview` |

- Every task branch is created **from latest `new-spec-development`**
- Every PR targets **`new-spec-development`** until policy changes
- Do not open task PRs against `main` unless a human explicitly asks

## Multi-agent workflow

```
Linear (Afiliantka Faceless)
        │
        ▼
  Orchestrator ── picks unblocked issue(s)
        │
        ├─► frontend-dev  ─┐
        ├─► backend-dev   ─┼─► branch + implement
        └─► test-dev      ─┘
                │
                ▼
          PR opened
                │
                ▼
          pr-reviewer + Bugbot (+ Security Review if needed)
                │
                ▼
          fixes if required
                │
                ▼
          Human merges PR
                │
                ▼
          Human pings orchestrator ("merged" / "next")
                │
                ▼
          Next unblocked Linear issue(s)
```

1. **Orchestrator** (`.cursor/agents/orchestrator.md`) — selects Linear issues, checks blockers, decides sequential vs parallel, briefs specialized agents.
2. **frontend-dev** (`.cursor/agents/frontend-dev.md`) — UI / public site / dashboard pages / components.
3. **backend-dev** (`.cursor/agents/backend-dev.md`) — API routes, Supabase, lib/, Drive/Blob, auth/roles.
4. **test-dev** (`.cursor/agents/test-dev.md`) — Vitest (and e2e when present); can pair after or with a feature agent.
5. **pr-reviewer** (`.cursor/agents/pr-reviewer.md`) — scope, SPEC, tests, security; triggers Bugbot / Security Review skills.
6. **Human** — merges PR; tells orchestrator work is unblocked for the next issue.

### Parallelism

Orchestrator **may** run multiple specialized agents in parallel when:

- Issues have **no** Linear blocker / blocked-by relation to each other
- Expected file touch sets **do not overlap** (orchestrator must state paths per issue)
- Each issue still gets its **own branch** and **own PR**

If paths may collide or issues share a feature slice → run **sequentially**.

### After merge (unlock next work)

Cursor has no automatic GitHub merge webhook in this setup. Unlock is:

1. Human merges the PR on GitHub
2. Human messages the orchestrator session: `merged` / `next` (optionally with PR URL or issue id)
3. Orchestrator verifies (optional: `gh pr view` / Linear issue status), closes/updates Linear if needed, picks the next unblocked issue(s)

Until that ping, do not start the next issue in the same orchestration loop.

## Linear / PR contract

- One Linear issue → one branch → one focused PR → merge into **`new-spec-development`**
- Branch naming: `feat/dzi-<n>-short-slug`, `fix/...`, `chore/...`, `docs/...`
- Target ~1–4 hours; **one concern only**
- Reject kitchen-sink PRs
- Every PR must include:
  - Link to Linear issue
  - What / why / how tested
  - Tests for new logic (or N/A note for pure docs)

## Definition of done (per issue)

- [ ] Acceptance criteria in the Linear issue met
- [ ] Out-of-scope items not implemented
- [ ] Tests added/updated when logic changed; CI green when available
- [ ] Mobile-first UI for any TSX changes (see frontend-ui skill)
- [ ] No secrets committed; service role only on server
- [ ] PR reviewed (pr-reviewer + Bugbot on non-trivial PRs)
- [ ] PR explanation present; Linear issue linked

## Code boundaries

| Area | Paths | Rule / agent |
|------|-------|----------------|
| Frontend / UI | `app/(website)/**`, `app/(app)/**/page.tsx`, `components/**` | `.cursor/rules/frontend.mdc`, frontend-dev |
| Backend / API | `app/(app)/api/**`, `lib/**`, `supabase/**`, `middleware.ts` | `.cursor/rules/backend.mdc`, backend-dev |
| Testing | `**/*.{test,spec}.*`, `vitest.config.*` | `.cursor/rules/testing.mdc`, test-dev |
| CMS schemas | `sanity.config.ts`, `sanity/**` | guidelines + backend/frontend as needed |

## Hard rules

- Polish UI copy for user-facing strings
- Dual hosts: never invent routes outside `app/(website)/` and `app/(app)/` (except root layout/globals)
- API routes: always Supabase session check; admin routes use `isCurrentUserAdmin()`
- Single Sanity client; no duplicate clients
- Mobile-first mandatory for UI
- Do not edit plan files under `~/.cursor/plans/` as part of implementation
- Current product priority: Phase 5.5 (public visitor repositioning) before Phase 6 (chat) / Phase 7 (AI)

## Starting work (orchestrator)

1. Read this file + `docs/PROJECT_SPEC.md` + `ROADMAP.md`
2. List unblocked issues in Linear project **Afiliantka Faceless**
3. Brief the right specialized agent(s); create branches from `new-spec-development`
4. After PR: run pr-reviewer (+ Bugbot); fix; wait for human merge + `merged`/`next` ping
