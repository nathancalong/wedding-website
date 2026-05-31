import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const schedule = [
  { time: "4:00 PM", event: "Ceremony" },
  { time: "5:30 PM", event: "Cocktail Hour" },
  { time: "6:30 PM", event: "Reception" },
  { time: "7:00 PM", event: "Speeches" },
  { time: "7:30 PM", event: "Dinner" },
  { time: "8:30 PM", event: "First Dance" },
  { time: "9:00 PM", event: "Party" },
];

const venue = {
  name: "Botanica + Co Bamboo Hills",
  address:
    "P-09, Taman Bukit Bambu, Off Lebuhraya Duta - Ulu Kelang, Taman Bamboo, 51200 Kuala Lumpur",
  lat: 3.1936680474769084,
  lng: 101.67396215286365,
};

export function WeddingInfo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([venue.lat, venue.lng], 15);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker([venue.lat, venue.lng]).addTo(map);
    marker
      .bindPopup(`<strong>${venue.name}</strong><br>${venue.address}`)
      .openPopup();

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <section id="info" className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">
            Everything you need to know
          </p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">
            Wedding Information
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <div className="mt-10 space-y-6">
          <div>
            <h3 className="font-display text-2xl text-hibiscus">The Venue</h3>
            <h2 className="font-display text-2xl text-foreground">
              Botanica + Co Bamboo Hills
            </h2>
          </div>

          <div className="relative mt-10">
            <div
              ref={mapRef}
              className="h-[400px] w-full rounded-lg border border-border"
            />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-0 right-0 z-[1000] rounded-br-lg rounded-tl-lg bg-hibiscus px-5 py-2.5 font-body text-sm tracking-[0.2em] uppercase text-white transition hover:brightness-110"
            >
              Get Directions
            </a>
          </div>

          <p className="mt-8 text-center text-lg text-foreground/80">
            Dress code: Tropical formal — light fabrics, bold colors, and your
            most joyful attire.
          </p>

          <div className="mt-12 space-y-0">
            {schedule.map(({ time, event }, idx) => (
              <div
                key={event}
                className={`flex items-center gap-6 py-4 ${idx !== schedule.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <span className="font-display text-xl text-hibiscus w-24">
                  {time}
                </span>
                <span className="font-display text-xl text-foreground flex-1">
                  {event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
