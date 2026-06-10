"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WishlistItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  isWishlisted: (productId: number) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
};

const STORAGE_KEY = "molina-wishlist";

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as WishlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredWishlist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const isWishlisted = useCallback(
    (productId: number) => items.some((item) => item.productId === productId),
    [items]
  );

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((entry) => entry.productId === item.productId);
      if (exists) {
        return prev.filter((entry) => entry.productId !== item.productId);
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const value = useMemo(
    () => ({
      items,
      isWishlisted,
      toggleItem,
      removeItem,
    }),
    [items, isWishlisted, toggleItem, removeItem]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
