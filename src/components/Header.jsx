import { useState, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.jpeg";

const LiveClock = memo(function LiveClock() {
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span>{currentTime} IST</span>;
});

const MOBILE_MENU = [
  {
    title: "Resolve a dispute",
    links: [
      { to: "/negotiation-guidelines", label: "Negotiation" },
      { to: "/mediation-rules", label: "Mediation" },
      { to: "/arbitration-rules", label: "Arbitration" },
      { to: "/fast-track-arbitration", label: "Fast-Track Arbitration" },
      { to: "/emergency-arbitration", label: "Emergency Arbitration" }
    ]
  },
  {
    title: "Tools",
    links: [
      { to: "/legal-assessment", label: "Legal Outcome Predictor" },
      { to: "/fee-schedule", label: "Fee Schedule" }
    ]
  },
  {
    title: "Panel & Registry",
    links: [
      { to: "/our-neutrals", label: "Our Neutrals" },
      { to: "/for-neutrals", label: "Join the Panel" },
      { to: "/contact", label: "Contact the Registry" }
    ]
  }
];

function Header({ onOpenFileModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "var(--ink)" : "#31445E",
    borderBottomColor: isActive(path) ? "var(--gold)" : "transparent",
    fontWeight: isActive(path) ? 600 : 400
  });

  const scrollToTracker = () => {
    const performScroll = () => {
      const el = document.getElementById("tracker");
      if (el) {
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        const input = el.querySelector("input");
        if (input) {
          setTimeout(() => input.focus(), 450);
        }
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(performScroll, 200);
    } else {
      performScroll();
    }
  };

  return (
    <header>
      {/* Top Institutional Live Status Marquee with Real-Time IST Clock */}
      <div className="institutional-ticker-bar" aria-label="Institutional Live Ticker">
        <div className="ticker-track">
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <span>LIVE ODR REGISTRY &bull; NEW DELHI SEAT &bull; <LiveClock /></span>
          </div>
          <div className="ticker-item">
            <span>⚖️ STATUTORY MEDIATION &amp; ARBITRATION FRAMEWORK</span>
          </div>
          <div className="ticker-item">
            <span>📜 180-DAY FAST-TRACK ARBITRATION (S. 29B)</span>
          </div>
          <div className="ticker-item">
            <span>🔒 AES-256 ENCRYPTED CASE DOSSIER</span>
          </div>
          <div className="ticker-item">
            <span>🇮🇳 ADMINISTERED COMMERCIAL ODR PROCEEDINGS</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <span>LIVE ODR REGISTRY &bull; NEW DELHI SEAT &bull; <LiveClock /></span>
          </div>
          <div className="ticker-item">
            <span>⚖️ STATUTORY MEDIATION &amp; ARBITRATION FRAMEWORK</span>
          </div>
          <div className="ticker-item">
            <span>📜 180-DAY FAST-TRACK ARBITRATION (S. 29B)</span>
          </div>
          <div className="ticker-item">
            <span>🔒 AES-256 ENCRYPTED CASE DOSSIER</span>
          </div>
          <div className="ticker-item">
            <span>🇮🇳 ADMINISTERED COMMERCIAL ODR PROCEEDINGS</span>
          </div>
        </div>
      </div>

      <div className="wrap nav" style={{ maxWidth: "1400px" }}>
        <Link to="/" className="brand" aria-label="JustNivaran home">
          <img
            src={logo}
            alt="JustNivaran Legal ODR"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="240"
            height="90"
            style={{
              width: "auto",
              objectFit: "contain",
              display: "block",
              mixBlendMode: "multiply",
              transformOrigin: "left center"
            }}
          />
        </Link>

        {/* Desktop Navigation with Active Highlights */}
        <nav className="nav-links">
          <Link to="/" style={linkStyle("/")}>
            Home
          </Link>
          <Link to="/negotiation-guidelines" style={linkStyle("/negotiation-guidelines")}>
            Negotiation
          </Link>
          <Link to="/mediation-rules" style={linkStyle("/mediation-rules")}>
            Mediation
          </Link>
          <Link to="/arbitration-rules" style={linkStyle("/arbitration-rules")}>
            Arbitration
          </Link>
          <Link to="/emergency-arbitration" style={linkStyle("/emergency-arbitration")}>
            Emergency Arbitration
          </Link>
          <Link to="/for-neutrals" style={linkStyle("/for-neutrals")} title="Neutral Empanelment">
            Empanelment
          </Link>
          <Link to="/our-neutrals" style={linkStyle("/our-neutrals")}>
            Our Neutrals
          </Link>
          <Link to="/contact" style={linkStyle("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Action Buttons: File Dispute, AI Predictor & Track Case */}
        <div className="nav-actions">
          <button className="nav-btn-file" type="button" onClick={onOpenFileModal}>
            File a dispute
          </button>
          <Link to="/legal-assessment" className="nav-btn-ai" title="AI Legal Outcome Predictor">
            <span className="ai-sparkle">✨</span>
            <span>AI Predictor</span>
          </Link>
          <button
            className="nav-btn-track"
            type="button"
            onClick={scrollToTracker}
          >
            <span>🔍</span>
            <span>Track Case</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          type="button"
          aria-label="Toggle Menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <nav className="mobile-drawer" aria-label="Main menu">
          {MOBILE_MENU.map((group) => (
            <div key={group.title} className="drawer-group">
              <p className="drawer-title">{group.title}</p>
              {group.links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={isActive(l.to) ? "drawer-link is-active" : "drawer-link"}
                  aria-current={isActive(l.to) ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
          <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
            <button
              className="nav-btn-file"
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenFileModal();
              }}
              style={{ width: "100%", height: "42px", fontSize: "14px" }}
            >
              File a Dispute →
            </button>
            <Link
              to="/legal-assessment"
              className="nav-btn-ai"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ width: "100%", height: "42px", fontSize: "14px", justifyContent: "center" }}
            >
              <span className="ai-sparkle">✨</span>
              <span>AI Predictor →</span>
            </Link>
            <button
              className="nav-btn-track"
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                scrollToTracker();
              }}
              style={{ width: "100%", height: "42px", fontSize: "14px" }}
            >
              <span>🔍</span>
              <span>Track Active Docket</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;