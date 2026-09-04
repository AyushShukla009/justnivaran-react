import { useState } from "react";

const STAGES = [
  {
    id: 1,
    title: "1. Digital Notice & Claim",
    badge: "Automated Dispatch",
    icon: "📨",
    desc: "Claimant files the dispute. The platform instantly issues a digitally verifiable notice to the respondent via encrypted email, WhatsApp, and SMS with a SHA-256 audit timestamp.",
    cta: "⚡ File Stage 1: Issue Digital Notice & Claim →",
    mode: "NEG",
    preview: {
      tag: "Proof of Notice Delivered",
      docket: "JN/NOT/2026/0417",
      status: "Delivered & Read by Respondent",
      metric: "Dispatch Time: < 30 seconds"
    }
  },
  {
    id: 2,
    title: "2. Consent & Window",
    badge: "Party Autonomy",
    icon: "🤝",
    desc: "Both parties agree to the negotiation window (15–30 days). No public court filings, no lawyers required unless requested by the parties.",
    cta: "🤝 Initiate Stage 2: 21-Day Negotiation Window →",
    mode: "NEG",
    preview: {
      tag: "Window Active",
      docket: "Negotiation Window: 21 Days",
      status: "Good-Faith Participation Confirmed",
      metric: "Statutory Basis: Indian Contract Act"
    }
  },
  {
    id: 3,
    title: "3. Secure Room & Exchange",
    badge: "Without Prejudice",
    icon: "🔒",
    desc: "Parties exchange offers, counter-offers, and invoice records in an encrypted digital room. All discussions are strictly confidential and inadmissible in subsequent litigation.",
    cta: "🔒 Launch Stage 3: Encrypted Negotiation Room →",
    mode: "MED",
    preview: {
      tag: "Live Room Active",
      docket: "Offer: ₹ 14,50,000 (30-day payment term)",
      status: "Under Counter-Review by Claimant",
      metric: "Encryption: AES-256 Bit"
    }
  },
  {
    id: 4,
    title: "4. Digital Settlement & e-Sign",
    badge: "Enforceable Contract",
    icon: "✍️",
    desc: "Upon mutual agreement, JustNivaran drafts the formal settlement terms. Both parties execute via Aadhaar e-Sign or digital signatures, creating a legally binding contract.",
    cta: "✍️ Execute Stage 4: Enforceable Settlement & e-Sign →",
    mode: "MED",
    preview: {
      tag: "Settlement Executed",
      docket: "Enforceable Settlement Agreement",
      status: "Digitally Signed & Validated",
      metric: "Legal Validity: 100% Binding"
    }
  },
  {
    id: 5,
    title: "5. Escalation if Unsettled",
    badge: "Zero Time Lost",
    icon: "⚖️",
    desc: "If negotiation does not settle within the window, the matter seamlessly transitions to Institutional Mediation (Mediation Act 2023) or Fast-Track Arbitration (s. 29B) without refiling fees.",
    cta: "⚖️ Fast-Track Stage 5: Escalate to Sole Arbitrator →",
    mode: "FTA",
    preview: {
      tag: "Seamless Escalation",
      docket: "Auto-Transferred to Fast-Track Panel",
      status: "Sole Arbitrator Assigned in 48 Hours",
      metric: "Time Saved: 6+ Months"
    }
  }
];

function ADRVisualizer({ onOpenFileModal }) {
  const [activeStage, setActiveStage] = useState(1);
  const current = STAGES.find((s) => s.id === activeStage) || STAGES[0];

  return (
    <section
      className="section"
      id="how-it-works"
      style={{
        background: "var(--paper-hi)",
        borderTop: "var(--rail)",
        overflowX: "hidden",
        scrollMarginTop: "90px",
        paddingTop: "90px",
        paddingBottom: "90px"
      }}
    >
      <div className="wrap">
        <div style={{ maxWidth: "780px", marginBottom: "32px" }}>
          <p className="eyebrow" style={{ marginBottom: "16px" }}>
            <b>Interactive Workflow</b> Negotiation &amp; ADR Lifecycle
          </p>
          <h2>How a Dispute Resolves on JustNivaran</h2>
          <p className="lede" style={{ margin: "14px 0 0" }}>
            Click on any stage below to explore the digital process, security protocols, and statutory enforceability in real time.
          </p>
        </div>

        {/* Mobile Horizontal Scrollable Stage Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "20px",
          WebkitOverflowScrolling: "touch"
        }}>
          {STAGES.map((st) => {
            const isActive = st.id === activeStage;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStage(st.id)}
                style={{
                  flex: "0 0 auto",
                  minWidth: "140px",
                  background: isActive ? "var(--ink)" : "#fff",
                  color: isActive ? "#fff" : "var(--ink)",
                  border: isActive ? "1px solid var(--ink)" : "1px solid var(--line)",
                  borderRadius: "4px",
                  padding: "12px 10px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s ease"
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{st.icon}</div>
                <div style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10px",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--gold)" : "var(--slate)"
                }}>
                  Stage 0{st.id}
                </div>
                <div style={{
                  fontFamily: "var(--sans)",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 500,
                  marginTop: "2px"
                }}>
                  {st.title.split(". ")[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Details */}
        <div className="two" style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          boxShadow: "0 10px 24px rgba(18,41,74,.06)",
          padding: "clamp(18px, 4vw, 32px)",
          alignItems: "center"
        }}>
          {/* Left Column: Details */}
          <div>
            <span style={{
              fontFamily: "var(--mono)",
              fontSize: "10.5px",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              background: "var(--gold-soft)",
              color: "var(--ink)",
              padding: "4px 8px",
              borderRadius: "2px",
              fontWeight: 500
            }}>
              {current.badge}
            </span>

            <h3 style={{ fontSize: "clamp(20px, 3vw, 26px)", margin: "12px 0 10px", color: "var(--ink)" }}>
              {current.title}
            </h3>

            <p style={{ fontSize: "14.5px", color: "#3B4E68", lineHeight: "1.65", marginBottom: "20px" }}>
              {current.desc}
            </p>

            <button
              className="btn gold"
              onClick={() => onOpenFileModal && onOpenFileModal()}
              type="button"
              style={{ width: "100%", justifyContent: "center" }}
            >
              File a Dispute →
            </button>
          </div>

          {/* Right Column: Simulated Live UI Card */}
          <div style={{
            background: "var(--ink-deep)",
            color: "#fff",
            borderRadius: "4px",
            padding: "20px",
            border: "1px solid rgba(255,255,255,.15)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,.15)",
              paddingBottom: "10px",
              marginBottom: "14px"
            }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "10.5px", color: "var(--gold)" }}>
                ● {current.preview.tag}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "#8FA4BE" }}>
                AUDIT: VERIFIED
              </span>
            </div>

            <div style={{ fontFamily: "var(--serif)", fontSize: "17px", color: "#fff", marginBottom: "6px" }}>
              {current.preview.docket}
            </div>

            <div style={{ fontSize: "13px", color: "#AEC0D6", marginBottom: "14px" }}>
              {current.preview.status}
            </div>

            <div style={{
              background: "rgba(255,255,255,.07)",
              padding: "8px 12px",
              borderRadius: "3px",
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "var(--gold-soft)",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>{current.preview.metric}</span>
              <span>🔒 256-Bit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ADRVisualizer;
