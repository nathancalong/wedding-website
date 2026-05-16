import { useEffect, useState } from "react";
import monstera from "@/assets/leaf-monstera.png";
import banana from "@/assets/leaf-banana.png";
import palm from "@/assets/leaf-palm.png";
import fern from "@/assets/leaf-fern.png";

const LEAVES = [monstera, banana, palm, fern, monstera, palm, banana, fern, monstera, palm, fern, banana, palm, monstera, banana, fern, palm, monstera];

// Pseudo-random but deterministic positions across the viewport
const items = LEAVES.map((src, i) => {
  const col = i % 6;
  const row = Math.floor(i / 6);
  const left = col * 18 + (row % 2 === 0 ? 0 : 9) + (i * 7) % 5;
  const top = row * 32 + (i * 11) % 10;
  const rot = ((i * 73) % 180) - 90;
  const ex = ((i * 53) % 200 - 100) + "vw";
  const ey = ((i * 37) % 160 - 80) + "vh";
  const size = 160 + (i * 23) % 220;
  return { src, left, top, rot, ex, ey, size, delay: 0.04 * i };
});

export function IntroOverlay() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 3200);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] pointer-events-none bg-background"
      style={{ animation: "intro-fade-out 3.2s ease-out forwards" }}
    >
      {items.map((it, i) => (
        <img
          key={i}
          src={it.src}
          alt=""
          width={512}
          height={512}
          className="absolute"
          style={{
            left: `${it.left}%`,
            top: `${it.top}%`,
            width: `${it.size}px`,
            height: "auto",
            ["--r" as never]: `${it.rot}deg`,
            ["--ex" as never]: it.ex,
            ["--ey" as never]: it.ey,
            animation: `leaf-in 0.7s ${it.delay}s cubic-bezier(.2,.8,.2,1) both, leaf-out 1.4s ${1.5 + it.delay * 0.3}s cubic-bezier(.6,.05,.4,1) both`,
          }}
        />
      ))}
    </div>
  );
}
