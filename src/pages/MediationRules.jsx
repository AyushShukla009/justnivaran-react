function MediationRules({ onOpenFileModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 80px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Statutory Framework</b> Mediation Act, 2023
      </p>

      <h1 style={{ marginBottom: "16px" }}>Mediation Procedural Rules</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Institutional mediation rules governing pre-litigation and commercial mediation with court decree enforceability under Section 27 of the Mediation Act, 2023.
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
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Mediation Act, 2023</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Statutory Ceiling</span>
          <div style={{ fontWeight: 600, color: "var(--gold)", marginTop: "4px" }}>120 Days (Max +60 Ext)</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Enforceability</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Decree of Civil Court</div>
        </div>
      </div>

      <section style={{ display: "grid", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>1. Pre-Institution Commercial Mediation</h2>
          <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.7" }}>
            Under the Mediation Act, 2023, commercial parties can engage in institutional online mediation before filing formal lawsuits. JustNivaran provides authenticated digital case management and registry compliance.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>2. Mediator Appointment &amp; Impartiality</h2>
          <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.7" }}>
            The registry appoints a certified mediator from the institutional panel with required domain experience and language proficiency. Mediators must file strict conflict-of-interest declarations prior to commencing proceedings.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>3. Enforcement under Section 27</h2>
          <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.7" }}>
            A Mediated Settlement Agreement authenticated by the JustNivaran Registry is legally binding and enforceable in the same manner as a judgment or decree passed by a Court of Law.
          </p>
        </div>
      </section>

      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button className="btn gold" onClick={onOpenFileModal} type="button">
          Initiate Mediation Online →
        </button>
      </div>
    </main>
  );
}

export default MediationRules;