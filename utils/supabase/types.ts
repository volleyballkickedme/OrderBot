export interface DbCategory {
  id: string;
  category_name: string;
}

export interface DbVariant {
  id: string;
  variant_name: string;
  item_category_id: string;
}

export interface DbMenuItem {
  id: string;
  flavour: string;
  price: number;
  category_id: string;
  item_variant_id: string;
}

export interface DbMenuItemWithJoins extends DbMenuItem {
  menu_item_variants: { variant_name: string } | null;
  item_categories: { category_name: string } | null;
}

// Shape consumed by the order form components
export interface LoafOption {
  menuItemId: string;
  loafName: string;
  price: number;
}

export interface FlavourGroup {
  flavour: string;
  loafOptions: LoafOption[];
}

export interface CategoryGroup {
  id: string;
  label: string;
  flavourGroups: FlavourGroup[];
}
