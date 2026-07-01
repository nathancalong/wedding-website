export function PreWedding() {
  return (
    <section id="pre-wedding" className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">
            Excited for more celebrations?
          </p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">
            Pre-Wedding Event
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <div className="mt-10 space-y-6">
          <p className="text-center font-display text-xl text-hibiscus md:text-xl">
            24 March 2027 · Location TBD · Kuala Lumpur, Malaysia
          </p>

          <div>
            <p className="text-foreground/80 leading-relaxed">
              We warmly invite all guests to join us for a special pre-wedding
              celebration combining a traditional{" "}
              <a
                href="https://www.thetamarindtree.in/blog/nalangu-ritual/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-hibiscus decoration-2 underline-offset-2 transition hover:text-hibiscus"
              >
                Nalangu
              </a>{" "}
              and{" "}
              <a
                href="https://www.brides.com/mehndi-party-5075519"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-hibiscus decoration-2 underline-offset-2 transition hover:text-hibiscus"
              >
                Mehndi
              </a>{" "}
              ceremony.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              All guests are welcome to attend and celebrate with us.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl text-hibiscus">
              Location & Details
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              <span className="font-bold">Start time: around 9:30am</span>
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Location and further details are yet to be confirmed. We will
              share more information as the date approaches. Please watch this
              space!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
