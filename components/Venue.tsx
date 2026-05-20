import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const venue = {
  name: "Botanica + Co Bamboo Hills",
  address:
    "P-09, Taman Bukit Bambu, Off Lebuhraya Duta - Ulu Kelang, Taman Bamboo, 51200 Kuala Lumpur",
  lat: 3.1936680474769084,
  lng: 101.67396215286365,
};

export function Venue() {
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
    <section id="venue" className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">The venue</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">
            Botanica + Co Bamboo Hills
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <div
          ref={mapRef}
          className="mt-10 h-[400px] w-full rounded-lg border border-border"
        />

        <p className="mt-6 text-center text-muted-foreground">
          {venue.address}
        </p>

        <div className="mt-8 text-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-hibiscus px-8 py-3 font-body text-sm tracking-[0.2em] uppercase text-white transition hover:bg-hibiscus/80"
          >
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
