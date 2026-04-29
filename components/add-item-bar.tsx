"use client";

import { useState } from "react";
import { Plus, Package, Tag, Loader2 } from "lucide-react";
import { useCategories } from "@/lib/hooks/useCategories";
import { createItem } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function AddItemBar({ 
  defaultCategoryId,
  onRefresh
}: { 
  defaultCategoryId?: string | null,
  onRefresh?: () => void
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(defaultCategoryId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createItem({
        name: name.trim(),
        category_id: categoryId || (categories.length > 0 ? categories[0].id : null),
        status: "prepare"
      });
      setName("");
      router.refresh();
      if (onRefresh) onRefresh();
      toast.success(`${name.trim()} ditambahkan!`);
    } catch (error) {
      toast.error("Gagal menambahkan barang");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-8 pt-4 bg-gradient-to-t from-surface via-surface/95 to-transparent">
      <div className="max-w-2xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative group bg-surface-container-high/80 backdrop-blur-2xl border border-outline-variant/30 rounded-[32px] shadow-2xl shadow-black/10 p-2 flex items-center gap-2 transition-all duration-500 hover:border-primary/30"
        >
          <div className="flex-1 flex items-center gap-3 px-4">
            <Package className="w-5 h-5 text-outline opacity-50" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tambah barang bawaan..."
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline/50 font-medium text-body-lg h-12"
            />
          </div>

          <div className="flex items-center gap-1">
            <div className="relative">
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value || null)}
                className="appearance-none bg-surface-container-low/50 border-none rounded-2xl pl-10 pr-4 h-11 text-sm font-bold text-on-surface-variant cursor-pointer hover:bg-primary/10 transition-colors focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                name.trim() 
                  ? "bg-primary text-on-primary scale-100 shadow-primary/30 rotate-0" 
                  : "bg-surface-container-lowest text-outline opacity-50 scale-90 -rotate-45"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-6 h-6 stroke-[3]" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
