import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { CAFE, ORDER_BLURB, waLink } from "@/lib/cafe";

export function Footer() {
  return (
    <footer className="relative bg-footer text-bone">
      <div className="h-10 rounded-t-[50%] bg-footer" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 md:grid-cols-4">
        <div>
          <p className="font-display text-caption uppercase text-blush">Follow us</p>
          <a
            href={`https://instagram.com/${CAFE.instagram}`}
            className="mt-3 inline-flex size-10 items-center justify-center rounded-full border border-bone/30"
            aria-label="Instagram"
          >
            <Instagram className="size-4" />
          </a>
          <p className="mt-6 max-w-xs text-caption text-blush">
            © {new Date().getFullYear()} Rowdy Momo Cafe. Bandra West.
          </p>
        </div>
        <div>
          <p className="font-display text-caption uppercase text-blush">Eat</p>
          <ul className="mt-3 space-y-2 font-display text-caption uppercase">
            <li><Link to="/menu" search={{ cook: "all" }}>Menu ›</Link></li>
            <li><Link to="/menu" search={{ cook: "steam" }}>Steam ›</Link></li>
            <li><Link to="/menu" search={{ cook: "plate" }}>Plates ›</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-caption uppercase text-blush">Visit</p>
          <ul className="mt-3 space-y-2 font-display text-caption uppercase">
            <li><Link to="/find-us">Find us ›</Link></li>
            <li><Link to="/find-us" hash="reserve">Reserve ›</Link></li>
            <li><a href={waLink(ORDER_BLURB)}>Order ›</a></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-caption uppercase text-blush">Cafe</p>
          <ul className="mt-3 space-y-2 font-display text-caption uppercase">
            <li><Link to="/story">Story ›</Link></li>
            <li><a href={`tel:+${CAFE.phoneWa}`}>{CAFE.phoneDisplay}</a></li>
            <li>{CAFE.hours}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
