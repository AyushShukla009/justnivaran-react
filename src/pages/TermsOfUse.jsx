function TermsOfUse({ onOpenFileModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Platform Rules &amp; Conditions</b> JustNivaran ODR
      </p>

      <h1 style={{ marginBottom: "16px" }}>Terms of Use &amp; Institutional Service Agreement</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Terms governing user registration, institutional dispute administration, electronic filings, and party representation on the JustNivaran ODR platform.
      </p>

      <section style={{ display: "grid", gap: "32px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>1. Institutional Platform Capacity</h2>
          <p>
            JustNivaran is an institutional Online Dispute Resolution (ODR) service provider administering consensual negotiation, mediation under the Mediation Act 2023, and fast-track arbitration under the Arbitration and Conciliation Act, 1996. JustNivaran is an institutional administrator and does not act as legal counsel or render direct judicial verdicts.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>2. Electronic Filings &amp; Verified Authority</h2>
          <p>
            Any party or legal counsel initiating a matter warrants that all pleadings, evidence, and contact details submitted are accurate and that they possess lawful authorization to represent the named entity or individual.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>3. Electronic Notice Service &amp; Consent</h2>
          <p>
            By using the platform or responding to an institutional docket, parties consent to electronic service of pleadings, notices, orders, and awards via authenticated email, WhatsApp, and SMS under Section 3 of the Arbitration and Conciliation Act, 1996.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>4. Virtual Hearing Protocols &amp; Confidentiality</h2>
          <p>
            Virtual hearing rooms are restricted to authorized parties, counsel, and empanelled neutrals. Unauthorized recording, broadcasting, or duplication of proceedings is strictly prohibited and subject to institutional de-listing and legal sanctions.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>5. Limitation of Institutional Liability</h2>
          <p>
            Awards and settlement agreements are rendered independently by presiding sole arbitrators and accredited mediators. JustNivaran disclaims liability for judicial decisions of independent neutrals or enforcement outcomes before statutory courts.
          </p>
        </div>

        <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12.5px", color: "var(--slate)" }}>
          <strong>Institutional Governance:</strong> Terms of Use Version 2.4 &bull; Effective Date: 01 September 2026 &bull; Published by JustNivaran Dispute Resolution Technologies Pvt. Ltd. (CIN: U74999DL2026PTC001234), Level 4, Barakhamba Road, Connaught Place, New Delhi – 110001, India.
        </div>
      </section>

      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button className="btn gold" onClick={onOpenFileModal} type="button">
          File a Matter under Institutional Terms →
        </button>
      </div>
    </main>
  );
}

export default TermsOfUse;
