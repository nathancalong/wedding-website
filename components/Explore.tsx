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
  category: "accommodation" | "sightseeing" | "shopping" | "food";
}

const places: Place[] = [
  {
    name: "EQ",
    description: "Boutique luxury in the Golden Triangle",
    details: "A stunning 52-storey tower in the heart of the Golden Triangle, featuring 440 luxurious rooms, a rooftop infinity pool, Himalayan salt sauna, and Sky51 bar with panoramic city views. Awarded Best City Hotel in Malaysia by Travel+Leisure.",
    address: "Equatorial Plaza, Jalan Sultan Ismail, 50250 Kuala Lumpur",
    lat: 3.1489,
    lng: 101.7128,
    category: "accommodation",
  },
  {
    name: "Traders Hotel",
    description: "Modern hotel with iconic Petronas views",
    details: "A Shangri-La hotel located in KLCC with direct covered access to the Kuala Lumpur Convention Centre. Offers unobstructed views of the Petronas Twin Towers, a rooftop SkyBar, and complimentary buggy service to Suria KLCC.",
    address: "Kuala Lumpur City Centre, 50088 Kuala Lumpur",
    lat: 3.1571,
    lng: 101.7132,
    category: "accommodation",
  },
  {
    name: "Pullman Hotel",
    description: "5-star hotel opposite Pavilion KL",
    details: "Part of the Accor group, located opposite Pavilion Kuala Lumpur in the Golden Triangle. Features a landscaped terrace, multiple dining options including Red Chinese Cuisine, a rooftop pool, and skybridge walkways connecting to surrounding shopping and dining.",
    address: "4 Jalan Conlay, 50450 Kuala Lumpur",
    lat: 3.1505,
    lng: 101.7145,
    category: "accommodation",
  },
  {
    name: "Batu Caves",
    description: "Limestone caves with Hindu temples",
    details: "A massive limestone hill featuring a series of caves and cave temples, reached by climbing 272 colourful steps. Home to the famous Thaipusam festival and resident temple monkeys.",
    address: "Gombak, 68100 Batu Caves, Selangor",
    lat: 3.237,
    lng: 101.6825,
    category: "sightseeing",
  },
  {
    name: "Petronas Towers",
    description: "Iconic twin skyscrapers",
    details: "The iconic 88-storey twin towers and former tallest buildings in the world. Visit the Skybridge and observation deck, or explore the upscale Suria KLCC mall at its base.",
    address: "Kuala Lumpur City Centre, 50088 Kuala Lumpur",
    lat: 3.1579,
    lng: 101.712,
    category: "sightseeing",
  },
  {
    name: "KLCC Park",
    description: "Urban park with lake and fountain show",
    details: "A 50-acre urban park designed by Roberto Burle Marx at the foot of the Petronas Towers. Features a 1.3 km jogging track, children's playground, wading pool, and the Lake Symphony fountain show with lights and music nightly at 8pm, 9pm and 10pm.",
    address: "Kuala Lumpur City Centre, 50088 Kuala Lumpur",
    lat: 3.1556,
    lng: 101.715,
    category: "sightseeing",
  },
  {
    name: "Bukit Bintang",
    description: "Shopping and entertainment district",
    details: "Kuala Lumpur's premier shopping and entertainment hub, packed with malls (Pavilion, Lot 10, Starhill), hawker stalls, rooftop bars, and live music. The energy here is unmatched.",
    address: "Bukit Bintang, 55100 Kuala Lumpur",
    lat: 3.1472,
    lng: 101.7128,
    category: "sightseeing",
  },
  {
    name: "Pavilion Kuala Lumpur",
    description: "Premier shopping destination",
    details: "One of KL's most iconic malls, featuring over 700 luxury and high-street brands, a stunning rooftop garden, and an incredible food court. Located right in the heart of Bukit Bintang.",
    address: "168 Jalan Bukit Bintang, 55100 Kuala Lumpur",
    lat: 3.149,
    lng: 101.7141,
    category: "shopping",
  },
  {
    name: "Suria KLCC",
    description: "Upscale mall at the Petronas base",
    details: "A premier shopping centre beneath the Petronas Towers, home to high-end boutiques, a science centre, an art gallery, and a lush park with a stunning fountain show at night.",
    address: "Kuala Lumpur City Centre, 50088 Kuala Lumpur",
    lat: 3.1575,
    lng: 101.7117,
    category: "shopping",
  },
  {
    name: "Central Market",
    description: "Cultural landmark & artisan market",
    details: "A heritage Art Deco building transformed into a vibrant market for Malaysian arts, crafts, and batik. Perfect for finding unique souvenirs, local snacks, and traditional handcrafted goods.",
    address: "Jalan Hang Kasturi, 50050 Kuala Lumpur",
    lat: 3.1473,
    lng: 101.6956,
    category: "shopping",
  },
  {
    name: "Mid Valley Megamall",
    description: "Massive mall with 430+ stores",
    details: "One of Southeast Asia's largest shopping malls, spanning 4.5 million sq ft with over 430 stores, a cinema, arcade, bowling alley, and convention centre. Connected to The Gardens Mall with direct access via the KTM Komuter Mid Valley station.",
    address: "Lingkaran Syed Putra, 59200 Kuala Lumpur",
    lat: 3.1181,
    lng: 101.6767,
    category: "shopping",
  },
  {
    name: "Jalan Alor",
    description: "Iconic street food destination",
    details: "KL's most famous food street, lined with open-air hawker stalls serving satay, grilled seafood, noodles, and durian. The atmosphere is electric — especially after dark.",
    address: "Jalan Alor, Bukit Bintang, 50200 Kuala Lumpur",
    lat: 3.146,
    lng: 101.708,
    category: "food",
  },
  {
    name: "Atmosphere 360",
    description: "Revolving restaurant with city views",
    details: "A unique revolving restaurant atop Kuala Lumpur Tower, serving an international buffet with panoramic 360-degree views of the city skyline. Perfect for a special evening.",
    address: "Menara Kuala Lumpur, Jalan Puncak, 50250 Kuala Lumpur",
    lat: 3.1528,
    lng: 101.7038,
    category: "food",
  },
  {
    name: "Oriental Kopi",
    description: "Popular Malaysian kopitiam chain",
    details: "A beloved kopitiam serving authentic Nanyang cuisine with signature dishes including Oriental Coffee, Portuguese Egg Tarts (Malaysia Book of Records for thickest egg tart), Polo Buns, Nasi Lemak, and Kaya Toast. Multiple locations across KL including Pavilion KL and Suria KLCC.",
    address: "Lot 1.30 & 1.31, Level 1, Pavilion Kuala Lumpur, 168 Jalan Bukit Bintang, 55100 Kuala Lumpur",
    lat: 3.149,
    lng: 101.7141,
    category: "food",
  },
];

const categoryColors: Record<Place["category"], string> = {
  accommodation: "#3b82f6",
  sightseeing: "#f97316",
  shopping: "#10b981",
  food: "#ec4899",
};

const categoryLabels: Record<Place["category"], string> = {
  accommodation: "Accommodation",
  sightseeing: "Attractions",
  shopping: "Shopping",
  food: "Food & Drink",
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
          <div className="absolute top-0 right-0 z-[1000] inline-grid grid-cols-2 justify-items-end gap-x-3 gap-y-1 rounded-bl-lg rounded-tr-lg bg-white/80 px-3 py-2 text-xs max-[400px]:text-[10px] tracking-wider uppercase shadow-sm backdrop-blur-sm sm:flex sm:flex-row sm:items-center sm:gap-4 sm:px-4">
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
                        : "border-border hover:border-hibiscus hover:bg-hibiscus/5"
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
