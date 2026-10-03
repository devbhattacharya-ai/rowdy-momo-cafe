import { createFileRoute } from "@tanstack/react-router";
import { GhostLink } from "@/components/actions";
import { FoodMask } from "@/components/plates";
import { Poster } from "@/components/poster";
import { Rise } from "@/components/scroll-motion";
import { Shell } from "@/components/shell";
import { CHAPTERS } from "@/lib/cafe";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [{ title: "Story — Rowdy Momo Cafe" }],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <Shell>
      <main className="px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <Poster eyebrow="◂ A Bandra room ▸" lines={["The", "Room"]} aside="(Since the steamer)" />
          <p className="mx-auto max-w-2xl text-center text-body text-blush">
            Rowdy Momo is a Nepali dumpling counter that refused a quiet dining room. One red, a black bar, and plates that do not whisper.
          </p>
          {CHAPTERS.map((chapter, index) => (
            <article key={chapter.kicker} className="grid items-center gap-6 md:grid-cols-2">
              <Rise className={index % 2 === 1 ? "md:order-2" : undefined} distance={28} end={0.72}>
                <FoodMask src={chapter.image} alt={chapter.alt} mask={chapter.mask} speed={0.18 + index * 0.04} />
              </Rise>
              <Rise distance={16} end={0.7}>
                <div className="flex flex-col gap-4">
                  <p className="font-display text-ui uppercase text-rowdy">{chapter.kicker}</p>
                  <h2 className="font-display text-mega uppercase text-bone">{chapter.title}</h2>
                  <p className="max-w-md text-body text-blush">{chapter.body}</p>
                </div>
              </Rise>
            </article>
          ))}
          <div className="flex justify-center">
            <GhostLink to="/menu" search={{ cook: "all" }}>
              Read the menu
            </GhostLink>
          </div>
        </div>
      </main>
    </Shell>
  );
}
