function FeeSchedule({ onOpenFileModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "960px" }}>
      <p className="eyebrow">
        <b>Statutory Transparency</b> Transparent Administrative Schedule
      </p>

      <h1 style={{ marginBottom: "16px" }}>Institutional Fee Schedule</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Predictable, capped administrative and neutral honorarium scales for Negotiation, Mediation (Mediation Act 2023), and Fast-Track Arbitration (s. 29B).
      </p>

      <div style={{
        background: "var(--paper-hi)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        overflow: "hidden",
        marginBottom: "40px"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--ink)", color: "#ffffff" }}>
              <th style={{ padding: "14px 18px", fontWeight: 600 }}>Dispute Claim Slab (INR)</th>
              <th style={{ padding: "14px 18px", fontWeight: 600 }}>Direct Negotiation</th>
              <th style={{ padding: "14px 18px", fontWeight: 600 }}>Institutional Mediation</th>
              <th style={{ padding: "14px 18px", fontWeight: 600 }}>Fast-Track Arbitration (s. 29B)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "14px 18px", fontWeight: 500 }}>Up to ₹ 5,00,000</td>
              <td style={{ padding: "14px 18px", color: "var(--gold-deep)", fontWeight: 600 }}>₹ 2,500</td>
              <td style={{ padding: "14px 18px" }}>₹ 7,500</td>
              <td style={{ padding: "14px 18px" }}>₹ 15,000 (Single Arbitrator)</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--line)", background: "rgba(11,27,49,.02)" }}>
              <td style={{ padding: "14px 18px", fontWeight: 500 }}>₹ 5,00,001 – ₹ 25,00,000</td>
              <td style={{ padding: "14px 18px", color: "var(--gold-deep)", fontWeight: 600 }}>₹ 5,000</td>
              <td style={{ padding: "14px 18px" }}>₹ 18,000</td>
              <td style={{ padding: "14px 18px" }}>₹ 35,000</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "14px 18px", fontWeight: 500 }}>₹ 25,00,001 – ₹ 1,00,00,000</td>
              <td style={{ padding: "14px 18px", color: "var(--gold-deep)", fontWeight: 600 }}>₹ 10,000</td>
              <td style={{ padding: "14px 18px" }}>₹ 35,000</td>
              <td style={{ padding: "14px 18px" }}>₹ 65,000</td>
            </tr>
            <tr style={{ background: "rgba(11,27,49,.02)" }}>
              <td style={{ padding: "14px 18px", fontWeight: 500 }}>Above ₹ 1,00,00,000</td>
              <td style={{ padding: "14px 18px", color: "var(--gold-deep)", fontWeight: 600 }}>₹ 20,000</td>
              <td style={{ padding: "14px 18px" }}>0.35% of Claim</td>
              <td style={{ padding: "14px 18px" }}>As per 4th Schedule (Arbitration Act)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section style={{ display: "grid", gap: "24px", fontSize: "14.5px", color: "#3B4E68", lineHeight: "1.7" }}>
        <div>
          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "8px" }}>Fee Breakdown &amp; Invoicing</h3>
          <p>
            Fees comprise (i) Institutional Case Administration &amp; Registry Fee, (ii) Neutral Honorarium, and (iii) Electronic Record and Audit Certificate under applicable Indian law (Section 63, Bharatiya Sakshya Adhiniyam 2023 &amp; IT Act 2000). All fees are exclusive of applicable GST (18%). Official tax invoices and GST receipts are issued electronically.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "8px" }}>Seamless Pathway Credit</h3>
          <p>
            If a matter does not settle in Negotiation or Mediation and is escalated to Fast-Track Arbitration, 100% of the administrative fee paid in the prior stage is credited toward the arbitral filing fee.
          </p>
        </div>

        <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12.5px", color: "var(--slate)" }}>
          <strong>Institutional Governance:</strong> Fee Schedule Version 2.4 &bull; Effective Date: 01 September 2026 &bull; Published by JustNivaran Private Limited (CIN: U62020DC2026PTC473641), New Delhi, India.
        </div>
      </section>

      <div style={{ marginTop: "44px", textAlign: "center" }}>
        <button className="btn gold" onClick={onOpenFileModal} type="button">
          Calculate Case Fee &amp; File Dispute →
        </button>
      </div>
    </main>
  );
}

export default FeeSchedule;
