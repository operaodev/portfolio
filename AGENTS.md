# AGENTS.md

## Stack

- Single-package Astro 7 static site managed with pnpm. `pnpm-workspace.yaml` only allowlists build scripts; there is no monorepo.
- React 19 islands power search/archive UI; Three.js via `@react-three/fiber` renders the animated background; Tailwind CSS v4 is wired through the Vite plugin.
- The site is dark-only: `html` always has `class="dark"`, and color tokens live only in `:root` in `src/styles/global.css`. Do not reintroduce a light palette or theme toggle.

## Commands

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm check          # astro check (type/Astro diagnostics)
pnpm build          # static build to dist/
pnpm preview
pnpm build:clean    # clears .astro + dist first; use when generated types are stale
```

There is no test, lint, or formatter script. Run `pnpm check` and `pnpm build` after non-trivial changes. There is no CI configured; output is a static `dist/` with no adapter.

## Project map

- `src/layouts/Base.astro` — global shell, metadata, `ClientRouter`, navigation, persisted 3D background.
- `public/0user.json` — site, contact, and resume data; typed/exported by `src/lib/info.ts`.
- `src/content/archives/*.md` — posts. Schema is in `src/content.config.ts`; `draft` defaults to `false`, and `src/lib/archive_data.ts` filters drafts out.
- `src/content/projects/*.md` — project posts rendered at `/projects/<slug>`. They use `image` for the list preview (falls back to `ogImage`, then `/placeholder.svg`) and optional `url` for the live-site button.
- Archive and project posts are named `YYYY-MM-DD-slug.md` so the folders sort chronologically. `generateId` in `src/content.config.ts` strips the date, so public URLs stay `/archives/<slug>` and `/projects/<slug>` — keep that in sync when renaming posts.
- Tag pages (`/tags`, `/tags/<tag>`) combine archives and projects; list links come from `Post.href`, not a hardcoded collection path.
- `src/lib/*` — search, tag, and archive helpers shared by Astro pages and React islands.
- `astro.config.mjs` — markdown pipeline (Expressive Code, callouts, code tabs, external links). Markdown feature usage is documented in `README.md`.

## Gotchas

- Preserve the background stacking order: canvas at `z-index:-1`, `body::before` blur at `z-index:0`, `main` at `z-index:1`, nav at `z-50`. Changing these can hide content or the 3D scene.
- Keep `#site-background` with `transition:persist` in `Base.astro`, and keep `BackgroundScene` as `client:only="react"`. This is what preserves the running WebGL canvas across `ClientRouter` navigations.
- In `BackgroundScene`, the card selection/randomness is intentionally at module scope. Moving it into render or `useMemo` can trigger an infinite Suspense retry loop.
- `Sparkle` exists in `src/components/background/Sparkle.tsx` but its render is intentionally commented out in `BackgroundScene`; do not delete or re-enable it unless asked.
- Navigation blur is scroll-dependent via `#site-nav.is-scrolled` (threshold 8px). Its inline script binds once and refreshes on `astro:page-load` / `astro:after-swap`; keep the ID and those hooks when touching navigation.
- Client-side DOM/scroll code must account for View Transitions using `astro:page-load` and/or `astro:after-swap`.
- Card textures are auto-discovered from `src/assets/cards/` with `import.meta.glob`; `back_card.webp` is special-cased. Adding an image there adds a card.
- The working tree commonly contains unrelated user content/UI edits. Do not reset, revert, or commit files unless explicitly asked.
