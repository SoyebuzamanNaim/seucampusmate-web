# AGENTS.md

Operational guide for AI coding agents working in `seucampusmate-web`.

## 1. Purpose

This file defines how agents should make safe, high-quality, low-noise changes in this repository.

Primary goals:
- Ship correct changes with minimal diffs.
- Preserve existing product behavior and design language unless asked otherwise.
- Keep work verifiable (`lint` + `build` for substantial code changes).

## 2. Source of Truth

Before coding, read these:
- [`README.md`](README.md): project overview, setup, env vars.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): team workflow and contribution rules.
- [`package.json`](package.json): actual command/script source of truth.

If guidance conflicts, follow this precedence:
1. User request
2. Repository code and existing patterns
3. `CONTRIBUTING.md`
4. This `AGENTS.md`

## 3. Project Snapshot

- Framework: Next.js App Router (`app/`)
- Language: TypeScript
- UI: React 19 + Tailwind CSS v4 + shared UI in `components/ui/`
- Runtime shape: mostly server-rendered pages with client components where needed
- Metadata/SEO helpers: `lib/metadata.ts`, optional helpers in `lib/seo/`

Key areas:
- `app/`: routes, pages, API handlers
- `components/`: reusable UI and feature components
- `lib/`: business logic, data utilities, metadata/SEO helpers
- `data/`: static data and overrides
- `public/`: static assets

## 4. Working Rules for Agents

### 4.1 Change style
- Keep diffs focused to the requested task.
- Reuse existing components/utilities before adding new abstractions.
- Do not refactor unrelated files "while here."
- Avoid adding dependencies unless needed and justified in the handoff.

### 4.2 Next.js and React conventions
- Prefer server components by default.
- Use `'use client'` only for interactivity/browser APIs.
- Keep API routes in `app/api/**/route.ts`.
- Use existing metadata helpers (`createPageMetadata`/`baseMetadata`) instead of ad-hoc metadata objects where practical.

### 4.3 TypeScript and styling
- Prefer explicit, narrow types; avoid `any` unless unavoidable.
- Follow existing import aliases (`@/...`) and naming style.
- Prefer Tailwind classes and existing UI patterns over one-off CSS.

### 4.4 Security and data safety
- Never commit secrets or tokens.
- Use `.env.local` for local secrets and keep `.env.example` as the public template.
- Treat external API data as untrusted; add defensive checks for parsing/shape mismatches.

## 5. Standard Workflow

1. Understand the task and inspect relevant files before editing.
2. Implement the smallest complete change.
3. Validate locally:
   - `npm run lint`
   - `npm run build`
4. Provide a concise handoff:
   - What changed
   - Why it changed
   - What was verified
   - Any limitations or follow-up items

Notes:
- For docs-only or tiny content-only changes, full build can be skipped if clearly stated.
- If a command cannot run (env/network/runtime constraints), report it explicitly.

## 6. Task Playbooks

| Task type | Expected touchpoints | Required validation |
|---|---|---|
| Add/update a tool page | `app/tools/<tool>/page.tsx` (or `layout.tsx`), related components, `lib/metadata.ts` | `npm run lint`, `npm run build` |
| API route change | `app/api/**/route.ts`, related helpers in `lib/` | `npm run lint`, `npm run build` |
| Shared UI change | `components/ui/*` or common layout/nav/footer components | `npm run lint`, `npm run build`, responsive sanity check |
| Navigation/link updates | `components/navbar/header.tsx`, `site.config.ts`, `components/footer.tsx` as needed | `npm run lint`, `npm run build` |
| Data/config updates | `data/**`, `site.config.ts`, or lib constants | `npm run lint` (and `build` if behavior/UI impacted) |

## 7. Definition of Done

A change is done when all are true:
- Request is fully addressed.
- No unrelated files were modified.
- Lint/build checks were run for substantial code changes (or skipped with reason).
- Handoff includes verification results and any known caveats.

## 8. Safe Operations

- Do not run destructive commands (mass delete/reset/rewrite history) unless explicitly requested.
- Do not overwrite or revert user-authored changes outside the task scope.
- If you discover conflicting unexpected changes, pause and report before proceeding.

---

When uncertain, choose correctness and minimal risk over cleverness.
