"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#0058be", // Primary Blue
  "#b90063", // Secondary Pink
  "#8b4d00", // Tertiary Orange
  "#006a6a", // Teal
  "#4d616c", // Slate
  "#6e5d0e", // Olive
  "#a03f3f", // Red
  "#5d5f00", // Lime
];

export function CategoryDialog({
  tripId,
  open,
  onOpenChange,
  category,
}: {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color || PRESET_COLORS[0]);
    } else {
      setName("");
      setColor(PRESET_COLORS[0]);
    }
  }, [category, open]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (category) {
        await updateCategory(category.id, { name, color }, tripId);
        toast.success("Category updated");
      } else {
        await createCategory({ trip_id: tripId, name, color });
        toast.success("Category created");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    setLoading(true);
    try {
      await deleteCategory(category.id, tripId);
      toast.success("Category deleted");
      onOpenChange(false);
    } catch (e) {
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[300px] sm:max-w-[320px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-surface p-md space-y-lg">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="font-heading text-h2 font-bold text-on-surface">
              {category ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-md">
            <div className="space-y-xs">
              <Label htmlFor="name" className="font-heading text-[10px] font-bold text-primary tracking-widest uppercase ml-1">Name</Label>
              <Input
                id="name"
                placeholder="Essentials, etc..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl h-11 bg-surface-container-low border-outline-variant/30 focus:ring-primary shadow-sm text-body-base"
              />
            </div>

            <div className="space-y-xs">
              <Label className="font-heading text-[10px] font-bold text-primary tracking-widest uppercase ml-1">Color</Label>
              <div className="grid grid-cols-4 gap-2 bg-surface-container-low p-sm rounded-2xl border border-outline-variant/20">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-8 w-full rounded-lg transition-all active:scale-90",
                      color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : "opacity-80 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={loading || !name.trim()}
              className="w-full h-11 rounded-xl font-heading font-bold shadow-lg shadow-primary/20"
            >
              {loading ? "Saving..." : category ? "Update" : "Create"}
            </Button>
            {category && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={loading}
                className="w-full h-10 text-error hover:text-error hover:bg-error/10 font-bold"
              >
                Delete Category
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
