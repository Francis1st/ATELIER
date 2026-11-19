"use client";

import { useSearchParams } from "next/navigation";
import { EditItemClient } from "@/app/wardrobe/edit/EditItemClient";

export function EditPageClient() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  if (!id) {
    return (
      <p className="text-sm text-red-800" role="alert">
        Missing piece id.
      </p>
    );
  }
  return <EditItemClient id={id} />;
}
