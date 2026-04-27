"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrips } from "@/lib/hooks/useTrips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Plus, ArrowRight, Loader2, Package2 } from "lucide-react";
import { createTrip } from "@/lib/actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import { createClient } from "@/lib/supabase/client";
import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const { trips, loading } = useTrips();
  const [isCreating, setIsCreating] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  const activeTrip = trips[0]; 
  const otherTrips = trips.slice(1);

  return (
    <div className="min-h-screen bg-surface pb-32">
      <NavBar title="My Trips" icon="luggage" />
      
      <main className="pt-24 px-margin-mobile max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center text-outline/30 mb-2">
              <span className="material-symbols-outlined text-[64px]">explore_off</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-h1 font-bold text-on-surface">No trips yet?</h2>
              <p className="font-sans text-body-sm text-outline max-w-[250px] mx-auto">
                Start your adventure by creating your first packing list.
              </p>
            </div>
            <Button 
               onClick={() => setIsCreating(true)}
               className="rounded-2xl h-14 px-8 font-heading font-bold shadow-lg shadow-primary/20"
            >
               Create New Trip
            </Button>
          </div>
        ) : (
          <>
            {/* Active Trip Section */}
            {activeTrip && (
              <section className="animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Active</span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </div>
                
                <div 
                  onClick={() => router.push(`/trip/${activeTrip.id}`)}
                  className="group relative overflow-hidden bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="h-32 w-full overflow-hidden bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[64px] text-outline/20">map</span>
                  </div>
                  <div className="p-md space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading text-h2 font-bold text-on-surface">{activeTrip.title}</h3>
                        <p className="font-sans text-body-sm text-outline">Current adventure</p>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <span className="font-heading text-[10px] font-bold">Planned</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Other Trips */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherTrips.map((trip, idx) => (
                <div 
                  key={trip.id}
                  onClick={() => router.push(`/trip/${trip.id}`)}
                  className={cn(
                    "flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-md space-y-4 cursor-pointer active:scale-[0.98] transition-all animate-in fade-in slide-in-from-bottom-2",
                    "hover:border-primary/20"
                  )}
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">event</span>
                    <span className="font-heading text-[10px] font-bold text-secondary uppercase tracking-wider">
                      Trip Detail
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading text-h2 font-bold text-on-surface leading-tight">{trip.title}</h3>
                    <p className="font-sans text-body-sm text-outline">Scheduled</p>
                  </div>
                </div>
              ))}
              
              {/* Add Trip Button */}
              <div 
                onClick={() => setIsCreating(true)}
                className="flex flex-col items-center justify-center bg-surface border-2 border-dashed border-outline-variant/50 rounded-2xl p-md min-h-40 group cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98]"
              >
                 <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-outline group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined text-[32px]">add</span>
                 </div>
                 <p className="font-heading text-body-sm font-bold text-outline mt-3 group-hover:text-primary">Create New Trip</p>
              </div>
            </section>
          </>
        )}

        {/* Stats Section */}
        <div className="bg-primary-fixed dark:bg-primary-container rounded-3xl p-lg flex items-center justify-between overflow-hidden relative shadow-lg shadow-primary/5">
          <div className="relative z-10">
            <p className="font-heading text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Traveler Profile</p>
            <p className="font-heading text-h1 font-bold text-on-surface">{trips.length} Trips Organized</p>
            <p className="font-sans text-body-sm text-on-surface-variant opacity-80 mt-1">Ready for the next adventure</p>
          </div>
          <span className="material-symbols-outlined text-[80px] text-primary opacity-5 absolute -right-4 -bottom-4">travel_explore</span>
        </div>
      </main>

      <BottomNav />
      
      {/* FAB */}
      <button 
        onClick={() => setIsCreating(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-40 group"
      >
        <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  );
}
