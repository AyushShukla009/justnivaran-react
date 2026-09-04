function PrivacyPolicy() {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Statutory Compliance</b> DPDP Act, 2023 &bull; IT Act, 2000 &bull; BSA 2023
      </p>

      <h1 style={{ marginBottom: "16px" }}>Privacy Policy &amp; Data Protection Notice</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Official statutory privacy notice governing the collection, processing, encrypted storage, and statutory rights of Data Principals on the JustNivaran Online Dispute Resolution platform.
      </p>

      <div style={{
        background: "var(--paper-hi)",
        border: "1px solid var(--line)",
        borderRadius: "4px",
        padding: "20px 24px",
        marginBottom: "36px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px"
      }}>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Data Fiduciary</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>JustNivaran Dispute Resolution Technologies Pvt. Ltd.</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Governing Law</span>
          <div style={{ fontWeight: 600, color: "var(--gold-deep)", marginTop: "4px" }}>Digital Personal Data Protection Act, 2023</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Grievance Redressal</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>grievance@justnivaran.in</div>
        </div>
      </div>

      <section style={{ display: "grid", gap: "32px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>1. Statutory Background &amp; Scope</h2>
          <p>
            JustNivaran is committed to safeguarding the privacy and confidentiality of parties, counsel, and empanelled neutrals. This Privacy Notice is issued pursuant to the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and the <strong>Bharatiya Sakshya Adhiniyam (BSA), 2023</strong>.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>2. Categories of Data Collected</h2>
          <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
            <li><strong>Party Identifiers:</strong> Legal names, registered entity names, CIN/LLPIN, official email addresses, verified telephone/WhatsApp numbers, and postal addresses.</li>
            <li><strong>Dispute Record:</strong> Statements of claim, defenses, counter-claims, contracts, invoices, electronic notices, evidentiary exhibits, and hearing minutes.</li>
            <li><strong>Technical &amp; Audit Logs:</strong> SHA-256 cryptographic timestamps, IP addresses, browser user-agents, and electronic delivery receipt metadata for Section 63 BSA 2023 compliance.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>3. Collection of Government Identifiers (Aadhaar / PAN)</h2>
          <p>
            <strong>Purpose &amp; Legal Basis:</strong> Government-issued identifiers (such as PAN or Aadhaar) are collected <em>strictly and exclusively</em> when required for (i) executing electronic signatures (e-Sign) under the Information Technology Act, 2000, (ii) party identity verification under Section 3A of the Arbitration and Conciliation Act, 1996, or (iii) GST invoice compliance.
          </p>
          <p>
            <strong>Access &amp; Security:</strong> Where Aadhaar is utilized for e-Signing, only the legally permitted masked Aadhaar token (last 4 digits) is retained. All identity records are encrypted at rest using AES-256 and accessible only by authorized compliance registrars. Such records are purged following the expiry of court challenge and enforcement limitation periods.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>4. Specified Purpose of Processing</h2>
          <p>
            Personal data is processed solely for administering institutional dispute resolution proceedings (Negotiation, Mediation, and Arbitration), issuing verifiable electronic service of process, facilitating secure video hearings, authenticating arbitral awards, and complying with statutory judicial record maintenance.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>5. Comprehensive Rights of Data Principals (DPDP Act, 2023)</h2>
          <p>Under Chapter III of the Digital Personal Data Protection Act, 2023, you hold the following statutory rights:</p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
            <li><strong>Right to Access Information:</strong> Request a summary of personal data being processed and identities of parties with whom such data has been shared.</li>
            <li><strong>Right to Correction &amp; Erasure:</strong> Request correction of inaccurate personal data, completion of incomplete data, or erasure of personal data that is no longer necessary for the dispute proceeding (subject to statutory arbitral record retention requirements).</li>
            <li><strong>Right of Grievance Redressal:</strong> Avail readily accessible grievance redressal mechanisms with our designated officer.</li>
            <li><strong>Right to Nominate:</strong> Nominate any other individual who shall, in the event of death or incapacity, exercise your rights as a Data Principal.</li>
            <li><strong>Consent Withdrawal:</strong> You may withdraw your consent for non-statutory data processing by writing to <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold-deep)" }}>grievance@justnivaran.in</a>. Withdrawal does not affect the legality of processing completed prior to withdrawal or statutory dispute record maintenance.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>6. Data Confidentiality &amp; Security Safeguards</h2>
          <p>
            Case documents, evidentiary exhibits, and hearing video recordings are protected via 256-bit encryption in transit (TLS 1.3) and at rest (AES-256). All consensual discussions in Negotiation, Mediation, and Conciliation are conducted strictly on a &ldquo;Without Prejudice&rdquo; basis and remain confidential and inadmissible in subsequent judicial proceedings under Section 22 of the Mediation Act, 2023, Section 75 of the Arbitration and Conciliation Act, 1996, and applicable provisions of the Bharatiya Sakshya Adhiniyam, 2023.
          </p>
        </div>

        <div style={{ background: "rgba(11, 27, 49, 0.03)", border: "1px solid var(--line)", padding: "20px", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Designated Grievance &amp; Data Protection Officer</h3>
          <p style={{ margin: "0 0 6px", fontSize: "14px", lineHeight: "1.6" }}>
            <strong>Officer:</strong> Adv. Rajeshwar Sharma, Registrar &amp; Legal Compliance Counsel<br />
            <strong>Entity:</strong> JustNivaran Private Limited (CIN: U62020DC2026PTC473641)<br />
            <strong>Email:</strong> <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold-deep)" }}>grievance@justnivaran.in</a> &bull; <strong>Direct Helpline:</strong> <a href="tel:+911149876500" style={{ color: "var(--gold-deep)" }}>+91 11 4987 6500</a><br />
            <strong>Notice Address:</strong> New Delhi – 110001, India<br />
            <strong>Statutory SLA:</strong> Acknowledgment within <strong>24 hours</strong> &bull; Resolution within <strong>15 calendar days</strong> under DPDP Act 2023 &amp; IT Rules 2021.
          </p>
        </div>

        <div style={{ fontSize: "12px", color: "var(--slate)", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
          <strong>Policy Metadata:</strong> Version 2.4 &bull; Effective Date: 01 September 2026 &bull; Last Updated: 04 September 2026 &bull; Published by JustNivaran Private Limited (CIN: U62020DC2026PTC473641).
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
