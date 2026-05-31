import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Place {
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  category: "accommodation" | "sightseeing";
}

const places: Place[] = [
  {
    name: "The Face Style",
    description: "Luxury suites with city views",
    address: "1020 Jalan Sultan Ismail, 50250 Kuala Lumpur",
    lat: 3.1708,
    lng: 101.6852,
    category: "accommodation",
  },
  {
    name: "The Ritz-Carlton",
    description: "5-star luxury near Petronas",
    address: "168 Jalan Ampang, 50450 Kuala Lumpur",
    lat: 3.1556,
    lng: 101.7082,
    category: "accommodation",
  },
  {
    name: "Hotel Indigo",
    description: "Boutique stay in Bukit Bintang",
    address: "126 Jalan Bukit Bintang, 55100 Kuala Lumpur",
    lat: 3.1452,
    lng: 101.7065,
    category: "accommodation",
  },
  {
    name: "Batu Caves",
    description: "Limestone caves with Hindu temples",
    address: "Gombak, 68100 Batu Caves, Selangor",
    lat: 3.139,
    lng: 101.6839,
    category: "sightseeing",
  },
  {
    name: "Petronas Towers",
    description: "Iconic twin skyscrapers",
    address:
      "Concourse Level, Lower Ground, Kuala Lumpur City Centre, 50088 Kuala Lumpur",
    lat: 3.1556,
    lng: 101.7082,
    category: "sightseeing",
  },
  {
    name: "Merdeka 118",
    description: "Second tallest building in Malaysia",
    address: "Jalan Hang Jebat, 50150 Kuala Lumpur",
    lat: 3.1478,
    lng: 101.7006,
    category: "sightseeing",
  },
  {
    name: "Bukit Bintang",
    description: "Shopping and entertainment district",
    address: "Bukit Bintang, 55100 Kuala Lumpur",
    lat: 3.1452,
    lng: 101.7065,
    category: "sightseeing",
  },
];

const categoryColors: Record<Place["category"], string> = {
  accommodation: "#3b82f6",
  sightseeing: "#f97316",
};

const categoryLabels: Record<Place["category"], string> = {
  accommodation: "Where to stay",
  sightseeing: "Things to see",
};

function createMarkerIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="40" viewBox="0 0 25 40">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5S12.5 40 12.5 40 25 19.4 25 12.5 19.4 0 12.5 0z" fill="${color}"/>
    <circle cx="12.5" cy="12.5" r="5" fill="white"/>
  </svg>`;
  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [25, 40],
    iconAnchor: [12.5, 40],
    popupAnchor: [0, -36],
  });
}

export function Explore() {
  const [selected, setSelected] = useState<Place | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const flyTo = useCallback((place: Place) => {
    mapInstance.current?.flyTo([place.lat, place.lng], 15, { duration: 1 });
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([3.1556, 101.7065], 13);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map);

    places.forEach((place) => {
      const icon = createMarkerIcon(categoryColors[place.category]);
      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
      marker.bindPopup(
        `<strong>${place.name}</strong><br>${place.description}`,
      );
      marker.on("click", () => setSelected(place));
      markersRef.current.set(place.name, marker);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const marker = markersRef.current.get(selected.name);
    if (marker) {
      marker.openPopup();
      flyTo(selected);
    }
  }, [selected, flyTo]);

  const grouped = places.reduce(
    (acc, place) => {
      (acc[place.category] ||= []).push(place);
      return acc;
    },
    {} as Record<Place["category"], Place[]>,
  );

  return (
    <section id="explore" className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-hibiscus">
            Explore Kuala Lumpur
          </p>
          <h2 className="mt-2 text-4xl md:text-6xl text-foreground">
            Recommendations
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-hibiscus to-transparent" />
        </div>

        <div className="relative mt-10">
          <div
            ref={mapRef}
            className="h-[400px] w-full rounded-lg border border-border"
          />
          <a
            href={
              selected
                ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.address)}`
                : undefined
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute bottom-0 right-0 z-[1000] rounded-tl-lg rounded-br-lg px-5 py-2.5 font-body text-sm tracking-[0.2em] uppercase text-white shadow-lg transition ${
              selected
                ? "bg-hibiscus hover:brightness-110"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Get Directions
          </a>
        </div>

        <div className="mt-10 space-y-8">
          {(Object.keys(grouped) as Place["category"][]).map((category) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                <h3 className="font-script text-2xl text-hibiscus">
                  {categoryLabels[category]}
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {grouped[category].map((place) => (
                  <button
                    key={place.name}
                    onClick={() =>
                      setSelected(selected?.name === place.name ? null : place)
                    }
                    className={`text-left rounded-lg border p-5 transition ${
                      selected?.name === place.name
                        ? "border-hibiscus bg-hibiscus/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <h4 className="font-display text-xl text-foreground">
                      {place.name}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {place.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
