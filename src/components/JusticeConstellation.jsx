import { useRef, useEffect } from "react";

/**
 * JusticeConstellation
 * Subtle, lightweight Canvas 2D background visual illustrating:
 * Party A → Neutral → Party B & Neutral → Resolution.
 * Strictly capped at 30 nodes on desktop and 10 on mobile.
 * Pauses when off-screen or tab is hidden. Supports prefers-reduced-motion.
 */
function JusticeConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = null;
    let isVisible = true;
    let isTabActive = !document.hidden;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Responsive node count: max 28 on desktop, 10 on mobile
    const isMobile = window.innerWidth <= 768;
    const nodeCount = isMobile ? 10 : 26;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Structured Key Triad Nodes: Party A, Neutral, Party B, Outcome
    let keyNodes = [];
    let ambientNodes = [];

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      initNodes();
    };

    const initNodes = () => {
      // Primary structured nodes for dispute resolution path
      const midX = width * 0.48;
      const midY = height * 0.45;

      keyNodes = [
        { id: "A", x: midX - Math.min(width * 0.22, 140), y: midY - 20, r: 4.5, color: "#1C3A63", label: "Party A", vx: 0.08, vy: 0.04, baseOffset: 0 },
        { id: "N", x: midX, y: midY - 40, r: 6, color: "#D19A34", label: "Neutral", vx: 0.05, vy: -0.06, baseOffset: Math.PI / 2 },
        { id: "B", x: midX + Math.min(width * 0.22, 140), y: midY - 20, r: 4.5, color: "#1C3A63", label: "Party B", vx: -0.07, vy: 0.05, baseOffset: Math.PI },
        { id: "R", x: midX, y: midY + Math.min(height * 0.25, 100), r: 5, color: "#D19A34", label: "Outcome", vx: 0.04, vy: 0.05, baseOffset: Math.PI * 1.5 }
      ];

      // Ambient supporting nodes
      ambientNodes = [];
      const count = nodeCount - keyNodes.length;
      for (let i = 0; i < count; i++) {
        ambientNodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 1.5,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          color: Math.random() > 0.4 ? "rgba(209, 154, 52, 0.4)" : "rgba(28, 58, 99, 0.25)"
        });
      }
    };

    let tick = 0;

    const render = () => {
      if (!isVisible || !isTabActive) return;

      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw structured resolution path lines
      if (keyNodes.length >= 4) {
        const [nA, nN, nB, nR] = keyNodes;

        // Subtle oscillating float
        const wave = Math.sin(tick * 0.015) * 4;

        // Path: A -> N -> B
        ctx.beginPath();
        ctx.strokeStyle = "rgba(209, 154, 52, 0.28)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(nA.x, nA.y + wave * 0.5);
        ctx.lineTo(nN.x, nN.y - wave * 0.8);
        ctx.lineTo(nB.x, nB.y + wave * 0.5);
        ctx.stroke();

        // Path: N -> R (Outcome)
        ctx.beginPath();
        ctx.strokeStyle = "rgba(209, 154, 52, 0.35)";
        ctx.lineWidth = 1.4;
        ctx.setLineDash([]);
        ctx.moveTo(nN.x, nN.y - wave * 0.8);
        ctx.lineTo(nR.x, nR.y + wave);
        ctx.stroke();
      }

      // 2. Ambient node connections (distance threshold <= 110px)
      const allNodes = [...keyNodes, ...ambientNodes];
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const dx = allNodes[i].x - allNodes[j].x;
          const dy = allNodes[i].y - allNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.16;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(18, 41, 74, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(allNodes[i].x, allNodes[i].y);
            ctx.lineTo(allNodes[j].x, allNodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Render ambient nodes
      ambientNodes.forEach((node) => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });

      // 4. Render key structured triad nodes
      keyNodes.forEach((node) => {
        const nodeWave = prefersReducedMotion ? 0 : Math.sin(tick * 0.02 + node.baseOffset) * 3;

        // Subtle outer glow halo
        ctx.beginPath();
        ctx.arc(node.x, node.y + nodeWave, node.r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = node.id === "N" ? "rgba(209, 154, 52, 0.12)" : "rgba(28, 58, 99, 0.08)";
        ctx.fill();

        // Core node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y + nodeWave, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(node.x, node.y + nodeWave, node.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Initialize dimensions
    handleResize();

    // IntersectionObserver to pause loop when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isTabActive && !prefersReducedMotion) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isVisible && isTabActive && !prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Window resize
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial render
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="justice-constellation-canvas"
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.8
      }}
    />
  );
}

export default JusticeConstellation;
