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
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto h-16 flex items-center gap-2 bg-card border rounded-full px-2 py-2 shadow-2xl backdrop-blur-xl">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-muted shrink-0">
               <div className="h-4 w-4 rounded-full" style={{ backgroundColor: selectedCategory?.color || '#cbd5e1' }} />
             </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => setCategoryId(null)}>No Category</DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem key={cat.id} onClick={() => setCategoryId(cat.id)}>
                <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          placeholder={`Add item to ${selectedCategory?.name || 'list'}...`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base"
        />

        <div className="flex items-center gap-1 shrink-0 bg-muted/30 p-1 rounded-full mr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOwner("me")}
            className={cn(
              "rounded-full h-8 px-3 text-xs transition-all",
              owner === "me" ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground"
            )}
          >
            Me
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOwner("partner")}
            className={cn(
              "rounded-full h-8 px-3 text-xs transition-all",
              owner === "partner" ? "bg-pink-500 text-white shadow-sm" : "text-muted-foreground"
            )}
          >
            P
          </Button>
        </div>

        <Button
          onClick={handleAdd}
          disabled={!name.trim() || loading}
          className="rounded-full h-12 w-12 p-0 shadow-lg shrink-0"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
