"use client";

import { Item, ItemStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { updateItemStatus, deleteItem, updateItem } from "@/lib/actions";
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
import { Edit2, Trash2, AlertCircle, CheckCircle2, Box, Circle, RefreshCw } from "lucide-react";

const STATUS_ORDER: ItemStatus[] = ["prepare", "ready", "packing", "unpacked"];

const STATUS_LABELS: Record<ItemStatus, string> = {
  prepare: "Prepare",
  ready: "Ready",
  packing: "Packing",
  unpacked: "Unpacked"
};

export function ItemCard({
  item,
  onDelete,
  onUpdate,
}: {
  item: Item;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Item>) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    const currentIndex = STATUS_ORDER.indexOf(item.status);
    const nextStatus = STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length];
    
    try {
      if (onUpdate) onUpdate(item.id, { status: nextStatus });
      await updateItemStatus(item.id, nextStatus);
      toast.success(`Status: ${STATUS_LABELS[nextStatus]}`);
    } catch (e) {
      toast.error("Gagal memperbarui status");
    }
  };

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
      await deleteItem(item.id);
      toast.success("Barang dihapus");
    } catch (e) {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-1 group">
      <div
        onClick={handleStatusChange}
        className={cn(
          "relative z-10 flex items-center justify-between p-4 border transition-all duration-300 rounded-2xl cursor-pointer",
          item.status === "packing" 
            ? "bg-primary/10 border-primary/20 shadow-sm"
            : item.status === "ready"
              ? "bg-secondary/10 border-secondary/20 shadow-sm"
              : item.status === "unpacked"
                ? "bg-error/5 border-error/10 opacity-70"
                : "bg-surface border-outline-variant/30 shadow-sm hover:shadow-md hover:border-outline-variant/50"
        )}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 transition-transform">
            {item.status === "packing" ? (
              <CheckCircle2 className="w-7 h-7 text-primary drop-shadow-sm" />
            ) : item.status === "ready" ? (
              <Box className="w-7 h-7 text-secondary drop-shadow-sm" />
            ) : item.status === "unpacked" ? (
              <RefreshCw className="w-7 h-7 text-error/60" />
            ) : (
              <Circle className="w-7 h-7 text-outline-variant/60" />
            )}
          </div>
          
          <div className="flex-1 min-w-0 pr-4">
            <p className={cn(
              "font-heading text-body-lg font-bold text-on-surface truncate transition-all",
              item.status === "packing" && "line-through opacity-50 font-medium"
            )}>
              {item.name}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                item.status === "packing" 
                  ? "bg-primary/15 text-primary" 
                  : item.status === "ready" 
                    ? "bg-secondary/15 text-secondary" 
                    : item.status === "unpacked"
                      ? "bg-error/15 text-error"
                      : "bg-outline-variant/20 text-outline"
              )}>
                {STATUS_LABELS[item.status]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowEdit(true); }}
              className="w-10 h-10 flex items-center justify-center rounded-full text-outline hover:bg-surface-container-high transition-colors active:scale-90 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
               <Edit2 className="w-[18px] h-[18px]" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="w-10 h-10 flex items-center justify-center rounded-full text-error/80 hover:bg-error/10 transition-colors active:scale-90 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
               <Trash2 className="w-[18px] h-[18px]" />
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
