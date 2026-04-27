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
import { Trash2 } from "lucide-react";

const PRESET_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#0ea5e9", // Sky
  "#6366f1", // Indigo
  "#a855f7", // Purple
  "#ec4899", // Pink
];

export function CategoryDialog({
  tripId,
  category,
  open,
  onOpenChange,
}: {
  tripId: string;
  category?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
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
        await updateCategory(category.id, name, color);
        toast.success("Category updated");
      } else {
        await createCategory(tripId, name, color);
        toast.success("Category created");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error("Error saving category");
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
      toast.error("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-surface p-lg space-y-xl">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="font-heading text-h1 font-bold text-on-surface">
              {category ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-lg">
            <div className="space-y-sm">
              <Label htmlFor="name" className="font-heading text-label-caps text-primary tracking-widest uppercase ml-1">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g. Essentials, Toiletries..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-2xl h-14 bg-surface-container-low border-outline-variant/30 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-sm">
              <Label className="font-heading text-label-caps text-primary tracking-widest uppercase ml-1">Accent Color</Label>
              <div className="grid grid-cols-4 gap-3 bg-surface-container-low p-md rounded-3xl border border-outline-variant/20">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`h-10 w-full rounded-2xl border-4 transition-all relative group flex items-center justify-center ${
                      color === c ? "border-primary-container scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  >
                    {color === c && (
                      <span className="material-symbols-outlined text-white text-[20px] font-bold">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={loading || !name.trim()}
              className="rounded-2xl h-14 font-heading font-bold shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined mr-2">save</span>
              {category ? "Update Category" : "Create Category"}
            </Button>
            
            <div className="flex gap-3">
              {category && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 rounded-2xl h-12 text-error hover:bg-error/5 font-bold"
                >
                  <span className="material-symbols-outlined mr-2">delete</span>
                  Delete
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-2xl h-12 text-outline font-bold"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
