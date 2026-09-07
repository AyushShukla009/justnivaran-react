import { Link } from "react-router-dom";
import logo from "../assets/logo1.jpeg";

export default function Footer() {
  return (
    <footer style={{ background: "#0B1B31", color: "#ffffff", padding: "36px 0 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="wrap">
        <div className="f-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr repeat(3, 1fr)", gap: "24px", marginBottom: "22px" }}>
          
          {/* Brand Overview */}
          <div className="f-brand" style={{ maxWidth: "300px" }}>
            <Link to="/" style={{ display: "inline-block", marginBottom: "10px" }}>
              <img
                src={logo}
                alt="JustNivaran"
                style={{
                  height: "42px",
                  width: "auto",
                  objectFit: "contain",
                  background: "rgba(255,255,255,0.95)",
                  padding: "3px 8px",
                  borderRadius: "4px"
                }}
              />
            </Link>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", lineHeight: "1.45", margin: "0 0 10px" }}>
              <strong>JustNivaran</strong> &bull; Online Dispute Resolution Platform<br />
              Institutional digital dispute resolution for negotiation, mediation, conciliation, and arbitration.
            </p>
            <div style={{ fontSize: "11px", color: "var(--gold)", fontFamily: "var(--mono)", lineHeight: "1.5" }}>
              📞 <a href="tel:+911149876500" style={{ color: "var(--gold)", textDecoration: "none" }}>+91 11 4987 6500</a><br />
              ✉️ <a href="mailto:registry@justnivaran.in" style={{ color: "var(--gold)", textDecoration: "none" }}>registry@justnivaran.in</a> &bull; <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold)", textDecoration: "none" }}>grievance@justnivaran.in</a>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
              Centre &amp; Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "6px", fontSize: "12.5px", lineHeight: "1.35" }}>
              <li><Link to="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Home</Link></li>
              <li><Link to="/legal-assessment" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>AI Legal Assessment</Link></li>
              <li><Link to="/fast-track-arbitration" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Fast-Track Arbitration (s. 29B)</Link></li>
              <li><Link to="/emergency-relief" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Emergency Relief (48–72h)</Link></li>
              <li><Link to="/for-neutrals" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Panel of Neutrals</Link></li>
              <li><Link to="/fee-schedule" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Fee Schedule</Link></li>
              <li><a href="/#tracker" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Live Docket Tracker</a></li>
              <li><a href="/#calculator" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Cost Calculator</a></li>
              <li><Link to="/contact" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Registry Contact</Link></li>
            </ul>
          </div>

          {/* Procedural Rules */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
              Procedural Framework
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "6px", fontSize: "12.5px", lineHeight: "1.35" }}>
              <li><Link to="/negotiation-guidelines" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Negotiation Guidelines</Link></li>
              <li><Link to="/mediation-rules" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Mediation Rules (2023 Act)</Link></li>
              <li><Link to="/conciliation-rules" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Conciliation Rules 2026</Link></li>
              <li><Link to="/arbitration-rules" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Arbitration Rules (s. 29B)</Link></li>
              <li><Link to="/neutral-code-of-conduct" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Core Values &amp; Code of Conduct</Link></li>
              <li><a href="/#clause" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Model Contract Clause</a></li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
              Legal &amp; Privacy
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "6px", fontSize: "12.5px", lineHeight: "1.35" }}>
              <li><Link to="/privacy-notice" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Public Privacy Notice</Link></li>
              <li><Link to="/privacy-policy" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Privacy Policy (DPDP Act)</Link></li>
              <li><Link to="/cookie-policy" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Cookie Policy Framework</Link></li>
              <li><Link to="/terms-of-use" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Terms of Use</Link></li>
              <li><Link to="/refund-policy" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Refund &amp; Cancellation</Link></li>
              <li><Link to="/data-retention" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Data Retention Policy</Link></li>
              <li><Link to="/grievance" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Grievance Redressal</Link></li>
              <li><Link to="/legal-disclaimer" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Legal Disclaimer</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("jn_open_cookie_preferences"))}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textAlign: "left",
                    fontFamily: "inherit"
                  }}
                >
                  ⚙️ Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            fontSize: "11.5px",
            color: "rgba(255,255,255,0.45)"
          }}
        >
          <span>&copy; 2026 JustNivaran Private Limited. All rights reserved.</span>
          <span>Online Dispute Resolution Platform</span>
        </div>
      </div>
    </footer>
  );
}
