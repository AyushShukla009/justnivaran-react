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

      <div className="wrap nav" style={{ height: "90px" }}>
        <Link to="/" className="brand" aria-label="JustNivaran home">
          <img
            src={logo}
            alt="JustNivaran Legal ODR"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="200"
            height="100"
            style={{
              height: "100px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              mixBlendMode: "multiply",
              transform: "scale(1.05)",
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
            Negotiation Guidelines
          </Link>
          <Link to="/mediation-rules" style={linkStyle("/mediation-rules")}>
            Mediation Rules
          </Link>
          <Link to="/arbitration-rules" style={linkStyle("/arbitration-rules")}>
            Arbitration Rules
          </Link>
          <Link to="/for-neutrals" style={linkStyle("/for-neutrals")}>
            For Neutrals
          </Link>
          <Link to="/contact" style={linkStyle("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Action Buttons: File Dispute & Track Case */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button className="btn" type="button" onClick={onOpenFileModal}>
            File a dispute
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={scrollToTracker}
            style={{
              padding: "9px 16px",
              fontSize: "13.5px",
              border: "1px solid var(--line)",
              background: "rgba(18, 41, 74, 0.04)"
            }}
          >
            🔍 Track Case
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
        <div className="mobile-drawer" style={{ top: "90px" }}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            🏠 Home
          </Link>
          <Link to="/negotiation-guidelines" onClick={() => setIsMobileMenuOpen(false)}>
            📜 Negotiation Guidelines
          </Link>
          <Link to="/mediation-rules" onClick={() => setIsMobileMenuOpen(false)}>
            ⚖️ Mediation Rules (2023 Act)
          </Link>
          <Link to="/arbitration-rules" onClick={() => setIsMobileMenuOpen(false)}>
            📑 Arbitration Rules (s. 29A/29B)
          </Link>
          <Link to="/for-neutrals" onClick={() => setIsMobileMenuOpen(false)}>
            👨‍⚖️ For Neutrals / Empanelment
          </Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            📞 Contact &amp; Consultation
          </Link>
          <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
            <button
              className="btn gold"
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenFileModal();
              }}
              style={{ width: "100%" }}
            >
              File a Dispute →
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                scrollToTracker();
              }}
              style={{ width: "100%", border: "1px solid var(--line)" }}
            >
              🔍 Track Active Docket
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;