import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Hero } from "@/components/Hero";
import { Schedule } from "@/components/Schedule";
import { Venue } from "@/components/Venue";
import { Travel } from "@/components/Travel";
import { Accommodation } from "@/components/Accommodation";
import { Explore } from "@/components/Explore";
import { FAQ } from "@/components/FAQ";
import { RSVP } from "@/components/RSVP";
import { Toaster } from "@/components/ui/sonner";

type Tab =
  | "schedule"
  | "venue"
  | "travel"
  | "accommodation"
  | "explore"
  | "faq";

const tabs: { id: Tab; label: string }[] = [
  { id: "schedule", label: "Schedule" },
  { id: "venue", label: "Venue" },
  { id: "travel", label: "Travel" },
  { id: "accommodation", label: "Accommodation" },
  { id: "explore", label: "Explore" },
  { id: "faq", label: "FAQ" },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("schedule");
  const [showOverlay, setShowOverlay] = useState(true);
  const [introDismissed, setIntroDismissed] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence>
        {showOverlay && (
          <IntroOverlay onDismiss={() => { setShowOverlay(false); setIntroDismissed(true); }} />
        )}
      </AnimatePresence>
      <Hero startCountdown={introDismissed} />

      <div className="bg-secondary/40">
        <div className="mx-auto flex max-w-3xl justify-center gap-8 px-6 py-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      <div className="bg-secondary/40 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            {activeTab === "schedule" && <Schedule />}
            {activeTab === "venue" && <Venue />}
            {activeTab === "travel" && <Travel />}
            {activeTab === "accommodation" && <Accommodation />}
            {activeTab === "explore" && <Explore />}
            {activeTab === "faq" && <FAQ />}
          </motion.div>
        </AnimatePresence>
      </div>

      <RSVP />

      <footer className="">
        <div className="py-6 text-center bg-secondary/40">
          <p className="font-script text-3xl text-hibiscus">Sasha & Nathan</p>
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
