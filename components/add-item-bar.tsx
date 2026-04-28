"use client";

import { useState } from "react";
import { Plus, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createItem } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/useCategories";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function AddItemBar({
  tripId,
  defaultCategoryId,
}: {
  tripId: string;
  defaultCategoryId: string | null;
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(defaultCategoryId);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { categories } = useCategories(tripId);

  const selectedCategory = categories.find(c => c.id === (categoryId || defaultCategoryId));

  const handleAdd = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    try {
      await createItem({
        trip_id: tripId,
        category_id: categoryId || defaultCategoryId,
        name: name.trim(),
        is_prepared: false,
        is_packed: false,
      });
      setName("");
      toast.success("Barang ditambahkan!");
    } catch (e) {
      toast.error("Gagal menambahkan barang");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-0 w-full px-4 z-50 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-xl mx-auto pointer-events-auto"
      >
        <div className={cn(
          "relative flex items-center gap-2 p-1.5 transition-all duration-500 rounded-full border shadow-2xl backdrop-blur-2xl",
          isFocused 
            ? "bg-white/90 border-primary ring-4 ring-primary/10" 
            : "bg-surface-container-low/80 border-outline-variant/30"
        )}>
          {/* Category Selector Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all overflow-hidden group">
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: selectedCategory?.color || '#94a3b8' }}
                />
                <Plus className="w-5 h-5 text-on-surface" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-3xl p-2 shadow-2xl border-none bg-surface-container-high/95 backdrop-blur-xl">
              <div className="px-3 py-2 text-[10px] font-bold text-outline uppercase tracking-widest">Kategori</div>
              <DropdownMenuItem onClick={() => setCategoryId(null)} className="rounded-2xl h-12">
                <div className="h-3 w-3 rounded-full border border-outline-variant mr-2" />
                Tanpa Kategori
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} onClick={() => setCategoryId(cat.id)} className="rounded-2xl h-12 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Input Field */}
          <div className="relative flex-grow flex items-center">
             <input
              placeholder={`Masukkan barang ke ${selectedCategory?.name || 'Essentials'}...`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full bg-transparent border-none focus:ring-0 font-heading text-body-base placeholder:text-outline/40 text-on-surface py-2"
              disabled={loading}
            />
            <AnimatePresence>
              {name.length > 0 && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-2"
                >
                  <Sparkles className="w-4 h-4 text-primary/40" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add/Send Button */}
          <button
            onClick={handleAdd}
            disabled={!name.trim() || loading}
            className={cn(
              "relative flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all active:scale-90 disabled:opacity-30 disabled:scale-95",
              name.trim() ? "bg-primary text-on-primary" : "bg-surface-container-highest text-outline"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className={cn("w-4 h-4 transition-transform", name.trim() && "translate-x-0.5 -translate-y-0.5")} />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
