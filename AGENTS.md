<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

BookNook — one Next.js 16.4.3 App Router package (no workspaces). Everything lives under `src/`: routes in `app/` (`/`, `/books`, `/add-books`), shared UI in `components/`, helpers in `lib/`. `@/*` aliases to `src/*` (declared in both `tsconfig.json` and `jsconfig.json`).

File extensions are mixed (`.js`, `.jsx`, `.tsx`) — match the surrounding feature instead of assuming TypeScript.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run lint` — flat-config ESLint (`eslint.config.mjs`); currently passes clean
- `npx tsc --noEmit` — there is no `typecheck` script; it only checks `.ts/.tsx` (no `checkJs`), so lint is the real gate for `.jsx` files
- `npm run build` — **fails unless the API server is running** (see below)

There are no tests, no CI, and no pre-commit hooks — `npm test` does not exist.

## External API (separate service, not in this repo)

- Backend base URL is configured with `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).
- `GET /books` is fetched **during `next build`** by `src/app/books/page.jsx` (static prerender, no error handling), so the backend must be up to build.
- `POST /add-books` is called client-side by `src/app/add-books/page.jsx`.
- Field names differ between read and write: GET returns `bookTitle`/`authorName`/`bookImage`/`shortDescription`, while the POST sends `title`/`author`/`imageUrl`/`description`. Verify against the backend before changing either side.

## Stack quirks

- **React Compiler is enabled** (`reactCompiler: true` in `next.config.mjs`): components must follow the Rules of React, and manual memoization (`useMemo`/`useCallback`/`memo`) is unnecessary.
- **Tailwind v4, CSS-first**: there is no `tailwind.config` or `postcss.config` — tokens and imports live in `src/app/globals.css`, compiled by the `@tailwindcss/turbopack` loader rule in `next.config.mjs`.
- **shadcn/ui emits JSX**: `components.json` sets `tsx: false` (style `base-nova`); new primitives go to `src/components/ui/*.jsx` and use Base UI (`@base-ui/react`), not Radix. `cn` is imported from the `cn` package (`import { cn } from "cn"`); `@/lib/utils` merely re-exports it.
- The navbar links to `/my-books` and `/my-borrows`, which have no pages yet — 404s there are expected, not regressions.
