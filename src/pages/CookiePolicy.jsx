import { useState } from "react";
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

export default function CookiePolicy() {
  const [preferences, setPreferences] = useState(getInitialPreferences);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleToggle = (key) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedStatus(false);
  };

  const handleSave = () => {
    const consentObj = {
      ...preferences,
      necessary: true,
      timestamp: new Date().toISOString(),
      version: "2026.1"
    };
    try {
      localStorage.setItem("jn_cookie_consent", JSON.stringify(consentObj));
    } catch {
      // storage blocked
    }
    setSavedStatus(true);
    window.dispatchEvent(new CustomEvent("jn_cookie_consent_updated", { detail: consentObj }));
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleAcceptAll = () => {
    const consentObj = {
      necessary: true,
      functional: true,
      analytics: true,
      thirdParty: true,
      timestamp: new Date().toISOString(),
      version: "2026.1"
    };
    setPreferences(consentObj);
    try {
      localStorage.setItem("jn_cookie_consent", JSON.stringify(consentObj));
    } catch {
      // storage blocked
    }
    setSavedStatus(true);
    window.dispatchEvent(new CustomEvent("jn_cookie_consent_updated", { detail: consentObj }));
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleRejectNonEssential = () => {
    const consentObj = {
      necessary: true,
      functional: false,
      analytics: false,
      thirdParty: false,
      timestamp: new Date().toISOString(),
      version: "2026.1"
    };
    setPreferences(consentObj);
    try {
      localStorage.setItem("jn_cookie_consent", JSON.stringify(consentObj));
    } catch {
      // storage blocked
    }
    setSavedStatus(true);
    window.dispatchEvent(new CustomEvent("jn_cookie_consent_updated", { detail: consentObj }));
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "980px" }}>
      <p className="eyebrow">
        <b>Statutory Compliance Framework</b> DPDP Act, 2023 &bull; DPDP Rules, 2025 &bull; IT Act, 2000
      </p>

      <h1 style={{ marginBottom: "12px", color: "var(--ink)", fontSize: "clamp(26px, 4vw, 36px)" }}>
        Cookie Policy Framework
      </h1>
      <p className="lede" style={{ marginBottom: "24px", color: "var(--slate)" }}>
        Official institutional policy governing the deployment, classification, consent architecture, and Data Principal control of cookies and tracking technologies across the JustNivaran Online Dispute Resolution platform.
      </p>

      {/* Framework Cross-Navigation Tabs */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "28px",
        flexWrap: "wrap"
      }}>
        <Link
          to="/privacy-notice"
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 500,
            background: "var(--paper-hi)",
            color: "var(--ink)",
            textDecoration: "none",
            border: "1px solid var(--line)"
          }}
        >
          📋 Public Privacy Notice
        </Link>
        <Link
          to="/privacy-policy"
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 500,
            background: "var(--paper-hi)",
            color: "var(--ink)",
            textDecoration: "none",
            border: "1px solid var(--line)"
          }}
        >
          🏛️ Parent Governance Framework
        </Link>
        <Link
          to="/cookie-policy"
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            background: "var(--ink)",
            color: "#fff",
            textDecoration: "none",
            border: "1px solid var(--ink)"
          }}
        >
          🍪 Cookie Policy Framework (Active)
        </Link>
      </div>

      {/* Metadata Document Card */}
      <div
        style={{
          background: "var(--paper-hi)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          padding: "20px 24px",
          marginBottom: "36px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
          boxShadow: "0 2px 8px rgba(11,27,49,0.03)"
        }}
      >
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Entity &amp; Platform
          </span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
            JustNivaran Private Limited
          </div>
          <div style={{ fontSize: "12px", color: "var(--slate)" }}>Online Dispute Resolution Platform</div>
        </div>

        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Statutory Reference
          </span>
          <div style={{ fontWeight: 600, color: "var(--gold-deep)", marginTop: "4px" }}>
            DPDP Act, 2023 &amp; Rules, 2025
          </div>
          <div style={{ fontSize: "12px", color: "var(--slate)" }}>Sections 5 &amp; 6 Notice &amp; Consent</div>
        </div>

        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Document Owner &amp; Date
          </span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
            Grievance Officer
          </div>
          <div style={{ fontSize: "12px", color: "var(--slate)" }}>Effective: 28.07.2026 &bull; Annual Review</div>
        </div>

        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Related Documents
          </span>
          <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
            <Link to="/privacy-policy" style={{ color: "var(--gold-deep)", textDecoration: "none" }}>Privacy Policy</Link>
          </div>
          <div style={{ fontSize: "12px", color: "var(--slate)" }}>Privacy Notice &amp; Data Retention</div>
        </div>
      </div>

      {/* Interactive Cookie Preference Centre Box */}
      <div
        id="preference-centre"
        style={{
          background: "#F2F5F9",
          border: "1px solid #D6DFEB",
          borderRadius: "8px",
          padding: "24px 28px",
          marginBottom: "44px",
          boxShadow: "0 4px 16px rgba(11,27,49,0.05)"
        }}
      >
        <div style={{ display: "flex", mechanical: "center", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", color: "var(--ink)" }}>
              ⚙️ Interactive Cookie Preference Centre
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--slate)" }}>
              Exercise your statutory rights under Section 6 of the DPDP Act. Configure your cookie preferences below at any time.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleAcceptAll}
              style={{
                background: "var(--gold)",
                color: "#241703",
                border: "none",
                padding: "8px 14px",
                borderRadius: "4px",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleRejectNonEssential}
              style={{
                background: "#fff",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                padding: "8px 14px",
                borderRadius: "4px",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Reject Non-Essential
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "14px", marginTop: "20px" }}>
          {/* Strictly Necessary */}
          <div style={{ background: "#fff", padding: "16px", borderRadius: "6px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "14.5px", color: "var(--ink)" }}>1. Strictly Necessary Cookies</strong>
                <span style={{ fontSize: "11px", background: "#E2E8F0", color: "#475569", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>ALWAYS ACTIVE</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--slate)", lineHeight: "1.5" }}>
                Essential for session authentication, login persistence, CSRF security tokens, load balancing, and preserving dispute filing drafts. Cannot be disabled.
              </p>
            </div>
            <input type="checkbox" checked disabled style={{ cursor: "not-allowed", transform: "scale(1.2)" }} />
          </div>

          {/* Functional Cookies */}
          <div style={{ background: "#fff", padding: "16px", borderRadius: "6px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "14.5px", color: "var(--ink)" }}>2. Functional Cookies</strong>
                <span style={{ fontSize: "11px", background: "rgba(209,154,52,0.15)", color: "var(--gold-deep)", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>OPT-IN</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--slate)", lineHeight: "1.5" }}>
                Remembers selected display language, accessibility preferences, font scaling, and dismissed portal notices across sessions (up to 12 months).
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={() => handleToggle("functional")}
                style={{ transform: "scale(1.2)", cursor: "pointer" }}
              />
            </label>
          </div>

          {/* Analytics / Performance */}
          <div style={{ background: "#fff", padding: "16px", borderRadius: "6px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "14.5px", color: "var(--ink)" }}>3. Analytics &amp; Performance Cookies</strong>
                <span style={{ fontSize: "11px", background: "rgba(209,154,52,0.15)", color: "var(--gold-deep)", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>OPT-IN</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--slate)", lineHeight: "1.5" }}>
                Aggregated, anonymized telemetry on page latency, feature adoption, and error rates to optimize registry performance. Never used for advertising.
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => handleToggle("analytics")}
                style={{ transform: "scale(1.2)", cursor: "pointer" }}
              />
            </label>
          </div>

          {/* Third-Party Embedded */}
          <div style={{ background: "#fff", padding: "16px", borderRadius: "6px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "14.5px", color: "var(--ink)" }}>4. Third-Party Embedded Services</strong>
                <span style={{ fontSize: "11px", background: "rgba(209,154,52,0.15)", color: "var(--gold-deep)", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>OPT-IN (Non-Essential)</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--slate)", lineHeight: "1.5" }}>
                Cookies set by embedded video-conferencing, payment gateways, and e-signature providers when participating in hearings or completing transactions.
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={preferences.thirdParty}
                onChange={() => handleToggle("thirdParty")}
                style={{ transform: "scale(1.2)", cursor: "pointer" }}
              />
            </label>
          </div>
        </div>

        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              background: "var(--ink)",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Save My Preferences
          </button>
          {savedStatus && (
            <span style={{ color: "#0F766E", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              ✓ Preferences updated and recorded successfully!
            </span>
          )}
        </div>
      </div>

      {/* Statutory Guidance Note */}
      <div
        style={{
          background: "rgba(209,154,52,0.08)",
          borderLeft: "4px solid var(--gold)",
          padding: "16px 20px",
          marginBottom: "36px",
          borderRadius: "0 6px 6px 0",
          fontSize: "13.5px",
          color: "var(--ink)",
          lineHeight: "1.6"
        }}
      >
        <strong>Statutory Notice under DPDP Act, 2023:</strong> Cookies that collect information capable of identifying a user, directly or indirectly (e.g., a persistent device identifier tied to an account) constitute processing of personal data by &ldquo;automated means&rdquo; and therefore fall within the notice and consent requirements of Sections 5 and 6 of the DPDP Act, once those provisions commence (expected May 2027). Strictly necessary cookies that do not identify a user are treated, as a matter of internal best practice, on the same informed-notice standard even though they are not gated behind consent.
      </div>

      {/* Statutory Document Sections */}
      <div style={{ display: "grid", gap: "36px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        
        {/* Section 1 */}
        <section id="section-1">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            1. Purpose and Scope
          </h2>
          <p>
            This Cookie Policy Framework (&ldquo;Policy&rdquo;) sets out how <strong>JustNivaran Private Limited</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;the Platform&rdquo;) uses cookies and similar tracking technologies on its website and application, the categories of such technologies, the purposes for which they are used, the consent mechanism that governs non-essential cookies, and how users can exercise control over them.
          </p>
          <p>
            This Policy operates alongside the Platform&rsquo;s <Link to="/privacy-policy" style={{ color: "var(--gold-deep)" }}>Privacy Notice</Link> and <Link to="/privacy-policy" style={{ color: "var(--gold-deep)" }}>Privacy Policy Framework</Link>. Where this Policy addresses a matter specific to cookies, this Policy governs; all other aspects of personal data processing continue to be governed by those other documents.
          </p>
        </section>

        {/* Section 2 */}
        <section id="section-2">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            2. What Cookies Are and How the Platform Uses Them
          </h2>
          <p>
            A cookie is a small text file placed on your device when you visit a website or use an application, which allows the Platform to recognise your browser or device on return visits, remember choices you have made, and understand how the Platform is used.
          </p>
          <p>
            This policy also covers functionally similar technologies &mdash; local storage, session storage, pixels, and Software Development Kits (hereinafter referred to as &ldquo;SDK&rdquo;) embedded within the Platform&rsquo;s web and mobile applications, including those loaded via third-party video-conferencing, payment, and e-signature integrations.
          </p>
        </section>

        {/* Section 3 */}
        <section id="section-3">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            3. Categories of Cookies Used on the Platform
          </h2>
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "2px solid var(--line)" }}>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Category</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Purpose</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Consent Required?</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Indicative Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Strictly necessary</td>
                  <td style={{ padding: "12px 14px" }}>Session authentication, login persistence, load balancing, security (e.g., CSRF tokens), remembering in-progress case filing form data</td>
                  <td style={{ padding: "12px 14px", color: "#0F766E", fontWeight: 600 }}>No &mdash; essential to deliver the service requested</td>
                  <td style={{ padding: "12px 14px" }}>Session, or up to 30 days for &ldquo;remember me&rdquo; login</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Functional</td>
                  <td style={{ padding: "12px 14px" }}>Remembering language/display preferences, accessibility settings, dismissed notifications</td>
                  <td style={{ padding: "12px 14px", color: "var(--gold-deep)", fontWeight: 600 }}>Yes &mdash; opt-in</td>
                  <td style={{ padding: "12px 14px" }}>Up to 12 months</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Analytics / performance</td>
                  <td style={{ padding: "12px 14px" }}>Understanding usage patterns (pages visited, feature adoption, error rates) to improve the Platform</td>
                  <td style={{ padding: "12px 14px", color: "var(--gold-deep)", fontWeight: 600 }}>Yes &mdash; opt-in</td>
                  <td style={{ padding: "12px 14px" }}>Up to 24 months, or per analytics provider default</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Third-party embedded service cookies</td>
                  <td style={{ padding: "12px 14px" }}>Cookies set by embedded video-conferencing, payment gateway, or e-signature widgets, governed by that provider&rsquo;s own cookie/privacy policy</td>
                  <td style={{ padding: "12px 14px" }}>Yes, where the embedded service itself is optional; No, where the embedded service is essential to conduct a hearing or complete a payment you have initiated</td>
                  <td style={{ padding: "12px 14px" }}>As set by the third-party provider</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ background: "rgba(11,27,49,0.04)", padding: "14px 18px", borderRadius: "4px", marginTop: "12px", border: "1px solid var(--line)" }}>
            <strong>Explicit Prohibition on Behavioral Advertising:</strong> The Platform does not use cookies for third-party behavioural advertising, ad targeting, or cross-site tracking, and does not permit advertising networks to place cookies through the Platform.
          </div>
        </section>

        {/* Section 4 */}
        <section id="section-4">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            4. Consent Mechanism
          </h2>
          <p>On first visit, users are presented with a cookie banner that:</p>
          <ul style={{ paddingLeft: "24px", margin: "10px 0" }}>
            <li>Clearly distinguishes strictly necessary cookies (always active) from functional, analytics, and third-party non-essential cookies (opt-in only).</li>
            <li>Provides a <strong>&ldquo;Reject Non-Essential&rdquo;</strong> option that is as prominent and as easy to select as <strong>&ldquo;Accept All,&rdquo;</strong> consistent with the DPDP Act&rsquo;s requirement that consent be free and that withdrawal be no harder than giving it.</li>
            <li>Links to this Policy for full detail before the user is asked to choose.</li>
            <li>Does not pre-tick any non-essential cookie category.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="section-5">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            5. Managing and Withdrawing Cookie Consent
          </h2>
          <p>Users may manage or withdraw their consent at any time through three statutory mechanisms:</p>
          <ol style={{ paddingLeft: "24px", margin: "10px 0" }}>
            <li><strong>Through the Platform&rsquo;s Cookie Preference Centre:</strong> Accessible at any time via <a href="#preference-centre" style={{ color: "var(--gold-deep)", fontWeight: 600 }}>the controls on this page</a> or from the footer of the website/application, where functional and analytics cookies can be switched on or off independently.</li>
            <li><strong>Through Browser Settings:</strong> Which allow blocking or deleting cookies generally &mdash; noting that blocking strictly necessary cookies will impair or prevent use of the Platform, including case filing and session participation.</li>
            <li><strong>By Writing to the Grievance Officer:</strong> Whose contact details are set out in Section 9 below.</li>
          </ol>
          <p style={{ marginTop: "12px" }}>
            <em>Legal Effect of Withdrawal:</em> Withdrawing consent to functional or analytics cookies takes effect for future visits; it does not retroactively affect data already collected before withdrawal, and does not affect strictly necessary cookies required for you to use the Platform.
          </p>
        </section>

        {/* Section 6 */}
        <section id="section-6">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            6. Third-Party Cookies from Embedded Services
          </h2>
          <p>
            Because the Platform embeds third-party tools to conduct hearings (video-conferencing), collect statutory deposits/fees, and obtain digital e-signatures, those providers may set their own cookies when their component loads within the Platform. The Platform:
          </p>
          <ul style={{ paddingLeft: "24px", margin: "10px 0" }}>
            <li>Requires each such provider to be named in Section 7 below and to be bound by a data processing agreement, consistent with the Privacy Policy Framework.</li>
            <li>Does not permit an embedded provider to use Platform-sourced cookie data for its own independent marketing purposes.</li>
            <li>Will update this policy whenever a new embedded provider is onboarded that sets cookies not already disclosed here.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="section-7">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            7. Current Cookie and Tracking Technology Inventory
          </h2>
          <p>The table below discloses the active inventory of cookies and tracking technologies deployed on the Platform:</p>
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "2px solid var(--line)" }}>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Provider / Cookie Name</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Category</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>session_id / auth_token</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "#0F766E" }}>Strictly necessary</td>
                  <td style={{ padding: "12px 14px" }}>Login session and institutional authentication</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>csrf_token</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "#0F766E" }}>Strictly necessary</td>
                  <td style={{ padding: "12px 14px" }}>Security &mdash; cross-site request forgery protection</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>lang_pref</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--gold-deep)" }}>Functional</td>
                  <td style={{ padding: "12px 14px" }}>Remembers selected display language and accessibility scaling</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>jn_analytics / first-party telemetry</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--gold-deep)" }}>Analytics</td>
                  <td style={{ padding: "12px 14px" }}>Aggregated usage statistics and system latency telemetry</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>video-conferencing provider (WebRTC / Secure SDK)</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--slate)" }}>Third-party embedded</td>
                  <td style={{ padding: "12px 14px" }}>Session/hearing functionality; governed by provider&rsquo;s own policy</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>payment gateway provider (UPI / NetBanking / Cards)</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--slate)" }}>Third-party embedded</td>
                  <td style={{ padding: "12px 14px" }}>Payment processing and statutory fee escrow; governed by provider&rsquo;s own policy</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink)" }}>e-signature provider (Aadhaar / DSC Token)</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--slate)" }}>Third-party embedded</td>
                  <td style={{ padding: "12px 14px" }}>Document execution and authenticated arbitral signing; governed by provider&rsquo;s own policy</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--slate)", fontStyle: "italic" }}>
            This inventory is a live document to be updated by the Engineering function each time a new script, tag, SDK, or embedded widget is added to the Platform. It is mandatory that the Grievance Officer sign off on any addition that introduces a new third-party cookie category before it goes live, so the banner and this policy stay accurate &mdash; a mismatch between actual cookies deployed and what is disclosed is itself a notice-compliance gap under Section 5 of the DPDP Act.
          </p>
        </section>

        {/* Section 8 */}
        <section id="section-8">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            8. Children and Persons Under Guardianship
          </h2>
          <p>
            Consistent with the Platform&rsquo;s <Link to="/privacy-policy" style={{ color: "var(--gold-deep)" }}>Privacy Notice</Link>, the Platform does not use functional, analytics, or third-party non-essential cookies to build behavioural profiles of, or direct targeted content at, users known to be minors or persons with disabilities represented through a lawful guardian. Only strictly necessary cookies are applied to such accounts by default.
          </p>
        </section>

        {/* Section 9 */}
        <section id="section-9">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            9. How to Reach Us
          </h2>
          <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", padding: "20px 24px", borderRadius: "6px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "14px" }}>
              <div>
                <strong style={{ color: "var(--ink)", display: "block", fontSize: "13px", textTransform: "uppercase", fontFamily: "var(--mono)" }}>Grievance Officer</strong>
                <span style={{ fontSize: "14.5px", color: "var(--ink)" }}>Adv. Rajeshwar Sharma, Registrar</span>
              </div>
              <div>
                <strong style={{ color: "var(--ink)", display: "block", fontSize: "13px", textTransform: "uppercase", fontFamily: "var(--mono)" }}>Email Channels</strong>
                <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold-deep)", fontSize: "14.5px", textDecoration: "none" }}>grievance@justnivaran.in</a>
              </div>
              <div>
                <strong style={{ color: "var(--ink)", display: "block", fontSize: "13px", textTransform: "uppercase", fontFamily: "var(--mono)" }}>Registered Office Address</strong>
                <span style={{ fontSize: "14.5px", color: "var(--ink)" }}>New Delhi – 110001, India</span>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", fontSize: "13.5px", color: "var(--slate)" }}>
              <strong>Response Timeline:</strong> Formal acknowledgement within <strong>7 days</strong> (with internal Registry SLA of 24 hours); substantive response and resolution within <strong>30 days</strong>, consistent with the timelines prescribed under the Digital Personal Data Protection Rules, 2025.
            </div>
          </div>
          <p style={{ marginTop: "12px", fontSize: "13.5px" }}>
            Queries about cookies specifically, as well as broader personal data queries, can be directed to the same Grievance Officer.
          </p>
        </section>

        {/* Section 10 */}
        <section id="section-10">
          <h2 style={{ fontSize: "20px", color: "var(--ink)", marginBottom: "12px" }}>
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Policy as our cookie and tracking technology inventory changes, or to reflect the commencement of DPDP Act provisions currently expected around May 2027. Material changes &mdash; particularly the introduction of a new non-essential cookie category &mdash; will trigger a fresh consent prompt rather than relying on prior consent.
          </p>
        </section>

      </div>
    </main>
  );
}
