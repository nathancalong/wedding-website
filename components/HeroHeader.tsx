import { motion } from "framer-motion";

interface HeroHeaderProps {
  animate?: boolean;
  className?: string;
  textColor?: string;
  accentColor?: string;
  animationState?: "hidden" | "visible";
}

export function HeroHeader({
  animate = false,
  className,
  textColor = "var(--color-foreground)",
  accentColor = "var(--color-hibiscus)",
  animationState = "visible",
}: HeroHeaderProps) {
  const target =
    animationState === "visible" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };

  const pProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: target,
        transition: { duration: 0.8, delay: 0.4 },
      }
    : {};

  const h1Props = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: target,
        transition: { duration: 0.8, delay: 0.6 },
      }
    : {};

  const dateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: target,
        transition: { duration: 0.8, delay: 0.8 },
      }
    : {};

  const P = animate ? motion.p : "p";
  const H1 = animate ? motion.h1 : "h1";
  const DateWrapper = animate ? motion.div : "div";

  return (
    <div className={className}>
      <div className="text-center">
        <P
          className="font-display text-xs sm:test-md md:text-lg tracking-[0.4em] uppercase"
          style={{ color: "var(--color-muted-foreground)" }}
          {...pProps}
        >
          We're Getting Married
        </P>
        <H1
          className="mt-4 font-names text-6xl sm:text-6xl md:text-9xl leading-none"
          style={{ color: textColor }}
          {...h1Props}
        >
          Sasha
          <span className="mx-4 inline-block" style={{ color: accentColor }}>
            &
          </span>
          Nathan
        </H1>
      </div>
      <DateWrapper
        className="mt-10 flex items-center justify-center gap-3 text-lg tracking-[0.15em]"
        {...dateProps}
      >
        <span
          className="font-display uppercase text-md"
          style={{ color: textColor }}
        >
          March 26, 2027 · Kuala Lumpur, Malaysia
        </span>
      </DateWrapper>
    </div>
  );
}
