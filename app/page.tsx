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

export default function HomePage() {
  const router = useRouter();
  const { trips, loading } = useTrips();
  const [newTitle, setNewTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Check local storage for last active trip
    const lastTripId = localStorage.getItem("lastTripId");
    if (lastTripId) {
      router.push(`/trip/${lastTripId}`);
    }
  }, [router]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      const trip = await createTrip(newTitle);
      localStorage.setItem("lastTripId", trip.id);
      router.push(`/trip/${trip.id}`);
      toast.success("Trip created!");
    } catch (e) {
      toast.error("Failed to create trip");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectTrip = (id: string) => {
    localStorage.setItem("lastTripId", id);
    router.push(`/trip/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
           <div className="inline-flex p-4 rounded-3xl bg-primary text-primary-foreground shadow-xl mb-4">
              <Package2 className="h-8 w-8" />
           </div>
           <h1 className="text-4xl font-black tracking-tight italic">PACKING<span className="text-primary not-italic">TRACKER</span></h1>
           <p className="text-muted-foreground">The ultimate companion for your next adventure.</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Where are we going?</CardTitle>
            <CardDescription>Start a new trip or continue an existing one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Japan 2024..." 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="rounded-xl h-12"
              />
              <Button onClick={handleCreate} disabled={isCreating || !newTitle.trim()} className="h-12 w-12 rounded-xl shrink-0 p-0">
                {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-6 w-6" />}
              </Button>
            </div>

            {trips.length > 0 && (
              <div className="pt-4 border-t border-muted">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Recent Trips</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => handleSelectTrip(trip.id)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary opacity-50" />
                        <span className="font-semibold">{trip.title}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <footer className="text-center text-xs text-muted-foreground pt-8">
           &copy; 2024 Packing Tracker PWA. Optimized for mobile.
        </footer>
      </motion.div>
    </div>
  );
}
