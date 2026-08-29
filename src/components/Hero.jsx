import { useState } from "react";
import paths from "../data/paths";

function Hero({ onOpenFileModal }) {
  const [activeKey, setActiveKey] = useState("NEG");
  const activePath = paths[activeKey] || paths.NEG;

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="tag">
            <i /> ● ODR CENTRE · INDIA
          </div>

          <h1>
            Two sides. One <em>neutral</em>. A record that holds up.
          </h1>

          <p className="lede">
            Negotiation, mediation, conciliation, Lok Adalat and arbitration —
            filed, heard and awarded entirely online, under the statutes that
            already make the outcome enforceable.
          </p>

          <div className="cta-row">
            <button className="btn" type="button" onClick={onOpenFileModal}>
              File a dispute
            </button>
            <a className="btn ghost" href="#clause">
              Get the model clause
            </a>
          </div>

          <dl className="hero-foot">
            <div>
              <dt>FILING TO AWARD</dt>
              <dd>Weeks, not years</dd>
            </div>
            <div>
              <dt>HEARING</dt>
              <dd>Fully remote</dd>
            </div>
            <div>
              <dt>LANGUAGES</dt>
              <dd>12+ supported</dd>
            </div>
          </dl>
        </div>

        {/* Resolution Explorer Card */}
        <div className="panel" id="paths">
          <div className="panel-head">
            <p>CHOOSE A PATH</p>
            <span className="docket">{activePath.docket || "JN/NEG/2026/0417"}</span>
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
                <dt>Legal basis</dt>
                <dd>
                  {activePath.basis} <code>{activePath.cite || activePath.statute}</code>
                </dd>
              </div>
              <div className="meta-cell">
                <dt>Timeline</dt>
                <dd>{activePath.window || activePath.timeline}</dd>
              </div>
              <div className="meta-cell">
                <dt>What you end with</dt>
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;