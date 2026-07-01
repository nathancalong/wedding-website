import { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import waxSeal from "@/assets/wax-seal.png";
import { HeroHeader } from "@/components/HeroHeader";

interface IntroOverlayProps {
  onDismiss: () => void;
}

type Phase = "idle" | "opening" | "done";

export function IntroOverlay({ onDismiss }: IntroOverlayProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showHint, setShowHint] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (phase !== "idle") return;
    const timer = setTimeout(() => setShowHint(true), 10000);
    return () => clearTimeout(timer);
  }, [phase]);

  useLayoutEffect(() => {
    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      history.scrollRestoration = prev;
    };
  }, []);

  useEffect(() => {
    const timers = [
      requestAnimationFrame(() => window.scrollTo(0, 0)),
      setTimeout(() => window.scrollTo(0, 0), 0),
      setTimeout(() => window.scrollTo(0, 0), 100),
    ];
    return () => timers.forEach((id) => clearTimeout(id as number));
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOpen = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("done");
      setTimeout(onDismiss, 600);
    }, 2200);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Envelope body — fills the entire viewport */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              background:
                "linear-gradient(175deg, #f2ebe0 0%, #ece3d4 30%, #e6dbca 60%, #e0d4c2 100%)",
            }}
          >
            {/* Subtle vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.06) 100%)",
              }}
            />

            {/* Bottom fold triangles */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
            >
              <polygon points="0,1000 500,400 0,400" fill="rgba(0,0,0,0.04)" />
              <polygon
                points="1000,1000 500,400 1000,400"
                fill="rgba(0,0,0,0.025)"
              />
            </svg>
          </div>

          {/* Page — the letter inside the envelope, matches hero bg */}
          <motion.div
            className="absolute inset-0"
            style={{ zIndex: 6, backgroundColor: "var(--color-background)", willChange: "clip-path" }}
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={
              phase === "opening"
                ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }
                : { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }
            }
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Envelope flap — trapezoid top, tapering to point at 60% */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[60vh] origin-top"
            initial={{ rotateX: 0 }}
            animate={phase === "opening" ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200, zIndex: 10, backfaceVisibility: "hidden", willChange: "transform" }}
          >
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-full"
              preserveAspectRatio="none"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.1))" }}
            >
              <defs>
                <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f5ede2" />
                  <stop offset="50%" stopColor="#ece3d4" />
                  <stop offset="100%" stopColor="#e0d4c2" />
                </linearGradient>
              </defs>
              <polygon
                points="0,0 1000,0 1000,200 500,600 0,200"
                fill="url(#flapGrad)"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="1"
              />
              <polygon
                points="0,0 1000,0 1000,200 500,600 0,200"
                fill="rgba(0,0,0,0.02)"
              />
            </svg>
          </motion.div>

          {/* Hero header — hidden behind the flap, revealed on open */}
          <div
            className="absolute inset-0 flex items-start justify-center"
            style={{ zIndex: 7 }}
          >
            <div className="mx-auto max-w-6xl px-6 pt-12 md:pt-24 w-full">
              <HeroHeader
                animate
                animationState={phase === "opening" ? "visible" : "hidden"}
              />
            </div>
          </div>

          {/* Wax seal — at flap apex */}
          {/* Pulse highlight ring — sits behind the seal */}
          <AnimatePresence>
            {showHint && phase === "idle" && !isHovering && (
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  top: "calc(60% - 30px)",
                  left: "50%",
                  marginTop: -148,
                  marginLeft: -148,
                  width: 296,
                  height: 296,
                  zIndex: 19,
                  background: "radial-gradient(circle, rgba(190,50,40,0.5) 0%, rgba(190,50,40,0.15) 40%, transparent 70%)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.92, 1.18, 0.92],
                  transition: {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              />
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleOpen}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="absolute cursor-pointer"
            style={{
              top: "calc(60% - 30px)",
              left: "50%",
              marginTop: -140,
              marginLeft: -140,
              zIndex: 20,
              width: 280,
              height: 280,
              willChange: "transform",
            }}
            initial={false}
            animate={
              phase === "opening"
                ? { scale: 1.4, opacity: 0, rotate: 15 }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            transition={{
              duration: phase === "opening" ? 0.45 : 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            whileHover={phase !== "opening" ? { scale: 1.08 } : undefined}
            whileTap={phase !== "opening" ? { scale: 0.93 } : undefined}
          >
            <img
              src={waxSeal}
              alt="Wax seal"
              className="relative h-full w-full object-contain"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
