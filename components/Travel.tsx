const airlines = [
  {
    name: "Malaysia Airlines",
    description: "National carrier with direct flights from major cities",
  },
  {
    name: "Air Asia",
    description: "Budget-friendly option with frequent direct flights",
  },
  {
    name: "Singapore Airlines",
    description: "Via Singapore, frequent daily flights",
  },
  {
    name: "Scoot Airlines",
    description:
      "Lowest cost option, typically with long layovers in Singapore",
  },
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
              Fly into{" "}
              <strong>
                <a
                  href="https://airports.malaysiaairports.com.my/en/klia1"
                  target="blank"
                  className="underline"
                >
                  Kuala Lumpur International Airport
                </a>
              </strong>{" "}
              (KUL), located in Sepang about 45 minutes from the city center.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              From the airport, you can take a taxi, public transport, or
              private transfer to your hotel. We strongly recommend downloading
              the{" "}
              <strong>
                <a
                  href="https://www.grab.com/my/download/"
                  target="blank"
                  className="underline"
                >
                  Grab
                </a>
              </strong>{" "}
              app for convenient transportation, it's the Uber of South-east
              Asia, is affordable, easy to use and convenient. You can download
              the app and set up an account ahead of time - no need to stress at
              the airport.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl text-hibiscus">
              Visa Information
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You must complete a{" "}
              <strong>
                <a
                  href="https://imigresen-online.imi.gov.my/mdac/main"
                  className="underline"
                  target="blank"
                >
                  Malaysia Digital Arrival Card (MDAC)
                </a>
              </strong>{" "}
              before you arrive. The MDAC must be submitted through the{" "}
              <a
                href="https://imigresen-online.imi.gov.my/mdac/main"
                target="blank"
                className="underline"
              >
                Malaysian Immigration website
              </a>
              .
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You can read more on the{" "}
              <a
                href="https://www.smartraveller.gov.au/destinations/asia/malaysia"
                target="blank"
                className="underline"
              >
                Australian Government SmartTraveller
              </a>{" "}
              website for the latest recommendations and travel requirements
              around travel to Malaysia.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl text-hibiscus">
              Travel Cards
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              As with most international travel it's advisable to set up a
              travel card for ease of use while overseas. We personally
              recommend{" "}
              <strong>
                <a
                  href="https://wise.com/"
                  className="underline"
                  target="blank"
                >
                  Wise
                </a>
              </strong>{" "}
              as it is low fees, works for ATM withdrawals, plus Grab and other
              international apps.
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
        </div>
      </div>
    </section>
  );
}
