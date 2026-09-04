import { useState } from "react";
import paths from "../data/paths";

function Hero({ onOpenFileModal }) {
  const [activeKey, setActiveKey] = useState("NEG");
  const activePath = paths[activeKey] || paths.NEG;

  const modeNameMap = {
    NEG: "Negotiation",
    MED: "Mediation",
    CON: "Conciliation",
    ARB_FAST: "Fast-Track Arbitration",
    ARB: "Arbitration",
    LOK: "Lok Adalat"
  };

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        {/* Left Column: Core Value Proposition & Statutory Trust */}
        <div>
          <div className="tag">
            <i /> ● ADMINISTERED INSTITUTIONAL ODR · SEAT: NEW DELHI
          </div>

          <h1>
            Two sides. One <em>neutral</em>. A record that holds up.
          </h1>

          <p className="lede">
            Administered commercial negotiation, institutional mediation, and fast-track arbitration —
            filed, heard, and managed online under the Arbitration &amp; Conciliation Act, 1996 and Mediation Act, 2023.
          </p>

          <div className="cta-row">
            <button className="btn" type="button" onClick={() => onOpenFileModal(activeKey === "ARB_FAST" ? "ARB" : activeKey)}>
              File a dispute →
            </button>
            <a className="btn ghost" href="#paths">
              Explore 6 ADR Tracks
            </a>
          </div>

          {/* Institutional Statutory Trust Badges */}
          <div className="hero-trust-strip" style={{
            margin: "28px 0 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            padding: "14px",
            background: "rgba(255, 255, 255, 0.6)",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            backdropFilter: "blur(8px)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink)", fontWeight: 500 }}>
              <span style={{ fontSize: "15px" }}>⚖️</span>
              <span>Mediation Act, 2023 Compliant</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink)", fontWeight: 500 }}>
              <span style={{ fontSize: "15px" }}>📜</span>
              <span>Arbitration Act, 1996 (S. 29B)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink)", fontWeight: 500 }}>
              <span style={{ fontSize: "15px" }}>🔒</span>
              <span>BSA 2023 / IT Act Record Audit</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink)", fontWeight: 500 }}>
              <span style={{ fontSize: "15px" }}>🇮🇳</span>
              <span>Administered ODR Registry</span>
            </div>
          </div>

          {/* Elevated Institutional Metrics */}
          <dl className="hero-foot" style={{ marginBottom: "12px" }}>
            <div>
              <dt>TARGET TIMELINE</dt>
              <dd>28–45 Days* <span style={{ fontSize: "11px", color: "var(--slate)", display: "block", fontWeight: 400 }}>Fast-Track ODR Target</span></dd>
            </div>
            <div>
              <dt>SETTLEMENT RATE</dt>
              <dd>85–90%* <span style={{ fontSize: "11px", color: "var(--slate)", display: "block", fontWeight: 400 }}>Projected Target Benchmark</span></dd>
            </div>
            <div>
              <dt>HEARINGS</dt>
              <dd>100% Virtual <span style={{ fontSize: "11px", color: "var(--slate)", display: "block", fontWeight: 400 }}>Encrypted Video Room</span></dd>
            </div>
            <div>
              <dt>ARBITRAL AWARDS</dt>
              <dd>S. 36 Enforceable <span style={{ fontSize: "11px", color: "var(--slate)", display: "block", fontWeight: 400 }}>Civil Court Decree</span></dd>
            </div>
          </dl>

          <p style={{ fontSize: "11px", color: "var(--slate)", margin: "0 0 20px", lineHeight: "1.4" }}>
            *Timelines and success rates represent target operational benchmarks for administered institutional ODR proceedings in comparison with traditional multi-year court litigation (NJDG data).
          </p>
        </div>

        {/* Right Column: Resolution Explorer Card with Ambient Glow */}
        <div style={{ position: "relative" }}>
          <div className="hero-ambient-glow" />
          <div className="panel" id="paths" style={{ position: "relative", zIndex: 2 }}>
            <div className="panel-head">
              <p>RESOLUTION EXPLORER</p>
              <span className="docket">{activePath.docket || "JN/ODR/2026/0417"}</span>
            </div>

            <div className="modes">
              <button
                className="mode"
                type="button"
                aria-selected={activeKey === "NEG"}
                onClick={() => setActiveKey("NEG")}
              >
                Negotiation
              </button>
              <button
                className="mode"
                type="button"
                aria-selected={activeKey === "MED"}
                onClick={() => setActiveKey("MED")}
              >
                Mediation
              </button>
              <button
                className="mode"
                type="button"
                aria-selected={activeKey === "CON"}
                onClick={() => setActiveKey("CON")}
              >
                Conciliation
              </button>
              <button
                className="mode"
                type="button"
                aria-selected={activeKey === "ARB_FAST"}
                onClick={() => setActiveKey("ARB_FAST")}
              >
                Fast-track arbitration
              </button>
              <button
                className="mode"
                type="button"
                aria-selected={activeKey === "ARB"}
                onClick={() => setActiveKey("ARB")}
              >
                Arbitration
              </button>
              <button
                className="mode"
                type="button"
                aria-selected={activeKey === "LOK"}
                onClick={() => setActiveKey("LOK")}
              >
                Lok Adalat
              </button>
            </div>

            <div className="path-body">
              <dl className="path-meta">
                <div className="meta-cell" style={{ flex: "1 1 100%" }}>
                  <dt>Statutory Legal Basis</dt>
                  <dd>
                    {activePath.basis} <code>{activePath.cite || activePath.statute}</code>
                  </dd>
                </div>
                <div className="meta-cell">
                  <dt>Procedural Timeline</dt>
                  <dd>{activePath.window || activePath.timeline}</dd>
                </div>
                <div className="meta-cell">
                  <dt>Enforceable Outcome</dt>
                  <dd>{activePath.outcome}</dd>
                </div>
              </dl>

              <div className="rail">
                {activePath.steps.map((s, idx) => (
                  <div key={idx} className="step">
                    <span className="dot" />
                    <div className="no">0{idx + 1}</div>
                    <div className="lb">{s.label || s.l}</div>
                    <p className="dl">{s.sub || s.d}</p>
                  </div>
                ))}
              </div>

              <p className="path-note">
                <i />
                <span>{activePath.note}</span>
              </p>

              {/* Direct 1-Click Track Initiator */}
              <div style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid var(--line-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div style={{ fontSize: "12px", color: "var(--slate)" }}>
                  Ready to resolve via <strong>{modeNameMap[activeKey]}</strong>?
                </div>
                <button
                  type="button"
                  onClick={() => onOpenFileModal(activeKey === "ARB_FAST" ? "ARB" : activeKey)}
                  style={{
                    background: "var(--gold)",
                    color: "#241703",
                    border: "none",
                    borderRadius: "3px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(209, 154, 52, 0.3)",
                    transition: "transform 0.15s ease"
                  }}
                >
                  <span>⚖️</span> Initiate {modeNameMap[activeKey]} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;