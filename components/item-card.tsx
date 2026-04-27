"use client";

import { Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  motion,
  useDragControls,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Check,
  Package,
  Trash2,
  GripVertical,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { togglePacked, togglePrepared, deleteItem } from "@/lib/actions";
import { toast } from "sonner";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export function ItemCard({
  item,
  tripId,
  categoryColor,
  onDelete,
}: {
  item: Item;
  tripId: string;
  categoryColor?: string;
  onDelete?: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  // Track x movement for background opacity
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-60, 0], [1, 0]);

  const handleTogglePrepared = async () => {
    try {
      await togglePrepared(item.id, !item.is_prepared, tripId);
      toast.success(item.is_prepared ? "Un-prepared" : "Prepared!");
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const handleTogglePacked = async () => {
    try {
      await togglePacked(item.id, !item.is_packed, tripId);
      toast.success(item.is_packed ? "Un-packed" : "Packed!");
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const confirmDelete = async () => {
    try {
      if (onDelete) onDelete(item.id);
      setIsDeleting(true);
      setShowConfirm(false);
      await deleteItem(item.id, tripId);
    } catch (e) {
      toast.error("Delete failed");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-1"
      ref={constraintsRef}
    >
      {/* Background Delete Button - Revealed on swipe */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-destructive text-destructive-foreground rounded-2xl cursor-pointer"
        onClick={() => setShowConfirm(true)}
      >
        <div className="flex flex-col items-center gap-1">
          <Trash2 className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase">Hapus</span>
        </div>
      </motion.div>

      <motion.div
        drag="x"
        style={{ x }}
        dragControls={dragControls}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          // If swiped significantly, snap to the revealed state
          if (info.offset.x < -40) {
            // Keep it open
          } else {
            // Spring back handled by motion
          }
        }}
        className={cn(
          "relative z-10 flex items-center gap-3 p-4 bg-card border-l-4 transition-all shadow-sm rounded-2xl",
          item.is_packed && "opacity-60 grayscale-[0.5]",
        )}
        style={{ borderLeftColor: categoryColor || "transparent" }}
      >
        <div
          className="cursor-grab active:cursor-grabbing text-muted-foreground mr-1"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[32px]">
          <button
            onClick={handleTogglePrepared}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
              item.is_prepared
                ? "bg-green-500 border-green-500 text-white"
                : "border-muted-foreground/30 hover:border-green-500",
            )}
          >
            {item.is_prepared && <Check className="h-4 w-4" />}
          </button>
        </div>

        <div
          className="flex-1 min-w-0"
          onDoubleClick={() => setShowConfirm(true)}
        >
          <p
            className={cn(
              "font-medium truncate transition-all",
              item.is_packed && "line-through text-muted-foreground",
            )}
          >
            {item.name}
          </p>
          {item.notes && (
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Info className="h-3 w-3" /> {item.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={cn(
              "text-[12px] font-bold uppercase tracking-tighter",
              item.is_packed
                ? "bg-primary text-white"
                : item.is_prepared
                  ? "bg-green-500 text-white"
                  : "bg-amber-500 text-white",
            )}
          >
            {item.is_packed ? "Packed" : item.is_prepared ? "Ready" : "Prepare"}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3 text-[10px] uppercase font-bold border-none",
              item.owner === "me"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
            )}
          >
            {item.owner}
          </Badge>

          <button
            onClick={handleTogglePacked}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl transition-all shadow-md",
              item.is_packed
                ? "bg-primary text-primary-foreground scale-95"
                : "bg-background border border-border hover:bg-muted",
            )}
          >
            <Package
              className={cn(
                "h-5 w-5",
                !item.is_packed && "text-muted-foreground",
              )}
            />
          </button>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-[90vw] rounded-3xl">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Hapus Barang?</DialogTitle>
            <DialogDescription className="text-center">
              Apakah Anda yakin ingin menghapus <strong>{item.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="rounded-xl h-12"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="rounded-xl h-12 shadow-lg shadow-destructive/20"
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
