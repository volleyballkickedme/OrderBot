import { type CategoryId } from "@/lib/config";
import { cn } from "@/lib/utils";

interface CategoryTabBarProps {
  categories: readonly { id: CategoryId; label: string }[];
  activeCategory: CategoryId;
  onSelect: (id: CategoryId) => void;
}

export function CategoryTabBar({ categories, activeCategory, onSelect }: CategoryTabBarProps) {
  return (
    <div className="overflow-x-auto mb-5 -mx-1">
      <div className="flex gap-1 bg-amber-50 rounded-xl p-1 min-w-max mx-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeCategory === cat.id
                ? "bg-white text-amber-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
