function ForNeutrals({ onOpenEmpanelmentModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 80px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Panel Registry</b> Empanelment Standards
      </p>

      <h1 style={{ marginBottom: "16px" }}>Empanelment for Neutrals</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        JustNivaran maintains a high-integrity institutional panel of retired judges, senior advocates, certified commercial mediators, and industry domain experts.
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
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Panel Roles</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Arbitrators &amp; Mediators</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Minimum Experience</span>
          <div style={{ fontWeight: 600, color: "var(--gold)", marginTop: "4px" }}>7+ Years Standing</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Hearing Mode</span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>100% Digital / Virtual</div>
        </div>
      </div>

      <section style={{ display: "grid", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>Empanelment Criteria &amp; Code of Ethics</h2>
          <ul style={{ paddingLeft: "20px", color: "#3B4E68", lineHeight: "1.8", fontSize: "14.5px" }}>
            <li><strong>Domain Specialization:</strong> Panels across MSME receivables, commercial contracts, banking, e-commerce, and employment agreements.</li>
            <li><strong>Impartiality &amp; Disclosures:</strong> Mandatory conflict-of-interest disclosures under the Arbitration &amp; Conciliation Act (Fifth Schedule).</li>
            <li><strong>Bilingual Capability:</strong> Ability to conduct hearings across English, Hindi, and regional languages.</li>
            <li><strong>Institutional Support:</strong> JustNivaran Registry provides complete case management, live transcription, and automated award formatting.</li>
          </ul>
        </div>
      </section>

      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button className="btn gold" onClick={onOpenEmpanelmentModal} type="button">
          Apply for Empanelment Now →
        </button>
      </div>
    </main>
  );
}

export default ForNeutrals;