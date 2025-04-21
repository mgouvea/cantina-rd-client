// store/cart-store.ts
import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (item) =>
    set((state) => {
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        // New item, add to cart
        updatedItems = [...state.items, { ...item, quantity: 1 }];
      }

      // Calculate new totals
      const newTotalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    }),

  removeItem: (id) =>
    set((state) => {
      // Find the item
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === id
      );

      // If item doesn't exist, return current state
      if (existingItemIndex === -1) return state;

      let updatedItems: CartItem[];

      // If quantity is 1, remove item completely
      if (state.items[existingItemIndex].quantity === 1) {
        updatedItems = state.items.filter((item) => item.id !== id);
      } else {
        // Decrease quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity -= 1;
      }

      // Calculate new totals
      const newTotalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    }),

  clearCart: () =>
    set({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    }),
}));
