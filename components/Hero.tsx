import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Sasha and Nathan in a Malaysian jungle scene with the Petronas Twin Towers in the distance"
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/10 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-hibiscus/10 via-transparent to-sunset/15" />
      </div>

      {/* Content — text anchored at top, couple sits in the image below */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pt-14 md:pt-16 text-center">
        <p
          className="font-script text-3xl md:text-4xl text-hibiscus animate-hero-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          Together with our families
        </p>

        <h1
          className="mt-2 font-names text-6xl md:text-8xl lg:text-9xl text-foreground leading-[1] animate-hero-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Nathan
          <span className="mx-2 inline-block text-hibiscus align-middle">
            &
          </span>
          Sasha
        </h1>

        <div className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-hibiscus to-transparent animate-shimmer-line" />

        <p
          className="mt-4 font-display text-lg md:text-xl tracking-[0.25em] uppercase text-foreground/90 animate-hero-fade-up"
          style={{ animationDelay: "1.0s" }}
        >
          Kuala Lumpur · 2027
        </p>

        <a
          href="#rsvp"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("rsvp")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="mt-auto mb-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.03] hover:shadow-xl animate-hero-fade-up"
          style={{ animationDelay: "1.5s" }}
        >
          RSVP
        </a>
      </div>
    </section>
  );
}
