function NeutralCodeOfConduct({ onOpenEmpanelmentModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Institutional Ethics</b> IBA Guidelines &bull; 5th &amp; 7th Schedule
      </p>

      <h1 style={{ marginBottom: "16px" }}>Neutral Code of Conduct &amp; Disclosure Policy</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Mandatory ethical standards, conflict-of-interest declarations, and impartiality guidelines governing all empanelled Arbitrators, Mediators, and Conciliators.
      </p>

      <section style={{ display: "grid", gap: "28px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>1. Absolute Independence &amp; Impartiality</h2>
          <p>
            Every empanelled neutral must maintain strict independence and impartiality throughout the proceedings. A neutral must not communicate ex-parte with any party regarding the merits of an arbitration without disclosure to all parties.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>2. Mandatory Section 12 Disclosure</h2>
          <p>
            Prior to accepting any appointment, an Arbitrator must submit a formal declaration in writing disclosing any circumstances falling within the <strong>Fifth and Seventh Schedules</strong> of the Arbitration and Conciliation Act, 1996 that may give rise to justifiable doubts as to independence or impartiality.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>3. Challenge &amp; Recusal Mechanism</h2>
          <p>
            Any party may challenge the appointment of an Arbitrator within 15 days of becoming aware of circumstances justifying doubts under Section 13. The Registrar shall review the challenge and refer the matter for reconstitution if justifiable grounds exist.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>4. Confidentiality of Mediation Caucuses</h2>
          <p>
            In mediation, all private caucus disclosures made by a party to the mediator remain strictly confidential and cannot be revealed to the opposing party without express written consent.
          </p>
        </div>

        <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12.5px", color: "var(--slate)" }}>
          <strong>Neutral Code of Conduct:</strong> Version 2.4 &bull; Effective Date: 01 September 2026 &bull; Published by JustNivaran Dispute Resolution Technologies Pvt. Ltd. (CIN: U74999DL2026PTC001234), Level 4, Barakhamba Road, Connaught Place, New Delhi – 110001, India.
        </div>
      </section>

      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button className="btn gold" onClick={onOpenEmpanelmentModal} type="button">
          Apply for Neutral Empanelment →
        </button>
      </div>
    </main>
  );
}

export default NeutralCodeOfConduct;
