export interface Trip {
  id: string;
  title: string;
  created_at: string;
}

export interface Category {
  id: string;
  trip_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Item {
  id: string;
  trip_id: string;
  category_id: string | null;
  name: string;
  is_prepared: boolean;
  is_packed: boolean;
  notes: string | null;
  created_at: string;
  // Joined
  category?: Category;
}

export type FilterType = "all" | "prepared" | "packed" | "unpacked";
