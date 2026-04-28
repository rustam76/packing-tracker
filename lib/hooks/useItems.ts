"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Item } from "../types";

export function useItems(tripId: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    if (!tripId) return;

    const fetchItems = async () => {
      if (!supabase.from) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("trip_id", tripId)
          .order("created_at", { ascending: true });

        if (!error && data) {
          setItems(data as Item[]);
        }
      } catch (e) {
        console.error("Failed to fetch items:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    // Subscribe to real-time changes
    if (supabase.channel) {
      const channelId = Math.random().toString(36).substring(7);
      const channel = supabase
        .channel(`items:trip_id=eq.${tripId}:${channelId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "items",
            filter: `trip_id=eq.${tripId}`,
          },
          (payload: any) => {
            if (payload.eventType === "INSERT") {
              setItems((prev) => [...prev, payload.new as Item]);
            } else if (payload.eventType === "UPDATE") {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id ? { ...item, ...payload.new } : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tripId, supabase]);

  return { items, loading, setItems };
}
