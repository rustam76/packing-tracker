"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Trip } from "../types";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!supabase.from) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setTrips(data as Trip[]);
        }
      } catch (e) {
        console.error("Failed to fetch trips:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();

    if (supabase.channel) {
      const channelId = Math.random().toString(36).substring(7);
      const channel = supabase
        .channel(`trips:${channelId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "trips",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setTrips((prev) => [payload.new as Trip, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setTrips((prev) =>
                prev.map((trip) =>
                  trip.id === payload.new.id ? { ...trip, ...payload.new } : trip
                )
              );
            } else if (payload.eventType === "DELETE") {
              setTrips((prev) => prev.filter((trip) => trip.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase]);

  return { trips, loading };
}
