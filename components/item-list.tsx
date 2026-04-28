"use client";

import { Category, FilterType, Item } from "@/lib/types";
import { ItemCard } from "./item-card";
import { Reorder } from "framer-motion";
import { useCategories } from "@/lib/hooks/useCategories";
import { ChevronDown, Package2, Ghost, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ItemList({
  items,
  tripId,
  filter,
  activeCategoryId,
}: {
  items: Item[];
  tripId: string;
  filter: FilterType;
  activeCategoryId: string | null;
}) {
  const [localItems, setLocalItems] = useState(items);
  const { categories } = useCategories(tripId);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Sync local items when props change
  useEffect(() => {
    const sorted = [...items].sort((a, b) => {
      const getStatusRank = (item: Item) => {
        if (item.is_packed) return 2;
        if (item.is_prepared) return 1;
        return 0;
      };
      return getStatusRank(a) - getStatusRank(b);
    });
    setLocalItems(sorted);
  }, [items]);

  // Filter items
  const filteredItems = localItems.filter((item) => {
    if (activeCategoryId && item.category_id !== activeCategoryId) return false;
    if (filter === "prepared" && !item.is_prepared) return false;
    if (filter === "packed" && !item.is_packed) return false;
    if (filter === "unpacked" && item.is_packed) return false;
    if (filter === "me" && item.owner !== "me") return false;
    if (filter === "partner" && item.owner !== "partner") return false;
    return true;
  });

  // Group by category
  const groups = filteredItems.reduce((acc, item) => {
    const catId = item.category_id || "uncategorized";
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const toggleCategory = (id: string) => {
    const next = new Set(collapsedCategories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedCategories(next);
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="bg-muted/30 rounded-full p-6 mb-4">
           <Ghost className="h-12 w-12 opacity-20" />
        </div>
        <p className="text-lg font-medium">Nothing found</p>
        <p className="text-sm">Try changing filters or add some items!</p>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-8">
      {Object.entries(groups).map(([catId, groupItems]) => {
        const category = categories.find((c) => c.id === catId);
        const isCollapsed = collapsedCategories.has(catId);
        const packedCount = groupItems.filter(i => i.is_packed).length;

        return (
          <div key={catId} className="space-y-4">
            {/* Header Kategori */}
            <div 
              className="flex items-center justify-between px-2 cursor-pointer group select-none"
              onClick={() => toggleCategory(catId)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={cn(
                    "h-3 w-3 rounded-full shadow-sm",
                    !category?.color && "bg-outline-variant"
                  )} 
                  style={{ backgroundColor: category?.color }} 
                />
                <h3 className="font-heading text-body-base font-bold capitalize text-on-surface">
                  {category?.name || "Uncategorized"}
                </h3>
                <span className="font-heading text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                  {packedCount} / {groupItems.length}
                </span>
              </div>
              <div className="text-outline group-hover:text-primary transition-colors">
                 {isCollapsed ? <ChevronDown size={18} /> : <MoreHorizontal size={18} />}
              </div>
            </div>

            {/* Daftar Item (Tanpa AnimatePresence yang berisiko menyembunyikan konten) */}
            {!isCollapsed && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Reorder.Group 
                  axis="y" 
                  values={groupItems} 
                  onReorder={(newOrder) => {
                    const otherGroupsItems = localItems.filter(i => (i.category_id || "uncategorized") !== catId);
                    setLocalItems([...otherGroupsItems, ...newOrder]);
                  }}
                  className="space-y-2"
                >
                   {groupItems.map((item) => (
                     <Reorder.Item 
                      key={item.id} 
                      value={item}
                      className="active:z-50"
                     >
                       <ItemCard 
                        item={item} 
                        tripId={tripId} 
                        categoryColor={category?.color}
                        onDelete={(id) => {
                          setLocalItems(prev => prev.filter(i => i.id !== id));
                        }}
                       />
                     </Reorder.Item>
                   ))}
                </Reorder.Group>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
