import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import heroBg from "@/assets/hero-bg.jpg";
import coupleImg from "@/assets/couple.png";
import { HeroHeader } from "@/components/HeroHeader";

const images = [heroBg, coupleImg, coupleImg];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 50 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const weddingDate = new Date("2027-03-26T16:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <HeroHeader />

        <div className="mt-4 flex justify-center gap-8 md:gap-16">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-display text-4xl md:text-5xl text-foreground">
                {String(value).padStart(2, "0")}
              </span>
              <span className="mt-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((src, idx) => (
                <div
                  className="relative min-w-0 flex-[0_0_100%] px-2"
                  key={idx}
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                    <img
                      src={src}
                      alt={`Sasha and Nathan ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === selectedIndex ? "w-8 bg-foreground" : "w-2 bg-border"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="mt-16 pb-16 text-center">
          <a
            href="#rsvp"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("rsvp")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-block rounded-full bg-hibiscus px-10 py-3 font-body text-sm tracking-[0.25em] uppercase text-white transition hover:bg-hibiscus/80"
          >
            RSVP
          </a>
        </div>
      </div>
    </section>
  );
}
