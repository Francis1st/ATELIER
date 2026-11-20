"use client";

import { useCallback, useEffect, useState } from "react";
import { resolveActiveCoverId, type DisplayItem } from "@/domain/types";
import { getImage, listItems } from "@/services/wardrobe/repository";

type State = {
  items: DisplayItem[];
  loading: boolean;
  error: string | null;
};

async function loadDisplayItems(): Promise<DisplayItem[]> {
  const rows = await listItems();
  return Promise.all(
    rows.map(async (item): Promise<DisplayItem> => {
      let coverUrl: string | undefined;
      const coverId = resolveActiveCoverId(item);
      if (coverId) {
        try {
          const img = await getImage(coverId);
          if (img?.blob) coverUrl = URL.createObjectURL(img.blob);
        } catch {
          coverUrl = undefined;
        }
      }
      return { ...item, coverUrl };
    }),
  );
}

function revokeCoverUrls(items: DisplayItem[]) {
  for (const item of items) {
    if (item.coverUrl?.startsWith("blob:")) URL.revokeObjectURL(item.coverUrl);
  }
}

export function useWardrobe() {
  const [state, setState] = useState<State>({
    items: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const withCovers = await loadDisplayItems();
      setState((prev) => {
        revokeCoverUrls(prev.items);
        return { items: withCovers, loading: false, error: null };
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not load your wardrobe from this browser.";
      setState((s) => ({ ...s, loading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let urls: DisplayItem[] = [];

    void (async () => {
      try {
        const withCovers = await loadDisplayItems();
        if (cancelled) {
          revokeCoverUrls(withCovers);
          return;
        }
        urls = withCovers;
        setState({ items: withCovers, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Could not load your wardrobe from this browser.";
        setState({ items: [], loading: false, error: message });
      }
    })();

    return () => {
      cancelled = true;
      revokeCoverUrls(urls);
    };
  }, []);

  return { ...state, refresh };
}
