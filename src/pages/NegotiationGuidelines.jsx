function NegotiationGuidelines({ onOpenFileModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 80px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Procedural Framework</b> Effective 2026
      </p>

      <h1 style={{ marginBottom: "16px" }}>Negotiation Guidelines</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Official procedural guidelines for conducting voluntary, party-driven online negotiations on the JustNivaran ODR platform.
      </p>

      <div style={{
        background: "var(--paper-hi)",
        border: "1px solid var(--line)",
        borderRadius: "4px",
        padding: "24px",
        marginBottom: "36px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px"
      }}>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Statutory Authority</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Indian Contract Act, 1872</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Standard Timeline</span>
          <div style={{ fontWeight: 600, color: "var(--gold)", marginTop: "4px" }}>15–30 Days (Party-set)</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Legal Enforceability</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Enforceable Contract</div>
        </div>
      </div>

      <section style={{ display: "grid", gap: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>1. Purpose &amp; Scope</h2>
          <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.7" }}>
            These Negotiation Guidelines govern voluntary negotiations administered on the JustNivaran platform. The objective is to enable disputing parties to reach a mutually acceptable resolution in a swift, confidential, and cost-effective manner.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>2. 5-Stage Negotiation Lifecycle</h2>
          <ul style={{ paddingLeft: "20px", color: "#3B4E68", lineHeight: "1.8", fontSize: "14.5px" }}>
            <li><strong>Initiation:</strong> Claimant opens a dispute filing and states the claim with supporting contracts.</li>
            <li><strong>Digital Notice &amp; Consent:</strong> Notice issues digitally to the respondent; negotiation proceeds upon consent.</li>
            <li><strong>Information Exchange:</strong> Parties upload invoices, claims, and settlement offers in the confidential docket.</li>
            <li><strong>Negotiation Window:</strong> Structured time window (15–30 days) for direct dialogue or neutral-assisted facilitations.</li>
            <li><strong>Binding Settlement:</strong> Terms are executed via digital signature or Aadhaar e-Sign.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>3. The 7 Core Rules of Conduct</h2>
          <div style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "16px", borderRadius: "3px" }}>
              <strong>Rule 1: Good Faith Participation</strong>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--slate)" }}>Parties agree to communicate with mutual respect and a genuine intention to reach a settlement.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "16px", borderRadius: "3px" }}>
              <strong>Rule 2: Strict Confidentiality &amp; "Without Prejudice"</strong>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--slate)" }}>All settlement discussions and offers are inadmissible as evidence in any subsequent court proceedings.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "16px", borderRadius: "3px" }}>
              <strong>Rule 3: Party Autonomy &amp; Voluntariness</strong>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--slate)" }}>Parties retain complete autonomy over settlement terms and can accept or reject any proposal.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "16px", borderRadius: "3px" }}>
              <strong>Rule 4: Transparent Information Sharing</strong>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--slate)" }}>Parties must provide true facts, invoices, and documents necessary for informed discussions.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "16px", borderRadius: "3px" }}>
              <strong>Rule 5: Timely &amp; Efficient Conduct</strong>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--slate)" }}>Offers and responses must be submitted within the active window to avoid procedural delays.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "16px", borderRadius: "3px" }}>
              <strong>Rule 6: Secure Digital Platform Use</strong>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--slate)" }}>All communications and agreements must be executed through the JustNivaran encrypted digital docket.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "16px", borderRadius: "3px" }}>
              <strong>Rule 7: Escalation Path to Mediation &amp; Arbitration</strong>
              <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--slate)" }}>If negotiation fails, the dispute seamlessly transitions to Institutional Mediation or Fast-Track Arbitration.</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{
        marginTop: "48px",
        padding: "28px",
        background: "var(--ink-deep)",
        color: "#fff",
        borderRadius: "4px",
        textAlign: "center"
      }}>
        <h3 style={{ color: "#fff", fontSize: "22px", marginBottom: "10px" }}>Ready to resolve a dispute under these guidelines?</h3>
        <p style={{ color: "#AEC0D6", fontSize: "14px", marginBottom: "20px" }}>Open a file in minutes or talk with our case management registry.</p>
        <button className="btn gold" onClick={onOpenFileModal} type="button">
          File a Dispute Now →
        </button>
      </div>
    </main>
  );
}

export default NegotiationGuidelines;