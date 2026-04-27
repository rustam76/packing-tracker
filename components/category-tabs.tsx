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
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect(null)}
          className={cn(
            "rounded-full px-4 border h-8",
            !activeCategoryId
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border"
          )}
        >
          All
        </Button>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 border h-8 cursor-pointer whitespace-nowrap transition-all",
              activeCategoryId === category.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:border-primary/50"
            )}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm font-medium">{category.name}</span>
            <div 
              onClick={(e) => handleOpenEdit(e, category)}
              className="ml-1 opacity-50 hover:opacity-100"
            >
              <Settings2 className="h-3 w-3" />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenCreate}
          className="rounded-full h-8 w-8 min-w-[32px] border-dashed"
        >
          <Plus className="h-4 w-4" />
        </Button>
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
