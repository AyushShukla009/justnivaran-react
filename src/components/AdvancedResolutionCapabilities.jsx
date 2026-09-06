import { Link } from "react-router-dom";
import TiltCard from "./TiltCard";
import AIAnalysisFlow from "./AIAnalysisFlow";

function AdvancedResolutionCapabilities() {
  return (
    <section
      className="section"
      id="advanced-capabilities"
      style={{
        background: "var(--paper-hi)",
        borderTop: "var(--rail)",
        borderBottom: "var(--rail)",
        position: "relative"
      }}
    >
      <div className="wrap">
        <div style={{ maxWidth: "820px", marginBottom: "36px" }}>
          <p className="eyebrow" style={{ color: "var(--slate)" }}>
            Specialized Dispute Mechanisms
          </p>
          <h2 style={{ fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: "1.2", margin: "0 0 16px" }}>
            Advanced Resolution Capabilities
          </h2>
          <p className="lede" style={{ margin: 0, color: "var(--slate)" }}>
            Institutional digital procedures engineered for complex commercial disputes, statutory fast-track mandates, and time-critical interim protection under Indian law.
          </p>
        </div>

        {/* 1. Visually Dominant Core USP Card: The Legal Outcome AI Predictor */}
        <div style={{ marginBottom: "24px" }}>
          <TiltCard
            style={{
              background: "linear-gradient(145deg, #0B1B31 0%, #12294A 100%)",
              border: "1.5px solid rgba(209, 154, 52, 0.45)",
              borderRadius: "8px",
              padding: "36px 32px",
              color: "#ffffff",
              boxShadow: "0 12px 36px rgba(11, 27, 49, 0.16)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Subtle Justice Scales & Neural Network Background SVG */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                opacity: 0.06,
                pointerEvents: "none"
              }}
              aria-hidden="true"
            >
              <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke="#D19A34" strokeWidth="1">
                <path d="M12 2v20M5 7l7-5 7 5M5 7l-3 7h6L5 7zm14 0l-3 7h6l-3-7z" />
                <circle cx="12" cy="12" r="3" />
                <circle cx="6" cy="6" r="2" />
                <circle cx="18" cy="6" r="2" />
                <line x1="6" y1="6" x2="12" y2="12" />
                <line x1="18" y1="6" x2="12" y2="12" />
              </svg>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "6px",
                      background: "rgba(209, 154, 52, 0.2)",
                      border: "1px solid rgba(209, 154, 52, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px"
                    }}
                  >
                    ⚖️
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "3px",
                        background: "rgba(209, 154, 52, 0.2)",
                        color: "var(--gold)",
                        border: "1px solid rgba(209, 154, 52, 0.4)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase"
                      }}
                    >
                      CORE USP &bull; AI BETA
                    </span>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: "clamp(22px, 2.8vw, 30px)", fontFamily: "var(--serif)", color: "#ffffff", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
                THE LEGAL OUTCOME AI PREDICTOR
              </h3>

              <p style={{ fontSize: "14.5px", color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", maxWidth: "880px", margin: "0 0 8px" }}>
                An AI-powered decision-support system that analyses dispute facts, contractual provisions, claims, expected defences, documentary evidence and verified legal authorities to identify probable outcome scenarios, material legal risks and settlement opportunities.
              </p>

              <div style={{ fontSize: "12px", color: "var(--gold)", fontFamily: "var(--mono)", letterSpacing: "0.02em", marginBottom: "20px" }}>
                Indicative assessment only &bull; Not legal advice &bull; Human review required
              </div>

              {/* Animated Flow: Facts -> Authorities -> AI Analysis -> Outcome Scenarios */}
              <AIAnalysisFlow />
            </div>

            <div style={{ paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                Zero confidential documents stored &bull; Curated Supreme Court Precedent Repository
              </div>
              <Link
                to="/legal-assessment"
                className="btn gold"
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                Try the AI Predictor →
              </Link>
            </div>
          </TiltCard>
        </div>

        {/* 2 Supporting Cards: Fast-Track Section 29B & Emergency Arbitration */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: "24px"
          }}
        >
          {/* Card 2: Fast-Track Arbitration */}
          <TiltCard
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 4px 20px rgba(11, 27, 49, 0.04)"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "6px",
                    background: "rgba(11, 27, 49, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}
                >
                  📜
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: "3px",
                    background: "rgba(18, 41, 74, 0.08)",
                    color: "var(--ink)",
                    border: "1px solid rgba(18, 41, 74, 0.2)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase"
                  }}
                >
                  Section 29B
                </span>
              </div>

              <h3 style={{ fontSize: "19px", fontFamily: "var(--serif)", color: "var(--ink)", margin: "0 0 10px" }}>
                Fast-Track Arbitration
              </h3>

              <p style={{ fontSize: "13.5px", color: "var(--slate)", lineHeight: "1.6", margin: "0 0 20px" }}>
                Expedited sole-arbitrator proceedings decided primarily on written pleadings and documents under Section 29B, targeting statutory award delivery within 6 months.
              </p>
            </div>

            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--line-soft)" }}>
              <Link
                to="/fast-track-arbitration"
                className="btn ghost"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "10px 16px",
                  fontSize: "13px",
                  textDecoration: "none"
                }}
              >
                View S. 29B Procedures →
              </Link>
            </div>
          </TiltCard>

          {/* Card 3: Emergency Arbitration & Interim Relief */}
          <TiltCard
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 4px 20px rgba(11, 27, 49, 0.04)"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "6px",
                    background: "rgba(192, 57, 43, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}
                >
                  🛡️
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: "3px",
                    background: "rgba(192, 57, 43, 0.1)",
                    color: "#C0392B",
                    border: "1px solid rgba(192, 57, 43, 0.3)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase"
                  }}
                >
                  48–72h Window
                </span>
              </div>

              <h3 style={{ fontSize: "19px", fontFamily: "var(--serif)", color: "var(--ink)", margin: "0 0 10px" }}>
                Emergency Arbitration &amp; Interim Relief
              </h3>

              <p style={{ fontSize: "13.5px", color: "var(--slate)", lineHeight: "1.6", margin: "0 0 20px" }}>
                Expedited emergency arbitrator mechanism for urgent interim preservation orders and asset protection prior to the constitution of the regular tribunal.
              </p>
            </div>

            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--line-soft)" }}>
              <Link
                to="/emergency-relief"
                className="btn ghost"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "10px 16px",
                  fontSize: "13px",
                  textDecoration: "none"
                }}
              >
                Request Emergency Relief →
              </Link>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

export default AdvancedResolutionCapabilities;
