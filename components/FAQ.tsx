import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need a visa to visit Malaysia?",
    a: "Most nationalities receive a 90-day visa on arrival. We recommend checking your country's specific requirements at least three months before traveling.",
  },
  {
    q: "Where should I stay?",
    a: "We'll be sharing a curated list of recommended hotels in Kuala Lumpur, ranging from boutique stays in the city center to luxury options near the Petronas Towers.",
  },
  {
    q: "What's the weather like?",
    a: "Tropical and warm year-round — expect 28–32°C (82–90°F) with occasional showers. Pack light, breathable clothing.",
  },
  {
    q: "Will there be transportation provided?",
    a: "Shuttles will run between the recommended hotels and the venue on the wedding day. Details will arrive with your invitation.",
  },
  {
    q: "Can I bring a plus one?",
    a: "Plus ones will be specified on your invitation. If you have questions, please reach out to us directly.",
  },
  {
    q: "Are children welcome?",
    a: "We adore little ones, but our celebration is adults-only. We hope this gives you a chance to enjoy the evening fully.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">Good to know</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">Frequently Asked</h2>
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
