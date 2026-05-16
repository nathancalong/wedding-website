import { Hero } from "@/components/Hero";
import { IntroOverlay } from "@/components/IntroOverlay";
import { WeddingInfo } from "@/components/WeddingInfo";
import { FAQ } from "@/components/FAQ";
import { RSVP } from "@/components/RSVP";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <main className="min-h-screen bg-background">
      <IntroOverlay />
      <Hero />
      <WeddingInfo />
      <FAQ />
      <RSVP />
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
