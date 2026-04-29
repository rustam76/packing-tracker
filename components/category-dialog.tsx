"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [category, open]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (category) {
        await updateCategory(category.id, { name });
        toast.success("Kategori diperbarui");
      } else {
        await createCategory({ name });
        toast.success("Kategori dibuat");
      }
      router.refresh();
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (e) {
      toast.error("Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    setLoading(true);
    try {
      await deleteCategory(category.id);
      router.refresh();
      if (onSuccess) onSuccess();
      toast.success("Kategori dihapus");
      onOpenChange(false);
    } catch (e) {
      toast.error("Gagal menghapus kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[300px] sm:max-w-[320px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-surface p-8 space-y-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="font-heading text-h2 font-bold text-on-surface">
              {category ? "Edit Kategori" : "Kategori Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-heading text-[10px] font-bold text-primary tracking-widest uppercase ml-1">Nama Kategori</Label>
              <Input
                id="name"
                placeholder="Contoh: Pakaian, Alat Mandi..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl h-11 bg-surface-container-low border-outline-variant/30 focus:ring-primary shadow-sm text-body-base"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={loading || !name.trim()}
              className="w-full h-11 rounded-xl font-heading font-bold shadow-lg shadow-primary/20"
            >
              {loading ? "Menyimpan..." : category ? "Perbarui" : "Buat Kategori"}
            </Button>
            {category && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={loading}
                className="w-full h-10 text-error hover:text-error hover:bg-error/10 font-bold"
              >
                Hapus Kategori
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
