"use client";

import { useCategories } from "@/lib/hooks/useCategories";
import { cn } from "@/lib/utils";
import { Plus, Hash } from "lucide-react";
import { useState } from "react";
import { CategoryDialog } from "./category-dialog";

export function CategoryTabs({
  activeCategoryId,
  onSelect,
}: {
  activeCategoryId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { categories, loading, refresh } = useCategories();
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
          activeCategoryId === null
            ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
            : "bg-surface-container-low text-outline hover:bg-surface-container hover:text-on-surface"
        )}
      >
        <Hash className="w-4 h-4" />
        Semua
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          onDoubleClick={() => handleEdit(cat)}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
            activeCategoryId === cat.id
              ? "bg-surface-container-high text-on-surface shadow-md ring-2 ring-primary/20"
              : "bg-surface-container-low text-outline hover:bg-surface-container"
          )}
        >
          {cat.name}
        </button>
      ))}

      <button
        onClick={handleCreate}
        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
      >
        <Plus className="w-5 h-5" />
      </button>

      <CategoryDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        category={editingCategory}
        onSuccess={() => refresh()}
      />
    </div>
  );
}
