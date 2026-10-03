import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Rise } from "@/components/scroll-motion";
import { Shell } from "@/components/shell";
import {
  CAFE,
  MENU,
  ORDER_BLURB,
  inr,
  waLink,
  type Plate,
} from "@/lib/cafe";
import { useCart } from "@/lib/cart";

const LANES = [
  { id: "steam", label: "Steam", match: (item: Plate) => item.cook === "steam" || item.cook === "jhol" },
  { id: "crisp", label: "Crisp", match: (item: Plate) => ["kothey", "fried", "chilli", "tandoor"].includes(item.cook) },
  { id: "plate", label: "Plates", match: (item: Plate) => item.cook === "plate" || item.cook === "cold" },
] as const;

const FAQS = [
  {
    q: "What's in the steam chicken momo?",
    a: "Minced chicken, ginger, garlic, and a thin wheat wrapper. Sesame chilli comes on the side. Eight pieces.",
  },
  {
    q: "Is there a plate without meat?",
    a: "Fries, the cold coffee, the cocoa shake, and the veg steamer are vegetarian. The rest of the momo list is chicken or paneer. Ask on WhatsApp if you need the whole table veg.",
  },
  {
    q: "Do you deliver?",
    a: "Order on WhatsApp and the cafe confirms what can leave the room. The table is the better seat.",
  },
  {
    q: "Where is the door?",
    a: `${CAFE.street}, ${CAFE.area}. Open ${CAFE.hours}.`,
  },
  {
    q: "Can I hold a table?",
    a: "Yes. The reserve form sends a WhatsApp note. Nothing is booked until the cafe replies.",
  },
];

const FLOATS = [
  { src: "/food/pizza.jpg", alt: "Chilli oil pizza", vx: 0.62, vy: 0.38 },
  { src: "/food/jhol.jpg", alt: "Jhol momos", vx: -0.48, vy: 0.55 },
  { src: "/food/burger.jpg", alt: "Smash burger", vx: 0.5, vy: -0.46 },
  { src: "/food/coffee.jpg", alt: "Cold coffee", vx: -0.58, vy: -0.36 },
];

function BumperFloats({ safe }: { safe: { current: HTMLDivElement | null } }) {
  const stage = useRef<HTMLDivElement>(null);
  const nodes = useRef<Array<HTMLImageElement | null>>([]);

  useLayoutEffect(() => {
    const box = stage.current;
    if (!box) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bodies = FLOATS.map((shot, index) => {
      const el = nodes.current[index];
      const size = el?.offsetWidth || 96;
      const w = box.clientWidth;
      const h = box.clientHeight;
      const pad = 12;
      const corners = [
        { x: pad, y: pad },
        { x: w - size - pad, y: pad },
        { x: pad, y: h - size - pad },
        { x: w - size - pad, y: h - size - pad },
      ];
      return { x: corners[index].x, y: corners[index].y, vx: shot.vx, vy: shot.vy, size };
    });

    const place = () => {
      bodies.forEach((body, index) => {
        const el = nodes.current[index];
        if (!el) return;
        el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
        el.style.visibility = "visible";
      });
    };
    place();
    if (reduce) return;

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const w = box.clientWidth;
      const h = box.clientHeight;
      const step = dt * 0.055;

      for (const body of bodies) {
        const el = nodes.current[bodies.indexOf(body)];
        body.size = el?.offsetWidth || body.size;
        body.x += body.vx * step;
        body.y += body.vy * step;
        if (body.x <= 0) {
          body.x = 0;
          body.vx = Math.abs(body.vx);
        }
        if (body.y <= 0) {
          body.y = 0;
          body.vy = Math.abs(body.vy);
        }
        if (body.x + body.size >= w) {
          body.x = w - body.size;
          body.vx = -Math.abs(body.vx);
        }
        if (body.y + body.size >= h) {
          body.y = h - body.size;
          body.vy = -Math.abs(body.vy);
        }
        const stageRect = box.getBoundingClientRect();
        const safeEl = safe.current;
        if (!safeEl) continue;
        const rect = safeEl.getBoundingClientRect();
        const pad = 20;
        const sx = rect.left - stageRect.left - pad;
        const sy = rect.top - stageRect.top - pad;
        const sw = rect.width + pad * 2;
        const sh = rect.height + pad * 2;
        const right = body.x + body.size;
        const bottom = body.y + body.size;
        if (right <= sx || body.x >= sx + sw || bottom <= sy || body.y >= sy + sh) continue;
        const overlapL = right - sx;
        const overlapR = sx + sw - body.x;
        const overlapT = bottom - sy;
        const overlapB = sy + sh - body.y;
        const min = Math.min(overlapL, overlapR, overlapT, overlapB);
        if (min === overlapL) {
          body.x -= overlapL;
          body.vx = -Math.abs(body.vx);
        } else if (min === overlapR) {
          body.x += overlapR;
          body.vx = Math.abs(body.vx);
        } else if (min === overlapT) {
          body.y -= overlapT;
          body.vy = -Math.abs(body.vy);
        } else {
          body.y += overlapB;
          body.vy = Math.abs(body.vy);
        }
      }

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const ax = a.x + a.size / 2;
          const ay = a.y + a.size / 2;
          const bx = b.x + b.size / 2;
          const by = b.y + b.size / 2;
          let dx = bx - ax;
          let dy = by - ay;
          const dist = Math.hypot(dx, dy) || 0.001;
          const min = (a.size + b.size) * 0.46;
          if (dist >= min) continue;
          dx /= dist;
          dy /= dist;
          const overlap = min - dist;
          a.x -= dx * overlap * 0.5;
          a.y -= dy * overlap * 0.5;
          b.x += dx * overlap * 0.5;
          b.y += dy * overlap * 0.5;
          const va = a.vx * dx + a.vy * dy;
          const vb = b.vx * dx + b.vy * dy;
          a.vx += (vb - va) * dx * 1.35;
          a.vy += (vb - va) * dy * 1.35;
          b.vx += (va - vb) * dx * 1.35;
          b.vy += (va - vb) * dy * 1.35;
        }
      }

      for (const body of bodies) {
        const speed = Math.hypot(body.vx, body.vy) || 1;
        const cruise = 0.72;
        const next = speed + (cruise - speed) * 0.04;
        const capped = Math.min(1.7, Math.max(0.4, next));
        body.vx = (body.vx / speed) * capped;
        body.vy = (body.vy / speed) * capped;
      }

      place();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [safe]);

  return (
    <div ref={stage} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {FLOATS.map((shot, index) => (
        <img
          key={shot.src}
          ref={(node) => {
            nodes.current[index] = node;
          }}
          src={shot.src}
          alt=""
          width={640}
          height={640}
          className="absolute top-0 left-0 aspect-square w-[3.465rem] object-cover mask-blob sm:w-[6.93rem] md:w-[9.24rem]"
          style={{ visibility: "hidden" }}
        />
      ))}
    </div>
  );
}

function RedPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="press inline-flex min-h-12 items-center gap-1 rounded-pill bg-rowdy px-5 font-display text-lg font-extrabold uppercase tracking-normal text-bone">
      {children}
    </a>
  );
}

function GhostPill({ to, children }: { to: "/find-us" | "/menu" | "/story"; children: ReactNode }) {
  return (
    <Link to={to} className="press inline-flex min-h-12 items-center gap-1 rounded-pill border border-bone/40 bg-ink/50 px-5 font-display text-lg font-extrabold uppercase tracking-normal text-bone">
      {children}
    </Link>
  );
}

function WordLoop() {
  const words = ["Steam", "Jhol", "Kothey", "Fried"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % words.length), 1600);
    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <div className="flex flex-col items-center">
      <p className="h-6 overflow-hidden font-display text-sm uppercase tracking-normal text-blush">
        <span key={words[index]} className="word-swap block">
          {words[index]}
        </span>
      </p>
      <span className="mt-1 block h-px w-8 bg-blush" aria-hidden="true" />
    </div>
  );
}

function Seal({ src, alt }: { src: string; alt: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className="lid mx-auto aspect-square w-full max-w-56 overflow-hidden">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d="M0.2,0.06 C0.32,0.16 0.68,0.16 0.8,0.06 C0.9,0.18 0.96,0.34 0.94,0.5 C0.96,0.66 0.9,0.84 0.8,0.94 C0.68,0.84 0.32,0.84 0.2,0.94 C0.1,0.84 0.04,0.66 0.06,0.5 C0.04,0.34 0.1,0.18 0.2,0.06 Z" />
        </clipPath>
      </svg>
      <img src={src} alt={alt} width={800} height={800} className="h-full w-full object-cover" style={{ clipPath: `url(#${id})` }} />
    </div>
  );
}

function Hero() {
  const wrap = useRef<HTMLElement>(null);
  const safe = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const node = wrap.current;
    if (!node) return;
    if (media.matches) {
      setReduce(true);
      return;
    }
    let frame = 0;
    const paint = () => {
      const range = node.offsetHeight - window.innerHeight;
      const scrolled = -node.getBoundingClientRect().top;
      const next = range <= 0 ? 0 : Math.min(1, Math.max(0, scrolled / range));
      node.style.setProperty("--p", next.toFixed(4));
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={wrap} className="relative">
      <div className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-3">
        <BumperFloats safe={safe} />
        <div className="relative h-[min(780px,88dvh)] w-full max-w-6xl">
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center sm:px-8"
            style={{ transform: reduce ? undefined : "translate3d(0, calc(var(--p) * -18vh), 0)" }}
          >
            <div ref={safe} className="flex flex-col items-center">
            <p className="font-display text-sm uppercase tracking-normal text-blush sm:text-base">Rowdy Momo Cafe</p>
            <p className="mt-1 font-display text-xs uppercase tracking-normal text-blush sm:text-sm">✦ It's giving ✦</p>
            <h1 className="type-3d mt-4 font-display uppercase text-rowdy">
              <span className="block text-hero">Momo</span>
            </h1>
            <p className="mt-2 font-display text-base uppercase tracking-normal text-blush sm:text-xl">(From Nepal)</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <RedPill href={waLink(ORDER_BLURB)}>› Order</RedPill>
              <GhostPill to="/find-us">
                <MapPin className="size-3.5" aria-hidden="true" /> Find us
              </GhostPill>
            </div>
            <p className="mt-4 font-body text-sm normal-case tracking-normal text-blush">
              Bandra West · {CAFE.hours}
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductRail() {
  const { add } = useCart();
  const [lane, setLane] = useState<(typeof LANES)[number]["id"]>("steam");
  const [dot, setDot] = useState(0);
  const section = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const slide = useRef({ prev: () => {}, next: () => {} });
  const items = MENU.filter(LANES.find((item) => item.id === lane)?.match ?? (() => true));

  useEffect(() => {
    const frame = view.current;
    const track = row.current;
    if (!frame || !track) return;

    let index = 0;
    let startX = 0;
    let drag = 0;
    let active = false;

    const cardWidth = () => {
      const card = track.querySelector("article");
      return (card?.getBoundingClientRect().width ?? 288) + 32;
    };
    const paint = (animate: boolean) => {
      const width = cardWidth();
      const max = Math.max(0, items.length - 1);
      index = Math.min(max, Math.max(0, index));
      track.style.transition = animate ? "transform 0.45s cubic-bezier(0.22, 0.8, 0.28, 1)" : "none";
      track.style.transform = `translate3d(${(-index * width + drag).toFixed(1)}px,0,0)`;
      setDot(index);
    };
    const prev = () => {
      drag = 0;
      index -= 1;
      paint(true);
    };
    const next = () => {
      drag = 0;
      index += 1;
      paint(true);
    };
    slide.current = { prev, next };

    const down = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("a, button")) return;
      active = true;
      startX = event.clientX;
      drag = 0;
      frame.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!active) return;
      drag = event.clientX - startX;
      paint(false);
    };
    const up = () => {
      if (!active) return;
      active = false;
      if (drag < -48) index += 1;
      else if (drag > 48) index -= 1;
      drag = 0;
      paint(true);
    };

    frame.addEventListener("pointerdown", down);
    frame.addEventListener("pointermove", move);
    frame.addEventListener("pointerup", up);
    frame.addEventListener("pointercancel", up);
    paint(false);
    return () => {
      frame.removeEventListener("pointerdown", down);
      frame.removeEventListener("pointermove", move);
      frame.removeEventListener("pointerup", up);
      frame.removeEventListener("pointercancel", up);
    };
  }, [lane, items.length]);

  return (
    <section ref={section} className="relative">
      <div className="overflow-hidden px-4 pt-1 pb-8">
        <p className="text-center font-body text-caption text-blush">Speaking of the steamer...</p>
        <div className="mx-auto mt-3 flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {LANES.map((item) => {
            const count = MENU.filter(item.match).length;
            const active = lane === item.id;
            return (
              <button key={item.id} type="button" onClick={() => setLane(item.id)} className="flex items-center gap-1.5">
                <span className={`font-display text-base uppercase transition-colors duration-300 sm:text-2xl ${active ? "text-bone underline decoration-2 underline-offset-4" : "text-blush"}`}>
                  {item.label}
                </span>
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-stage font-display text-[0.7rem] text-bone">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex justify-center">
          <WordLoop />
        </div>
        <div className="relative mx-auto mt-4 max-w-7xl">
          <button
            type="button"
            aria-label="Previous plate"
            onClick={() => slide.current.prev()}
            className="absolute top-24 left-1 z-10 inline-flex size-11 items-center justify-center rounded-full bg-rowdy text-bone"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next plate"
            onClick={() => slide.current.next()}
            className="absolute top-24 right-1 z-10 inline-flex size-11 items-center justify-center rounded-full bg-rowdy text-bone"
          >
            <ChevronRight className="size-5" />
          </button>
          <div ref={view} className="cursor-grab overflow-hidden touch-pan-y active:cursor-grabbing">
            <div ref={row} className="w-max will-change-transform">
              <div key={lane} className="lane-in flex w-max gap-8 px-16">
              {items.map((item) => (
                <article key={item.id} className="w-72 shrink-0 text-center">
                  <Seal src={item.image} alt={item.name} />
                  <h3 className="mt-4 font-display text-ui uppercase text-bone">{item.name}</h3>
                  <p className="mt-1 font-display text-caption uppercase text-blush">{inr(item.price)} · {item.serves}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={() => add(item.id)} className="press inline-flex min-h-12 items-center gap-1 rounded-pill bg-rowdy px-5 font-display text-lg uppercase tracking-normal text-bone">
                      Add
                    </button>
                    <GhostPill to="/find-us">
                      <MapPin className="size-3.5" aria-hidden="true" /> Find it
                    </GhostPill>
                  </div>
                </article>
              ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {items.map((item, index) => (
              <span key={item.id} className={`size-2 rounded-full ${index === dot ? "bg-bone" : "bg-bone/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Platter() {
  const { add } = useCart();
  const [filter, setFilter] = useState<"momo" | "plate" | "cold">("momo");
  const picks =
    filter === "momo"
      ? MENU.filter((item) => item.cook !== "plate" && item.cook !== "cold").slice(0, 2)
      : filter === "plate"
        ? MENU.filter((item) => item.cook === "plate").slice(0, 2)
        : MENU.filter((item) => item.cook === "cold").concat(MENU.filter((item) => item.cook === "plate")).slice(0, 2);

  return (
    <section className="px-4 py-16">
      <p className="text-center font-body text-body-sm text-blush">Want the menu? We got you.</p>
      <div className="mt-5 flex justify-center gap-2">
        {(
          [
            ["momo", "Momos"],
            ["plate", "Plates"],
            ["cold", "Cold"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`min-h-10 rounded-pill px-4 font-display text-caption uppercase ${filter === id ? "bg-blush text-ink" : "bg-ink text-blush"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-16 text-center font-display text-caption uppercase text-rowdy">✦ Feed the table ✦</p>
      <h2 className="mt-6 text-center font-display text-mega uppercase text-rowdy" style={{ lineHeight: 0.95 }}>
        The platter
      </h2>
      <div className="mx-auto mt-8 grid max-w-5xl gap-8 md:grid-cols-2">
        {picks.map((item, index) => (
          <Rise key={item.id} distance={index === 0 ? 110 : 168} end={index === 0 ? 0.5 : 0.32}>
            <article>
              <div className="lid overflow-hidden">
                <img src={item.image} alt={item.name} width={900} height={900} className="aspect-[4/3] w-full object-cover wave-a" />
              </div>
              <p className="mt-4 font-display text-caption uppercase text-blush">{item.serves}</p>
              <h3 className="mt-1 font-display text-heading-sm uppercase text-bone">{item.name}</h3>
              <p className="mt-2 text-body-sm text-blush">{item.note}</p>
              <div className="mt-4">
                <button type="button" onClick={() => add(item.id)} className="press inline-flex min-h-12 items-center gap-1 rounded-pill bg-rowdy px-5 font-display text-lg uppercase tracking-normal text-bone">
                  Add
                </button>
              </div>
            </article>
          </Rise>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-3xl items-center gap-4">
        <span className="h-px flex-1 bg-bone/30" />
        <Link to="/menu" search={{ cook: "all" }} className="inline-flex min-h-10 items-center rounded-pill bg-rowdy px-4 font-display text-caption uppercase text-bone">
          › See the menu
        </Link>
        <span className="h-px flex-1 bg-bone/30" />
      </div>
    </section>
  );
}

function Faqs() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const root = document.documentElement;
        root.classList.add("sky-flash");
        timer = window.setTimeout(() => root.classList.remove("sky-flash"), 480);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      document.documentElement.classList.remove("sky-flash");
    };
  }, []);

  return (
    <section ref={ref} className="px-4 py-16">
      <h2 className="text-center font-display text-mega uppercase text-rowdy">
        Browse our
        <br />
        faq's
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-center font-display text-lg uppercase tracking-normal text-blush">
        The short answers. Steamer, plates, the door, a table.
      </p>
      <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3">
        {FAQS.map((item, index) => {
          const on = open === index;
          return (
            <Rise key={item.q} distance={40} end={0.62 - index * 0.06}>
              <div className="rounded-feature bg-ink px-6">
              <button
                type="button"
                className="flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left font-display text-lg uppercase tracking-normal text-bone"
                aria-expanded={on}
                onClick={() => setOpen(on ? null : index)}
              >
                {item.q}
                <ChevronDown className={`size-6 shrink-0 transition-transform duration-300 ${on ? "rotate-180" : ""}`} />
              </button>
              <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <p className="pb-5 font-body text-base font-normal leading-relaxed text-blush">{item.a}</p>
                </div>
              </div>
              </div>
            </Rise>
          );
        })}
      </div>
    </section>
  );
}

function Still() {
  return (
    <section className="px-4 py-16 text-center">
      <p className="font-display text-caption uppercase text-bone">✦ Still ✦</p>
      <h2 className="mt-3 font-display text-mega uppercase text-blush">
        Have
        <br />
        questions?
      </h2>
      <p className="mt-4 text-body-sm text-bone">Feel free to contact us.</p>
      <a href={waLink("I have a question for Rowdy Momo Cafe.")} className="press mt-5 inline-flex min-h-10 items-center rounded-pill bg-rowdy px-4 font-display text-caption uppercase text-bone">
        › Find help
      </a>
    </section>
  );
}

function Locator() {
  const ref = useRef<HTMLElement>(null);
  const [drop, setDrop] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrop(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setDrop(true);
        observer.disconnect();
      },
      { threshold: 0.28 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="overflow-hidden px-4 pb-8">
      <div className={drop ? "curtain-drop" : "curtain-hold"}>
        <div className="locator mx-auto max-w-4xl px-6 pt-16 pb-10 text-center text-ink">
          <p className="font-display text-caption uppercase">✦ Door ✦</p>
          <h2 className="mt-2 font-display text-mega uppercase">Locator</h2>
          <p className="mx-auto mt-3 max-w-md text-body-sm">
            Where's the steamer? {CAFE.street}, {CAFE.area}. {CAFE.hours}.
          </p>
          <div className="relative mx-auto mt-6 h-40 max-w-xl overflow-hidden rounded-b-feature">
            <svg viewBox="0 0 400 160" className="h-full w-full" aria-hidden="true">
              <rect width="400" height="160" fill="#e7b8b4" />
              {Array.from({ length: 8 }).map((_, index) => (
                <line key={`h${index}`} x1="0" x2="400" y1={20 * index} y2={20 * index + (index % 2) * 8} stroke="#a85a62" strokeWidth={index % 3 === 0 ? 3 : 1} />
              ))}
              {Array.from({ length: 10 }).map((_, index) => (
                <line key={`v${index}`} y1="0" y2="160" x1={40 * index} x2={40 * index + (index % 2) * 6} stroke="#8d4550" strokeWidth={index % 4 === 0 ? 3 : 1} />
              ))}
            </svg>
            <a href={CAFE.maps} className="absolute bottom-4 left-1/2 inline-flex min-h-10 -translate-x-1/2 items-center rounded-pill bg-ink px-4 font-display text-caption uppercase text-bone">
              › Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Signup() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!ok) return;
    window.open(waLink(`Add ${email} to Rowdy Momo updates.`), "_blank", "noopener,noreferrer");
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
        <h2 className="font-display text-heading-sm uppercase text-bone">
          Sign up to hear about the steamer, the pie, and the late sitting
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="flex items-center rounded-pill bg-bone p-1">
            <label className="sr-only" htmlFor="updates-email">Email</label>
            <input
              id="updates-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="min-h-11 flex-1 bg-transparent px-4 text-body-sm text-ink outline-none"
            />
            <button type="submit" className="min-h-10 rounded-pill bg-rowdy px-4 font-display text-caption uppercase text-bone">
              Submit
            </button>
          </div>
          <label className="flex items-start gap-2 text-caption text-blush">
            <input type="checkbox" checked={ok} onChange={(event) => setOk(event.target.checked)} className="mt-1" required />
            Send this to the cafe on WhatsApp. No list is stored on the site.
          </label>
        </form>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <Shell>
      <main>
        <Hero />
        <ProductRail />
        <Platter />
        <Faqs />
        <Still />
        <Locator />
        <Signup />
      </main>
    </Shell>
  );
}
