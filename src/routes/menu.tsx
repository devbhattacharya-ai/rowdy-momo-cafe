import { createFileRoute, Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { PlateCard } from "@/components/plates";
import { Poster } from "@/components/poster";
import { Shell } from "@/components/shell";
import { byCook, FILTERS, parseCook } from "@/lib/cafe";

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>) => ({
    cook: parseCook(search.cook),
  }),
  head: () => ({
    meta: [{ title: "Menu — Rowdy Momo Cafe" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { cook } = Route.useSearch();
  const items = byCook(cook);

  return (
    <Shell>
      <main className="px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <Poster eyebrow="Bandra · till midnight" lines={["The", "Menu"]} />
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter the menu">
            {FILTERS.map((filter) => {
              const active = filter.id === cook;
              return (
                <Link
                  key={filter.id}
                  to="/menu"
                  search={{ cook: filter.id }}
                  role="tab"
                  aria-selected={active}
                  className={clsx(
                    "inline-flex min-h-11 items-center rounded-pill px-4 font-display text-ui uppercase transition-colors duration-300",
                    active ? "bg-rowdy text-bone" : "border border-stage text-blush",
                  )}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
          {items.length === 0 ? (
            <p className="text-center text-blush">Nothing in that lane tonight.</p>
          ) : (
            <div key={cook} className="grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <div key={item.id} className="menu-card" style={{ animationDelay: `${index * 70}ms` }}>
                  <PlateCard item={item} feature={item.cook === "cold"} fit="grid" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}
