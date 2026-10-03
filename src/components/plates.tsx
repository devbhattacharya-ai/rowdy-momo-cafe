import { useRef, useState } from "react";
import { clsx } from "clsx";
import { GhostLink } from "@/components/actions";
import { Drift } from "@/components/drift";
import { inr, type Plate } from "@/lib/cafe";
import { useCart } from "@/lib/cart";

export function FoodMask({
  src,
  alt,
  mask,
  speed = 0.08,
  className,
}: {
  src: string;
  alt: string;
  mask: string;
  speed?: number;
  className?: string;
}) {
  return (
    <Drift speed={speed} className={className}>
      <img
        src={src}
        alt={alt}
        width={1408}
        height={1408}
        className={clsx("aspect-square w-full object-cover", mask)}
      />
    </Drift>
  );
}

export function PlateCard({
  item,
  feature = false,
  fit = "strip",
}: {
  item: Plate;
  feature?: boolean;
  fit?: "strip" | "grid";
}) {
  const { add } = useCart();
  return (
    <article
      className={clsx(
        "plate-card flex flex-col overflow-hidden border border-butcher bg-stage",
        feature ? "rounded-feature" : "rounded-card",
        fit === "strip" ? "w-72 shrink-0 snap-start" : "w-full min-w-0",
      )}
    >
      <div className="lid overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          width={1408}
          height={1408}
          className="plate-shot aspect-square w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h3 className="font-display text-sub uppercase text-blush">{item.name}</h3>
          <p className="mt-2 text-body-sm text-bone">{item.note}</p>
        </div>
        <p className="font-display text-ui uppercase text-bone">
          {inr(item.price)} · {item.serves}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => add(item.id)}
            className="press inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill bg-rowdy px-3.5 py-2.5 font-display text-ui uppercase text-bone"
          >
            Add
          </button>
          <GhostLink to="/find-us" pin>
            Find it
          </GhostLink>
        </div>
      </div>
    </article>
  );
}

export function PlateStrip({ items }: { items: Plate[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function sync() {
    const el = scroller.current;
    if (!el) return;
    const cards = [...el.children] as HTMLElement[];
    let best = 0;
    let dist = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const delta = Math.abs(card.offsetLeft - el.scrollLeft);
      if (delta < dist) {
        dist = delta;
        best = index;
      }
    });
    setActive(best);
  }

  function go(index: number) {
    const el = scroller.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div>
      <div ref={scroller} onScroll={sync} className="strip -mx-4 md:mx-0">
        {items.map((item) => (
          <PlateCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.name}`}
            aria-current={index === active}
            onClick={() => go(index)}
            className={clsx("size-3 rounded-full", index === active ? "bg-rowdy" : "bg-blush/40")}
          />
        ))}
      </div>
    </div>
  );
}
