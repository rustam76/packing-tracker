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
import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { motion } from "framer-motion";

export default function TripPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { trips } = useTrips();
  const { items, loading } = useItems(id);
  
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Sync last trip ID
  useEffect(() => {
    localStorage.setItem("lastTripId", id);
  }, [id]);

  const activeTrip = trips.find((t) => t.id === id);
  const packedCount = useMemo(() => items.filter((i) => i.is_packed).length, [items]);
  const percentage = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  const handleBack = () => {
    localStorage.removeItem("lastTripId");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface pb-40">
      <NavBar 
        title={activeTrip?.title || "Summer Trip 2024"} 
        onAction={handleBack}
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

      <main className="mt-20 px-margin-mobile max-w-2xl mx-auto space-y-6">
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
            tripId={id} 
            activeCategoryId={activeCategoryId} 
            onSelect={setActiveCategoryId} 
           />
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-surface-container-low animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <ItemList 
            items={items} 
            tripId={id} 
            filter="all" 
            activeCategoryId={activeCategoryId} 
          />
        )}

        {/* Aesthetic Bento-ish Highlight Card */}
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-lg aspect-[16/9] flex flex-col justify-end shadow-xl animate-in zoom-in duration-700">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB64Yq180TGFCWKnWYTeQH8C8IKOk7XDrW0YGC9G92NSdjvoble0qXt2szDKfU2j8pQmDJ15VsMWDwbBnuEeALXE9pE6ofIeABA2zhKEoaA5BdGtYg7x0T4-L0XbQj4FAFEZ5WdxSwwEil3HDfHN5NPQMM4UVNOoyH3GpBrbsew5u_qVLSE8WOfYsR5osm8IwoAXggaYwtEFY3qA6wyq-JaX7yO2I8_SlPw5NbHwom4FijOHnrLtAQgZ8xBv2QStclbjEfX-KkLCZs"
          />
          <div className="relative z-10">
            <span className="bg-blue-600 text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block font-heading tracking-widest">
              PACKING TIP
            </span>
            <h4 className="font-heading text-h2 leading-tight">
              High of 32°C in Amalfi.<br/>Pack extra hydration.
            </h4>
          </div>
        </div>
      </main>

      <AddItemBar tripId={id} defaultCategoryId={activeCategoryId} />
      <BottomNav />
    </div>
  );
}
