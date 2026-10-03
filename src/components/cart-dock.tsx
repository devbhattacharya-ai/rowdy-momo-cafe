import { useState } from "react";
import { MENU, inr, waLink } from "@/lib/cafe";
import { useCart } from "@/lib/cart";

function CartIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
      <path
        d="M6 8h2.2l2.4 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.5L27 12H10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="25.5" r="1.6" fill="currentColor" />
      <circle cx="22" cy="25.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function CartDock() {
  const { lines, count, total, open, pulse, show, hide, setQty } = useCart();
  const [press, setPress] = useState(false);

  if (count < 1) return null;

  const plates = lines.flatMap((line) => {
    const plate = MENU.find((item) => item.id === line.id);
    return plate ? [{ ...plate, qty: line.qty }] : [];
  });
  const note = plates
    .map((plate) => `${plate.qty} × ${plate.name} (${inr(plate.price)})`)
    .join("\n");

  function openCart() {
    setPress(true);
    window.setTimeout(() => {
      setPress(false);
      show();
    }, 180);
  }

  return (
    <>
      <div className="h-24" />
      {open ? null : (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="cart-dock pointer-events-auto w-full max-w-sm">
            <button
              type="button"
              onClick={openCart}
              className={`cart-btn inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-full px-5 font-display text-lg uppercase text-bone ${press ? "cart-click" : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <CartIcon />
                View cart
              </span>
              <span key={pulse} className="cart-price font-body text-sm normal-case tracking-normal text-bone">
                {count} · {inr(total)}
              </span>
            </button>
          </div>
        </div>
      )}
      {open ? (
        <div className="cart-scrim fixed inset-0 z-50 flex items-end justify-center bg-butcher/50 p-3 backdrop-blur-[6px]">
          <button type="button" className="absolute inset-0" aria-label="Close cart" onClick={hide} />
          <div className="cart-sheet relative z-10 w-full max-w-md rounded-feature bg-ink px-5 pt-5 pb-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl uppercase text-rowdy">Your cart</h2>
              <button type="button" onClick={hide} className="font-display text-sm uppercase text-blush">
                Close
              </button>
            </div>
            <ul className="mt-4 flex max-h-[46vh] flex-col gap-3 overflow-auto">
              {plates.map((plate) => (
                <li key={plate.id} className="cart-row flex items-center gap-3">
                  <img src={plate.image} alt="" width={72} height={72} className="size-16 rounded-card object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm uppercase text-bone">{plate.name}</p>
                    <p className="font-body text-sm text-blush">{inr(plate.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 font-display text-bone">
                    <button type="button" className="size-8 rounded-full border border-bone/30" onClick={() => setQty(plate.id, plate.qty - 1)} aria-label={`Remove one ${plate.name}`}>
                      –
                    </button>
                    <span className="w-4 text-center">{plate.qty}</span>
                    <button type="button" className="size-8 rounded-full border border-bone/30" onClick={() => setQty(plate.id, plate.qty + 1)} aria-label={`Add one ${plate.name}`}>
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-body text-sm text-bone">
              Subtotal ({count} {count === 1 ? "item" : "items"}): <span className="font-display text-rowdy">{inr(total)}</span>
            </p>
            <a
              href={waLink(`I'd like to order from Rowdy Momo Cafe, Bandra West.\n${note}\nSubtotal ${inr(total)}`)}
              target="_blank"
              rel="noreferrer"
              className="press mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-rowdy font-display text-lg uppercase text-bone"
            >
              Send on WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
