import { useState, useEffect, useRef } from "react";

const STAGES = [
  {
    id: 1,
    key: "filed",
    no: "01",
    label: "Filed",
    desc: "Dispute lodged and registry docket opened",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )
  },
  {
    id: 2,
    key: "notice",
    no: "02",
    label: "Notice Served",
    desc: "Statutory notice transmitted with response window",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )
  },
  {
    id: 3,
    key: "hearing",
    no: "03",
    label: "Hearing",
    desc: "Neutral session and evidence review",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </svg>
    )
  },
  {
    id: 4,
    key: "resolution",
    no: "04",
    label: "Resolution",
    desc: "Enforceable settlement agreement or arbitral award",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
];

function determineActiveStage(status) {
  if (!status) return 2;
  const s = String(status).toLowerCase();
  if (s.includes("award") || s.includes("settle") || s.includes("closed") || s.includes("concluded") || s.includes("resolved")) {
    return 4;
  }
  if (s.includes("hearing") || s.includes("session") || s.includes("progress") || s.includes("arbitration") || s.includes("mediation")) {
    return 3;
  }
  if (s.includes("notice") || s.includes("negotiation") || s.includes("consent") || s.includes("response")) {
    return 2;
  }
  return 1;
}

export default function VerifiedCaseJourney({ caseData }) {
  const [hasRevealed, setHasRevealed] = useState(false);
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const activeStageId = determineActiveStage(caseData?.status);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Viewport Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    // Visibility handling
    const handleVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Desktop 3D Card Tilt (Restricted strictly to <= 2deg, scale <= 1.005, max 8px translateZ)
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let isPointerInside = false;

    const handleMouseMove = (e) => {
      if (!isPointerInside || prefersReducedMotion || !canHover) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
        const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

        // Strictly max 2 degrees tilt
        const rotX = -yNorm * 3.5;
        const rotY = xNorm * 3.5;

        el.style.setProperty("--vcj-rx", `${rotX.toFixed(2)}deg`);
        el.style.setProperty("--vcj-ry", `${rotY.toFixed(2)}deg`);
        el.style.setProperty("--vcj-scale", "1.005");
      });
    };

    const handleMouseEnter = () => {
      isPointerInside = true;
    };

    const handleMouseLeave = () => {
      isPointerInside = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.style.setProperty("--vcj-rx", "0deg");
      el.style.setProperty("--vcj-ry", "0deg");
      el.style.setProperty("--vcj-scale", "1");
    };

    if (canHover && !prefersReducedMotion) {
      el.addEventListener("mousemove", handleMouseMove, { passive: true });
      el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
      el.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canHover) {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Progress percentage calculation
  const progressPercent = Math.min(100, Math.max(12, ((activeStageId - 1) / (STAGES.length - 1)) * 100));

  return (
    <div
      ref={containerRef}
      className={`verified-case-journey ${hasRevealed ? "is-revealed" : ""}`}
      style={{
        margin: "24px 0 28px",
        background: "rgba(6, 17, 32, 0.75)",
        border: "1px solid rgba(209, 154, 52, 0.45)",
        borderRadius: "6px",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* 1. One-Time "Docket Status Verified" Seal Header */}
      <div
        className="vcj-seal-banner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "14px",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Institutional Seal SVG with One-Time Reveal */}
          <div
            className="vcj-seal-icon"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(209, 154, 52, 0.18)",
              border: "1.2px solid var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gold)",
              flexShrink: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--gold)",
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}
            >
              DOCKET STATUS VERIFIED
            </div>
            <div style={{ fontSize: "11px", color: "#8FA4BE", marginTop: "1px" }}>
              Institutional Registry Verification &bull; {caseData?.mode || "ODR"} Track
            </div>
          </div>
        </div>

        {/* Current Verified Milestone Badge */}
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "10.5px",
            background: "rgba(209, 154, 52, 0.15)",
            border: "1px solid rgba(209, 154, 52, 0.4)",
            color: "var(--gold)",
            padding: "4px 10px",
            borderRadius: "3px"
          }}
        >
          ● Active: Stage 0{activeStageId} of 04
        </div>
      </div>

      {/* 2. Layered Four-Stage Journey Grid */}
      <div className="vcj-stages-wrapper" style={{ position: "relative" }}>
        {/* Subtle connecting progress track */}
        <div
          className="vcj-progress-rail"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "22px",
            left: "4%",
            right: "4%",
            height: "2px",
            background: "rgba(255, 255, 255, 0.1)",
            zIndex: 1
          }}
        >
          <div
            className="vcj-progress-fill"
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, var(--gold), #E6BE75)",
              boxShadow: "0 0 8px rgba(209, 154, 52, 0.6)",
              transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          />
        </div>

        {/* Stages Cards */}
        <div
          className="vcj-stages-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            position: "relative",
            zIndex: 2
          }}
        >
          {STAGES.map((st) => {
            const isCompleted = st.id < activeStageId;
            const isCurrent = st.id === activeStageId;
            const isUpcoming = st.id > activeStageId;

            return (
              <div
                key={st.id}
                className={`vcj-stage-card ${isCurrent ? "is-current" : ""} ${isCompleted ? "is-completed" : ""} ${isUpcoming ? "is-upcoming" : ""}`}
                style={{
                  background: isCurrent
                    ? "linear-gradient(180deg, rgba(209, 154, 52, 0.14) 0%, rgba(11, 27, 49, 0.85) 100%)"
                    : isCompleted
                    ? "rgba(11, 27, 49, 0.75)"
                    : "rgba(11, 27, 49, 0.4)",
                  border: isCurrent
                    ? "1.5px solid var(--gold)"
                    : isCompleted
                    ? "1px solid rgba(209, 154, 52, 0.35)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "4px",
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative"
                }}
              >
                {/* Node Milestone Dot / Icon */}
                <div
                  className="vcj-node-bubble"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isCurrent
                      ? "var(--gold)"
                      : isCompleted
                      ? "#1C3A63"
                      : "rgba(255, 255, 255, 0.08)",
                    border: isCurrent
                      ? "2px solid #ffffff"
                      : isCompleted
                      ? "1.5px solid var(--gold)"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    color: isCurrent ? "#0B1B31" : isCompleted ? "var(--gold)" : "#7E93AE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                    boxShadow: isCurrent ? "0 0 12px rgba(209, 154, 52, 0.6)" : "none"
                  }}
                >
                  {isCompleted ? "✓" : st.icon}
                </div>

                {/* Stage Number & Title */}
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "9.5px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isCurrent ? "var(--gold)" : "#7E93AE",
                    marginBottom: "2px"
                  }}
                >
                  Stage {st.no}
                </span>

                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: "13px",
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent ? "#ffffff" : isCompleted ? "#E2E8F0" : "#8FA4BE",
                    marginBottom: "4px"
                  }}
                >
                  {st.label}
                </div>

                <p
                  style={{
                    fontSize: "11px",
                    color: isCurrent ? "#DCE5F0" : "#6E8299",
                    lineHeight: "1.4",
                    margin: 0
                  }}
                >
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
