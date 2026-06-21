import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Place {
  name: string;
  description: string;
  details: string;
  address: string;
  lat: number;
  lng: number;
  category: "accommodation" | "sightseeing";
}

const places: Place[] = [
  {
    name: "The Face Style",
    description: "Luxury suites with city views",
    details: "Stylish suites in the heart of KL with a stunning rooftop infinity pool overlooking the Petronas Towers. Walking distance to shopping, dining, and public transport.",
    address: "1020 Jalan Sultan Ismail, 50250 Kuala Lumpur",
    lat: 3.1708,
    lng: 101.6852,
    category: "accommodation",
  },
  {
    name: "The Ritz-Carlton",
    description: "5-star luxury near Petronas",
    details: "World-class luxury hotel on the Golden Triangle, offering elegant rooms, fine dining, and exceptional service. Steps from KLCC and the Petronas Towers.",
    address: "168 Jalan Ampang, 50450 Kuala Lumpur",
    lat: 3.1556,
    lng: 101.7082,
    category: "accommodation",
  },
  {
    name: "Hotel Indigo",
    description: "Boutique stay in Bukit Bintang",
    details: "A colourful boutique hotel in the buzzing Bukit Bintang district, featuring locally inspired décor and a rooftop bar. Surrounded by shopping malls, street food, and nightlife.",
    address: "126 Jalan Bukit Bintang, 55100 Kuala Lumpur",
    lat: 3.1452,
    lng: 101.7065,
    category: "accommodation",
  },
  {
    name: "Batu Caves",
    description: "Limestone caves with Hindu temples",
    details: "A massive limestone hill featuring a series of caves and cave temples, reached by climbing 272 colourful steps. Home to the famous Thaipusam festival and resident temple monkeys.",
    address: "Gombak, 68100 Batu Caves, Selangor",
    lat: 3.139,
    lng: 101.6839,
    category: "sightseeing",
  },
  {
    name: "Petronas Towers",
    description: "Iconic twin skyscrapers",
    details: "The iconic 88-storey twin towers and former tallest buildings in the world. Visit the Skybridge and observation deck, or explore the upscale Suria KLCC mall at its base.",
    address:
      "Concourse Level, Lower Ground, Kuala Lumpur City Centre, 50088 Kuala Lumpur",
    lat: 3.1556,
    lng: 101.7082,
    category: "sightseeing",
  },
  {
    name: "Merdeka 118",
    description: "Second tallest building in Malaysia",
    details: "A striking new supertall skyscraper standing at 678.9 metres, now the second tallest building in the world. Features an observation deck with panoramic views of the city.",
    address: "Jalan Hang Jebat, 50150 Kuala Lumpur",
    lat: 3.1478,
    lng: 101.7006,
    category: "sightseeing",
  },
  {
    name: "Bukit Bintang",
    description: "Shopping and entertainment district",
    details: "Kuala Lumpur's premier shopping and entertainment hub, packed with malls (Pavilion, Lot 10, Starhill), hawker stalls, rooftop bars, and live music. The energy here is unmatched.",
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
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      if (visibleHeight < rect.height * 0.5) {
        mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
          <div className="absolute bottom-0 left-0 z-[1000] flex gap-4 rounded-tr-lg rounded-bl-lg bg-white/80 px-4 py-2 text-xs tracking-wider uppercase shadow-sm backdrop-blur-sm">
            {(Object.keys(categoryColors) as Place["category"][]).map(
              (cat) => (
                <span key={cat} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: categoryColors[cat] }}
                  />
                  {categoryLabels[cat]}
                </span>
              ),
            )}
          </div>
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

        <p className="mt-8 text-center font-body text-base text-muted-foreground">
          {selected ? (
            <span>
              <strong className="text-foreground">{selected.name}</strong>
              <span className="block mt-1.5">{selected.details}</span>
            </span>
          ) : (
            "Select a recommendation below for more information"
          )}
        </p>

        <div className="mt-10 space-y-8">
          {(Object.keys(grouped) as Place["category"][]).map((category) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display text-xl md:text-2xl text-hibiscus">
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
