export const PRODUCT_CATEGORIES = [
  {
    id: "bread",
    label: "Sourdough Bread",
    items: [
      { id: "plain", label: "Plain", price: 10 },
      { id: "cranberrywalnut", label: "Cranberry & Walnut", price: 14 },
      { id: "redyeastcranberry", label: "Red Yeast & Cranberry", price: 14 },
      { id: "cinnamonchocolate", label: "Cinnamon Chocolate", price: 14 },
      { id: "apricotraisin", label: "Apricot & Raisin", price: 14 },
      { id: "walnutapricot", label: "Walnut & Apricot", price: 14 },
      // { id: "matcharaisinalmond", label: "Matcha Raisin & Almond", price: 14 },
      { id: "olivewalnut", label: "Olive & Walnut", price: 14 },
      { id: "olive", label: "Olive", price: 14 },
      { id: "cranberry", label: "Cranberry", price: 14 },
      { id: "walnut", label: "Walnut", price: 14 },
    ],
    flavours: ["Rustic Loaf", "Sandwich Loaf"],
  },
  // {
  //   id: "cake",
  //   label: "Test Cakes",
  //   items: [
  //     { id: "vanilla", label: "Vanilla", price: 8 },
  //     { id: "chocolate", label: "Chocolate", price: 9 },
  //     { id: "matcha", label: "Matcha", price: 10 },
  //   ],
  //   flavours: ["Regular", "Mini"],
  // },
  // {
  //   id: "cookies",
  //   label: "Test Cookies",
  //   items: [
  //     { id: "butter", label: "Butter", price: 5 },
  //     { id: "oatmeal", label: "Oatmeal", price: 6 },
  //     { id: "chocochip", label: "Chocolate Chip", price: 6 },
  //   ],
  //   flavours: ["Classic", "Premium"],
  // },
  // {
  //   id: "muffins",
  //   label: "Test Muffins",
  //   items: [
  //     { id: "blueberry", label: "Blueberry", price: 7 },
  //     { id: "banana", label: "Banana", price: 7 },
  //     { id: "doublechoc", label: "Double Chocolate", price: 8 },
  //   ],
  //   flavours: ["Standard", "Deluxe"],
  // },
  // {
  //   id: "brownies",
  //   label: "Test Brownies",
  //   items: [
  //     { id: "classic", label: "Classic", price: 8 },
  //     { id: "walnutfudge", label: "Walnut Fudge", price: 9 },
  //     { id: "saltedcaramel", label: "Salted Caramel", price: 9 },
  //   ],
  //   flavours: ["Bite", "Bar"],
  // },
  // {
  //   id: "pastries",
  //   label: "Test Pastries",
  //   items: [
  //     { id: "croissant", label: "Croissant", price: 6 },
  //     { id: "painauchocolat", label: "Pain au Chocolat", price: 7 },
  //     { id: "almondtwist", label: "Almond Twist", price: 7 },
  //   ],
  //   flavours: ["Fresh", "Buttery"],
  // },
  // {
  //   id: "tarts",
  //   label: "Test Tarts",
  //   items: [
  //     { id: "lemon", label: "Lemon", price: 9 },
  //     { id: "apple", label: "Apple", price: 9 },
  //     { id: "berry", label: "Mixed Berry", price: 10 },
  //   ],
  //   flavours: ["Single", "Family"],
  // },
  // {
  //   id: "donuts",
  //   label: "Test Donuts",
  //   items: [
  //     { id: "glazed", label: "Glazed", price: 5 },
  //     { id: "cinnamon", label: "Cinnamon Sugar", price: 6 },
  //     { id: "strawberry", label: "Strawberry", price: 6 },
  //   ],
  //   flavours: ["Ring", "Filled"],
  // },
] as const;

export const DELIVERY_OPTIONS = [
  { id: "pickup", label: "Self-Pickup", surcharge: 0 },
  { id: "standard", label: "Standard Delivery from 3pm to 9pm (Excluding Sentosa and Tuas)", surcharge: 15 },
] as const;

export type CategoryId = (typeof PRODUCT_CATEGORIES)[number]["id"];
export type LoafId = (typeof PRODUCT_CATEGORIES)[number]["items"][number]["id"];
export type Flavour = (typeof PRODUCT_CATEGORIES)[number]["flavours"][number];
export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export interface CartItem {
  loafId: LoafId;
  loafLabel: string;
  flavour: Flavour;
  qty: number;
  unitPrice: number;
}
