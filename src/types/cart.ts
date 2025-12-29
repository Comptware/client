// src/types/cart.ts

/** Extra ASIC details that may accompany certain product types */
export interface AsicSpec {
  model: string;
  hashRate: string;
  power: string;
  efficiency: string;
}

/** A single item as returned by the backend */
export interface CartItem {
  productType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  asicSpec?: AsicSpec | null;
}

/** Standard shape of every cart API response */
export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status?: string; // optional field from server
}

/** Payload used when adding/updating/removing items */
export interface CartItemPayload {
  productType: string;
  quantity?: number;       // quantity is optional for remove
  asicSpec?: AsicSpec | null;
}
