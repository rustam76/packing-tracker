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
import { ChevronDown, Plus, MapPin } from "lucide-react";
import { createTrip } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";

export function TripSelector({ activeTripId, onSelect }: { activeTripId?: string; onSelect: (id: string) => void }) {
  const { trips, loading } = useTrips();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState("");

  const activeTrip = trips.find((t) => t.id === activeTripId);

  const handleCreateTrip = async () => {
    if (!newTripTitle.trim()) return;
    try {
      const trip = await createTrip(newTripTitle);
      onSelect(trip.id);
      setIsDialogOpen(false);
      setNewTripTitle("");
      toast.success("Trip created!");
    } catch (e) {
      toast.error("Failed to create trip");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-background/50 backdrop-blur-md border-none shadow-none text-lg font-bold">
            <MapPin className="h-5 w-5 text-primary" />
            {activeTrip ? activeTrip.title : "Select Trip"}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Current Trips</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {loading ? (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          ) : (
            trips.map((trip) => (
              <DropdownMenuItem
                key={trip.id}
                onClick={() => onSelect(trip.id)}
                className="flex items-center gap-2"
              >
                {trip.title}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-primary font-medium">
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Where are we going?"
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateTrip()}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTrip}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
