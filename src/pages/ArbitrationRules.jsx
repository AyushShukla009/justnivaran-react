function ArbitrationRules({ onOpenFileModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 80px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Adjudication Rules</b> Arbitration &amp; Conciliation Act, 1996
      </p>

      <h1 style={{ marginBottom: "16px" }}>Arbitration Procedural Rules</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Rules governing Fast-Track Arbitration (Section 29B) and Standard Commercial Arbitration (Section 29A) resulting in a final, binding arbitral award.
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
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Statute</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Arbitration Act, 1996</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Fast-Track Ceiling</span>
          <div style={{ fontWeight: 600, color: "var(--gold)", marginTop: "4px" }}>6 Months (s. 29B)</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Enforcement</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Section 36 Court Decree</div>
        </div>
      </div>

      <section style={{ display: "grid", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>1. Fast-Track Procedure (Section 29B)</h2>
          <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.7" }}>
            Disputes under Section 29B are decided solely on written pleadings, documents, and digital submissions within 6 months, avoiding oral hearing delays unless specifically requested.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>2. Digital Hearings &amp; Automated Scrutiny</h2>
          <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.7" }}>
            All hearings occur via encrypted virtual hearing rooms with synchronized real-time transcripts. Awards undergo automated procedural scrutiny to ensure zero defects under Section 34 challenge grounds.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>3. Execution of Arbitral Award (Section 36)</h2>
          <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.7" }}>
            The rendered final award carries the full legal force of a court decree, enforceable directly under the Code of Civil Procedure, 1908.
          </p>
        </div>
      </section>

      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button className="btn gold" onClick={onOpenFileModal} type="button">
          File for Arbitration →
        </button>
      </div>
    </main>
  );
}

export default ArbitrationRules;