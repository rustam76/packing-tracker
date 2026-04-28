"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrips } from "@/lib/hooks/useTrips";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Edit2,
  Trash2,
  MapPin,
  GripVertical,
  Plus,
  Calendar,
  AlertTriangle,
  PackageCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";
import {
  createTrip,
  updateTrip,
  deleteTrip,
  reorderTrips,
} from "@/lib/actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Countdown } from "@/components/countdown";
import { ProgressBar } from "@/components/progress-bar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function HomePage() {
  const router = useRouter();
  const { trips: initialTrips, loading } = useTrips();
  const [trips, setTrips] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [tripTitle, setTripTitle] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with initial trips from hook
  useEffect(() => {
    if (initialTrips) {
      setTrips(initialTrips);
    }
  }, [initialTrips]);

  const handleReorder = async (newOrder: any[]) => {
    setTrips(newOrder);
    try {
      await reorderTrips(newOrder.map((t) => t.id));
    } catch (e) {
      console.error("Reorder failed:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  const handleCreate = async () => {
    if (!tripTitle.trim()) return;
    setIsProcessing(true);
    try {
      const trip = await createTrip(tripTitle, departureAt || undefined);
      toast.success("Trip created!");
      setIsCreating(false);
      setTripTitle("");
      setDepartureAt("");
      router.push(`/trip/${trip.id}`);
    } catch (e) {
      toast.error("Failed to create trip");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async () => {
    if (!tripTitle.trim() || !editingTrip) return;
    setIsProcessing(true);
    try {
      await updateTrip(editingTrip.id, {
        title: tripTitle,
        departure_at: departureAt || undefined,
      });
      toast.success("Trip updated!");
      setEditingTrip(null);
      setTripTitle("");
      setDepartureAt("");
    } catch (e) {
      toast.error("Failed to update trip");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this trip and all its items?")) return;
    try {
      await deleteTrip(id);
      toast.success("Trip deleted");
    } catch (e) {
      toast.error("Failed to delete trip");
    }
  };

  const openEdit = (e: React.MouseEvent, trip: any) => {
    e.stopPropagation();
    setEditingTrip(trip);
    setTripTitle(trip.title);
    setDepartureAt(trip.departure_at ? trip.departure_at.slice(0, 16) : "");
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      <NavBar title="My Trips" icon="luggage" />

      <main className="pt-20 px-margin-mobile max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-outline/30 mb-2">
              <span className="material-symbols-outlined text-[48px]">
                explore_off
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-h1 font-bold text-on-surface">
                No trips yet?
              </h2>
              <p className="font-sans text-body-sm text-outline max-w-[250px] mx-auto">
                Start your adventure by creating your first packing list.
              </p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="rounded-2xl h-12 px-8 font-heading font-bold shadow-lg shadow-primary/20"
            >
              Create New Trip
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-heading text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                Your Adventures
              </span>
              <span className="font-sans text-[10px] text-outline italic">
                Hold & drag to reorder
              </span>
            </div>

            <Reorder.Group
              axis="y"
              values={trips}
              onReorder={handleReorder}
              className="space-y-4"
            >
              {trips.map((trip) => {
                const total = trip.total_items || 0;
                const packed = trip.packed_items || 0;
                const remaining = total - packed;
                const progress =
                  total > 0 ? Math.round((packed / total) * 100) : 0;

                const isUrgent =
                  trip.departure_at &&
                  new Date(trip.departure_at).getTime() - new Date().getTime() <
                    24 * 60 * 60 * 1000 &&
                  new Date(trip.departure_at).getTime() - new Date().getTime() >
                    0;

                return (
                  <Reorder.Item
                    key={trip.id}
                    value={trip}
                    className="relative group"
                  >
                    <div
                      onClick={() => router.push(`/trip/${trip.id}`)}
                      className={cn(
                        "flex flex-col bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm p-5 space-y-4 cursor-pointer active:scale-[0.98] transition-all overflow-hidden relative",
                        "hover:border-primary/20",
                        isUrgent && "border-error/30 bg-error/[0.02]",
                      )}
                    >
                      {/* Urgency Badge */}
                      {isUrgent && (
                        <div className="absolute top-0 right-0 left-0 h-1 bg-error animate-pulse z-20" />
                      )}

                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-outline group-hover:text-primary transition-colors shrink-0">
                          <GripVertical
                            size={20}
                            className="opacity-20 group-hover:opacity-100"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-body-base font-bold text-on-surface truncate leading-tight">
                              {trip.title}
                            </h3>
                            {isUrgent && (
                              <span className="flex items-center gap-1 bg-error text-white text-[8px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                                <Zap size={8} fill="currentColor" /> URGENT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            {trip.departure_at ? (
                              <Countdown date={trip.departure_at} />
                            ) : (
                              <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-outline" />
                                <p className="font-sans text-[10px] text-outline font-medium">
                                  Set Departure
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => openEdit(e, trip)}
                            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, trip.id)}
                            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-error/60 hover:text-error transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="pt-2 border-t border-outline-variant/10">
                        <ProgressBar packedCount={packed} totalCount={total} />

                        <div className="relative mt-2">
                          {isUrgent && progress < 100 && (
                            <div className="absolute -right-1 -top-12 flex flex-col items-end">
                              <div className="bg-error text-white text-[9px] px-2 py-1 rounded-lg rounded-br-none shadow-lg animate-pulse font-bold flex items-center gap-1">
                                <AlertTriangle size={10} /> Finish packing!
                              </div>
                            </div>
                          )}
                          {/* {progress === 100 && (
                            <div className="absolute -right-1 -top-12">
                              <div className="bg-primary text-white text-[9px] px-2 py-1 rounded-lg rounded-br-none shadow-lg font-bold">
                                All set! ✈️
                              </div>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>

            <div
              onClick={() => {
                setTripTitle("");
                setDepartureAt("");
                setIsCreating(true);
              }}
              className="flex flex-col items-center justify-center bg-surface border-2 border-dashed border-outline-variant/50 rounded-3xl p-6 min-h-24 group cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-outline group-hover:bg-primary group-hover:text-on-primary transition-all">
                <Plus size={20} />
              </div>
              <p className="font-heading text-[11px] font-bold text-outline mt-2 group-hover:text-primary uppercase tracking-widest">
                New Adventure
              </p>
            </div>
            {/* Stats Section */}
            <div className="bg-primary-fixed dark:bg-primary-container rounded-[2rem] p-6 flex items-center justify-between overflow-hidden relative shadow-lg shadow-primary/5">
              <div className="relative z-10">
                <p className="font-heading text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
                  Traveler Profile
                </p>
                <div className="flex items-baseline gap-4">
                  <div>
                    <p className="font-heading text-h2 font-bold text-on-surface leading-tight">
                      {trips.length}
                    </p>
                    <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase opacity-60">
                      Trips
                    </p>
                  </div>
                  <div className="w-px h-8 bg-outline-variant/30" />
                  <div>
                    <p className="font-heading text-h2 font-bold text-on-surface leading-tight">
                      {trips.reduce((acc, t) => acc + (t.total_items || 0), 0)}
                    </p>
                    <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase opacity-60">
                      Total Items
                    </p>
                  </div>
                </div>
                <p className="font-sans text-body-sm text-on-surface-variant opacity-80 mt-3 italic">
                  Ready for your next adventure
                </p>
              </div>
              <span className="material-symbols-outlined text-[70px] text-primary opacity-10 absolute -right-2 -bottom-2 rotate-12">
                travel_explore
              </span>
            </div>
          </div>
        )}
      </main>

      <BottomNav />

      <button
        onClick={() => {
          setTripTitle("");
          setDepartureAt("");
          setIsCreating(true);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-40 group"
      >
        <Plus
          size={32}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* Dialogs... */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-[320px] rounded-[2rem] p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-h2 font-bold">
              New Adventure
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-primary ml-1">
                Destination Name
              </Label>
              <Input
                placeholder="Where are we going?"
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                className="rounded-2xl h-12 bg-surface-container-low border-outline-variant/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-primary ml-1">
                Departure Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={departureAt}
                onChange={(e) => setDepartureAt(e.target.value)}
                className="rounded-2xl h-12 bg-surface-container-low border-outline-variant/30 text-body-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={isProcessing || !tripTitle.trim()}
              className="w-full rounded-2xl h-13 font-bold shadow-lg shadow-primary/20"
            >
              {isProcessing ? "Creating..." : "Start Planning"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTrip} onOpenChange={() => setEditingTrip(null)}>
        <DialogContent className="max-w-[320px] rounded-[2rem] p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-h2 font-bold">
              Edit Trip
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-primary ml-1">
                Destination Name
              </Label>
              <Input
                placeholder="Update destination"
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                className="rounded-2xl h-12 bg-surface-container-low border-outline-variant/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-primary ml-1">
                Update Departure
              </Label>
              <Input
                type="datetime-local"
                value={departureAt}
                onChange={(e) => setDepartureAt(e.target.value)}
                className="rounded-2xl h-12 bg-surface-container-low border-outline-variant/30 text-body-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdate}
              disabled={isProcessing || !tripTitle.trim()}
              className="w-full rounded-2xl h-13 font-bold shadow-lg shadow-primary/20"
            >
              {isProcessing ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
