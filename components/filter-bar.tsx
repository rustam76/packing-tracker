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
        <div className="mt-2 flex justify-center gap-2">
           <TabsList className="bg-muted/30 p-1 rounded-full h-8">
              <TabsTrigger value="all" onSelect={() => onChange('all')} className="rounded-full px-4 h-6 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Global</TabsTrigger>
              <TabsTrigger value="me" className="rounded-full px-4 h-6 text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white">Me</TabsTrigger>
              <TabsTrigger value="partner" className="rounded-full px-4 h-6 text-xs data-[state=active]:bg-pink-500 data-[state=active]:text-white">Partner</TabsTrigger>
           </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
