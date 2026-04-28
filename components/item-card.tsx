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
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const status = item.is_packed 
    ? "packed" 
    : item.is_prepared 
      ? "ready" 
      : "prepare";

  const handleStatusChange = async () => {
    try {
      if (status === "prepare") {
        await togglePrepared(item.id, true, tripId);
        toast.success("Ready for packing!");
      } else if (status === "ready") {
        await togglePacked(item.id, true, tripId);
        toast.success("Packed!");
      } else if (status === "packed") {
        await togglePacked(item.id, false, tripId);
        toast.success("Unpacked!");
      }
    } catch (e) {
      toast.error("Status update failed");
    }
  };

  const handleReset = async () => {
    try {
       await togglePrepared(item.id, false, tripId);
       await togglePacked(item.id, false, tripId);
       toast.success("Reset to prepare");
    } catch (e) {
       toast.error("Reset failed");
    }
  }

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
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-error text-on-error rounded-2xl cursor-pointer"
        onClick={() => setShowConfirm(true)}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="material-symbols-outlined mb-1">delete</span>
          <span className="text-[10px] font-bold uppercase">Hapus</span>
        </div>
      </motion.div>

      <motion.div
        drag="x"
        style={{ x }}
        dragControls={dragControls}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.05}
        className={cn(
          "relative z-10 flex items-center justify-between p-md border transition-all rounded-2xl",
          status === "packed" 
            ? "bg-primary/10 border-primary/30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            : status === "ready"
              ? "bg-secondary/10 border-secondary/30 shadow-sm"
              : "bg-surface-container-lowest border-outline-variant/30 shadow-sm"
        )}
      >
        <div className="flex items-center gap-md flex-1 min-w-0">
          <button 
            onClick={handleStatusChange}
            className="flex-shrink-0 active:scale-90 transition-transform"
          >
            <span 
              className={cn(
                "material-symbols-outlined text-[28px]",
                status === "packed" ? "text-primary" : status === "ready" ? "text-secondary" : "text-outline-variant"
              )}
              style={{ fontVariationSettings: status !== "prepare" ? "'FILL' 1" : "'FILL' 0" }}
            >
              {status === "packed" ? "check_circle" : status === "ready" ? "inventory_2" : "radio_button_unchecked"}
            </span>
          </button>
          
          <div className="flex-1 min-w-0" onPointerDown={(e) => dragControls.start(e)}>
            <p className={cn(
              "font-heading text-body-base font-semibold text-on-surface truncate",
              status === "packed" && "line-through opacity-60"
            )}>
              {item.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tight",
                item.owner?.toLowerCase() === "me" 
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-secondary-container text-on-secondary-container"
              )}>
                {item.owner || "SHARED"}
              </span>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tight ml-1",
                status === "packed" 
                  ? "bg-primary/10 text-primary" 
                  : status === "ready" 
                    ? "bg-secondary/10 text-secondary" 
                    : "bg-outline-variant/20 text-outline"
              )}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
           {status !== "prepare" && (
             <button 
               onClick={handleReset}
               className="w-9 h-9 flex items-center justify-center rounded-full text-outline hover:bg-surface-container-high transition-colors active:scale-90"
             >
                <span className="material-symbols-outlined text-[18px]">undo</span>
             </button>
           )}
           <button 
              onClick={handleStatusChange}
              className={cn(
                "px-3 h-9 flex items-center justify-center rounded-2xl transition-all active:scale-95 font-heading text-[11px] font-bold",
                status === "packed" 
                  ? "bg-primary text-on-primary text-white" 
                  : status === "ready" 
                    ? "bg-secondary text-on-secondary shadow-lg shadow-secondary/20 text-white" 
                    : "bg-surface-container-high text-on-surface text-[12px]"
              )}
            >
              {status === "packed" ? "Unpack" : status === "ready" ? "Pack Now" : "Ready?"}
            </button>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-[400px] w-[90vw] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-lg text-center space-y-md">
            <div className="mx-auto w-16 h-16 rounded-full bg-error-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-[32px]">warning</span>
            </div>
            <div>
               <DialogTitle className="font-heading text-h1 font-bold text-on-surface">Hapus Barang?</DialogTitle>
               <DialogDescription className="font-sans text-body-sm text-outline mt-2">
                 Apakah Anda yakin ingin menghapus <strong>{item.name}</strong>? Tindakan ini tidak dapat dibatalkan.
               </DialogDescription>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="rounded-2xl h-14 font-heading font-bold shadow-lg shadow-error/20"
              >
                Ya, Hapus Sekarang
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                className="rounded-2xl h-12 text-outline font-bold"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
