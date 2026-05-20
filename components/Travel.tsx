const airlines = [
  {
    name: "Malaysia Airlines",
    description: "National carrier with direct flights from major cities",
  },
  {
    name: "Air Asia",
    description: "Budget-friendly option with frequent flights",
  },
  {
    name: "Singapore Airlines",
    description: "Via Singapore, frequent daily flights",
  },
];

const visaInfo: { country: string; requirement: string }[] = [
  {
    country: "Most Countries",
    requirement: "90-day visa-free entry on arrival",
  },
  {
    country: "USA, UK, EU",
    requirement: "No visa needed for stays under 90 days",
  },
  { country: "Australia", requirement: "eVisa required before travel" },
  { country: "India", requirement: "eVisa available for tourism" },
];

export function Travel() {
  return (
    <section id="travel" className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">Come fly with me</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">
            Getting to Malaysia
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <div className="mt-10 space-y-10">
          <div>
            <p className="text-foreground/80 leading-relaxed">
              Fly into <strong>Kuala Lumpur International Airport (KUL)</strong>
              , located in Sepang about 45 minutes from the city center.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              From the airport, you can take a taxi, grab a ride, or arrange a
              transfer to your hotel. We recommend downloading the{" "}
              <strong>Grab</strong> app for convenient transportation.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl text-hibiscus">
              Recommended Airlines
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {airlines.map((airline) => (
                <div
                  key={airline.name}
                  className="rounded-lg border border-border p-4"
                >
                  <h4 className="font-display text-lg text-foreground">
                    {airline.name}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {airline.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl text-hibiscus">
              Visa Information
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Malaysia offers visa-free entry for citizens of many countries.
              Please check your specific requirements before traveling.
            </p>
            <div className="mt-4 space-y-3">
              {visaInfo.map((item) => (
                <div key={item.country} className="flex gap-4">
                  <span className="font-display text-foreground">
                    {item.country}
                  </span>
                  <span className="text-foreground/80">{item.requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
