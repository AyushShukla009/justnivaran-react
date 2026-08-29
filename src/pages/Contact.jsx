function Contact({ onOpenConsultationModal, onOpenFileModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 80px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Registry Support</b> Case Management
      </p>

      <h1 style={{ marginBottom: "16px" }}>Connect with JustNivaran</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Our registry team is available to assist parties, legal counsel, and enterprises with case filing, procedural questions, and dispute triage.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", padding: "24px", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "19px", marginBottom: "8px" }}>Book a Case Consultation</h3>
          <p style={{ fontSize: "14px", color: "#3B4E68", lineHeight: "1.6", marginBottom: "18px" }}>
            Schedule a 15-minute consultation with our registry counsel to discuss your dispute and choose the right resolution path.
          </p>
          <button className="btn gold" onClick={onOpenConsultationModal} type="button">
            Book Virtual Consultation →
          </button>
        </div>

        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", padding: "24px", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "19px", marginBottom: "8px" }}>Immediate Case Filing</h3>
          <p style={{ fontSize: "14px", color: "#3B4E68", lineHeight: "1.6", marginBottom: "18px" }}>
            Ready to open a matter? File your claim directly online and generate an active dispute docket in under 5 minutes.
          </p>
          <button className="btn" onClick={onOpenFileModal} type="button">
            Open a Dispute Docket →
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "24px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h4 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--ink)" }}>Registry Office &amp; Inquiries</h4>
          <div style={{ fontSize: "14px", color: "#3B4E68", display: "grid", gap: "8px" }}>
            <div>📧 <strong>Registry Email:</strong> registry@justnivaran.in</div>
            <div>📞 <strong>Grievance &amp; Notices:</strong> notices@justnivaran.in</div>
            <div>📍 <strong>National ODR Jurisdiction:</strong> Online Jurisdiction Across India</div>
          </div>
        </div>

        <div>
          <a
            href="https://wa.me/?text=Hello%20JustNivaran%20Registry,%20I%20have%20an%20inquiry%20regarding%20an%20ODR%20case%20filing."
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#25D366",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(37, 211, 102, 0.25)"
            }}
          >
            <span>💬</span> Chat on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

export default Contact;