export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export type ItemStatus = "prepare" | "ready" | "packing" | "unpacked";

export interface Item {
  id: string;
  category_id: string | null;
  name: string;
  status: ItemStatus;
  notes: string | null;
  created_at: string;
  // Joined
  category?: Category;
}

export type FilterType = "all" | ItemStatus;
