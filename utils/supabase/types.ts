export interface DbCategory {
  id: string;
  category_name: string;
}

export interface DbLoafType {
  id: string;
  loaf_name: string;
}

export interface DbMenuItem {
  id: string;
  flavour: string;
  price: number;
  category_id: string;
  loaf_type_id: string;
}

export interface DbMenuItemWithJoins extends DbMenuItem {
  loaf_types: { loaf_name: string } | null;
  item_categories: { category_name: string } | null;
}

// Shape consumed by admin sections
export interface AdminMenuItem extends DbMenuItemWithJoins {}

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
