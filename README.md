# ATELIER — Visual Wardrobe (Web MVP)

Quiet luxury web experience for a private visual wardrobe: brand site, Demo Gallery, and a local-first personal wardrobe with real CRUD, search/filter, and ZIP import/export.

## Stack

- Next.js App Router · React · TypeScript (strict) · Tailwind CSS
- Dexie (IndexedDB) · Zod · JSZip · Lucide icons

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end |

First e2e run may need: `npx playwright install chromium`

## Scope (this MVP)

- Brand home, Demo Collection (`/experience`), personal wardrobe (`/wardrobe`)
- Upload / edit / delete / favorite, search & filters, Gallery + Grid
- Local IndexedDB persistence; Export / Import ZIP (`atelier-wardrobe` schema v1)
- Privacy page aligned with real behavior; Coming to iPhone (no fake App Store link)

## Not in this MVP

- Accounts, cloud sync, payments, AI recognition
- Real App Store download (set `NEXT_PUBLIC_APP_STORE_*` only when live)
- Native iOS app (see `docs/data-contract.md` for migration format)

## Browser data

Wardrobe photos live in this browser’s IndexedDB. Clearing site data deletes them. Export regularly.

## Docs

- `docs/data-contract.md` — ZIP / JSON contract for future SwiftUI
- `docs/product-decisions.md` — product constraints
- `ATELIER_Web_Cursor_Development_Prompt.md` — full task brief
