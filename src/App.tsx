import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Toaster } from "@/components/ui/sonner";

const Schedule = lazy(() => import("@/components/Schedule").then(m => ({ default: m.Schedule })));
const Venue = lazy(() => import("@/components/Venue").then(m => ({ default: m.Venue })));
const Travel = lazy(() => import("@/components/Travel").then(m => ({ default: m.Travel })));
const Accommodation = lazy(() => import("@/components/Accommodation").then(m => ({ default: m.Accommodation })));
const Explore = lazy(() => import("@/components/Explore").then(m => ({ default: m.Explore })));
const FAQ = lazy(() => import("@/components/FAQ").then(m => ({ default: m.FAQ })));
const RSVP = lazy(() => import("@/components/RSVP").then(m => ({ default: m.RSVP })));

type Tab = "schedule" | "venue" | "travel" | "accommodation" | "explore" | "faq";

const tabs: { id: Tab; label: string }[] = [
  { id: "schedule", label: "Schedule" },
  { id: "venue", label: "Venue" },
  { id: "travel", label: "Travel" },
  { id: "accommodation", label: "Accommodation" },
  { id: "explore", label: "Explore" },
  { id: "faq", label: "FAQ" },
];

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-hibiscus border-t-transparent" />
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("schedule");

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return <Schedule />;
      case "venue":
        return <Venue />;
      case "travel":
        return <Travel />;
      case "accommodation":
        return <Accommodation />;
      case "explore":
        return <Explore />;
      case "faq":
        return <FAQ />;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Hero />

      <div className="bg-secondary/40">
        <div className="mx-auto flex max-w-3xl justify-center gap-8 px-6 py-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative font-body text-sm tracking-[0.2em] uppercase transition"
            >
              <span className={activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"}>
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

      <div className="bg-secondary/40 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <Suspense fallback={<LoadingSpinner />}>
              {renderContent()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <RSVP />
      </Suspense>

      <footer className="border-t border-border py-10 text-center">
        <p className="font-script text-3xl text-hibiscus">Sasha & Nathan</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Kuala Lumpur · 2027
        </p>
      </footer>
      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;