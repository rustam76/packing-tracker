"use client";

import { useState } from "react";
import { Plus, User, Users, ChevronRight, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItem } from "@/lib/actions";
import { toast } from "sonner";
import { Owner } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/useCategories";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function AddItemBar({
  tripId,
  defaultCategoryId,
}: {
  tripId: string;
  defaultCategoryId: string | null;
}) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState<Owner>("me");
  const [categoryId, setCategoryId] = useState<string | null>(defaultCategoryId);
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories(tripId);

  const selectedCategory = categories.find(c => c.id === (categoryId || defaultCategoryId));

  const handleAdd = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    try {
      await createItem({
        trip_id: tripId,
        category_id: categoryId || defaultCategoryId,
        name: name.trim(),
        owner,
        is_prepared: false,
        is_packed: false,
      });
      setName("");
      toast.success("Added!");
    } catch (e) {
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[80px] left-0 w-full px-margin-mobile z-50 pointer-events-none">
      <div className="max-w-xl mx-auto pointer-events-auto bg-surface-container border border-outline-variant/30 rounded-full h-12 flex items-center px-sm shadow-2xl backdrop-blur-xl">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <button className="flex-shrink-0 active:scale-95 transition-transform mr-sm">
               <span className="material-symbols-outlined text-outline" data-icon="add_circle">
                add_circle
               </span>
             </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-2xl p-2">
            <DropdownMenuItem onClick={() => setCategoryId(null)} className="rounded-xl">No Category</DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem key={cat.id} onClick={() => setCategoryId(cat.id)} className="rounded-xl flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          placeholder={`Add to ${selectedCategory?.name || 'Essentials'}...`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-grow bg-transparent border-none focus:ring-0 font-sans text-body-base placeholder:text-outline/60 text-on-surface"
          disabled={loading}
        />

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setOwner(owner === "me" ? "partner" : "me")}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all",
              owner === "me" 
                ? "bg-primary-container text-on-primary-container" 
                : "bg-secondary-container text-on-secondary-container"
            )}
          >
            {owner === "me" ? "Me" : "Partner"}
          </button>
          
          <button
            onClick={handleAdd}
            disabled={!name.trim() || loading}
            className="w-9 h-9 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-lg active:scale-90 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="send">
              {loading ? "sync" : "send"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
