"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  wardrobeItemInputSchema,
  type WardrobeItemInput,
} from "@/domain/schema";
import { CATEGORIES, SEASONS, type WardrobeItem } from "@/domain/types";
import { CATEGORY_LABELS, COLOR_PRESETS, SEASON_LABELS } from "@/domain/labels";
import { createItem, updateItem } from "@/services/wardrobe/repository";
import { ImageUploader } from "@/components/wardrobe/ImageUploader";
import { Button } from "@/components/ui/Button";

function toFormValues(item?: WardrobeItem): WardrobeItemInput {
  return {
    name: item?.name ?? "",
    brand: item?.brand ?? "",
    model: item?.model ?? "",
    category: item?.category ?? "tops",
    subcategory: item?.subcategory ?? "",
    colors: item?.colors ?? [],
    seasons: item?.seasons ?? [],
    material: item?.material ?? "",
    purchaseDate: item?.purchaseDate ?? "",
    purchasePrice: item?.purchasePrice,
    currency: item?.currency ?? "USD",
    notes: item?.notes ?? "",
    isFavorite: item?.isFavorite ?? false,
  };
}

export function ItemForm({
  initial,
  existingImageUrl,
}: {
  initial?: WardrobeItem;
  existingImageUrl?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<WardrobeItemInput>(toFormValues(initial));
  const [file, setFile] = useState<File | null>(null);
  const [colorDraft, setColorDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = wardrobeItemInputSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    if (!initial && !file) {
      setError("Add at least one photo.");
      return;
    }
    setSaving(true);
    try {
      if (initial) {
        await updateItem(initial.id, parsed.data, file);
        router.push("/wardrobe");
        router.refresh();
      } else {
        await createItem(parsed.data, file!);
        router.push("/wardrobe");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this piece.");
      setSaving(false);
    }
  }

  function toggleSeason(season: (typeof SEASONS)[number]) {
    setValues((v) => ({
      ...v,
      seasons: v.seasons.includes(season)
        ? v.seasons.filter((s) => s !== season)
        : [...v.seasons, season],
    }));
  }

  function addColor(raw: string) {
    const color = raw.trim();
    if (!color) return;
    setValues((v) =>
      v.colors.includes(color) || v.colors.length >= 8
        ? v
        : { ...v, colors: [...v.colors, color] },
    );
    setColorDraft("");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
      <ImageUploader
        file={file}
        onChange={setFile}
        existingUrl={!file ? existingImageUrl : undefined}
      />

      <div className="space-y-5">
        <Field label="Name" required>
          <input
            required
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            className="field"
            maxLength={120}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand">
            <input
              value={values.brand ?? ""}
              onChange={(e) => setValues({ ...values, brand: e.target.value })}
              className="field"
              maxLength={80}
            />
          </Field>
          <Field label="Category" required>
            <select
              value={values.category}
              onChange={(e) =>
                setValues({
                  ...values,
                  category: e.target.value as WardrobeItemInput["category"],
                })
              }
              className="field"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Colors">
          <div className="flex flex-wrap gap-2">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => addColor(c)}
                className="border border-border px-2 py-1 text-xs text-warm-gray hover:border-champagne hover:text-charcoal"
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={colorDraft}
              onChange={(e) => setColorDraft(e.target.value)}
              className="field"
              placeholder="Custom color"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor(colorDraft);
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={() => addColor(colorDraft)}>
              Add
            </Button>
          </div>
          {values.colors.length ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {values.colors.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    className="border border-champagne/50 px-2 py-1 text-xs text-charcoal"
                    onClick={() =>
                      setValues({
                        ...values,
                        colors: values.colors.filter((x) => x !== c),
                      })
                    }
                  >
                    {c} ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </Field>

        <Field label="Seasons">
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSeason(s)}
                className={`border px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase ${
                  values.seasons.includes(s)
                    ? "border-charcoal text-charcoal"
                    : "border-border text-warm-gray"
                }`}
                aria-pressed={values.seasons.includes(s)}
              >
                {SEASON_LABELS[s]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Material">
          <input
            value={values.material ?? ""}
            onChange={(e) => setValues({ ...values, material: e.target.value })}
            className="field"
            maxLength={80}
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Purchase date">
            <input
              type="date"
              value={values.purchaseDate ?? ""}
              onChange={(e) =>
                setValues({ ...values, purchaseDate: e.target.value })
              }
              className="field"
            />
          </Field>
          <Field label="Price">
            <input
              type="number"
              min={0}
              step="0.01"
              value={values.purchasePrice ?? ""}
              onChange={(e) =>
                setValues({
                  ...values,
                  purchasePrice: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="field"
            />
          </Field>
          <Field label="Currency">
            <input
              value={values.currency ?? ""}
              onChange={(e) => setValues({ ...values, currency: e.target.value })}
              className="field"
              maxLength={3}
              placeholder="USD"
            />
          </Field>
        </div>

        <Field label="Notes">
          <textarea
            value={values.notes ?? ""}
            onChange={(e) => setValues({ ...values, notes: e.target.value })}
            className="field min-h-24"
            maxLength={2000}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={values.isFavorite}
            onChange={(e) =>
              setValues({ ...values, isFavorite: e.target.checked })
            }
          />
          Mark as favorite
        </label>

        {error ? (
          <p className="text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : initial ? "Save changes" : "Save piece"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/wardrobe")}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
