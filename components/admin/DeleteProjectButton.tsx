"use client";

import { Trash2 } from "lucide-react";

export default function DeleteProjectButton({
  onDelete,
  id,
}: {
  onDelete: (id: string) => Promise<void>;
  id: string;
}) {
  return (
    <form
      action={async () => {
        if (window.confirm("¿Eliminar este proyecto permanentemente?")) {
          await onDelete(id);
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Eliminar
      </button>
    </form>
  );
}
