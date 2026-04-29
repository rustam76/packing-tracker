"use client";

import { useItems } from "@/lib/hooks/useItems";
import { useCategories } from "@/lib/hooks/useCategories";
import { CategoryTabs } from "@/components/category-tabs";
import { ProgressBar } from "@/components/progress-bar";
import { ItemList } from "@/components/item-list";
import { AddItemBar } from "@/components/add-item-bar";
import { useState, useMemo } from "react";
import { NavBar } from "@/components/nav-bar";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { categories, loading: loadingCategories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { items, loading: loadingItems, setItems, refresh: refreshItems } = useItems(activeCategoryId);

  const packedCount = useMemo(() => items.filter((i) => i.status === "packing").length, [items]);

  if (loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-40">
      <NavBar 
        title="Packing Tracker" 
        icon="luggage"
      />

      {/* Main Container */}
      <main className="mt-14 mx-auto w-full max-w-2xl animate-in fade-in duration-700">
        
        {/* Sticky Header Section (Progress & Tabs) */}
        <div className="sticky top-14 z-30 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/20 pt-4 pb-2 px-margin-mobile shadow-sm">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <ProgressBar packedCount={packedCount} totalCount={items.length} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <CategoryTabs 
              activeCategoryId={activeCategoryId} 
              onSelect={setActiveCategoryId} 
            />
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="px-margin-mobile mt-6">
          {loadingItems ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 w-full bg-surface-container-low animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <ItemList 
              items={items} 
              onItemsChange={setItems}
              activeCategoryId={activeCategoryId} 
            />
          )}
        </div>
      </main>

      <AddItemBar defaultCategoryId={activeCategoryId} onRefresh={refreshItems} />
    </div>
  );
}
