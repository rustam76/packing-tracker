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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Toiletries"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === c ? "border-black scale-110 shadow-md" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row items-center justify-between">
          {category && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
