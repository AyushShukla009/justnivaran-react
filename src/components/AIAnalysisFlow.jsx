import { memo } from "react";

const STEPS = [
  {
    step: "01",
    label: "Dispute Facts",
    detail: "Chronology & Contractual Clauses",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    step: "02",
    label: "Verified Authorities",
    detail: "Supreme Court Precedent Matching",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    step: "03",
    label: "AI Reasoning",
    detail: "Gemini Structured Issue Mapping",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    )
  },
  {
    step: "04",
    label: "Outcome Scenarios",
    detail: "Risk Bands & Settlement Ranges",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
];

function AIAnalysisFlow() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "12px",
        margin: "24px 0 8px",
        position: "relative"
      }}
      role="region"
      aria-label="AI Predictor Analysis Progression"
    >
      {STEPS.map((item, idx) => (
        <div
          key={item.step}
          style={{
            background: "rgba(11, 27, 49, 0.4)",
            border: "1px solid rgba(209, 154, 52, 0.25)",
            borderRadius: "6px",
            padding: "14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            position: "relative",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--gold)", display: "flex", alignItems: "center" }}>
              {item.icon}
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.45)",
                fontWeight: 600
              }}
            >
              {item.step}
            </span>
          </div>

          <div>
            <div style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, letterSpacing: "-0.01em" }}>
              {item.label}
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "2px", lineHeight: "1.4" }}>
              {item.detail}
            </div>
          </div>

          {idx < STEPS.length - 1 && (
            <div
              style={{
                position: "absolute",
                right: "-8px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                color: "var(--gold)",
                fontSize: "12px",
                display: "none" // Shown via responsive CSS if needed
              }}
              aria-hidden="true"
            >
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(AIAnalysisFlow);
