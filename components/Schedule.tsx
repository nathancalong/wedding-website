const schedule = [
  { time: "4:00 PM", event: "Ceremony" },
  { time: "5:30 PM", event: "Cocktail Hour" },
  { time: "6:30 PM", event: "Reception" },
  { time: "7:00 PM", event: "Speeches" },
  { time: "7:30 PM", event: "Dinner" },
  { time: "8:30 PM", event: "First Dance" },
  { time: "9:00 PM", event: "Party" },
];

export function Schedule() {
  return (
    <section id="schedule" className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">The schedule</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">March 26, 2027</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <p className="mt-8 text-center text-lg text-foreground/80">
          Dress code: Tropical formal — light fabrics, bold colors, and your most joyful attire.
        </p>

        <div className="mt-12 space-y-0">
          {schedule.map(({ time, event }, idx) => (
            <div
              key={event}
              className={`flex items-center gap-6 py-4 ${idx !== schedule.length - 1 ? "border-b border-border/60" : ""}`}
            >
              <span className="font-display text-xl text-hibiscus w-24">{time}</span>
              <span className="font-display text-xl text-foreground flex-1">{event}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}