import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Hero } from "@/components/Hero";
import { WeddingInfo } from "@/components/WeddingInfo";
import { Travel } from "@/components/Travel";
import { Explore } from "@/components/Explore";
import { FAQ } from "@/components/FAQ";
import { PreWedding } from "@/components/PreWedding";
import { RSVP } from "@/components/RSVP";
import { Toaster } from "@/components/ui/sonner";

type Tab = "info" | "travel" | "explore" | "faq" | "pre-wedding";

const tabs: { id: Tab; label: string }[] = [
  { id: "info", label: "Info" },
  { id: "travel", label: "Travel" },
  { id: "pre-wedding", label: "Events" },
  { id: "explore", label: "Explore" },
  { id: "faq", label: "FAQ" },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [showOverlay, setShowOverlay] = useState(true);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [direction, setDirection] = useState(1);
  const [tabsVisible, setTabsVisible] = useState(true);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabsEl = tabsRef.current;
    if (!tabsEl) return;

    const tabsObserver = new IntersectionObserver(
      ([entry]) => setTabsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 80px 0px" }
    );

    tabsObserver.observe(tabsEl);

    return () => {
      tabsObserver.disconnect();
    };
  }, []);

  const currentIndex = tabs.findIndex((t) => t.id === activeTab);

  const navigateToTab = useCallback(
    (tab: Tab) => {
      const newIndex = tabs.findIndex((t) => t.id === tab);
      setDirection(newIndex > currentIndex ? 1 : -1);
      setActiveTab(tab);
    },
    [currentIndex],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".leaflet-container")) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest(".leaflet-container")) return;
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const minSwipe = 50;
      const maxVerticalForSwipe = 75;
      if (Math.abs(dy) > maxVerticalForSwipe) return;
      if (Math.abs(dx) < minSwipe) return;
      if (dx > 0 && currentIndex < tabs.length - 1) {
        navigateToTab(tabs[currentIndex + 1].id);
      } else if (dx < 0 && currentIndex > 0) {
        navigateToTab(tabs[currentIndex - 1].id);
      }
    },
    [currentIndex, navigateToTab],
  );

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence>
        {showOverlay && (
          <IntroOverlay
            onDismiss={() => {
              setShowOverlay(false);
              setIntroDismissed(true);
            }}
          />
        )}
      </AnimatePresence>
      <div>
        <Hero startCountdown={introDismissed} />
      </div>

      <div className={`sticky top-0 z-[1000] bg-secondary/40 backdrop-blur-sm transition duration-300 ${tabsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="mx-auto flex max-w-3xl justify-center gap-8 px-6 py-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateToTab(tab.id)}
              className="relative font-body text-sm tracking-[0.2em] uppercase transition"
            >
              <span
                className={
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-hibiscus"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={tabsRef}
        className="bg-secondary/40 relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ opacity: 0, x: dir * 100 }),
              center: { opacity: 1, x: 0 },
              exit: (dir: number) => ({ opacity: 0, x: dir * -100 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            {activeTab === "info" && <WeddingInfo />}
            {activeTab === "travel" && <Travel />}
            {activeTab === "explore" && <Explore />}
            {activeTab === "faq" && <FAQ />}
            {activeTab === "pre-wedding" && <PreWedding />}
          </motion.div>
        </AnimatePresence>
      </div>

      <RSVP />

      <footer className="">
        <div className="py-6 text-center bg-secondary/40">
          <p className="font-names text-3xl text-foreground">
            Sasha <span className="text-hibiscus">&</span> Nathan
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            26 March 2027 · Botanica & Co · Kuala Lumpur, Malaysia
          </p>
        </div>
      </footer>
      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;
