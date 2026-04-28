"use client";

import { useCategories } from "@/lib/hooks/useCategories";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { CategoryDialog } from "./category-dialog";
import { useState } from "react";

export function CategoryTabs({
  tripId,
  activeCategoryId,
  onSelect,
}: {
  tripId: string;
  activeCategoryId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { categories } = useCategories(tripId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, category: any) => {
    e.stopPropagation();
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-sm overflow-x-auto no-scrollbar -mx-margin-mobile px-margin-mobile pb-2">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "flex items-center gap-2 px-md py-sm rounded-full whitespace-nowrap transition-all font-heading text-[10px] font-bold uppercase tracking-wider",
            !activeCategoryId
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-lowest border border-outline-variant/30 text-on-surface"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex items-center gap-2 px-md py-sm rounded-full whitespace-nowrap transition-all font-heading text-[10px] font-bold uppercase tracking-wider",
              activeCategoryId === category.id
                ? "bg-primary text-on-primary shadow-md"
                : "bg-surface-container-lowest border border-outline-variant/30 text-on-surface"
            )}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span>{category.name}</span>
            <span 
              onClick={(e) => handleOpenEdit(e, category)}
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] transition-colors",
                activeCategoryId === category.id ? "bg-white/20" : "bg-surface-container-highest"
              )}
            >
              <span className="material-symbols-outlined text-[11px]">settings</span>
            </span>
          </button>
        ))}
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest border border-dashed border-outline-variant text-outline active:scale-90 transition-all shrink-0"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <CategoryDialog
        tripId={tripId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
