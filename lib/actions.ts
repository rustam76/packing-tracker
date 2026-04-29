"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Category, Item, ItemStatus } from "./types";

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
  revalidatePath("/");
  return data;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/");
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
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
  revalidatePath("/");
  return data;
}

export async function updateItemStatus(id: string, status: ItemStatus): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase
    .from("items")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function deleteItem(id: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase.from) throw new Error("Supabase not configured");
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
