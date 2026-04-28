"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Trip } from "../types";

export function useSharedTrips() {
  const [sharedTrips, setSharedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    const fetchSharedTrips = async () => {
      setLoading(true);
      try {
        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) {
          setLoading(false);
          return;
        }

        // 2. Fetch invitations for this email that are accepted
        const { data: invitations, error: inviteError } = await supabase
          .from("trip_invitations")
          .select("trip_id")
          .eq("email", user.email)
          .eq("status", "accepted");

        if (inviteError) throw inviteError;

        if (invitations && invitations.length > 0) {
          const tripIds = invitations.map(i => i.trip_id);
          
          // 3. Fetch trip details for those IDs
          const { data: trips, error: tripsError } = await supabase
            .from("trips")
            .select("*")
            .in("id", tripIds)
            .order("created_at", { ascending: false });

          if (tripsError) throw tripsError;
          setSharedTrips(trips as Trip[]);
        }
      } catch (e) {
        console.error("Failed to fetch shared trips:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTrips();
  }, [supabase]);

  return { sharedTrips, loading };
}
