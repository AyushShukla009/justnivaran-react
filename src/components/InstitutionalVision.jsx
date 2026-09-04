import TiltCard from "./TiltCard";

function InstitutionalVision({ onOpenFileModal }) {
  return (
    <section className="section" id="vision" style={{ background: "var(--paper)", borderTop: "var(--rail)" }}>
      <div className="wrap">
        <div className="two" style={{ alignItems: "center", gap: "clamp(32px, 5vw, 64px)" }}>
          {/* Left Column: Vision Statement & Actions */}
          <div>
            <p className="eyebrow">
              <b>INSTITUTIONAL VISION</b>
            </p>
            <h2>Justice should move at the speed of agreement.</h2>
            <p className="lede" style={{ margin: "20px 0 28px" }}>
              JustNivaran is building a structured digital environment for suitable commercial disputes—where notices,
              documents, hearings and outcomes remain organized, secure and auditable.
            </p>

            <div className="cta-row" style={{ marginTop: "28px" }}>
              <a className="btn" href="#process">
                Explore the Process →
              </a>
              <button
                className="btn gold"
                type="button"
                onClick={() => onOpenFileModal && onOpenFileModal()}
              >
                File a Dispute
              </button>
            </div>
          </div>

          {/* Right Column: Lightweight 3D Justice Emblem Card */}
          <div>
            <TiltCard
              className="vision-emblem-card"
              style={{
                background: "#ffffff",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                padding: "clamp(24px, 4vw, 36px)",
                boxShadow: "0 8px 24px rgba(18, 41, 74, 0.04)",
                position: "relative"
              }}
            >
              {/* Decorative Subtle 3D Justice Emblem */}
              <div
                className="justice-emblem-container"
                aria-hidden="true"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none"
                }}
              >
                <div className="justice-emblem-graphic">
                  <svg
                    viewBox="0 0 240 200"
                    width="100%"
                    height="180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ maxWidth: "260px", display: "block", margin: "0 auto" }}
                  >
                    {/* Outer Institutional Seal Ring with Slow Idle Rotation */}
                    <circle
                      cx="120"
                      cy="100"
                      r="84"
                      stroke="var(--gold)"
                      strokeWidth="1"
                      strokeDasharray="3 6"
                      opacity="0.55"
                      className="emblem-orbit-outer"
                    />

                    {/* Concentric Inner Geometric Seal */}
                    <circle
                      cx="120"
                      cy="100"
                      r="68"
                      stroke="var(--line)"
                      strokeWidth="1.2"
                      opacity="0.8"
                    />

                    {/* Golden Resolution Orbit Ellipse */}
                    <ellipse
                      cx="120"
                      cy="100"
                      rx="76"
                      ry="32"
                      stroke="var(--gold)"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      transform="rotate(-15 120 100)"
                      className="emblem-orbit-inner"
                    />

                    {/* Resolution Connection Path Lines */}
                    {/* Party A (48, 120) to Neutral (120, 52) */}
                    <path
                      d="M 54 116 Q 80 72 114 56"
                      stroke="var(--line)"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    {/* Party B (186, 120) to Neutral (120, 52) */}
                    <path
                      d="M 186 116 Q 160 72 126 56"
                      stroke="var(--line)"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    {/* Neutral (120, 52) to Resolution Outcome (120, 148) */}
                    <path
                      d="M 120 60 L 120 138"
                      stroke="var(--gold)"
                      strokeWidth="2"
                    />

                    {/* Party Node A */}
                    <g className="emblem-node">
                      <circle cx="50" cy="120" r="14" fill="#F4F7FA" stroke="var(--ink)" strokeWidth="1.5" />
                      <circle cx="50" cy="120" r="4.5" fill="var(--ink)" />
                      <text x="50" y="146" textAnchor="middle" fill="var(--slate)" fontSize="9" fontFamily="var(--mono)" letterSpacing="0.08em">PARTY A</text>
                    </g>

                    {/* Neutral Adjudication Node */}
                    <g className="emblem-node">
                      <circle cx="120" cy="52" r="17" fill="#FFFDF9" stroke="var(--gold)" strokeWidth="2" />
                      <circle cx="120" cy="52" r="6" fill="var(--gold)" />
                      <text x="120" y="28" textAnchor="middle" fill="var(--gold)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="600" letterSpacing="0.1em">NEUTRAL</text>
                    </g>

                    {/* Party Node B */}
                    <g className="emblem-node">
                      <circle cx="190" cy="120" r="14" fill="#F4F7FA" stroke="var(--ink)" strokeWidth="1.5" />
                      <circle cx="190" cy="120" r="4.5" fill="var(--ink)" />
                      <text x="190" y="146" textAnchor="middle" fill="var(--slate)" fontSize="9" fontFamily="var(--mono)" letterSpacing="0.08em">PARTY B</text>
                    </g>

                    {/* Outcome Node */}
                    <g className="emblem-node">
                      <circle cx="120" cy="148" r="10" fill="var(--ink)" stroke="var(--gold)" strokeWidth="1.5" />
                      <circle cx="120" cy="148" r="3" fill="#ffffff" />
                      <text x="120" y="172" textAnchor="middle" fill="var(--ink)" fontSize="9" fontFamily="var(--mono)" fontWeight="500" letterSpacing="0.08em">OUTCOME</text>
                    </g>
                  </svg>
                </div>

                <div style={{ textAlign: "center", marginTop: "14px" }}>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "10.5px",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      fontWeight: 600,
                      display: "block"
                    }}
                  >
                    STRUCTURED ODR ARCHITECTURE
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--slate)", marginTop: "2px", display: "block" }}>
                    Two Parties · One Impartial Neutral · Digital Resolution Trail
                  </span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Three Trust Pillars (Wrapped in Restricted TiltCard) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "48px"
          }}
        >
          {/* Pillar 1 */}
          <TiltCard
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "24px 22px",
              boxShadow: "0 4px 14px rgba(18, 41, 74, 0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px" }}>⚖️</span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    fontWeight: 600
                  }}
                >
                  PILLAR 01
                </span>
              </div>
              <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "8px" }}>
                Neutral by Process
              </h3>
              <p style={{ fontSize: "13.5px", color: "#3B4E68", lineHeight: "1.6", margin: 0 }}>
                Transparent appointment workflows, conflict disclosures and human oversight.
              </p>
            </div>
          </TiltCard>

          {/* Pillar 2 */}
          <TiltCard
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "24px 22px",
              boxShadow: "0 4px 14px rgba(18, 41, 74, 0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    fontWeight: 600
                  }}
                >
                  PILLAR 02
                </span>
              </div>
              <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "8px" }}>
                Private by Default
              </h3>
              <p style={{ fontSize: "13.5px", color: "#3B4E68", lineHeight: "1.6", margin: 0 }}>
                Masked public verification with authenticated access to confidential case records.
              </p>
            </div>
          </TiltCard>

          {/* Pillar 3 */}
          <TiltCard
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "24px 22px",
              boxShadow: "0 4px 14px rgba(18, 41, 74, 0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px" }}>📜</span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    fontWeight: 600
                  }}
                >
                  PILLAR 03
                </span>
              </div>
              <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "8px" }}>
                Verifiable by Record
              </h3>
              <p style={{ fontSize: "13.5px", color: "#3B4E68", lineHeight: "1.6", margin: 0 }}>
                Structured digital files, controlled access and auditable event histories.
              </p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

export default InstitutionalVision;
