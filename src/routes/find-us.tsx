import { createFileRoute } from "@tanstack/react-router";
import { MapLink, OrderLink } from "@/components/actions";
import { FoodMask } from "@/components/plates";
import { Poster } from "@/components/poster";
import { ReserveForm } from "@/components/reserve-form";
import { Rise } from "@/components/scroll-motion";
import { Shell } from "@/components/shell";
import { CAFE, ORDER_BLURB, waLink } from "@/lib/cafe";

export const Route = createFileRoute("/find-us")({
  head: () => ({
    meta: [{ title: "Find us — Rowdy Momo Cafe" }],
  }),
  component: FindPage,
});

function FindPage() {
  return (
    <Shell>
      <main className="px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-12">
          <Poster eyebrow="Bandra West" lines={["Find", "Us"]} />
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <Rise distance={100} end={0.45}>
              <div className="flex flex-col gap-6">
                <FoodMask src="/food/coffee.jpg" alt="Thick cold coffee" mask="mask-b" speed={0.2} />
              <div className="rounded-card border border-butcher bg-stage p-4 md:p-6">
                <p className="font-display text-ui uppercase text-rowdy">The door</p>
                <p className="mt-3 font-display text-heading-sm uppercase text-bone">
                  {CAFE.street}
                  <br />
                  {CAFE.area}
                </p>
                <dl className="mt-6 grid gap-4 text-body-sm">
                  <div>
                    <dt className="font-display text-caption uppercase text-blush">Hours</dt>
                    <dd className="mt-1 text-bone">{CAFE.hours}</dd>
                  </div>
                  <div>
                    <dt className="font-display text-caption uppercase text-blush">Phone</dt>
                    <dd className="mt-1">
                      <a className="text-bone" href={`tel:+${CAFE.phoneWa}`}>
                        {CAFE.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-display text-caption uppercase text-blush">Instagram</dt>
                    <dd className="mt-1">
                      <a
                        className="text-bone"
                        href={`https://instagram.com/${CAFE.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{CAFE.instagram}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap gap-2">
                  <MapLink href={CAFE.maps}>Directions</MapLink>
                  <OrderLink href={waLink(ORDER_BLURB)}>Order</OrderLink>
                </div>
              </div>
              </div>
            </Rise>
            <Rise distance={140} end={0.32}>
              <ReserveForm />
            </Rise>
          </div>
        </div>
      </main>
    </Shell>
  );
}
