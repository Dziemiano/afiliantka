# AGENTS.md — Afiliantka Faceless

## Project

Dual-host Next.js platform: a public bank-offers website (`WEB_HOST`) and an invite-only affiliate app (`APP_HOST`).

- Product requirements: [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md)
- Priorities: [`ROADMAP.md`](./ROADMAP.md)
- Global conventions: [`.cursor/rules/guidelines.mdc`](./.cursor/rules/guidelines.mdc)
- Frontend: [`.cursor/rules/frontend.mdc`](./.cursor/rules/frontend.mdc)
- Backend: [`.cursor/rules/backend.mdc`](./.cursor/rules/backend.mdc)
- Testing: [`.cursor/rules/testing.mdc`](./.cursor/rules/testing.mdc)

## Linear and branches

- Team: **Dziemiano** (`DZI`)
- Project: [Afiliantka Faceless](https://linear.app/dziemiano/project/afiliantka-faceless-db72de5feef7)
- Project ID: `dbce88bb-1fc2-48f2-a138-fb63feab7065`
- Base and PR target: **`new-spec-development`** until the policy switches to `preview`
- Branches: `feat/dzi-<n>-short-slug`, `fix/...`, `chore/...`, or `docs/...`

Use this Linear project only. One issue maps to one focused branch and PR; never target `main` unless a human explicitly asks.

## Required workflow

Multi-agent delivery is mandatory for Linear issues:

1. **orchestrator** selects unblocked work and sends a compact assignment.
2. **frontend-dev** and/or **backend-dev** implement one assigned issue.
3. **test-dev** validates or adds coverage for every behavioral change.
4. The implementation PR targets `new-spec-development`.
5. **pr-reviewer** reviews the open PR.
6. **Bugbot** reviews non-trivial UI, API, auth, or data changes; **Security Review** is also required for high-risk auth, roles, RLS, migration, upload, or Drive changes.
7. A human merges, then sends `merged` or `next` before the orchestrator selects more work.

Do not replace this pipeline with one general-purpose agent. Model tier controls cost and capability only; it never removes a required test or review gate. Routing details and the handoff format live in [`.cursor/agents/orchestrator.md`](./.cursor/agents/orchestrator.md).

### Parallel work

Run issues in parallel only when they have no blocker relationship and their expected paths do not overlap. Each issue still needs its own branch and PR. Otherwise run sequentially.

### Ready-for-merge gate

- Acceptance criteria and declared scope are satisfied.
- Behavioral changes have tests; `npm test` and CI are green. Pure docs/copy may use **Tests: N/A**.
- test-dev and pr-reviewer completed.
- Bugbot completed for non-trivial changes.
- Security Review completed where required.
- Findings are fixed and checks re-run; known CI, hydration, or security failures block readiness.

## PR contract

Every PR includes:

- Linear issue link and one-concern scope
- What changed and why
- How it was tested, or **Tests: N/A** for pure docs/copy
- Risk and selected model tier
- Confirmation of test-dev, pr-reviewer, Bugbot, and Security Review status

## Definition of done

- [ ] Acceptance criteria met; out-of-scope work excluded
- [ ] Tests cover changed behavior; local and CI checks pass
- [ ] TSX changes are mobile-first
- [ ] No secrets committed; service role remains server-only
- [ ] Required specialist and review gates completed; findings addressed
- [ ] PR contract completed and Linear issue linked

## Ownership

| Area | Paths | Detailed owner |
|---|---|---|
| Frontend/UI | `app/(website)/**`, `app/(app)/**/{page,layout}.tsx`, `components/**` | `frontend.mdc`, frontend-dev, frontend-ui skill |
| Backend/API | `app/(app)/api/**`, `lib/**`, `supabase/**`, `middleware.ts` | `backend.mdc`, backend-dev |
| Testing | `**/*.{test,spec}.*`, `vitest.config.*`, `e2e/**` | `testing.mdc`, test-dev |
| CMS schemas | `sanity.config.ts`, `sanity/**` | `backend.mdc`, backend-dev |

## Hard process constraints

- Do not edit plan files under `~/.cursor/plans/` during implementation.
- Current priority is Phase 5.5 before Phase 6 or Phase 7.
- Do not start another issue in the same orchestration loop until the human sends `merged` or `next`.
