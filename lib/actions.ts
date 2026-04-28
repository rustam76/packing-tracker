"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Category, Item, Trip, Owner } from "./types";

// --- Trip Actions ---

export async function createTrip(title: string, departure_at?: string): Promise<Trip> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("trips")
    .insert([{ title, departure_at, user_id: user?.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/");
  return data;
}

export async function updateTrip(id: string, updates: { title?: string; departure_at?: string }): Promise<Trip> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  
  const { data, error } = await supabase
    .from("trips")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/trip/${id}`);
  return data;
}

export async function deleteTrip(id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  
  const { error } = await supabase
    .from("trips")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function getTrips(): Promise<(Trip & { total_items: number; packed_items: number })[]> {
  const supabase = await createClient();
  if (!supabase.from) return [];

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("trips")
    .select(`
      *,
      items:items(id, is_packed)
    `)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    // If sort_order doesn't exist yet, fallback to created_at
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("trips")
      .select(`
        *,
        items:items(id, is_packed)
      `)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    if (fallbackError) throw new Error(fallbackError.message);
    
    return (fallbackData || []).map(trip => ({
      ...trip,
      total_items: trip.items?.length || 0,
      packed_items: trip.items?.filter((item: any) => item.is_packed).length || 0
    }));
  }

  return (data || []).map(trip => ({
    ...trip,
    total_items: trip.items?.length || 0,
    packed_items: trip.items?.filter((item: any) => item.is_packed).length || 0
  }));
}

// --- Category Actions ---

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${category.trip_id}`);
  revalidatePath("/");
  return data;
}

export async function updateCategory(id: string, updates: Partial<Category>, trip_id: string): Promise<Category> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
  revalidatePath("/");
  return data;
}

export async function deleteCategory(id: string, trip_id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
  revalidatePath("/");
}

// --- Item Actions ---

export async function createItem(item: Partial<Item>): Promise<Item> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("items")
    .insert([item])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${item.trip_id}`);
  revalidatePath("/");
  return data;
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<Item> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${data.trip_id}`);
  revalidatePath("/");
  return data;
}

export async function deleteItem(id: string, trip_id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
  revalidatePath("/");
}

export async function togglePrepared(id: string, is_prepared: boolean, trip_id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase
    .from("items")
    .update({ is_prepared })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
  revalidatePath("/");
}

export async function togglePacked(id: string, is_packed: boolean, trip_id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase
    .from("items")
    .update({ is_packed })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
  revalidatePath("/");
}

// --- Invitation Actions ---

export async function inviteUser(trip_id: string, email: string) {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  
  const { data, error } = await supabase
    .from("trip_invitations")
    .insert([{ trip_id, email, status: "pending" }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function joinTripByCode(code: string) {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");

  const { data: invitation, error: inviteError } = await supabase
    .from("trip_invitations")
    .select("*")
    .eq("id", code)
    .eq("status", "pending")
    .single();

  if (inviteError || !invitation) throw new Error("Invalid or expired invitation code");

  await supabase
    .from("trip_invitations")
    .update({ status: "accepted" })
    .eq("id", code);

  revalidatePath("/shared");
  return invitation;
}

export async function reorderTrips(tripIds: string[]): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");

  const updates = tripIds.map((id, index) => 
    supabase.from("trips").update({ sort_order: index }).eq("id", id)
  );

  await Promise.all(updates);
  revalidatePath("/");
}
