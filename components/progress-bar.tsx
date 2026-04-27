"use client";

import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export function ProgressBar({
  packedCount,
  totalCount,
  isSticky = false,
}: {
  packedCount: number;
  totalCount: number;
  isSticky?: boolean;
}) {
  const percentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  return (
    <div className="w-full space-y-lg pt-base">
      <div className="flex items-end justify-between">
        <div>
          <span className="font-heading text-[10px] font-bold text-primary tracking-[0.2em] uppercase block mb-xs">
            PACKING PROGRESS
          </span>
          <h2 className="font-heading text-h1 font-bold text-on-surface">
            {Math.round(percentage)}% Packed
          </h2>
        </div>
        <div className="text-right">
          <span className="font-sans text-body-sm text-outline font-medium">
            {packedCount} of {totalCount} items
          </span>
        </div>
      </div>
      
      {/* ProgressBar component as used in content cards */}
      {!isSticky && (
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(0,88,190,0.3)]"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
    </div>
  );
}
