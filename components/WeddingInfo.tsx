import monstera from "@/assets/leaf-monstera.png";
import palm from "@/assets/leaf-palm.png";
import hibiscus from "@/assets/flower-hibiscus-red.png";
import frangipani from "@/assets/flower-frangipani.png";

const items = [
  {
    title: "The Date",
    body: "Spring 2027. Final date and times will be confirmed on your invitation.",
  },
  {
    title: "The Place",
    body: "Kuala Lumpur, Malaysia. Ceremony and reception at a venue overlooking the city skyline.",
  },
  {
    title: "The Dress Code",
    body: "Tropical formal — light fabrics, bold colors, and your most joyful attire.",
  },
  {
    title: "Getting There",
    body: "Fly into Kuala Lumpur International Airport (KUL). Travel guide coming soon.",
  },
  {
    title: "Where to Stay",
    body: "We'll share a curated list of hotels nearby — from boutique stays in Bukit Bintang to luxury rooms by the Petronas Towers.",
  },
  {
    title: "Things to Do",
    body: "Make a holiday of it — Batu Caves, the night markets, Penang street food, or the rainforests of Taman Negara.",
  },
];

export function WeddingInfo() {
  return (
    <section id="info" className="relative overflow-hidden py-24 md:py-32">
      {/* Botanical decorations */}
      <img src={monstera} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute -left-20 top-10 w-72 opacity-40 -rotate-12" />
      <img src={palm} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute -right-24 top-40 w-80 opacity-40 rotate-12" />
      <img src={hibiscus} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute right-10 bottom-16 w-32 opacity-70" />
      <img src={frangipani} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute left-12 bottom-24 w-28 opacity-80" />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">A celebration of love</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">Wedding Information</h2>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <dl className="mt-16 space-y-10">
          {items.map(({ title, body }) => (
            <div key={title} className="border-b border-border/60 pb-8 last:border-b-0">
              <dt className="font-display text-2xl md:text-3xl text-hibiscus">{title}</dt>
              <dd className="mt-3 text-base md:text-lg text-foreground/80 leading-relaxed">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
