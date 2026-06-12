# Plan 008: Auto-redeploy on Sanity content changes (operator runbook)

> **Executor instructions**: This plan is different from the others — it is
> primarily an OPERATOR RUNBOOK. Most steps happen in the Sanity and
> Cloudflare dashboards, which a code-executing agent cannot drive. An agent
> executor's only in-repo task is Step 4 (documentation). If you are an agent:
> do Step 4, mark this plan PARTIAL in `plans/README.md` with "dashboard steps
> pending operator", and stop.

## Status

- **Priority**: P3
- **Effort**: S (≈15 minutes of dashboard work)
- **Risk**: LOW
- **Depends on**: none (plans/001 for the CLAUDE.md edit in Step 4)
- **Category**: dx / infra
- **Planned at**: commit `62cddd8`, 2026-06-11

## Why this matters

The site is built statically: every page (including all `/projects/[slug]` pages via `generateStaticParams`) fetches Sanity content **at build time** and is served as static files from Cloudflare Pages (`wrangler.toml` → `.vercel/output/static`). Editing a project in Sanity therefore changes nothing on leo.dev until the next deploy, which today only happens on a git push. This silently defeats half the value of having a CMS. The standard fix is a Sanity webhook that calls a Cloudflare Pages **deploy hook** whenever content changes.

## Current state

- Sanity project: `jyqe7nab`, dataset `production` (managed at https://www.sanity.io/manage).
- Document types that affect the site: `project`, `book` (schemas in `sanity/schemas/`).
- Cloudflare Pages project: `leodotdev` (per `wrangler.toml` `name`), build configured in the CF dashboard.
- No webhook or deploy hook currently exists (assumed — verify in Step 1; if one already exists, this plan is moot: mark DONE with a note).

## Steps

### Step 1 (operator, Cloudflare dashboard): create a deploy hook

Cloudflare dashboard → Workers & Pages → `leodotdev` → Settings → Builds & deployments → **Deploy hooks** → Create. Name: `sanity-content`. Branch: `main`. Copy the generated URL (format `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<id>`).

**The hook URL is a credential** — anyone with it can trigger deploys (and burn build minutes). Do not commit it to the repo or paste it into plan files; store it in a password manager.

### Step 2 (operator, Sanity dashboard): create the webhook

sanity.io/manage → project `jyqe7nab` → API → Webhooks → Create:

- Name: `redeploy-leodotdev`
- URL: the deploy hook URL from Step 1
- Dataset: `production`
- Trigger on: create, update, delete
- Filter: `_type in ["project", "book"]`
- HTTP method: POST. No secret/auth needed (the URL itself is the secret).

### Step 3 (operator): end-to-end test

1. Make a trivial edit to one project document in Sanity (e.g. touch its description) and publish.
2. Cloudflare dashboard → the Pages project → Deployments: a new build should start within ~1 minute, source "Deploy hook: sanity-content".
3. After it finishes, confirm the edit is live on leo.dev, then revert the trivial edit (it will trigger one more deploy — that's the system working).

**Verify**: deployment triggered by the hook appears in the CF deployments list and the content change went live without a git push.

### Step 4 (agent or operator, in-repo): document it

Add to `CLAUDE.md` (deployment section) and the README's deployment section:

> Content publishing: a Sanity webhook (`redeploy-leodotdev`, filter `_type in ["project", "book"]`) calls a Cloudflare Pages deploy hook, so publishing in Sanity redeploys the site automatically (~build time delay). If content edits stop appearing, check that webhook first (sanity.io/manage → API → Webhooks → attempts log).

**Verify**: `grep -c "deploy hook" CLAUDE.md README.md` → ≥1 each.

## Scope

**In scope**: dashboard config (operator), `CLAUDE.md` + `README.md` doc additions.
**Out of scope**: any application code; ISR/`revalidate` options (pointless on a fully static deploy); committing any hook URL.

## Done criteria

- [ ] Deploy hook exists in Cloudflare; webhook exists in Sanity with the type filter
- [ ] Step 3 end-to-end test passed (content edit went live with no git push)
- [ ] Docs updated; no hook URL appears anywhere in the repo (`grep -rn "deploy_hooks" . --include="*.md"` → 0 matches)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The Cloudflare Pages project doesn't show a "Deploy hooks" section (plan assumptions about the hosting setup are wrong — report what the dashboard actually offers).
- A webhook already exists pointing at a different automation — don't stack a second one; report.

## Maintenance notes

- Every Sanity publish now costs a CF Pages build; with heavy editing sessions consider Sanity's webhook "debounce"/delivery settings or batching publishes.
- If document types are added to the site (e.g. an `experience` schema later), extend the webhook filter.
