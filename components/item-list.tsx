"use client";

import { Item, FilterType, Category } from "@/lib/types";
import { ItemCard } from "./item-card";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Hash } from "lucide-react";
import { useCategories } from "@/lib/hooks/useCategories";

export function ItemList({
  items,
  onItemsChange,
  activeCategoryId,
}: {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
  activeCategoryId: string | null;
}) {
  const { categories } = useCategories();
  const [filter, setFilter] = useState<FilterType>("all");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeCategoryId && item.category_id !== activeCategoryId) return false;
      if (filter !== "all" && item.status !== filter) return false;
      return true;
    });
  }, [items, filter, activeCategoryId]);

  const stats = {
    total: items.length,
    prepare: items.filter(i => i.status === "prepare").length,
    ready: items.filter(i => i.status === "ready").length,
    packing: items.filter(i => i.status === "packing").length,
    unpacked: items.filter(i => i.status === "unpacked").length,
  };

  const groups = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const catId = item.category_id || "uncategorized";
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
  }, [filteredItems]);

  const toggleCategory = (id: string) => {
    const next = new Set(collapsedCategories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedCategories(next);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 bg-surface-container-low/30 rounded-[32px] border-2 border-dashed border-outline-variant/30">
        <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center">
          <Hash className="w-10 h-10 text-outline/30" />
        </div>
        <div className="space-y-1">
          <p className="text-on-surface font-bold text-h2">Belum ada barang</p>
          <p className="text-outline text-body-base max-w-[240px]">Tambah barang bawaan Anda untuk memulai tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-8">
      {/* Filter Tabs */}
      

      {Object.entries(groups).map(([catId, groupItems]) => {
        const category = categories.find((c) => c.id === catId);
        const isCollapsed = collapsedCategories.has(catId);
        
        return (
          <div key={catId} className="space-y-3">
            <button 
              onClick={() => toggleCategory(catId)}
              className="flex items-center gap-2 group/header w-full text-left"
            >
              <span className="font-heading text-h3 font-black text-on-surface flex-1">
                {category?.name || "Tanpa Kategori"}
                <span className="ml-2 text-outline/50 font-bold">{groupItems.length}</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-outline group-hover/header:bg-surface-container transition-colors">
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {!isCollapsed && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                {groupItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDelete={(id) => onItemsChange(items.filter(i => i.id !== id))}
                    onUpdate={(id, updates) => onItemsChange(items.map(i => i.id === id ? { ...i, ...updates } : i))}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
