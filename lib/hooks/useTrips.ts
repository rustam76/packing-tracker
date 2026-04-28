"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Trip } from "../types";
import { getTrips } from "../actions";

export function useTrips() {
  const [trips, setTrips] = useState<(Trip & { total_items: number; packed_items: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseClient(), []);

  const fetchTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (e) {
      console.error("Failed to fetch trips:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    
    // Subscribe to changes to refresh the counts
    if (supabase.channel) {
      const channelId = Math.random().toString(36).substring(7);
      const channel = supabase
        .channel(`global-sync:${channelId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "trips" },
          () => fetchTrips()
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "items" },
          () => fetchTrips()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase]);

  return { trips, loading };
}
