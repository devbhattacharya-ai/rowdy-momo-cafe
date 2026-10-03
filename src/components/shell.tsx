import type { ReactNode } from "react";
import { CartDock } from "@/components/cart-dock";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CartProvider } from "@/lib/cart";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-velvet text-bone">
        <Header />
        {children}
        <Footer />
        <CartDock />
      </div>
    </CartProvider>
  );
}
