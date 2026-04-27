"use client";

import { useItems } from "@/lib/hooks/useItems";
import { useTrips } from "@/lib/hooks/useTrips";
import { useParams, useRouter } from "next/navigation";
import { TripSelector } from "@/components/trip-selector";
import { CategoryTabs } from "@/components/category-tabs";
import { ProgressBar } from "@/components/progress-bar";
import { FilterBar } from "@/components/filter-bar";
import { ItemList } from "@/components/item-list";
import { AddItemBar } from "@/components/add-item-bar";
import { useState, useMemo, useEffect } from "react";
import { FilterType } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TripPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { trips } = useTrips();
  const { items, loading } = useItems(id);
  
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Sync last trip ID
  useEffect(() => {
    localStorage.setItem("lastTripId", id);
  }, [id]);

  const activeTrip = trips.find((t) => t.id === id);

  const packedCount = useMemo(() => items.filter((i) => i.is_packed).length, [items]);

  const handleBack = () => {
    localStorage.removeItem("lastTripId");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 pt-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex items-center justify-between sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl z-30 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
               <ArrowLeft className="h-5 w-5" />
             </Button>
             <TripSelector 
               activeTripId={id} 
               onSelect={(newId) => router.push(`/trip/${newId}`)} 
             />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5 opacity-50" />
            </Button>
          </div>
        </header>

        {/* Progress Display */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-card border rounded-3xl p-6 shadow-sm"
        >
          <ProgressBar packedCount={packedCount} totalCount={items.length} />
        </motion.div>

        {/* Filters/Categories Section */}
        <div className="space-y-4 sticky top-[80px] bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl z-20 py-2 -mx-4 px-4">
           <FilterBar value={filter} onChange={setFilter} />
           <CategoryTabs 
            tripId={id} 
            activeCategoryId={activeCategoryId} 
            onSelect={setActiveCategoryId} 
           />
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-muted/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <ItemList 
            items={items} 
            tripId={id} 
            filter={filter} 
            activeCategoryId={activeCategoryId} 
          />
        )}
      </div>

      {/* Persistent Bottom Bar */}
      <AddItemBar tripId={id} defaultCategoryId={activeCategoryId} />
    </div>
  );
}
