import { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";

type ImageCarouselProps = {
  images: { src: string; alt: string }[];
  opts?: EmblaOptionsType;
  className?: string;
  disabled?: boolean;
};

export function ImageCarousel({
  images,
  opts,
  className,
  disabled,
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 50,
    ...opts,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cooldownRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const programmaticRef = useRef(false);

  const clearAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  const startAutoplay = useCallback(() => {
    clearAutoplay();
    if (!emblaApi || cooldownRef.current) return;
    intervalRef.current = setInterval(() => {
      programmaticRef.current = true;
      emblaApi.scrollNext();
      programmaticRef.current = false;
    }, 5000);
  }, [emblaApi, clearAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const container = containerRef.current;
    if (!container) return;

    const onUserInteract = () => {
      cooldownRef.current = true;
      clearAutoplay();
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        cooldownRef.current = false;
        startAutoplay();
      }, 15000);
    };

    const onSelect = () => {
      if (!programmaticRef.current) onUserInteract();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !disabled) {
          if (!cooldownRef.current) startAutoplay();
        } else {
          clearAutoplay();
        }
      },
      { threshold: 0.3 },
    );

    emblaApi.on("pointerDown", onUserInteract);
    emblaApi.on("select", onSelect);
    observer.observe(container);

    return () => {
      emblaApi.off("pointerDown", onUserInteract);
      emblaApi.off("select", onSelect);
      clearAutoplay();
      clearTimeout(resumeTimeoutRef.current);
      observer.disconnect();
    };
  }, [emblaApi, startAutoplay, clearAutoplay, disabled]);

  useEffect(() => {
    if (!disabled && emblaApi && !cooldownRef.current) {
      startAutoplay();
    }
  }, [disabled, emblaApi, startAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div ref={containerRef} className={className}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image, idx) => (
            <div className="relative min-w-0 flex-[0_0_100%] px-2" key={idx}>
              <div className="relative aspect-[3/4] sm:aspect-[16/9] overflow-hidden rounded-lg">
                <img
                  src={image.src}
                  alt={image.alt}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
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
    </div>
  );
}
