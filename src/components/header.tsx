import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CAFE, type CookFilter } from "@/lib/cafe";

const pill =
  "press inline-flex min-h-9 items-center rounded-pill border border-bone/40 bg-transparent px-3 font-display text-sm uppercase tracking-normal text-bone";

const drops: { label: string; items: { label: string; cook: CookFilter }[] }[] = [
  {
    label: "Momos",
    items: [
      { label: "Steam", cook: "steam" },
      { label: "Kothey", cook: "kothey" },
      { label: "Fried", cook: "fried" },
      { label: "Jhol", cook: "jhol" },
      { label: "Chilli", cook: "chilli" },
      { label: "Tandoor", cook: "tandoor" },
    ],
  },
  {
    label: "Plates",
    items: [
      { label: "Plates", cook: "plate" },
      { label: "Cold", cook: "cold" },
      { label: "All", cook: "all" },
    ],
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = bar.current;
    if (!node) return;
    let frame = 0;
    const paint = () => {
      const doc = document.scrollingElement || document.documentElement;
      const top = window.scrollY || doc.scrollTop;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      node.style.transform = `scaleX(${Math.min(1, Math.max(0, top / max))})`;
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="header-frost sticky top-0 z-50">
      <div ref={bar} className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] origin-left bg-rowdy" style={{ transform: "scaleX(0)" }} />
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:gap-8 md:px-6">
        <div className="contents md:flex md:items-center md:gap-3">
        <Link to="/" aria-label="Rowdy Momo Cafe" className="inline-flex size-10 shrink-0 overflow-hidden rounded-full md:size-14">
          <video
            src="/brand/momo-logo.mp4"
            poster="/brand/momo-logo.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="size-full origin-center scale-125 object-cover"
          />
        </Link>
        <button
          type="button"
          className="inline-flex size-9 shrink-0 items-center justify-center text-bone md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <Link to="/" className="shrink-0 font-display text-xl uppercase tracking-normal text-rowdy sm:text-2xl md:text-3xl">
          Rowdy
        </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex" aria-label="Primary">
          {drops.map((menu) => (
            <div
              key={menu.label}
              className="relative"
              onMouseEnter={() => setDrop(menu.label)}
              onMouseLeave={() => setDrop(null)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 font-display text-xl font-extrabold uppercase tracking-normal text-bone"
                aria-expanded={drop === menu.label}
                onClick={() => setDrop((value) => (value === menu.label ? null : menu.label))}
              >
                {menu.label}
                <ChevronDown className={`size-5 transition-transform duration-300 ${drop === menu.label ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <div className="absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 pt-3">
                <ul
                  className={`origin-top rounded-card bg-ink py-2 shadow-2xl shadow-black/50 ${
                    drop === menu.label ? "drop-in visible" : "invisible -translate-y-6 scale-95 opacity-0"
                  }`}
                >
                  {menu.items.map((item) => (
                    <li key={item.cook}>
                      <Link
                        to="/menu"
                        search={{ cook: item.cook }}
                        className="block px-4 py-2.5 font-display text-lg font-extrabold uppercase text-bone hover:text-blush"
                        onClick={() => setDrop(null)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <Link to="/story" className="font-display text-xl font-extrabold uppercase tracking-normal text-bone data-[status=active]:underline">
            Story
          </Link>
          <Link to="/menu" search={{ cook: "all" }} className="font-display text-xl font-extrabold uppercase tracking-normal text-bone data-[status=active]:underline">
            Menu
          </Link>
        </nav>

        <div className="flex shrink-0 items-center">
          <Link to="/find-us" hash="reserve" className={pill}>
            Reserve
          </Link>
        </div>
      </div>
      <nav
        id="mobile-nav"
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out md:hidden ${open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
        aria-label="Mobile"
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <ul className={`border-t border-white/10 px-4 py-3 ${open ? "drop-in" : "-translate-y-8"}`}>
            <li>
              <Link to="/menu" search={{ cook: "all" }} className="block py-3 font-display text-heading-sm uppercase text-bone" onClick={() => setOpen(false)}>
                Menu
              </Link>
            </li>
            <li>
              <Link to="/story" className="block py-3 font-display text-heading-sm uppercase text-bone" onClick={() => setOpen(false)}>
                Story
              </Link>
            </li>
            <li>
              <Link to="/find-us" className="block py-3 font-display text-heading-sm uppercase text-bone" onClick={() => setOpen(false)}>
                Find us
              </Link>
            </li>
            <li>
              <a className="block py-3 font-display text-heading-sm uppercase text-blush" href={`https://instagram.com/${CAFE.instagram}`}>
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
