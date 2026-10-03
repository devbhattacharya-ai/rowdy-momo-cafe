import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MENU } from "@/lib/cafe";

type Line = { id: string; qty: number };

type CartValue = {
  lines: Line[];
  count: number;
  total: number;
  open: boolean;
  pulse: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  show: () => void;
  hide: () => void;
};

const CartContext = createContext<CartValue | null>(null);
const KEY = "rowdy-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Line[];
        if (Array.isArray(parsed)) setLines(parsed.filter((line) => line.qty > 0 && MENU.some((item) => item.id === line.id)));
      }
    } catch {
      /* keep an empty cart */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const total = lines.reduce((sum, line) => {
      const plate = MENU.find((item) => item.id === line.id);
      return sum + (plate?.price ?? 0) * line.qty;
    }, 0);
    return {
      lines,
      count,
      total,
      open,
      pulse,
      add(id) {
        setLines((prev) => {
          const hit = prev.find((line) => line.id === id);
          if (!hit) return [...prev, { id, qty: 1 }];
          return prev.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line));
        });
        setPulse((value) => value + 1);
      },
      setQty(id, qty) {
        setLines((prev) => prev.flatMap((line) => (line.id !== id ? [line] : qty > 0 ? [{ ...line, qty }] : [])));
      },
      show() {
        setOpen(true);
      },
      hide() {
        setOpen(false);
      },
    };
  }, [lines, open, pulse]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("Cart is only available inside the site shell.");
  return value;
}
