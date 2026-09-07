import { useState } from "react";
import { Link } from "react-router-dom";

export default function PrivacyNotice() {
  const [activeSection, setActiveSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const SECTIONS = [
    { id: "sec-a", label: "A. Overview" },
    { id: "sec-b", label: "B. Scope & Applicability" },
    { id: "sec-c", label: "C. Information We Collect" },
    { id: "sec-d", label: "D. Third Party Links" },
    { id: "sec-e", label: "E. Use & Legal Basis" },
    { id: "sec-f", label: "F. Legitimate Uses (DPDP)" },
    { id: "sec-g", label: "G. Disclosure & Sharing" },
    { id: "sec-h", label: "H. Rights of Data Principal" },
    { id: "sec-i", label: "I. Children & Guardianship" },
    { id: "sec-j", label: "J. How to Reach Us (Grievance)" },
    { id: "sec-12", label: "12. Changes to Notice" }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleCopyLink = (id) => {
    const url = window.location.origin + window.location.pathname + "#" + id;
    navigator.clipboard.writeText(url);
    alert("Section link copied to clipboard!");
  };

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "1080px" }}>
      {/* Top Institutional Header */}
      <div style={{ marginBottom: "32px" }}>
        <p className="eyebrow">
          <b>Statutory Transparency Notice</b> DPDP Act, 2023 &bull; IT SPDI Rules, 2011 &bull; GDPR Aligned
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: "1.15", margin: "0 0 14px", color: "var(--ink)" }}>
          Privacy Notice
        </h1>
        
        <p className="lede" style={{ color: "#33455F", maxWidth: "900px", margin: "0 0 24px" }}>
          Public-facing data protection disclosure setting out how <strong>JustNivaran Private Limited</strong> processes, protects, and respects personal and sensitive data across all online dispute resolution services.
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
              fontWeight: 600,
              background: "var(--ink)",
              color: "#fff",
              textDecoration: "none",
              border: "1px solid var(--ink)"
            }}
          >
            📋 Public Privacy Notice (Active)
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
              fontWeight: 500,
              background: "var(--paper-hi)",
              color: "var(--ink)",
              textDecoration: "none",
              border: "1px solid var(--line)"
            }}
          >
            🍪 Cookie Policy Framework
          </Link>
        </div>

        {/* Metadata Grid */}
        <div style={{
          background: "var(--paper-hi)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          boxShadow: "0 2px 8px rgba(11,27,49,0.03)"
        }}>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Data Fiduciary</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginTop: "3px" }}>JustNivaran Private Limited</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Statutory Regimes</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--gold)", marginTop: "3px" }}>DPDP 2023 &bull; SPDI 2011 &bull; GDPR</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Grievance Desk</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginTop: "3px" }}>grievance@justnivaran.in</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Statutory SLA</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginTop: "3px" }}>24h Ack &bull; 15d Resolution</div>
          </div>
        </div>
      </div>

      {/* Quick Jump Section Bar */}
      <div style={{
        position: "sticky",
        top: "92px",
        zIndex: 20,
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        padding: "12px 16px",
        marginBottom: "36px",
        boxShadow: "0 4px 12px rgba(11,27,49,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", fontFamily: "var(--mono)", textTransform: "uppercase", color: "var(--slate)", fontWeight: 600 }}>
            ⚡ Quick Navigation
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search privacy notice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "4px",
                border: "1px solid var(--line)",
                width: "180px",
                fontFamily: "var(--sans)"
              }}
            />
            <button
              type="button"
              onClick={() => window.print()}
              className="btn ghost"
              style={{ padding: "4px 10px", fontSize: "12px", height: "26px" }}
              title="Print Notice"
            >
              🖨️ Print
            </button>
          </div>
        </div>

        <div style={{
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "thin"
        }}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              style={{
                background: activeSection === sec.id ? "var(--ink)" : "var(--paper-hi)",
                color: activeSection === sec.id ? "#fff" : "var(--slate)",
                border: activeSection === sec.id ? "1px solid var(--ink)" : "1px solid var(--line)",
                borderRadius: "14px",
                padding: "4px 12px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontWeight: activeSection === sec.id ? 600 : 400
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Content Container */}
      <div style={{ display: "grid", gap: "32px" }}>

        {/* Section A */}
        <section id="sec-a" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              A. OVERVIEW
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-a")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75" }}>
            <p>
              <strong>“Just Nivaran Private Limited”</strong> (also referred to as (<strong>“Platform”/ “Just Nivaran”</strong>) shall collectively refer to Just Nivaran. <strong>“You” / “Yourself” / “User”/ “Visitor”</strong> shall collectively be interpreted in a way to refer to the ‘User’ of the website whether it means any Individual/Entity/Organization/Company accessing the website.
            </p>
          </div>
        </section>

        {/* Section B */}
        <section id="sec-b" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              B. SCOPE &amp; APPLICABILITY
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-b")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p>
              This privacy policy describes the information practices that we carry out to process, use, store, disclose, transfer and protects your personal data/information when you use or access our Online Dispute Resolution services which include but are not limited to e-Arbitration, Mediation, Negotiation, Conciliation, Case Management, document exchange, e-signatures, and audio recordings/video recordings/ case hearings (hereinafter collectively referred to as <strong>“Services”</strong>) via any website, mobile applications, APIs, communication tools, and any other online services.
            </p>
            <p>
              By accessing our website or using the services, you acknowledge that you have read our Privacy policy thoroughly and hereby consent to it. However, if you do not agree, kindly do not use our website.
            </p>
            <p>
              The Objective of this policy is to comply with applicable data protection laws such as <strong>Digital Personal Data Protection Act, 2023</strong> (hereinafter <strong>“DPDP Act”</strong>), the Information Technology Act (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (hereinafter <strong>“SPDI Rules”</strong>) to the extent in force, and – where applicable – the EU/UK General Data Protection Regulation (hereinafter <strong>“GDPR”</strong>).
            </p>
            <p><strong>This policy applies to:</strong></p>
            <ul style={{ paddingLeft: "24px", margin: "4px 0", display: "grid", gap: "6px" }}>
              <li><strong>a.</strong> Visitors who browse or interact with our platform</li>
              <li><strong>b.</strong> Account Holders who register and use our services</li>
              <li><strong>c.</strong> Legal Professionals or Party Representatives acting on behalf of clients (Legal Counsel, Advisors)</li>
              <li><strong>d.</strong> Parties to the Dispute (Claimant and Respondent)</li>
              <li><strong>e.</strong> Neutrals (Arbitrators, Mediators, Conciliators, Negotiators)</li>
              <li><strong>f.</strong> Witnesses, Experts and other Participants (if any)</li>
            </ul>
          </div>
        </section>

        {/* Section C */}
        <section id="sec-c" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              C. WHAT INFORMATION WE COLLECT
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-c")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "16px" }}>
            <p>
              Whenever you access our website or choose to interact with our platform for the purpose of availing services, you may asked to provide us with information relating to you. By agreeing to avail our services, you consent to providing us with the following categories of data which are as follows:
            </p>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px", fontWeight: 600 }}>I. Personal Information</h3>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "grid", gap: "5px" }}>
                <li>First name, middle name and last name, username or any similar identifier;</li>
                <li>Contact number, email address, postal address and gender;</li>
                <li>Identification documents such as PAN card, Aadhar card, Passport etc.;</li>
                <li>Nationality, Residential address, delivery address;</li>
                <li>Employment, business or professional details (where applicable);</li>
                <li>Payment and billing information;</li>
                <li>Account credentials or login credentials (username, password etc.);</li>
                <li>Communications sent to us which include but are not limited to customer support queries or any technical question or any other communication that pertains to the functioning of our platform;</li>
                <li>Any other information that is voluntarily submitted by you during registration or case submission.</li>
              </ul>
            </div>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px", fontWeight: 600 }}>II. DISPUTE RELATED INFORMATION</h3>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "grid", gap: "5px" }}>
                <li>Case details, statements, claims, counter claims, supporting documents, evidence, and correspondence related to the dispute etc.;</li>
                <li>Communications exchanged during the arbitration, mediation, negotiation proceedings;</li>
                <li>Transcript of the Proceeding;</li>
                <li>Awards, settlements, orders (interim and final both), or any other decision made by the Mediator / Arbitrator / adjudicating authority;</li>
                <li>Any other miscellaneous document that may be related to the dispute.</li>
              </ul>
            </div>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px", fontWeight: 600 }}>III. TECHNICAL AND USAGE INFORMATION</h3>
              <ul style={{ paddingLeft: "20px", margin: 0, display: "grid", gap: "5px" }}>
                <li>IP address, browser type, device identifiers, operating system, and access timestamps;</li>
                <li>Log files, cookies, and usage analytics to improve performance and security.</li>
              </ul>
            </div>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px", fontWeight: 600 }}>IV. SENSITIVE PERSONAL DATA</h3>
              <p style={{ margin: "0 0 8px" }}>
                As prescribed under the Information Technology (Reasonable security practices and procedures sensitive personal data or information Rules, 2011) (hereinafter <strong>“IT Rules”</strong>) this may include:
              </p>
              <ul style={{ paddingLeft: "20px", margin: "0 0 10px", display: "grid", gap: "5px" }}>
                <li>Password;</li>
                <li>Financial information such as Bank account or credit card or debit card or other payment instrument details;</li>
                <li>Physical, physiological or mental health condition;</li>
                <li>Sexual orientation;</li>
                <li>Medical history and records;</li>
                <li>Biometric information;</li>
                <li>Any detail relating to the above clauses as provided to body corporate for providing service; and</li>
                <li>Any of the information received under above clauses by body corporate for processing, stored or processed under lawful contract or otherwise.</li>
              </ul>
              <div style={{ fontSize: "13px", color: "var(--slate)", fontStyle: "italic", borderTop: "1px solid var(--line)", paddingTop: "8px" }}>
                <strong>Statutory Proviso:</strong> Provided that, any information that is freely available or accessible in the public domain or furnished under the Right to Information Act, 2005 or any other law for the time being in force shall not be regarded as sensitive personal data or information for the purposes of these rules.
              </div>
            </div>
          </div>
        </section>

        {/* Section D */}
        <section id="sec-d" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              D. THIRD PARTY USERS/LINKS
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-d")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75" }}>
            <p>
              When you access our website, you may come across links to another website plugins or applications that are controlled by third party. By clicking and providing your consent to access such links, plugins or applications, you are enabling the third party to collect your personal data/information from the website. We are not in control of any such third party and shall in no manner be held liable for the manner in which they collect and make use of your data. It is advisable that you may visit their privacy policy / notice / statement to know more about their information practices and procedures.
            </p>
          </div>
        </section>

        {/* Section E */}
        <section id="sec-e" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              E. HOW WE USE YOUR INFORMATION AND LEGAL BASIS FOR USING IT
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-e")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "10px" }}>
            <p>We may use your personal data / information to:</p>
            <ul style={{ paddingLeft: "24px", margin: 0, display: "grid", gap: "8px" }}>
              <li><strong>• Facilitate ODR proceedings:</strong> Register users, case filing, communications with the opposite party or parties, schedule sessions etc.;</li>
              <li><strong>• Verify Identities:</strong> Authenticate users, neutrals, and representatives;</li>
              <li><strong>• Provide Support:</strong> Offer technical or procedural assistance;</li>
              <li><strong>• Comply with Legal Obligations:</strong> As required under applicable laws, court orders, or regulatory mandates;</li>
              <li><strong>• Improve Services:</strong> Conduct research, audits, and user experience improvements;</li>
              <li><strong>• Communicate Updates:</strong> Send service-related notifications, policy updates, and administrative messages;</li>
              <li><strong>• Ensure Platform Security:</strong> Detect and prevent fraud, misuse, or unauthorized access.</li>
            </ul>
          </div>
        </section>

        {/* Section F */}
        <section id="sec-f" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              F. HOW WE PROCESS YOUR PERSONAL DATA (LEGITIMATE USES UNDER DPDP ACT)
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-f")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p>
              The DPDP Act permits the processing of personal data belonging to data principals for certain legitimate uses. For such uses, a data fiduciary may not be required to provide notice or obtain consent from a data principal. The prescribed legitimate uses under the DPDP Act include:
            </p>
            <ul style={{ paddingLeft: "24px", margin: 0, display: "grid", gap: "8px" }}>
              <li><strong>a.</strong> Where data principals voluntarily provide their personal data to the data fiduciary and if the data principal has not indicated to the data fiduciary that they do not consent to the use of such personal data</li>
              <li><strong>b.</strong> For the performance of any function or fulfilling any obligation under any law by government authorities</li>
              <li><strong>c.</strong> For compliance with any judgment, order or decree issued under any law</li>
              <li><strong>d.</strong> For responding to a medical emergency involving a threat to the life or immediate threat to the health of the data principal or any other individual</li>
              <li><strong>e.</strong> For taking measures to provide medical treatment or health service to any individual during an epidemic, outbreak of disease, or any other threat to public health</li>
              <li><strong>f.</strong> For taking measures to ensure the safety of, or provide assistance or services to any individual during any disaster, or any breakdown of public order; and</li>
              <li><strong>g.</strong> For purposes related to employment.</li>
            </ul>
          </div>
        </section>

        {/* Section G */}
        <section id="sec-g" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              G. DISCLOSURE AND SHARING OF INFORMATION
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-g")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p>We may share your information in the following circumstances:</p>
            <ul style={{ paddingLeft: "24px", margin: 0, display: "grid", gap: "8px" }}>
              <li><strong>• Between Disputing Parties:</strong> As necessary to facilitate the dispute resolution process (e.g., sharing statements with the opposing party or the neutral).</li>
              <li><strong>• With Neutrals and Panel Members:</strong> Arbitrators, mediators, conciliators, or other professionals engaged in the process.</li>
              <li><strong>• Service Providers:</strong> IT, hosting, payment gateways, or communication service providers under strict confidentiality obligations.</li>
              <li><strong>• Regulatory Authorities:</strong> When required by law, court orders, or government agencies.</li>
              <li><strong>• Business Transfers:</strong> In case of merger, acquisition, or restructuring, subject to confidentiality safeguards.</li>
            </ul>
            <div style={{ background: "var(--paper-hi)", padding: "12px 16px", borderRadius: "4px", border: "1px solid var(--line)", fontWeight: 600, color: "var(--ink)" }}>
              🔒 Commercial Guarantee: We do not sell or rent your personal data to any third parties for marketing purposes.
            </div>
          </div>
        </section>

        {/* Section H */}
        <section id="sec-h" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              H. RIGHTS OF DATA PRINCIPAL
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-h")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p>
              Subject to applicable law and any verification we may reasonably require, you have the right to:
            </p>
            <ol style={{ paddingLeft: "24px", margin: 0, display: "grid", gap: "8px" }}>
              <li><strong>Access:</strong> Access a summary of the personal data we hold about you and the processing we carry out.</li>
              <li><strong>Correction &amp; Completion:</strong> Request correction or completion of inaccurate or incomplete personal data.</li>
              <li><strong>Erasure:</strong> Request erasure of personal data that is no longer necessary for the purpose it was collected, subject to our legal retention obligations.</li>
              <li><strong>Consent Withdrawal:</strong> Withdraw consent at any time, with the same ease with which you gave it — noting that withdrawal does not affect the lawfulness of processing before withdrawal, and may affect our ability to continue providing services tied to an ongoing case.</li>
              <li><strong>Nomination:</strong> Nominate another individual to exercise these rights on your behalf in the event of your death or incapacity.</li>
              <li><strong>Grievance &amp; Escalation:</strong> Raise a grievance with us, and if unresolved, approach the Data Protection Board of India once it is constituted and operational.</li>
            </ol>
            <p style={{ marginTop: "4px" }}>
              To exercise any of these rights, write to our Grievance Officer using the contact details in <strong>Section J</strong>.
            </p>
          </div>
        </section>

        {/* Section I */}
        <section id="sec-i" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              I. Children and Persons Under Guardianship
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-i")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75" }}>
            <p>
              If you are a minor, or a person with a disability represented by a lawful guardian, your account and case must be managed through your parent or lawful guardian, who will provide verifiable consent on your behalf. We do not knowingly direct behavioural tracking or advertising at such users.
            </p>
          </div>
        </section>

        {/* Section J */}
        <section id="sec-j" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              J. How to Reach Us &bull; Grievance Redressal Desk
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-j")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "16px" }}>
            <p>
              In accordance with Section 13 of the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000, Data Principals may direct any inquiry, consent withdrawal, or grievance to our designated officer:
            </p>

            <div style={{
              background: "var(--paper-hi)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              padding: "20px 24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px"
            }}>
              <div>
                <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Designated Authority</span>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)", marginTop: "2px" }}>Adv. Rajeshwar Sharma</div>
                <div style={{ fontSize: "13px", color: "var(--slate)" }}>Grievance &amp; Data Protection Officer</div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Grievance Email</span>
                <div style={{ fontSize: "15px", fontWeight: 600, marginTop: "2px" }}>
                  <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold-deep)", textDecoration: "underline" }}>
                    grievance@justnivaran.in
                  </a>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Official Postal Address</span>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)", marginTop: "2px", lineHeight: "1.5" }}>
                  DC-12, 1st Floor, District Centre,<br />Janakpuri, New Delhi – 110058, India
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Statutory Response SLA</span>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)", marginTop: "2px", lineHeight: "1.5" }}>
                  Acknowledgement within <strong>24 hours</strong>;<br />
                  Resolution within <strong>15 calendar days</strong>.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 12 */}
        <section id="sec-12" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              12. Changes to This Notice
            </h2>
            <button type="button" onClick={() => handleCopyLink("sec-12")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75" }}>
            <p>
              We may update this Notice from time to time, including to reflect the commencement of DPDP Act provisions currently expected around May 2027. We will notify you of material changes through the Platform or your registered email, and where required, seek fresh consent.
            </p>
          </div>
        </section>

      </div>

      {/* Action Footer Callout */}
      <div style={{
        marginTop: "48px",
        background: "var(--ink)",
        borderRadius: "6px",
        padding: "36px 40px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "24px"
      }}>
        <div style={{ maxWidth: "560px" }}>
          <h3 style={{ color: "#fff", fontSize: "22px", margin: "0 0 8px", fontWeight: 600 }}>
            Exercise Your Data Principal Rights
          </h3>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
            Submit an official data access, correction, erasure, or consent withdrawal request to our Grievance Desk.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a
            href="mailto:grievance@justnivaran.in?subject=Data%20Principal%20Rights%20Request"
            className="btn gold"
            style={{ padding: "12px 24px", fontSize: "14.5px", textDecoration: "none" }}
          >
            Email Grievance Officer
          </a>
          <Link
            to="/privacy-policy"
            className="btn ghost"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", padding: "12px 20px", fontSize: "14.5px", textDecoration: "none" }}
          >
            View Governance Framework
          </Link>
        </div>
      </div>
    </main>
  );
}
