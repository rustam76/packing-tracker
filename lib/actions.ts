"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Category, Item, Trip, Owner } from "./types";

// --- Trip Actions ---

export async function createTrip(title: string): Promise<Trip> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("trips")
    .insert([{ title }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/");
  return data;
}

export async function getTrips(): Promise<Trip[]> {
  const supabase = await createClient();
  if (!supabase.from) return [];
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// --- Category Actions ---

export async function createCategory(trip_id: string, name: string, color: string): Promise<Category> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("categories")
    .insert([{ trip_id, name, color }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
  return data;
}

export async function updateCategory(id: string, name: string, color: string): Promise<Category> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("categories")
    .update({ name, color })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${data.trip_id}`);
  return data;
}

export async function deleteCategory(id: string, trip_id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
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
  return data;
}

export async function deleteItem(id: string, trip_id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trip/${trip_id}`);
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
}
