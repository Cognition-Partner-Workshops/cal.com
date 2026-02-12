"use client";

import { create } from "zustand";

interface CartProduct {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

interface CartState {
  items: CartProduct[];
  isLoading: boolean;
  setItems: (items: CartProduct[]) => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
  itemCount: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  setLoading: (isLoading) => set({ isLoading }),
  clearCart: () => set({ items: [] }),
  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  total: () =>
    Math.round(
      get().items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    ) / 100,
}));
