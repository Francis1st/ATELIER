# Product decisions (Web MVP)

- **Web-first validation**: brand site + demo gallery + local personal wardrobe before iOS launch.
- **No fake App Store / waitlist / AI**: Coming to iPhone until a real store URL is configured.
- **Local-first**: IndexedDB (Dexie); photos never go to localStorage.
- **Demo isolation**: Demo Collection is static content, never written into the user DB.
- **Export is the migration bridge**: versioned ZIP (`atelier-wardrobe` schema v1) for future SwiftUI restore.
- **Quiet Luxury visual system**: Ivory / Charcoal / Warm Gray / Champagne; editorial serif + modern sans.
- **Gallery is the hero view**: deterministic asymmetric layout (not random masonry).
