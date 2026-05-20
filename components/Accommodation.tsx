import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Place {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

const places: Place[] = [
  {
    name: "The Face Style",
    description: "Luxury suites with city views",
    lat: 3.1708,
    lng: 101.6852,
  },
  {
    name: "The Ritz-Carlton",
    description: "5-star luxury near Petronas",
    lat: 3.1556,
    lng: 101.7082,
  },
  {
    name: "Hotel Indigo",
    description: "Boutique stay in Bukit Bintang",
    lat: 3.1452,
    lng: 101.7065,
  },
];

export function Accommodation() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([3.1556, 101.7065], 13);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map);

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng]).addTo(map);
      marker.bindPopup(
        `<strong>${place.name}</strong><br>${place.description}`,
      );
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <section id="stay" className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">Where to stay</p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">
            Our Recommendations
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <div
          ref={mapRef}
          className="mt-10 h-[400px] w-full rounded-lg border border-border"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {places.map((place) => (
            <div
              key={place.name}
              className="rounded-lg border border-border p-5"
            >
              <h3 className="font-display text-xl text-foreground">
                {place.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {place.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
