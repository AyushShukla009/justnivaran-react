import { Link } from "react-router-dom";
import logo from "../assets/logo1.jpeg";

export default function Footer() {
  return (
    <footer style={{ background: "#0B1B31", color: "#ffffff", padding: "64px 0 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="wrap">
        <div className="f-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "36px", marginBottom: "48px" }}>
          
          {/* Brand & Registry Overview */}
          <div className="f-brand" style={{ maxWidth: "320px" }}>
            <Link to="/" style={{ display: "inline-block", marginBottom: "16px" }}>
              <img
                src={logo}
                alt="JustNivaran"
                style={{
                  height: "60px",
                  width: "auto",
                  objectFit: "contain",
                  background: "rgba(255,255,255,0.95)",
                  padding: "4px 10px",
                  borderRadius: "6px"
                }}
              />
            </Link>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px", lineHeight: "1.6", margin: "0 0 12px" }}>
              India&apos;s institutional Online Dispute Resolution (ODR) Centre for commercial, MSME, and civil disputes.
            </p>
            <div style={{ fontSize: "12px", color: "var(--gold)", fontFamily: "var(--mono)" }}>
              🏛️ Seat of Registry: New Delhi, India
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "13px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
              Centre &amp; Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13.5px", lineHeight: "2" }}>
              <li><Link to="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Home</Link></li>
              <li><Link to="/for-neutrals" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Panel of Neutrals &amp; Empanelment</Link></li>
              <li><a href="/#tracker" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Live Docket Tracker</a></li>
              <li><a href="/#calculator" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Cost &amp; Savings Calculator</a></li>
              <li><Link to="/contact" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Contact &amp; Consultation</Link></li>
            </ul>
          </div>

          {/* Procedural Rules */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "13px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
              Statutory Rules &amp; Codes
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13.5px", lineHeight: "2" }}>
              <li><Link to="/negotiation-guidelines" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Negotiation Guidelines</Link></li>
              <li><Link to="/mediation-rules" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Mediation Rules (2023 Act)</Link></li>
              <li><Link to="/arbitration-rules" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Arbitration Rules (s. 29A/29B)</Link></li>
              <li><a href="/#clause" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Model Contract Clause</a></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "13px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
              Legal &amp; Compliance
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13.5px", lineHeight: "2" }}>
              <li style={{ color: "rgba(255,255,255,0.65)", fontSize: "12.5px" }}>🔒 DPDP Act 2023 Compliant</li>
              <li style={{ color: "rgba(255,255,255,0.65)", fontSize: "12.5px" }}>📜 Section 65B Electronic Records</li>
              <li style={{ color: "rgba(255,255,255,0.65)", fontSize: "12.5px" }}>⚖️ UNCITRAL &amp; NITI Aayog Aligned</li>
              <li style={{ marginTop: "8px" }}>
                <a href="mailto:jnivaran@gmail.com" style={{ color: "var(--gold)", textDecoration: "none", fontSize: "13px" }}>
                  ✉️ registry@justnivaran.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)"
          }}
        >
          <span>© 2026 JustNivaran Online Dispute Resolution Centre. All rights reserved.</span>
          <span>Digital dispute proceedings administered under Indian statutory law.</span>
        </div>
      </div>
    </footer>
  );
}  