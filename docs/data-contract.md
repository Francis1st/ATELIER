# ATELIER Wardrobe Data Contract

Versioned interchange format for the Web MVP and a future native SwiftUI / SwiftData client.

## ZIP package

```
ATELIER-Wardrobe-Export.zip
├── manifest.json
└ images/
    ├── <image-id>.<ext>
    └── ...
```

- Encoding: UTF-8 for JSON.
- Compression: standard ZIP (DEFLATE allowed).
- Image paths must be exactly `images/<filename>` with no `..` segments.
- Max archive size (Web MVP): 40 MB. Max single image entry: 10 MB.

## manifest.json

| Field | Type | Notes |
| --- | --- | --- |
| `format` | string | Always `atelier-wardrobe` |
| `schemaVersion` | number | Current: `1` |
| `exportedAt` | string | ISO-8601 timestamp |
| `items` | array | Wardrobe items |
| `images` | array | Image metadata (binary lives under `images/`) |

### Item fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string (UUID preferred) | yes | Stable identity across merge |
| `name` | string | yes | 1–120 chars |
| `brand` | string | no | |
| `model` | string | no | |
| `category` | enum | yes | `tops` `bottoms` `outerwear` `dresses` `footwear` `bags` `accessories` |
| `subcategory` | string | no | |
| `colors` | string[] | yes | May be empty |
| `seasons` | string[] | yes | `spring` `summer` `autumn` `winter` |
| `material` | string | no | |
| `purchaseDate` | string | no | `YYYY-MM-DD` |
| `purchasePrice` | number | no | Non-negative; not a locale string |
| `currency` | string | no | ISO-like 3-letter code, e.g. `USD` |
| `notes` | string | no | |
| `isFavorite` | boolean | yes | |
| `sortOrder` | number | yes | Client-defined ordering hint |
| `createdAt` | string | yes | ISO-8601 |
| `updatedAt` | string | yes | ISO-8601 |
| `originalImageId` | string | no | References `images[].id` |
| `coverImageId` | string | no | References `images[].id` |

### Image metadata fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | |
| `itemId` | string | yes | Parent item |
| `role` | enum | yes | `original` or `cover` |
| `source` | enum | yes | `user_photo` or `demo_asset` |
| `mimeType` | string | yes | e.g. `image/jpeg` |
| `width` | number | yes | Positive integer |
| `height` | number | yes | Positive integer |
| `filename` | string | yes | Basename only; file must exist at `images/<filename>` |
| `createdAt` | string | yes | ISO-8601 |

Binary image bytes are **not** embedded in JSON.

## Import rules

1. Validate `format` and `schemaVersion` before any write.
2. Reject unsafe paths, oversized archives, missing image files, or invalid MIME.
3. **Merge**: upsert by item `id` (same id replaces that item and its images).
4. **Replace**: clear local wardrobe, then write the archive contents.
5. Failed validation must leave existing data untouched.

## Schema migration

- Bump `schemaVersion` for breaking field changes.
- Readers should reject unsupported versions rather than guess.
- Additive optional fields may remain on the same version if older clients can ignore them safely.

## Swift notes

- Prefer `UUID` for `id` fields when generating new records.
- Decode dates as ISO-8601; do not rely on JavaScript `Date` string quirks.
- Store price as a number + currency code, not a formatted display string.
- Map `images/` files into local file storage / SwiftData binary attributes as appropriate.
