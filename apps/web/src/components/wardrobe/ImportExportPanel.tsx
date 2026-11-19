"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  downloadBlob,
  exportWardrobeZip,
  importWardrobeZip,
  type ImportMode,
} from "@/services/import-export/zip";

export function ImportExportPanel({ onDone }: { onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImportMode>("merge");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onExport() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const blob = await exportWardrobeZip();
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `ATELIER-Wardrobe-Export-${stamp}.zip`);
      setMessage("Export downloaded. Keep this ZIP as your backup.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onImport(file?: File | null) {
    if (!file) return;
    if (mode === "replace") {
      const ok = window.confirm(
        "Replace will delete your current local wardrobe and load this export. Continue?",
      );
      if (!ok) return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await importWardrobeZip(file, mode);
      setMessage(
        mode === "replace"
          ? `Imported ${result.itemCount} pieces (${result.imageCount} images).`
          : `Merged ${result.itemCount} pieces — added ${result.added ?? 0}, replaced ${result.replaced ?? 0}.`,
      );
      onDone();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Import failed. Your existing wardrobe was not changed.",
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="border border-border p-5 md:p-6" aria-labelledby="backup-heading">
      <h2 id="backup-heading" className="font-display text-2xl text-charcoal">
        Backup & migrate
      </h2>
      <p className="mt-2 text-sm text-warm-gray leading-relaxed">
        Export a versioned ZIP with your pieces and photos for safekeeping or
        future iPhone restore. Import validates the archive before writing.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button" onClick={onExport} disabled={busy}>
          Export Wardrobe
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          Import Wardrobe
        </Button>
      </div>
      <fieldset className="mt-4">
        <legend className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
          Import mode
        </legend>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-charcoal">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="import-mode"
              checked={mode === "merge"}
              onChange={() => setMode("merge")}
            />
            Merge (same ID replaces that piece)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="import-mode"
              checked={mode === "replace"}
              onChange={() => setMode("replace")}
            />
            Replace all local data
          </label>
        </div>
      </fieldset>
      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip"
        className="sr-only"
        onChange={(e) => void onImport(e.target.files?.[0])}
      />
      {message ? <p className="mt-3 text-sm text-charcoal">{message}</p> : null}
      {error ? (
        <p className="mt-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
