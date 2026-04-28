"use client";

import { useTrips } from "@/lib/hooks/useTrips";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, MapPin, Edit2, Trash2 } from "lucide-react";
import { createTrip, updateTrip, deleteTrip } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { cn } from "@/lib/utils";

export function TripSelector({ activeTripId, onSelect }: { activeTripId?: string; onSelect: (id: string) => void }) {
  const { trips, loading } = useTrips();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tripTitle, setTripTitle] = useState("");
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeTrip = trips.find((t) => t.id === activeTripId);

  const handleCreateTrip = async () => {
    if (!tripTitle.trim()) return;
    setIsProcessing(true);
    try {
      const trip = await createTrip(tripTitle);
      onSelect(trip.id);
      setIsCreateOpen(false);
      setTripTitle("");
      toast.success("Trip created!");
    } catch (e) {
      toast.error("Failed to create trip");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTrip = async () => {
    if (!tripTitle.trim() || !editingTrip) return;
    setIsProcessing(true);
    try {
      await updateTrip(editingTrip.id, { title: tripTitle });
      setIsEditOpen(false);
      setEditingTrip(null);
      setTripTitle("");
      toast.success("Trip updated!");
    } catch (e) {
      toast.error("Failed to update trip");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTrip = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      await deleteTrip(id);
      toast.success("Trip deleted");
      if (activeTripId === id) {
        // Redirect to first available trip or home
        const otherTrips = trips.filter(t => t.id !== id);
        if (otherTrips.length > 0) {
          onSelect(otherTrips[0].id);
        }
      }
    } catch (e) {
      toast.error("Failed to delete trip");
    }
  };

  const openEdit = (e: React.MouseEvent, trip: any) => {
    e.stopPropagation();
    setEditingTrip(trip);
    setTripTitle(trip.title);
    setIsEditOpen(true);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-background/50 backdrop-blur-md border-none shadow-none text-lg font-bold p-0 px-2 h-auto">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="truncate max-w-[120px]">{activeTrip ? activeTrip.title : "Select Trip"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 rounded-3xl p-2 shadow-2xl border-none" align="start">
          <DropdownMenuLabel className="font-heading text-[10px] font-bold text-outline uppercase tracking-widest px-3 py-2">My Trips</DropdownMenuLabel>
          <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1">
            {loading ? (
              <div className="p-4 text-center opacity-30">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : trips.length === 0 ? (
              <p className="p-4 text-center text-xs text-outline">No trips yet.</p>
            ) : (
              trips.map((trip) => (
                <div 
                  key={trip.id}
                  className={cn(
                    "group flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-colors",
                    activeTripId === trip.id ? "bg-primary/10 text-primary" : "hover:bg-surface-container-low"
                  )}
                  onClick={() => onSelect(trip.id)}
                >
                  <span className="font-heading text-body-sm font-semibold truncate flex-1">{trip.title}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => openEdit(e, trip)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-high text-outline"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteTrip(e, trip.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-error/10 text-error/60"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <DropdownMenuSeparator className="my-2 bg-outline-variant/10" />
          
          <button 
            onClick={() => {
              setTripTitle("");
              setIsCreateOpen(true);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/5 text-primary transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span className="font-heading text-body-sm font-bold">Create New Trip</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-[320px] rounded-3xl p-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-h2 font-bold">New Trip</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Where are we going?"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTrip()}
              className="rounded-2xl h-12 bg-surface-container-low border-outline-variant/30"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCreateTrip} 
              disabled={isProcessing || !tripTitle.trim()}
              className="w-full rounded-2xl h-12 font-bold"
            >
              {isProcessing ? "Creating..." : "Create Trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-[320px] rounded-3xl p-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-h2 font-bold">Edit Trip</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Update trip title"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateTrip()}
              className="rounded-2xl h-12 bg-surface-container-low border-outline-variant/30"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleUpdateTrip} 
              disabled={isProcessing || !tripTitle.trim()}
              className="w-full rounded-2xl h-12 font-bold"
            >
              {isProcessing ? "Updating..." : "Update Title"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
