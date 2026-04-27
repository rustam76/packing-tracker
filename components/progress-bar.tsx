"use client";

import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export function ProgressBar({
  packedCount,
  totalCount,
}: {
  packedCount: number;
  totalCount: number;
}) {
  const percentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-muted-foreground">Packing Progress</h3>
          <p className="text-2xl font-bold">
            {packedCount} <span className="text-muted-foreground text-sm font-normal">of</span> {totalCount}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{Math.round(percentage)}%</p>
        </div>
      </div>
      <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="absolute h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
