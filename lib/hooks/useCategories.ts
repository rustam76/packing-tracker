"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Category } from "../types";

export function useCategories(tripId: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    if (!tripId) return;

    const fetchCategories = async () => {
      if (!supabase.from) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("trip_id", tripId)
          .order("created_at", { ascending: true });

        if (!error && data) {
          setCategories(data as Category[]);
        }
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    if (supabase.channel) {
      // Use a unique channel name to avoid collisions if cleanup is pending
      const channelId = Math.random().toString(36).substring(7);
      const channel = supabase
        .channel(`categories:trip_id=eq.${tripId}:${channelId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "categories",
            filter: `trip_id=eq.${tripId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setCategories((prev) => [...prev, payload.new as Category]);
            } else if (payload.eventType === "UPDATE") {
              setCategories((prev) =>
                prev.map((cat) =>
                  cat.id === payload.new.id ? { ...cat, ...payload.new } : cat
                )
              );
            } else if (payload.eventType === "DELETE") {
              setCategories((prev) => prev.filter((cat) => cat.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tripId, supabase]);

  return { categories, loading };
}
