import { Link } from "react-router-dom";
import logo from "../assets/logo1.jpeg";

export default function Footer() {
  return (
    <footer style={{ background: "#0B1B31", color: "#ffffff", padding: "64px 0 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="wrap">
        <div className="f-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "36px", marginBottom: "48px" }}>
          
          {/* Brand Overview */}
          <div className="f-brand" style={{ maxWidth: "340px" }}>
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
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", lineHeight: "1.6", margin: "0 0 12px" }}>
              <strong>JustNivaran</strong><br />
              Online Dispute Resolution Platform<br />
              Supporting negotiation, mediation, conciliation and arbitration through secure digital processes.
            </p>
            <div style={{ fontSize: "11.5px", color: "var(--gold)", fontFamily: "var(--mono)", lineHeight: "1.6" }}>
              📞 <strong>Helpline:</strong> <a href="tel:+911149876500" style={{ color: "var(--gold)", textDecoration: "none" }}>+91 11 4987 6500</a><br />
              ✉️ <strong>Registry:</strong> <a href="mailto:registry@justnivaran.in" style={{ color: "var(--gold)", textDecoration: "none" }}>registry@justnivaran.in</a> &bull; <strong>Grievance:</strong> <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold)", textDecoration: "none" }}>grievance@justnivaran.in</a>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "12px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
              Centre &amp; Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13.5px", lineHeight: "2" }}>
              <li><Link to="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Home</Link></li>
              <li><Link to="/legal-assessment" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>AI Legal Assessment (Beta)</Link></li>
              <li><Link to="/fast-track-arbitration" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Fast-Track Arbitration (s. 29B)</Link></li>
              <li><Link to="/emergency-relief" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Emergency Relief (48–72h)</Link></li>
              <li><Link to="/for-neutrals" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Panel of Neutrals</Link></li>
              <li><Link to="/fee-schedule" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Institutional Fee Schedule</Link></li>
              <li><a href="/#tracker" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Live Docket Tracker</a></li>
              <li><a href="/#calculator" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Cost &amp; Savings Calculator</a></li>
              <li><Link to="/contact" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Registry Contact</Link></li>
            </ul>
          </div>

          {/* Procedural Rules */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "12px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
              Procedural Framework
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13.5px", lineHeight: "2" }}>
              <li><Link to="/negotiation-guidelines" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Negotiation Guidelines</Link></li>
              <li><Link to="/mediation-rules" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Mediation Rules (2023 Act)</Link></li>
              <li><Link to="/arbitration-rules" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Arbitration Rules (s. 29B)</Link></li>
              <li><Link to="/neutral-code-of-conduct" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Neutral Ethics &amp; Conflicts</Link></li>
              <li><a href="/#clause" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Model Contract Clause</a></li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 style={{ color: "var(--gold)", fontSize: "12px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
              Legal &amp; Privacy
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13.5px", lineHeight: "2" }}>
              <li><Link to="/privacy-policy" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Privacy Policy (DPDP Act)</Link></li>
              <li><Link to="/terms-of-use" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Terms of Use</Link></li>
              <li><Link to="/refund-policy" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Refund &amp; Cancellation</Link></li>
              <li><Link to="/data-retention" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Data Retention Policy</Link></li>
              <li><Link to="/grievance" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Grievance Redressal</Link></li>
              <li><Link to="/legal-disclaimer" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Legal Disclaimer</Link></li>
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
          <span>&copy; 2026 JustNivaran. All rights reserved.</span>
          <span>Online Dispute Resolution Platform</span>
        </div>
      </div>
    </footer>
  );
}