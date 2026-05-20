const items = [
  {
    title: "The Date",
    body: "March 26, 2027. The ceremony will begin at 4:00 PM.",
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
];

export function WeddingInfo() {
  return (
    <section id="info" className="py-12 md:py-16">
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">A celebration of love</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">Wedding Information</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <dl className="mt-10 space-y-8">
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