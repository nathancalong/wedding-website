import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Can I take photos during the ceremony?",
    a: "We'd love for you to be fully present with us during the ceremony. We're having an unplugged ceremony, so please keep phones and cameras away until cocktail hour. Our professional photographers will capture everything beautifully, and plenty of photos will be shared post celebrations.",
  },
  {
    q: "Is the ceremony indoors or outdoors?",
    a: "The ceremony and reception will be held at Botanica + Co Bamboo Hills, which features both indoor and outdoor spaces. We'll be making the most of the outdoor setting for our ceremony, so do consider this for dress accordingly and preparing for some warm, humid weather until the celebrations move indoors.",
  },
  {
    q: "Is there parking at the venue?",
    a: "Yes — Botanica + Co Bamboo Hills has on-site parking available and have ensured us that all guests traveling by car would have a spot available for them.",
  },
  {
    q: "Can I bring a plus one?",
    a: "If you would like to include more than on your current invitation, please reach out to us directly. We are considering numbers and availability of the venue.",
  },
  {
    q: "Should I arrive early?",
    a: "We recommend arriving at least 20-30 minutes before the ceremony start time to settle in. Please allow for some travel time on the day as traffic can vary and add significant time to the journey, even from close by in the city.",
  },
  // TODO: q: "Will there be transportation provided?",
  {
    q: "What's the weather like around the ceremony time of year?",
    a: "Tropical and warm year-round, expect 28-32°C with occasional showers or heavier rain, mostly in the afternoons. Pack light, breathable clothing.",
  },
  {
    q: "Do you have a gift registry?",
    a: "Your presence is the greatest gift of all. We appreciate the time, leave and travel that you would undertake to join us on our special day. If you feel you must gift us something, please contact the couple directly.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">Good to know</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">
            Frequently Asked
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-5 shadow-sm"
            >
              <AccordionTrigger className="text-left font-display text-xl text-foreground hover:no-underline [&[data-state=open]>span]:border-b-2 [&[data-state=open]>span]:border-hibiscus [&[data-state=open]>span]:pb-0.5">
                <span>{f.q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
