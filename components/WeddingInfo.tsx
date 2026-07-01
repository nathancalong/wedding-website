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

        <div className="mt-10 space-y-2">
          <div>
            <h3 className="font-display text-2xl text-hibiscus text-center">
              Botanica + Co Bamboo Hills
            </h3>
            <h2 className="font-display text-2xl text-foreground"></h2>
          </div>

          <div className="relative mb-6">
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

          <div className="mt-10 space-y-6">
            <div>
              <h3 className="font-display text-2xl text-hibiscus">
                Event details
              </h3>
              <p className="mt-4 text-foreground/80 leading-relaxed">
                <span className="font-bold">Start time: 4:30pm</span>
              </p>
              <p className="mt-4 text-foreground/80 leading-relaxed">
                We invite guests to arrive at 4pm to be relaxed and seated prior
                to the start time so the ceremony can begin.
              </p>
              <p className="mt-4 text-foreground/80 leading-relaxed">
                Ceremony to be hosted outdoors in the gardens of Botanica + Co,
                with the reception to follow.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl text-hibiscus">
                Dress Code
              </h3>
              <p className="mt-4 text-foreground/80 leading-relaxed">
                Cultural attire is encouraged, semi-formal outfits are also
                welcome.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
