function Platform() {
  return (
    <section className="section dark" id="platform">
      <div className="wrap">
        <p className="eyebrow">
          <b>03</b> Platform Architecture
        </p>
        <h2 style={{ maxWidth: "20ch" }}>
          Technology engineered for legal enforceability.
        </h2>
        <p className="lede" style={{ marginTop: "20px" }}>
          Nothing here replaces human adjudicators or neutral mediators. Every system capability exists to maintain procedural sanctity, guarantee evidentiary integrity under BSA 2023, and accelerate resolution timelines.
        </p>

        <div className="caps">
          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
                boxShadow: "0 0 8px #10b981"
              }} />
              Live in Production
            </span>
            <h3>Cryptographic SHA-256 Audit Trail</h3>
            <p>
              Every filing, notice dispatch, viewing event, and procedural order is timestamped and cryptographically hashed, generating an immutable BSA 2023 §63 electronic record certificate for court enforcement.
            </p>
          </div>

          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
                boxShadow: "0 0 8px #10b981"
              }} />
              Live in Production
            </span>
            <h3>2-Tier PIN-Secured Case Vault</h3>
            <p>
              Confidential party PII, evidence repositories, and financial claims are protected behind 6-digit Case Access PINs and AES-256 encrypted storage buckets, eliminating public exposure risks.
            </p>
          </div>

          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
                boxShadow: "0 0 8px #10b981"
              }} />
              Live in Production
            </span>
            <h3>Secure Virtual Hearing Rooms</h3>
            <p>
              Encrypted, browser-based video rooms with authenticated attendee admission, recording controls, and automatic hearing milestone logging tied to the case docket.
            </p>
          </div>

          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--gold)"
              }} />
              Enterprise Beta
            </span>
            <h3>Procedural Award Scrutiny</h3>
            <p>
              Pre-signature checklist scrutinising draft awards for statutory notice compliance, stamp duty schedules, and clerical consistency to preempt Section 34 challenge vulnerabilities.
            </p>
          </div>

          <div className="cap soon">
            <span className="k">On the Roadmap</span>
            <h3>Real-Time Speech-to-Text &amp; Translation</h3>
            <p>
              AI-assisted multi-dialect speech transcription and vernacular translation across 12+ Indian official languages to support inclusive regional arbitration and mediation hearings.
            </p>
          </div>

          <div className="cap soon">
            <span className="k">On the Roadmap</span>
            <h3>Intelligent Dispute Triage</h3>
            <p>
              Intake assessment engine analyzing claim characteristics, contract clauses, and counterparty responsiveness to recommend optimal ADR track velocity before fee remittance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Platform;