import { useState, useEffect } from "react";
import img1 from "@/assets/image1.jpg";
import img2 from "@/assets/image2.jpg";
import img3 from "@/assets/image3.jpg";
import img4 from "@/assets/image4.jpg";
import img5 from "@/assets/image5.jpg";
import img6 from "@/assets/image6.jpg";
import { HeroHeader } from "@/components/HeroHeader";
import { ImageCarousel } from "@/components/ImageCarousel";

const images = [
  { src: img1, alt: "Sasha and Nathan 1" },
  { src: img2, alt: "Sasha and Nathan 2" },
  { src: img3, alt: "Sasha and Nathan 3" },
  { src: img4, alt: "Sasha and Nathan 4" },
  { src: img5, alt: "Sasha and Nathan 5" },
  { src: img6, alt: "Sasha and Nathan 6" },
];

const weddingDate = new Date("2027-03-26T16:00:00");

function computeTimeLeft() {
  const diff = weddingDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Hero({ startCountdown }: { startCountdown: boolean }) {
  const [timeLeft, setTimeLeft] = useState(computeTimeLeft);

  useEffect(() => {
    if (!startCountdown) return;
    setTimeLeft(computeTimeLeft());
    const interval = setInterval(() => setTimeLeft(computeTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [startCountdown]);

  return (
    <section className="relative flex min-h-screen flex-col w-full bg-background">
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

        <div className="mt-8 text-center">
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

      <div className="flex flex-1 items-center justify-center">
        <ImageCarousel
          images={images}
          className="mx-auto max-w-xl px-4 sm:max-w-xl sm:px-6 md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-8xl"
          disabled={!startCountdown}
        />
      </div>
    </section>
  );
}
