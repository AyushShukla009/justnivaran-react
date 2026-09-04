function DataRetention() {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Data Lifecycle Management</b> DPDP Act 2023 &bull; Limitation Act 1963 &bull; BSA 2023
      </p>

      <h1 style={{ marginBottom: "16px" }}>Data Retention &amp; Deletion Policy</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Institutional protocols for AES-256 encrypted archival, statutory challenge windows under Section 34, limitation periods for execution under the Limitation Act 1963, and automated purging under the DPDP Act 2023.
      </p>

      <section style={{ display: "grid", gap: "28px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>1. Active Dispute Resolution Phase</h2>
          <p>
            During an active matter (Negotiation, Mediation, or Arbitration), all pleadings, evidentiary exhibits, hearing audio/video recordings, and communication logs are stored in private, access-controlled AES-256 encrypted storage buckets. Access is restricted strictly to verified parties with valid Case Access PINs, their authorized legal counsel, and the assigned neutral or tribunal.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>2. Statutory Challenge Windows &amp; Limitation Periods</h2>
          <p>
            Upon issuance and delivery of a Final Arbitral Award or Mediated Settlement Agreement, institutional records are classified and archived according to statutory requirements:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "12px 0", display: "grid", gap: "10px" }}>
            <li>
              <strong>Section 34 Challenge Window:</strong> The complete arbitral record, pleadings, notices, and procedural orders are archived for a standard institutional retention window of <strong>3 years</strong> to accommodate statutory setting-aside applications under Section 34(3) of the Arbitration &amp; Conciliation Act, 1996 (3-month window plus 30-day discretionary extension upon sufficient cause shown), as well as appellate proceedings under Section 37.
            </li>
            <li>
              <strong>Execution &amp; Enforcement of Awards (Limitation Act 1963):</strong> Certified true copies of final awards, authenticated settlement agreements, and Section 63 BSA electronic audit certificates are archived for <strong>12 years</strong> in alignment with Article 136 of the Limitation Act, 1963 (enforcement of decrees and arbitral awards under Section 36 of the Arbitration Act).
            </li>
            <li>
              <strong>Mediation &amp; Conciliation Settlement Confidentiality:</strong> In accordance with Section 22 and Section 23 of the Mediation Act, 2023, preliminary mediation proposals, without-prejudice settlement offers, notes, and exploratory negotiation chats are permanently purged from active registries within <strong>90 days</strong> of case conclusion or withdrawal, preserving absolute statutory confidentiality.
            </li>
            <li>
              <strong>Bharatiya Sakshya Adhiniyam (BSA) 2023 Electronic Certificates:</strong> Cryptographic SHA-256 hash digests, tamper-evident server audit logs, and digital signing receipts required for Section 63 electronic record certification are preserved alongside the final decree dossier.
            </li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>3. Data Principal Rights &amp; Erasure Protocol (DPDP Act 2023)</h2>
          <p>
            Under Chapter III (Section 12) of the Digital Personal Data Protection Act, 2023, Data Principals may exercise their statutory right to data erasure:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "12px 0", display: "grid", gap: "10px" }}>
            <li>
              <strong>Non-Essential Records:</strong> Marketing contact data, general website inquiries, and optional consultation logs will be permanently scrubbed within <strong>30 days</strong> of a validated request.
            </li>
            <li>
              <strong>Statutory Record Exceptions:</strong> Dispute pleadings, evidence submitted to a constituted arbitral tribunal, and signed awards cannot be erased prior to the expiry of the statutory limitation periods described above, as institutional retention is mandated under applicable law for judicial enforcement and registry verification.
            </li>
            <li>
              <strong>Aadhaar &amp; PAN Redaction:</strong> Post-verification, full Aadhaar and PAN numbers are purged or irreversibly masked to display only the last 4 digits in institutional databases.
            </li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>4. Inquiries &amp; Deletion Requests</h2>
          <p>
            To lodge an erasure request or query retention schedules, contact the Registry and Data Protection Officer at:
          </p>
          <p style={{ marginTop: "8px", background: "#f8fafc", padding: "16px 20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong>Registrar &amp; Legal Compliance Office</strong><br />
            JustNivaran Dispute Resolution Technologies Pvt. Ltd. (CIN: U74999DL2026PTC001234)<br />
            Level 4, Barakhamba Road, Connaught Place, New Delhi – 110001, India<br />
            Email: <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--navy)", fontWeight: 600 }}>grievance@justnivaran.in</a> &bull; Telephone: <a href="tel:+911149876500" style={{ color: "var(--navy)", fontWeight: 600 }}>+91 11 4987 6500</a>
          </p>
        </div>

        <div style={{ fontSize: "12px", color: "var(--slate)", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
          <strong>Data Retention Policy:</strong> Version 2.4 &bull; Effective Date: 01 September 2026 &bull; Published by JustNivaran Dispute Resolution Technologies Pvt. Ltd., New Delhi, India.
        </div>
      </section>
    </main>
  );
}

export default DataRetention;
