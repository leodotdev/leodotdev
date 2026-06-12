# CLAUDE.md

## Project

Personal portfolio site for Leo Succar (leo.dev). Stack:

- **Next.js 14** — app router, TypeScript strict mode
- **Tailwind CSS** — utility-first styling; shadcn-style `components/ui/` primitives (migrated Radix → Base UI in commit `62cddd8`)
- **Sanity CMS** — headless CMS; project `jyqe7nab`, dataset `production`
- **framer-motion** — animations

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server at http://localhost:3001 |
| `npm run verify` | Typecheck + lint + production build — **run before every commit** |
| `npm run lint` | ESLint only |
| `npx tsc --noEmit` | Typecheck only |
| `npx sanity dev` | Local Sanity Studio (config in `sanity.cli.js`) |

## Deployment constraints (important)

This site deploys to **Cloudflare Pages** as a static build (`@cloudflare/next-on-pages` style). Constraints:

- No Node.js runtime at request time — no `fs`, no server-side APIs unless edge-compatible.
- Do **not** add a `/studio` route (`NextStudio`) to the Next app. It builds as a dynamic, server-rendered route (~1MB first-load JS) which the static Cloudflare Pages deploy cannot serve. This route was removed in commit `93f6064` and again in plan 005. Use `npx sanity dev` for a local studio instead.
- Content updates require a redeploy (the site is fully static).

## Routing facts

- `/` permanently redirects to `/projects` (configured in `next.config.js`)
- `/resume` rewrites to `/resume.html`

## Conventions

- Path alias `@/*` → repo root (configured in `tsconfig.json`)
- Client components must be marked with `"use client"` at the top of the file
- Icons from `react-icons/tb` (Tabler icon set)
- Styling via Tailwind classes; utility helper `cn()` from `lib/utils.ts`
