"use client";

import { useItems } from "@/lib/hooks/useItems";
import { useTrips } from "@/lib/hooks/useTrips";
import { useRouter } from "next/navigation";
import { CategoryTabs } from "@/components/category-tabs";
import { ProgressBar } from "@/components/progress-bar";
import { ItemList } from "@/components/item-list";
import { AddItemBar } from "@/components/add-item-bar";
import { useState, useMemo, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { motion } from "framer-motion";
import { createTrip } from "@/lib/actions";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { trips, loading: loadingTrips } = useTrips();
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  
  const { items, loading: loadingItems, setItems } = useItems(activeTripId || "");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Auto-select or create trip
  useEffect(() => {
    if (loadingTrips) return;

    if (trips.length > 0) {
      setActiveTripId(trips[0].id);
    } else if (!isCreatingTrip) {
      setIsCreatingTrip(true);
      createTrip("My Packing List")
        .then((newTrip) => {
          setActiveTripId(newTrip.id);
        })
        .finally(() => {
          setIsCreatingTrip(false);
        });
    }
  }, [trips, loadingTrips, isCreatingTrip]);

  const activeTrip = trips.find((t) => t.id === activeTripId);
  const packedCount = useMemo(() => items.filter((i) => i.is_packed).length, [items]);
  const percentage = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  if (loadingTrips || isCreatingTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  if (!activeTripId) {
    return null; // Should be handled by loading or creation
  }

  return (
    <div className="min-h-screen bg-surface pb-40">
      <NavBar 
        title={activeTrip?.title || "Packing List"} 
        icon="luggage"
      />

      {/* Global Progress Bar (Sticky) */}
      <div className="fixed top-16 left-0 w-full h-1 bg-surface-container z-40">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-primary transition-all duration-500" 
          style={{ boxShadow: "0 0 8px rgba(0,88,190,0.4)" }} 
        />
      </div>

      <main className="mt-20 px-margin-mobile max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700">
        {/* Progress Text & Summary */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <ProgressBar packedCount={packedCount} totalCount={items.length} isSticky />
        </motion.div>

        {/* Horizontal Category Tabs */}
        <div className="sticky top-[70px] bg-surface/80 backdrop-blur-md z-30 py-4 -mx-margin-mobile px-margin-mobile">
           <CategoryTabs 
            tripId={activeTripId} 
            activeCategoryId={activeCategoryId} 
            onSelect={setActiveCategoryId} 
           />
        </div>

        {/* Content Section */}
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
            tripId={activeTripId} 
            filter="all" 
            activeCategoryId={activeCategoryId} 
          />
        )}
      </main>

      <AddItemBar tripId={activeTripId} defaultCategoryId={activeCategoryId} />
    </div>
  );
}
