"use client";

import { AdminModal } from "./AdminModal";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  loading,
}: DeleteConfirmModalProps) {
  return (
    <AdminModal open={open} onOpenChange={onOpenChange} title="Confirm Delete">
      <p className="text-stone-600 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-medium text-stone-800">"{itemName}"</span>? This
        action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </AdminModal>
  );
}
