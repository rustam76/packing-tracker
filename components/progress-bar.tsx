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
    <div className="w-full space-y-3 pt-2">
      <div className="flex items-end justify-between">
        <div>
          <span className="font-heading text-[10px] font-bold text-primary tracking-[0.2em] uppercase block mb-1">
            PACKING PROGRESS
          </span>
          <h2 className="font-heading text-h2 font-bold text-on-surface leading-none">
            {Math.round(percentage)}% Packed
          </h2>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-sans text-[12px] text-on-surface font-bold">
            {packedCount} / {totalCount}
          </span>
          <span className="font-sans text-[9px] text-outline uppercase font-bold tracking-tighter">
            Items Packed
          </span>
        </div>
      </div>
      
      {/* ProgressBar component as used in content cards */}
      {!isSticky && (
        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden shadow-inner border border-outline-variant/10">
          <motion.div
            className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary-rgb,0,88,190),0.3)]"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
    </div>
  );
}
