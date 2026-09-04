import { getWhatsAppUrl } from "../lib/whatsapp";

function Contact({ onOpenConsultationModal, onOpenFileModal }) {
  const whatsappUrl = getWhatsAppUrl("", "Hello JustNivaran Registry, I have an inquiry regarding an ODR case filing.");
  return (
    <main className="wrap" style={{ paddingBlock: "48px 80px", maxWidth: "920px" }}>
      <p className="eyebrow">
        <b>Registry Support</b> Case Management &amp; Notice Office
      </p>

      <h1 style={{ marginBottom: "16px" }}>Connect with JustNivaran Registry</h1>
      <p className="lede" style={{ marginBottom: "36px" }}>
        Our registry officers, triage counsel, and dispute managers are available to assist commercial parties, advocates, and institutions with case filings, procedural rules, and neutral empanelment.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", padding: "24px", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "19px", marginBottom: "8px" }}>Book a Case Evaluation</h3>
          <p style={{ fontSize: "14px", color: "#3B4E68", lineHeight: "1.6", marginBottom: "18px" }}>
            Schedule an encrypted 15-minute consultation with registry counsel to evaluate dispute triage, statutory timelines, and capped fee scales.
          </p>
          <button className="btn gold" onClick={onOpenConsultationModal} type="button">
            Book Virtual Consultation →
          </button>
        </div>

        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", padding: "24px", borderRadius: "4px" }}>
          <h3 style={{ fontSize: "19px", marginBottom: "8px" }}>Immediate Case Filing</h3>
          <p style={{ fontSize: "14px", color: "#3B4E68", lineHeight: "1.6", marginBottom: "18px" }}>
            File your claim online under the Arbitration Act or Mediation Act 2023 to generate an active dispute docket with Section 63 BSA electronic service.
          </p>
          <button className="btn" onClick={onOpenFileModal} type="button">
            Open a Dispute Docket →
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "28px", borderRadius: "6px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        <div>
          <h4 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--ink)" }}>Institutional Notice Office</h4>
          <div style={{ fontSize: "13.5px", color: "#3B4E68", display: "grid", gap: "8px", lineHeight: "1.6" }}>
            <div>
              🏛️ <strong>Entity:</strong> JustNivaran Dispute Resolution Technologies Pvt. Ltd. (CIN: U74999DL2026PTC001234)
            </div>
            <div>
              📍 <strong>Registered Office:</strong> Level 4, Barakhamba Road, Connaught Place, New Delhi – 110001, India
            </div>
            <div>
              👤 <strong>Registrar &amp; Compliance Officer:</strong> Adv. Rajeshwar Sharma
            </div>
            <div>
              📞 <strong>Helpline:</strong> <a href="tel:+911149876500" style={{ color: "var(--gold-deep)", textDecoration: "none", fontWeight: 500 }}>+91 11 4987 6500</a>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--ink)" }}>Official Registry Channels</h4>
          <div style={{ fontSize: "13.5px", color: "#3B4E68", display: "grid", gap: "8px", lineHeight: "1.6" }}>
            <div>
              📧 <strong>General &amp; Case Filings:</strong> <a href="mailto:registry@justnivaran.in" style={{ color: "var(--gold-deep)", textDecoration: "none" }}>registry@justnivaran.in</a>
            </div>
            <div>
              📜 <strong>Notices &amp; Pleadings:</strong> <a href="mailto:notices@justnivaran.in" style={{ color: "var(--gold-deep)", textDecoration: "none" }}>notices@justnivaran.in</a>
            </div>
            <div>
              ⚖️ <strong>Grievance &amp; DPDP Officer:</strong> <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold-deep)", textDecoration: "none" }}>grievance@justnivaran.in</a>
            </div>
            <div style={{ marginTop: "6px" }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#25D366",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(37, 211, 102, 0.25)"
                }}
              >
                <span>💬</span> Registry WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;