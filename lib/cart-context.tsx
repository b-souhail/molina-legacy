"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { buildCartKey } from "@/lib/product-options";

export type CartItem = {
  cartKey: string;
  productId: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variant?: string;
  selectedOptionIds?: number[];
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  totalQty: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity" | "cartKey">, quantity?: number) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  removeItem: (cartKey: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "molina-cart";

const CartContext = createContext<CartContextValue | null>(null);

function normalizeCartItem(item: CartItem): CartItem {
  const cartKey =
    item.cartKey ??
    buildCartKey(item.productId, item.variant);
  return { ...item, cartKey };
}

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => normalizeCartItem(item));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity" | "cartKey">, quantity = 1) => {
      const cartKey = buildCartKey(item.productId, item.variant);
      setItems((prev) => {
        const existing = prev.find((i) => i.cartKey === cartKey);
        if (existing) {
          return prev.map((i) =>
            i.cartKey === cartKey
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, cartKey, quantity }];
      });
      setIsOpen(true);
    },
    []
  );

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalQty = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      total,
      totalQty,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, isOpen, total, totalQty, addItem, updateQuantity, removeItem, clearCart]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
