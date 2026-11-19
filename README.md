# ATELIER — Visual Wardrobe

Monorepo for ATELIER: a quiet-luxury visual wardrobe.

```
apps/
  web/    Next.js web MVP (brand site, demo gallery, local wardrobe)
  ios/    Reserved for the future SwiftUI iPhone app
docs/     Shared product & data-contract docs
```

## Setup

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts (root)

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start `apps/web` |
| `npm run build` | Production build for `apps/web` |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Unit tests |
| `npm run test:e2e` | Playwright e2e |

First e2e run may need: `npx playwright install chromium` (from `apps/web` or via workspace).

## Web MVP scope

- Brand home, Demo Collection (`/experience`), personal wardrobe (`/wardrobe`)
- Upload / edit / delete / favorite, search & filters, Gallery + Grid
- Local IndexedDB persistence; Export / Import ZIP (`atelier-wardrobe` schema v1)
- Privacy page aligned with real behavior; Coming to iPhone (no fake App Store link)

## Not in this MVP

- Accounts, cloud sync, payments, AI recognition
- Real App Store download (set `NEXT_PUBLIC_APP_STORE_*` only when live)
- Native iOS implementation (see `apps/ios` and `docs/data-contract.md`)

## Docs

- `docs/data-contract.md` — ZIP / JSON contract for future SwiftUI
- `docs/product-decisions.md` — product constraints
- `ATELIER_Web_Cursor_Development_Prompt.md` — web task brief
