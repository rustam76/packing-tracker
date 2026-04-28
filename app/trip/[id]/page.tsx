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

import { inviteUser } from "@/lib/actions";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TripPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { trips } = useTrips();
  const { items, loading } = useItems(id);
  
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

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

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      const invite = await inviteUser(id, inviteEmail.trim());
      toast.success(`Invitation sent! Code: ${invite.id}`);
      setInviteEmail("");
      setShowInvite(false);
    } catch (e) {
      toast.error("Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-40">
      <NavBar 
        title={activeTrip?.title || "Summer Trip 2024"} 
        onAction={handleBack}
      />
      
      {/* Share Button (Float near top) */}
      <button 
        onClick={() => setShowInvite(true)}
        className="fixed top-20 right-margin-mobile z-40 bg-surface-container-highest/80 backdrop-blur-md p-3 rounded-2xl border border-outline-variant/30 text-primary shadow-lg active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[20px]">person_add</span>
      </button>

      {/* Global Progress Bar (Sticky) */}
      <div className="fixed top-16 left-0 w-full h-1 bg-surface-container z-40">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-primary transition-all duration-500" 
          style={{ boxShadow: "0 0 8px rgba(0,88,190,0.4)" }} 
        />
      </div>

      <main className="mt-[72px] px-margin-mobile max-w-2xl mx-auto space-y-4">
        {/* Progress Text & Summary */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <ProgressBar packedCount={packedCount} totalCount={items.length} isSticky />
        </motion.div>

        {/* Horizontal Category Tabs */}
        <div className="sticky top-[68px] bg-surface/80 backdrop-blur-md z-30 py-3 -mx-margin-mobile px-margin-mobile">
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

        
      </main>

      <AddItemBar tripId={id} defaultCategoryId={activeCategoryId} />
      <BottomNav />

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-[400px] w-[90vw] rounded-3xl p-lg border-none shadow-2xl">
          <DialogHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[32px]">group_add</span>
            </div>
            <DialogTitle className="font-heading text-h1 font-bold text-on-surface">Share Trip</DialogTitle>
            <DialogDescription className="font-sans text-body-sm text-outline">
              Invite someone to collaborate on this packing list via email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline ml-1">Email Address</label>
              <Input 
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-12 rounded-2xl bg-surface-container-low border-outline-variant/30 focus-visible:ring-primary"
              />
            </div>
            <Button 
              onClick={handleInvite}
              disabled={isInviting || !inviteEmail}
              className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20"
            >
              {isInviting ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
