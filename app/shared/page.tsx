"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { joinTripByCode } from "@/lib/actions";
import { useSharedTrips } from "@/lib/hooks/useSharedTrips";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SharedPage() {
  const router = useRouter();
  const { sharedTrips, loading } = useSharedTrips();
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    try {
      const invitation = await joinTripByCode(joinCode.trim());
      toast.success("Joined trip successfully!");
      setJoinCode("");
      setShowJoin(false);
      router.push(`/trip/${invitation.trip_id}`);
    } catch (e) {
      toast.error("Invalid invitation code");
    } finally {
      setIsJoining(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-surface pb-32">
      <NavBar title="Shared Collaborations" icon="group" />

      <main className="pt-24 px-margin-mobile max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        <section className="bg-primary-container text-on-primary-container rounded-3xl p-lg shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
             <p className="font-heading text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Collective Traveling</p>
             <h2 className="font-heading text-h1 font-bold">Planned Together</h2>
             <p className="font-sans text-[12px] text-white/80 max-w-[80%] pt-2">Manage all the trips you are collaborating on with friends and family.</p>
          </div>
          <span className="material-symbols-outlined text-[100px] text-white/10 absolute -right-4 -bottom-4">hub</span>
        </section>

        <div className="space-y-lg">
          <h3 className="font-heading text-label-caps text-primary tracking-widest uppercase ml-1">Active Collaborations</h3>
          
          <div className="space-y-4">
             {loading ? (
               <div className="flex flex-col items-center py-10 opacity-20">
                 <Loader2 className="w-8 h-8 animate-spin" />
               </div>
             ) : sharedTrips.length === 0 ? (
               <div className="py-10 text-center border border-dashed border-outline-variant/30 rounded-3xl">
                 <p className="font-sans text-body-sm text-outline">No active collaborations yet.</p>
               </div>
             ) : (
               sharedTrips.map((trip) => (
                 <div 
                   key={trip.id}
                   onClick={() => router.push(`/trip/${trip.id}`)}
                   className="bg-surface-container-lowest rounded-3xl p-md border border-outline-variant/30 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-primary/30 transition-all"
                 >
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center overflow-hidden text-outline/30">
                      <span className="material-symbols-outlined text-[32px]">map</span>
                    </div>
                    <div className="flex-grow">
                       <h4 className="font-heading text-body-base font-bold text-on-surface">{trip.title}</h4>
                       <p className="font-sans text-[11px] text-outline">Collaborator</p>
                    </div>
                    <div className="flex -space-x-2 mr-2">
                       <div className="w-7 h-7 rounded-full border-2 border-surface bg-primary text-on-primary flex items-center justify-center font-bold text-[8px]">
                          +
                       </div>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        <div className="bg-surface-container-low rounded-3xl p-lg border-2 border-dashed border-outline-variant/50 flex flex-col items-center gap-3 text-center opacity-70">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[24px]">add_link</span>
          </div>
          <div>
            <p className="font-heading text-body-sm font-semibold text-on-surface">Enter Invitation Code</p>
            <p className="font-sans text-[11px] text-outline">Join a trip someone shared with you</p>
          </div>
          <button 
            onClick={() => setShowJoin(true)}
            className="mt-2 bg-surface-container-highest px-6 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-primary hover:text-on-primary transition-all active:scale-95"
          >
            Join Trip
          </button>
        </div>
      </main>

      <BottomNav />

      <Dialog open={showJoin} onOpenChange={setShowJoin}>
        <DialogContent className="max-w-[400px] w-[90vw] rounded-3xl p-lg border-none shadow-2xl">
          <DialogHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[32px]">link</span>
            </div>
            <DialogTitle className="font-heading text-h1 font-bold text-on-surface">Join a Trip</DialogTitle>
            <DialogDescription className="font-sans text-body-sm text-outline">
              Enter the invitation code sent to your email to join the collaboration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline ml-1">Invitation Code</label>
              <Input 
                placeholder="Enter code here..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="h-12 rounded-2xl bg-surface-container-low border-outline-variant/30 focus-visible:ring-secondary"
              />
            </div>
            <Button 
              onClick={handleJoin}
              disabled={isJoining || !joinCode}
              variant="secondary"
              className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-secondary/20"
            >
              {isJoining ? "Joining..." : "Accept Invitation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
