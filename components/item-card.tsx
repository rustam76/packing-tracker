"use client";

import { Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { togglePacked, togglePrepared, deleteItem, updateItem } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Edit2, Trash2, Undo2, AlertCircle, CheckCircle2, Box, Circle } from "lucide-react";

export function ItemCard({
  item,
  tripId,
  categoryColor,
  onDelete,
  onUpdate,
}: {
  item: Item;
  tripId: string;
  categoryColor?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Item>) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [isUpdating, setIsUpdating] = useState(false);

  const status = item.is_packed 
    ? "packed" 
    : item.is_prepared 
      ? "ready" 
      : "prepare";

  const handleStatusChange = async () => {
    try {
      if (status === "prepare") {
        if (onUpdate) onUpdate(item.id, { is_prepared: true });
        await togglePrepared(item.id, true, tripId);
        toast.success("Siap untuk dipacking!");
      } else if (status === "ready") {
        if (onUpdate) onUpdate(item.id, { is_packed: true });
        await togglePacked(item.id, true, tripId);
        toast.success("Sudah dipacking!");
      } else if (status === "packed") {
        if (onUpdate) onUpdate(item.id, { is_packed: false });
        await togglePacked(item.id, false, tripId);
        toast.success("Batal packing!");
      }
    } catch (e) {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleReset = async () => {
    try {
       if (onUpdate) onUpdate(item.id, { is_prepared: false, is_packed: false });
       await togglePrepared(item.id, false, tripId);
       await togglePacked(item.id, false, tripId);
       toast.success("Reset ke awal");
    } catch (e) {
       toast.error("Gagal reset");
    }
  }

  const handleUpdate = async () => {
    if (!editName.trim() || isUpdating) return;
    setIsUpdating(true);
    try {
      if (onUpdate) onUpdate(item.id, { name: editName.trim() });
      await updateItem(item.id, { name: editName.trim() });
      setShowEdit(false);
      toast.success("Barang diperbarui!");
    } catch (e) {
      toast.error("Gagal memperbarui barang");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    try {
      if (onDelete) onDelete(item.id);
      setShowConfirm(false);
      await deleteItem(item.id, tripId);
    } catch (e) {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-1 group">
      <div
        className={cn(
          "relative z-10 flex items-center justify-between p-md border transition-all duration-300 rounded-2xl",
          status === "packed" 
            ? "bg-primary-fixed/30 border-primary-fixed shadow-sm"
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
            {status === "packed" ? (
              <CheckCircle2 className="w-8 h-8 text-primary" />
            ) : status === "ready" ? (
              <Box className="w-8 h-8 text-secondary" />
            ) : (
              <Circle className="w-8 h-8 text-outline-variant" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-heading text-body-base font-semibold text-on-surface truncate",
              status === "packed" && "line-through opacity-60"
            )}>
              {item.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tight",
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

        <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setShowEdit(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-outline hover:bg-surface-container-high transition-colors active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity"
            >
               <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowConfirm(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-error/70 hover:bg-error/10 transition-colors active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity"
            >
               <Trash2 className="w-4 h-4" />
            </button>
            
           {status !== "prepare" && (
             <button 
               onClick={handleReset}
               className="w-9 h-9 flex items-center justify-center rounded-full text-outline hover:bg-surface-container-high transition-colors active:scale-90"
             >
                <Undo2 className="w-4 h-4" />
             </button>
           )}
           <button 
              onClick={handleStatusChange}
              className={cn(
                "px-3 sm:px-4 h-10 flex items-center justify-center rounded-2xl transition-all active:scale-95 font-heading text-[12px] font-bold",
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
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-[400px] w-[90vw] rounded-[32px] p-8 border-none shadow-2xl bg-surface-container-low/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-h1 font-bold text-on-surface">Ubah Barang</DialogTitle>
            <DialogDescription className="text-outline">Perbarui nama barang bawaan Anda.</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Input 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nama barang..."
              className="rounded-2xl h-14 bg-surface-container border-none focus:ring-4 focus:ring-primary/10 text-body-lg font-medium"
            />
          </div>
          <DialogFooter className="flex flex-col gap-3">
            <Button 
              onClick={handleUpdate}
              disabled={!editName.trim() || isUpdating}
              className="rounded-2xl h-14 w-full font-bold text-body-base shadow-lg shadow-primary/20"
            >
              {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowEdit(false)}
              className="rounded-2xl h-12 w-full text-outline font-bold"
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-[400px] w-[90vw] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl bg-surface-container-low/95 backdrop-blur-xl">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-error" />
            </div>
            <div className="space-y-2">
               <DialogTitle className="font-heading text-h1 font-bold text-on-surface">Hapus Barang?</DialogTitle>
               <DialogDescription className="font-sans text-body-base text-outline">
                 Apakah Anda yakin ingin menghapus <strong>{item.name}</strong>? Tindakan ini tidak dapat dibatalkan.
               </DialogDescription>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="rounded-2xl h-14 font-heading font-bold shadow-lg shadow-error/20 text-body-base"
              >
                Ya, Hapus Sekarang
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                className="rounded-2xl h-12 text-outline font-bold hover:bg-black/5"
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
