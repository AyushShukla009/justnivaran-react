import { Link } from "react-router-dom";
import logo from "../assets/logo1.jpeg";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { to: "/legal-assessment", label: "Legal Outcome Predictor" },
      { to: "/emergency-arbitration", label: "Emergency Arbitration" },
      { to: "/fast-track-arbitration", label: "Fast-Track Arbitration" },
      { href: "/#tracker", label: "Track a Case" },
      { to: "/fee-schedule", label: "Fee Schedule" },
      { href: "/#calculator", label: "Cost Calculator" }
    ]
  },
  {
    title: "Rules & Procedure",
    links: [
      { to: "/negotiation-guidelines", label: "Negotiation Guidelines" },
      { to: "/mediation-rules", label: "Mediation Rules" },
      { to: "/conciliation-rules", label: "Conciliation Rules" },
      { to: "/arbitration-rules", label: "Arbitration Rules" },
      { to: "/neutral-code-of-conduct", label: "Code of Conduct" },
      { href: "/#clause", label: "Model Contract Clause" }
    ]
  },
  {
    title: "Panel",
    links: [
      { to: "/our-neutrals", label: "Our Neutrals" },
      { to: "/for-neutrals", label: "Join the Panel" },
      { to: "/contact", label: "Contact the Registry" }
    ]
  },
  {
    title: "Legal & Privacy",
    links: [
      { to: "/privacy-notice", label: "Privacy Notice" },
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/cookie-policy", label: "Cookie Policy" },
      { to: "/terms-of-use", label: "Terms of Use" },
      { to: "/refund-policy", label: "Refund & Cancellation" },
      { to: "/data-retention", label: "Data Retention" },
      { to: "/grievance", label: "Grievance Redressal" },
      { to: "/legal-disclaimer", label: "Legal Disclaimer" }
    ]
  }
];

function FooterLink({ link }) {
  return link.to ? (
    <Link to={link.to} className="f-link">{link.label}</Link>
  ) : (
    <a href={link.href} className="f-link">{link.label}</a>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="f-grid">
          {/* Brand & registry contact */}
          <div className="f-brand">
            <Link to="/" className="f-logo" aria-label="JustNivaran home">
              <img src={logo} alt="JustNivaran" width="76" height="72" loading="lazy" decoding="async" />
            </Link>
            <p className="f-name">JustNivaran</p>
            <p className="f-tagline">
              Online dispute resolution for negotiation, mediation, conciliation and arbitration.
            </p>

            <address className="f-contact">
              <span className="f-label">Registered office</span>
              DC-12, 1st Floor, District Centre, Janakpuri, New Delhi – 110058
              <span className="f-label">Registry</span>
              <a href="tel:+911149876500">+91 11 4987 6500</a>
              <a href="mailto:registry@justnivaran.in">registry@justnivaran.in</a>
              <span className="f-label">Grievances</span>
              <a href="mailto:grievance@justnivaran.in">grievance@justnivaran.in</a>
            </address>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} className="f-col" aria-label={col.title}>
              <h2 className="f-col-title">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink link={l} />
                  </li>
                ))}
                {col.title === "Legal & Privacy" && (
                  <li>
                    <button
                      type="button"
                      className="f-link f-link-button"
                      onClick={() => window.dispatchEvent(new CustomEvent("jn_open_cookie_preferences"))}
                    >
                      Cookie Settings
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="f-bottom">
          <span>&copy; 2026 JustNivaran Private Limited. All rights reserved.</span>
          <span className="f-note">
            JustNivaran administers dispute resolution proceedings. It is not a court and does not give legal advice.
          </span>
        </div>
      </div>
    </footer>
  );
}
