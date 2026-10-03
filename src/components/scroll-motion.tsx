import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

const watched = new Set<HTMLElement>();
let frame = 0;
let listening = false;

function paint() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vh = window.innerHeight;
  for (const node of watched) {
    if (reduce) {
      node.style.setProperty("--p", "1");
      continue;
    }
    const start = Number(node.dataset.spanStart ?? "0.96");
    const end = Number(node.dataset.spanEnd ?? "0.46");
    const top = node.getBoundingClientRect().top;
    const from = vh * start;
    const to = vh * end;
    const raw = (from - top) / (from - to || 1);
    node.style.setProperty("--p", Math.min(1, Math.max(0, raw)).toFixed(3));
  }
}

function arm() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(paint);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  paint();
}

function useScrollVar<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    watched.add(node);
    arm();
    paint();
    return () => {
      watched.delete(node);
    };
  }, []);
  return ref;
}

export function Rise({
  children,
  className,
  distance = 72,
  start = 0.98,
  end = 0.5,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  start?: number;
  end?: number;
}) {
  const ref = useScrollVar<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-span-start={start}
      data-span-end={end}
      className={`motion-rise ${className ?? ""}`}
      style={{ transform: `translate3d(0, calc((1 - var(--p, 0)) * ${distance}px), 0)` }}
    >
      {children}
    </div>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useScrollVar<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-span-start="0.82"
      data-span-end="0.28"
      className={className}
      style={{ "--p": 0 } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function Step({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`motion-step ${className ?? ""}`}
      style={
        {
          "--i": index,
          opacity: "clamp(0, calc((var(--p) - var(--i) * 0.18) / 0.28), 1)",
          transform: "translate3d(calc((1 - clamp(0, (var(--p) - var(--i) * 0.18) / 0.28, 1)) * -28px), 0, 0)",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
