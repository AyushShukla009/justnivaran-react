import { useRef, useEffect } from "react";

/**
 * Restricted 3D Card Tilt Component
 * Strictly constrained to max 3deg tilt, max 3px elevation, and 1.01 scale.
 * Avoids React re-renders by mutating CSS custom properties via requestAnimationFrame.
 * Fully disabled on mobile/touch devices and when prefers-reduced-motion is active.
 */
function TiltCard({ children, className = "", style = {}, ...props }) {
  const cardRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Check if hover is supported and reduced motion is NOT preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (prefersReducedMotion || !canHover) {
      return;
    }

    let isHovering = false;

    const handleMouseMove = (e) => {
      if (!isHovering) return;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Relative coordinates from center: -0.5 to +0.5
        const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
        const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

        // Maximum rotation: 2.5 degrees (strictly <= 3deg)
        const rotX = -yPercent * 5;
        const rotY = xPercent * 5;

        // Glare coordinates: 0% to 100%
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--tilt-rx", `${rotX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-ry", `${rotY.toFixed(2)}deg`);
        card.style.setProperty("--tilt-tz", "3px");
        card.style.setProperty("--tilt-scale", "1.01");
        card.style.setProperty("--glare-x", `${glareX.toFixed(1)}%`);
        card.style.setProperty("--glare-y", `${glareY.toFixed(1)}%`);
        card.style.setProperty("--glare-opacity", "0.10");
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
      card.style.setProperty("--glare-opacity", "0.10");
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Smoothly return to rest
      card.style.setProperty("--tilt-rx", "0deg");
      card.style.setProperty("--tilt-ry", "0deg");
      card.style.setProperty("--tilt-tz", "0px");
      card.style.setProperty("--tilt-scale", "1");
      card.style.setProperty("--glare-opacity", "0");
    };

    card.addEventListener("mousemove", handleMouseMove, { passive: true });
    card.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    card.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export default TiltCard;
