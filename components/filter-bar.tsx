"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterType } from "@/lib/types";

export function FilterBar({
  value,
  onChange,
}: {
  value: FilterType;
  onChange: (val: FilterType) => void;
}) {
  return (
    <div className="flex justify-center w-full">
      <Tabs value={value} onValueChange={(val) => onChange(val as FilterType)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-10 rounded-full p-1 bg-muted/50">
          <TabsTrigger value="all" className="rounded-full text-xs sm:text-sm">All</TabsTrigger>
          <TabsTrigger value="prepared" className="rounded-full text-xs sm:text-sm">Ready</TabsTrigger>
          <TabsTrigger value="packed" className="rounded-full text-xs sm:text-sm">Packed</TabsTrigger>
          <TabsTrigger value="unpacked" className="rounded-full text-xs sm:text-sm">Left</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
