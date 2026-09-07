import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const getInitialPreferences = () => {
  try {
    const saved = typeof window !== "undefined" ? localStorage.getItem("jn_cookie_consent") : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        necessary: true,
        functional: !!parsed.functional,
        analytics: !!parsed.analytics,
        thirdParty: !!parsed.thirdParty
      };
    }
  } catch {
    // fallback
  }
  return {
    necessary: true,
    functional: false,
    analytics: false,
    thirdParty: false
  };
};

export default function CookieBanner() {
  const [hasConsent, setHasConsent] = useState(() => {
    try {
      return typeof window !== "undefined" && Boolean(localStorage.getItem("jn_cookie_consent"));
    } catch {
      return false;
    }
  });
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState(getInitialPreferences);

  useEffect(() => {
    if (!hasConsent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasConsent]);

  // Listen for manual trigger from Footer or other links
  useEffect(() => {
    const handleOpenPreferences = () => {
      setShowModal(true);
      setIsVisible(false);
    };
    window.addEventListener("jn_open_cookie_preferences", handleOpenPreferences);
    return () => window.removeEventListener("jn_open_cookie_preferences", handleOpenPreferences);
  }, []);

  const saveConsent = (prefs) => {
    const consentObj = {
      ...prefs,
      necessary: true,
      timestamp: new Date().toISOString(),
      version: "2026.1"
    };
    try {
      localStorage.setItem("jn_cookie_consent", JSON.stringify(consentObj));
    } catch {
      // storage quota or blocked
    }
    setHasConsent(true);
    setPreferences(consentObj);
    setIsVisible(false);
    setShowModal(false);
    window.dispatchEvent(new CustomEvent("jn_cookie_consent_updated", { detail: consentObj }));
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      thirdParty: true
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      thirdParty: false
    });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  const handleToggle = (key) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible && !showModal) return null;

  return (
    <>
      {/* Bottom Sticky Consent Banner */}
      {isVisible && !showModal && (
        <aside
          aria-label="Cookie and Privacy Consent"
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            zIndex: 9999,
            background: "rgba(11, 27, 49, 0.96)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderTop: "1px solid rgba(209, 154, 52, 0.35)",
            padding: "16px 24px",
            color: "#FFFFFF",
            boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)",
            animation: "fadeInUp 0.3s ease"
          }}
        >
          <div
            className="wrap"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              maxWidth: "1280px"
            }}
          >
            <div style={{ flex: "1 1 500px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px" }}>🍪</span>
                <strong style={{ fontSize: "13.5px", color: "var(--gold-soft)", letterSpacing: "0.02em" }}>
                  DPDP Act, 2023 &bull; Cookie &amp; Data Protection Framework
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.5" }}>
                JustNivaran deploys strictly necessary cookies for case filing and authentication. Non-essential cookies (functional, analytics, embedded hearing services) are opt-in. We <strong>never</strong> use advertising trackers or sell party data. Read our{" "}
                <Link to="/cookie-policy" style={{ color: "var(--gold)", textDecoration: "underline" }}>
                  Cookie Policy Framework
                </Link>
                .
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{
                  background: "transparent",
                  color: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  padding: "7px 14px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                ⚙️ Preferences
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  padding: "7px 14px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                style={{
                  background: "var(--gold)",
                  color: "#241703",
                  border: "none",
                  padding: "7px 16px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(209, 154, 52, 0.3)"
                }}
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Interactive Preferences Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(11, 27, 49, 0.75)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.3)",
              border: "1px solid var(--line)",
              padding: "24px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 id="cookie-modal-title" style={{ margin: 0, fontSize: "18px", color: "var(--ink)" }}>
                  Institutional Cookie Preferences
                </h3>
                <span style={{ fontSize: "11px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase" }}>
                  Digital Personal Data Protection Act, 2023
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  color: "var(--slate)",
                  cursor: "pointer",
                  lineHeight: 1
                }}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "var(--slate)", lineHeight: "1.5", margin: "0 0 20px" }}>
              Manage your consent preferences for cookies deployed across JustNivaran. Strictly necessary cookies cannot be switched off as they are vital for system integrity and case administration.
            </p>

            <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
              {/* Strictly Necessary */}
              <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13.5px", color: "var(--ink)" }}>Strictly Necessary Cookies</strong>
                  <span style={{ fontSize: "10px", background: "#E2E8F0", color: "#475569", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>ALWAYS ACTIVE</span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--slate)", lineHeight: "1.4" }}>
                  Authentication, CSRF tokens, session state, and dispute filing form resilience.
                </p>
              </div>

              {/* Functional */}
              <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13.5px", color: "var(--ink)" }}>Functional Cookies</strong>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={() => handleToggle("functional")}
                    style={{ transform: "scale(1.15)", cursor: "pointer" }}
                  />
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--slate)", lineHeight: "1.4" }}>
                  Remembers language preferences, accessibility settings, and dismissed notices.
                </p>
              </div>

              {/* Analytics */}
              <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13.5px", color: "var(--ink)" }}>Analytics &amp; Performance</strong>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleToggle("analytics")}
                    style={{ transform: "scale(1.15)", cursor: "pointer" }}
                  />
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--slate)", lineHeight: "1.4" }}>
                  Aggregated telemetry to measure latency, registry adoption, and error diagnostics. Zero advertising.
                </p>
              </div>

              {/* Third-Party Embedded */}
              <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13.5px", color: "var(--ink)" }}>Third-Party Embedded Services</strong>
                  <input
                    type="checkbox"
                    checked={preferences.thirdParty}
                    onChange={() => handleToggle("thirdParty")}
                    style={{ transform: "scale(1.15)", cursor: "pointer" }}
                  />
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--slate)", lineHeight: "1.4" }}>
                  Loaded for embedded video hearings, payment gateway escrow, and e-signature execution.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <Link
                to="/cookie-policy"
                onClick={() => setShowModal(false)}
                style={{ fontSize: "12px", color: "var(--gold-deep)", textDecoration: "underline" }}
              >
                Read Complete Policy Framework &rarr;
              </Link>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  style={{
                    background: "#FFFFFF",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    padding: "8px 14px",
                    borderRadius: "4px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Reject All
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  style={{
                    background: "var(--gold)",
                    color: "#241703",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
