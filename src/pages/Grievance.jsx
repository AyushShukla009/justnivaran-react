function Grievance() {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Statutory Redressal</b> DPDP Act 2023 &bull; IT Rules 2021
      </p>

      <h1 style={{ marginBottom: "16px" }}>Grievance Redressal &amp; DPDP Officer</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Official contact matrix and statutory escalation procedure for data privacy concerns, administrative complaints, or neutral conduct grievances.
      </p>

      <div style={{
        background: "var(--paper-hi)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        padding: "24px 28px",
        marginBottom: "36px"
      }}>
        <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: "0 0 16px" }}>Designated Data Protection &amp; Grievance Officer</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", fontSize: "14px" }}>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Officer Name &amp; Designation</span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Adv. Rajeshwar Sharma</div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>Registrar &amp; Legal Compliance Counsel</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Official Grievance Email</span>
            <div style={{ fontWeight: 600, marginTop: "4px" }}>
              <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold-deep)", textDecoration: "none" }}>grievance@justnivaran.in</a>
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "2px" }}>Direct Helpline: <a href="tel:+911149876500" style={{ color: "var(--ink)", textDecoration: "none" }}>+91 11 4987 6500</a></div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Registered Notice Address</span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>JustNivaran Private Limited</div>
            <div style={{ fontSize: "12px", color: "#4A5E78", marginTop: "2px" }}>New Delhi – 110001, India</div>
          </div>
        </div>
      </div>

      <section style={{ display: "grid", gap: "28px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>1. Redressal Timeline</h2>
          <p>
            Pursuant to the <strong>Information Technology (Intermediary Guidelines) Rules, 2021</strong> and the <strong>DPDP Act, 2023</strong>:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
            <li><strong>Acknowledgment:</strong> All grievances are acknowledged within <strong>24 hours</strong> with a unique Ticket ID.</li>
            <li><strong>Investigation &amp; Disposal:</strong> Grievances are reviewed and resolved within <strong>15 calendar days</strong> from receipt.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "10px" }}>2. Escalation to Data Protection Board of India</h2>
          <p>
            If a Data Principal is not satisfied with the resolution provided by the JustNivaran Grievance Officer, they may escalate their complaint to the <strong>Data Protection Board of India</strong> in accordance with Section 28 of the DPDP Act, 2023.
          </p>
        </div>

        <div style={{ fontSize: "12px", color: "var(--slate)", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
          <strong>Grievance Redressal Policy:</strong> Version 2.4 &bull; Effective Date: 01 September 2026 &bull; Published by JustNivaran Private Limited (CIN: U62020DC2026PTC473641), New Delhi, India.
        </div>
      </section>
    </main>
  );
}

export default Grievance;
