import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import waxSeal from "@/assets/wax-seal.png";
import { HeroHeader } from "@/components/HeroHeader";

interface IntroOverlayProps {
  onDismiss: () => void;
}

type Phase = "idle" | "opening" | "done";

export function IntroOverlay({ onDismiss }: IntroOverlayProps) {
  const [phase, setPhase] = useState<Phase>("idle");

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Envelope body — fills the entire viewport */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                "linear-gradient(175deg, #f2ebe0 0%, #ece3d4 30%, #e6dbca 60%, #e0d4c2 100%)",
            }}
          >
            {/* Paper fiber texture */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Fine linen weave overlay */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.08) 2px,
                  rgba(0,0,0,0.08) 3px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.06) 2px,
                  rgba(0,0,0,0.06) 3px
                )`,
              }}
            />
            {/* Subtle vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.06) 100%)",
              }}
            />

            {/* Inner shadow at the top edge */}
            <div
              className="absolute top-0 left-0 right-0 h-24"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.08), transparent)",
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
              <polygon
                points="0,1000 500,650 1000,1000"
                fill="rgba(255,255,255,0.05)"
              />
            </svg>
          </motion.div>

          {/* Envelope flap — trapezoid top, tapering to point at 60% */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[60vh] origin-top"
            initial={{ rotateX: 0 }}
            animate={phase === "opening" ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200, zIndex: 10 }}
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
            style={{ zIndex: 5 }}
          >
            <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 w-full">
              <HeroHeader
                animate
                animationState={phase === "opening" ? "visible" : "hidden"}
                textColor="#3d3024"
                accentColor="rgba(180,80,60,0.5)"
              />
            </div>
          </div>

          {/* Wax seal — at flap apex */}
          <motion.button
            onClick={handleOpen}
            className="absolute cursor-pointer"
            style={{
              top: "calc(60% - 30px)",
              left: "50%",
              marginTop: -140,
              marginLeft: -140,
              zIndex: 20,
              width: 280,
              height: 280,
            }}
            initial={{ scale: 0, opacity: 0, rotate: -30 }}
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
              className="h-full w-full object-contain"
            />
          </motion.button>

          {/* Hint text below the seal */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.p
                className="absolute font-display text-xs tracking-[0.3em] uppercase text-black/15"
                style={{
                  top: "calc(60% + 130px)",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 20,
                }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Click the seal to open
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
