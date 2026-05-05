import { Pencil, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminItemRowProps {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminItemRow({ label, onEdit, onDelete }: AdminItemRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <span className="text-stone-700 text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit">
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          aria-label="Delete"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Minus />
        </Button>
      </div>
    </div>
  );
}
