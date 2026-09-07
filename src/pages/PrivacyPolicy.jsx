import { useState } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("all");

  const SECTIONS = [
    { id: "purpose-scope", label: "1. Purpose & Scope" },
    { id: "definitions", label: "2. Definitions" },
    { id: "principles", label: "3. Guiding Principles" },
    { id: "roles", label: "4. Roles & Responsibilities" },
    { id: "categories", label: "5. Personal Data Processed" },
    { id: "purposes", label: "6. Purposes & Lawful Basis" },
    { id: "sharing", label: "7. Sharing & Disclosure" },
    { id: "cross-border", label: "8. Cross-Border Transfers" },
    { id: "retention", label: "9. Retention & Erasure" },
    { id: "security", label: "10. Security Safeguards" },
    { id: "dpia", label: "11. DPIA & Significant Data Fiduciary" },
    { id: "rights", label: "12. Rights of Data Principals" },
    { id: "children", label: "13. Children & Guardianship" },
    { id: "roadmap", label: "14. Transition Roadmap" },
    { id: "review", label: "15. Review & Grievance Desk" }
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

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "1080px" }}>
      {/* Top Institutional Header */}
      <div style={{ marginBottom: "32px" }}>
        <p className="eyebrow">
          <b>Statutory Governance Architecture</b> DPDP Act, 2023 &bull; DPDP Rules, 2025 &bull; IT Act, 2000 &bull; SPDI Rules, 2011
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: "1.15", margin: "0 0 14px", color: "var(--ink)" }}>
          Privacy Policy Framework
        </h1>
        
        <p className="lede" style={{ color: "#33455F", maxWidth: "900px", margin: "0 0 24px" }}>
          Parent statutory governance framework setting out the architecture through which <strong>JustNivaran Private Limited</strong> collects, processes, stores, shares, and protects personal data of litigants, counsel, and empanelled neutrals across its digital dispute resolution platform.
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
              fontWeight: 600,
              background: "var(--ink)",
              color: "#fff",
              textDecoration: "none",
              border: "1px solid var(--ink)"
            }}
          >
            🏛️ Parent Governance Framework (Active)
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
              Governance Status
            </span>
            <div style={{ fontWeight: 600, color: "var(--gold-deep)", marginTop: "4px" }}>
              Approved by Board of Directors
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>Document Owner: Grievance Officer</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Effective Date &amp; Review
            </span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
              28.07.2026
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>Review Cycle: Annual / Material Change</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Related Subordinate Policies
            </span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
              <Link to="/cookie-policy" style={{ color: "var(--gold-deep)", textDecoration: "none" }}>Cookie Policy Framework</Link>
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>
              <Link to="/data-retention" style={{ color: "var(--slate)", textDecoration: "none" }}>Data Retention</Link> &bull; <Link to="/grievance" style={{ color: "var(--slate)", textDecoration: "none" }}>Grievance Desk</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Guidance Callout Box */}
      <div
        style={{
          background: "rgba(209,154,52,0.08)",
          borderLeft: "4px solid var(--gold)",
          padding: "18px 22px",
          marginBottom: "36px",
          borderRadius: "0 6px 6px 0",
          fontSize: "13.5px",
          color: "var(--ink)",
          lineHeight: "1.65"
        }}
      >
        <strong>Statutory Note on Staggered DPDP Commencement:</strong> The Digital Personal Data Protection Act, 2023 received Presidential assent on 11 August 2023, with substantive provisions being brought into force by government notification (anticipated full commencement by May 2027). This Framework establishes internal best practice ahead of legal mandates, assuming full commencement while actively complying with current statutory requirements under the Information Technology Act, 2000, the SPDI Rules, 2011, the Arbitration and Conciliation Act, 1996, and the Mediation Act, 2023.
      </div>

      {/* Sticky Quick Jump Navigation */}
      <div style={{
        position: "sticky",
        top: "92px",
        zIndex: 40,
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
        padding: "10px 0",
        marginBottom: "40px",
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        whiteSpace: "nowrap"
      }}>
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollToSection(sec.id)}
            style={{
              background: activeSection === sec.id ? "var(--ink)" : "var(--paper-hi)",
              color: activeSection === sec.id ? "#fff" : "var(--ink)",
              border: "1px solid var(--line)",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontFamily: "var(--mono)",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Main Framework Body */}
      <div style={{ display: "grid", gap: "48px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.8" }}>
        
        {/* Section 1 */}
        <section id="purpose-scope" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            1. Purpose and Scope
          </h2>
          <p>
            This Privacy Policy Framework (&ldquo;Framework&rdquo;) sets out the governing architecture through which <strong>JustNivaran Private Limited</strong> (&ldquo;the Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, processes, stores, shares, and protects personal data of litigants, their authorised representatives, empanelled neutrals (arbitrators, mediators, conciliators), and other users in the course of providing online dispute resolution (&ldquo;ODR&rdquo;) services, including e-arbitration, e-mediation, e-negotiation, and e-conciliation.
          </p>
          <p>
            This is an internal governance document intended for the Board, management, employees, contractors, and empanelled neutrals. It is the parent document from which the external-facing <em>Privacy Notice</em>, the <em>Consent Management &amp; Data Subject Rights Policy</em>, and the <em>Data Breach Response &amp; Grievance Redressal Policy</em> are derived. Where any inconsistency arises between this Framework and a subordinate document, this Framework prevails for internal governance purposes and the Privacy Notice prevails for representations made to users.
          </p>
        </section>

        {/* Section 2 */}
        <section id="definitions" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            2. Definitions
          </h2>
          <ul style={{ paddingLeft: "20px", display: "grid", gap: "10px" }}>
            <li>
              <strong>&ldquo;Data Principal&rdquo;:</strong> The individual to whom personal data relates &mdash; in the Platform&rsquo;s context, primarily including litigants, co-litigants, authorised representatives, advocates, and empanelled neutrals.
            </li>
            <li>
              <strong>&ldquo;Data Fiduciary&rdquo;:</strong> The Platform (JustNivaran Private Limited), which determines the purpose and means of processing personal data of Data Principals.
            </li>
            <li>
              <strong>&ldquo;Data Processor&rdquo;:</strong> Any entity processing personal data on behalf of the Platform under contract, including cloud hosting providers, payment gateways, video-conferencing infrastructure providers, and document e-signing vendors.
            </li>
            <li>
              <strong>&ldquo;Personal Data&rdquo;:</strong> Any data about an individual who is identifiable by or in relation to such data.
            </li>
            <li>
              <strong>&ldquo;Case Data&rdquo;:</strong> Personal data submitted in the course of a dispute resolution proceeding, including pleadings, evidence, financial statements, correspondence, and session recordings.
            </li>
            <li>
              <strong>&ldquo;Significant Data Fiduciary&rdquo; (&ldquo;SDF&rdquo;):</strong> A Data Fiduciary notified as such by the Central Government under Section 10 of the DPDP Act, based on factors such as volume and sensitivity of personal data processed, risk to Data Principal rights, and potential impact on electoral democracy, security of the State, and public order. The Platform will assess its SDF exposure once the notification thresholds are published, given the volume of dispute-related personal data it is expected to process at scale.
            </li>
            <li>
              <strong>&ldquo;Consent Manager&rdquo;:</strong> An entity registered with the Data Protection Board of India that enables a Data Principal to give, manage, review, and withdraw consent through an interoperable platform, as contemplated under Section 6(7)&ndash;(9) of the DPDP Act.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="principles" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            3. Guiding Data Protection Principles
          </h2>
          <p>
            The Platform commits to the following foundational principles across all processing activities, consistent with Section 8 of the DPDP Act and international institutional best practice:
          </p>
          <ol style={{ paddingLeft: "24px", display: "grid", gap: "8px" }}>
            <li><strong>Lawfulness and consent-primacy:</strong> Personal data is processed only on the basis of free, specific, informed consent, or a certified legitimate use recognised under the DPDP Act.</li>
            <li><strong>Purpose limitation:</strong> Personal data is collected only for purposes disclosed at or before collection and is not repurposed without fresh notice and consent.</li>
            <li><strong>Data minimisation:</strong> Only personal data necessary for the stated purpose of dispute resolution is collected.</li>
            <li><strong>Accuracy:</strong> Reasonable steps are taken to ensure personal data used to make a decision affecting a Data Principal, or shared with another Data Fiduciary, is accurate and complete.</li>
            <li><strong>Storage limitation:</strong> Personal data is retained only as long as necessary for the specified purpose or as required by applicable law, including the Arbitration and Conciliation Act, 1996 and limitation statutes.</li>
            <li><strong>Security safeguards:</strong> Reasonable and appropriate technical and organisational measures are implemented to prevent personal data breach, in line with Section 8(5) of the DPDP Act.</li>
            <li><strong>Accountability:</strong> The Platform is responsible for compliance and must be able to demonstrate it, including maintaining records of processing activities (&ldquo;RoPA&rdquo;).</li>
          </ol>
        </section>

        {/* Section 4 */}
        <section id="roles" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            4. Roles and Responsibilities
          </h2>
          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "6px", border: "1px solid var(--line)" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--ink)" }}>4.1 Board / Founding Team</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Overall accountability for data protection governance, approval of this Framework, and oversight of significant risk decisions including any Data Protection Impact Assessment (&ldquo;DPIA&rdquo;) outcomes.
              </p>
            </div>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "6px", border: "1px solid var(--line)" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--ink)" }}>4.2 Grievance Officer / Privacy Lead</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Acts as the statutory point of contact required under Section 13 of the DPDP Act for Data Principal grievances, coordinates breach response, maintains the RoPA, and liaises with the Data Protection Board of India once constituted. Contact particulars are published in the Privacy Notice.
              </p>
            </div>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "6px", border: "1px solid var(--line)" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--ink)" }}>4.3 Engineering and Security Function</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Responsible for implementing technical safeguards &mdash; encryption in transit (TLS 1.3) and at rest (AES-256), role-based access controls, immutable logging under Section 63 BSA 2023, and secure deletion &mdash; and for supporting breach detection and forensics.
              </p>
            </div>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "6px", border: "1px solid var(--line)" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--ink)" }}>4.4 Neutrals (Arbitrators, Mediators, Conciliators)</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Empanelled neutrals process Case Data in their capacity as independent adjudicators or facilitators. Their engagement letters include data protection obligations equivalent to those imposed on Data Processors, notwithstanding their functional independence in the proceeding itself.
              </p>
            </div>

            <div style={{ background: "var(--paper-hi)", padding: "16px 20px", borderRadius: "6px", border: "1px solid var(--line)" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--ink)" }}>4.5 Vendors / Data Processors</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Any third party processing personal data on the Platform&rsquo;s behalf (hosting, payments, e-signature, video conferencing, SMS/email gateways) must be bound by a data processing agreement incorporating confidentiality, security, sub-processing consent, breach notification to the Platform within a defined internal SLA (within 24 hours of the processor becoming aware), and data return/deletion on termination.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="categories" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            5. Categories of Personal Data Processed
          </h2>
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "2px solid var(--line)" }}>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Category</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Examples</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Sensitivity</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Identity &amp; contact data</td>
                  <td style={{ padding: "12px 14px" }}>Name, address, phone, email, PAN/Aadhaar (where mandated for KYC), signature</td>
                  <td style={{ padding: "12px 14px", color: "#DC2626", fontWeight: 600 }}>High &mdash; identity/financial identifiers</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Case data</td>
                  <td style={{ padding: "12px 14px" }}>Pleadings, evidence, contracts, correspondence, settlement terms</td>
                  <td style={{ padding: "12px 14px", color: "#DC2626", fontWeight: 600 }}>High &mdash; contractual, financial, and evidentiary records</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Financial data</td>
                  <td style={{ padding: "12px 14px" }}>Bank details, payment records, claim amounts, invoices</td>
                  <td style={{ padding: "12px 14px", color: "#DC2626", fontWeight: 600 }}>High</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Session data</td>
                  <td style={{ padding: "12px 14px" }}>Video/audio recordings and transcripts of hearings, mediation, or conciliation sessions</td>
                  <td style={{ padding: "12px 14px", color: "#DC2626", fontWeight: 600 }}>High &mdash; biometric voice/image elements possible</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Representative data</td>
                  <td style={{ padding: "12px 14px" }}>Advocate-on-record details, power of attorney, authorisation letters</td>
                  <td style={{ padding: "12px 14px", color: "var(--gold-deep)", fontWeight: 600 }}>Moderate</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Technical data</td>
                  <td style={{ padding: "12px 14px" }}>IP address, device ID, login logs, cookies</td>
                  <td style={{ padding: "12px 14px", color: "var(--gold-deep)", fontWeight: 600 }}>Moderate</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Neutral data</td>
                  <td style={{ padding: "12px 14px" }}>Empanelment credentials, conflict-of-interest disclosures, case allocation history</td>
                  <td style={{ padding: "12px 14px", color: "var(--gold-deep)", fontWeight: 600 }}>Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--slate)", fontStyle: "italic" }}>
            <strong>Note on Sensitive Personal Data:</strong> The DPDP Act does not retain the SPDI Rules&rsquo; special category of &ldquo;Sensitive Personal Data or Information&rdquo;; all personal data is subject to a uniform standard of protection. However, until the DPDP Act is fully in force, financial information and any health data disclosed in a dispute (e.g., in a personal injury or matrimonial matter) continue to attract the heightened handling standard under the SPDI Rules, 2011, and this Framework applies that heightened standard as internal best practice regardless of the statutory transition.
          </p>
        </section>

        {/* Section 6 */}
        <section id="purposes" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            6. Purposes and Lawful Basis for Processing
          </h2>
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "2px solid var(--line)" }}>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Purpose</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Lawful Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Onboarding, identity verification, and account creation</td>
                  <td style={{ padding: "12px 14px" }}>Consent</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Case filing, docketing, and neutral allocation</td>
                  <td style={{ padding: "12px 14px" }}>Consent; performance necessary for the service the Data Principal has requested</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Conduct of e-arbitration / e-mediation / e-conciliation / e-negotiation sessions, including recording</td>
                  <td style={{ padding: "12px 14px" }}>Explicit, itemised consent &mdash; recording consent captured separately from general onboarding consent</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Payment processing and invoicing</td>
                  <td style={{ padding: "12px 14px" }}>Consent; compliance with legal obligation under tax and accounting law</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Grievance redressal and legal compliance</td>
                  <td style={{ padding: "12px 14px" }}>Compliance with legal obligation; legitimate use for legal proceedings under Section 7 of the DPDP Act</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Platform security, fraud prevention, and abuse monitoring</td>
                  <td style={{ padding: "12px 14px" }}>Legitimate use recognised under Section 7 (prevention of unlawful activity)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Product improvement and anonymised analytics</td>
                  <td style={{ padding: "12px 14px" }}>Consent, or use of data rendered non-personal through anonymisation</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--slate)" }}>
            Where the Platform relies on &ldquo;legitimate uses&rdquo; under Section 7 of the DPDP Act instead of consent, it documents the specific limb relied upon (e.g., compliance with a court order, processing for legal proceedings) in the RoPA, since these grounds are enumerated and narrower than a general &lsquo;legitimate interest&rsquo; test.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sharing" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            7. Sharing and Disclosure of Personal Data
          </h2>
          <p>
            Personal data may be shared with the following categories of recipients, strictly on a need-to-know basis:
          </p>
          <ul style={{ paddingLeft: "24px", display: "grid", gap: "8px" }}>
            <li><strong>Empanelled neutrals:</strong> Assigned to the specific matter, limited to the Case Data relevant to that proceeding.</li>
            <li><strong>Opposing party and authorised representatives:</strong> To the extent procedurally required for natural justice and evidentiary exchange in the dispute resolution process.</li>
            <li><strong>Data Processors:</strong> Engaged for hosting, payment, video conferencing, and e-signature, under binding data processing agreements.</li>
            <li><strong>Courts, tribunals, or statutory authorities:</strong> Where disclosure is mandated by law, a valid court order, or in connection with enforcement of a settlement or arbitral award.</li>
            <li><strong>Professional advisors:</strong> Auditors and legal counsel under strict confidentiality obligations.</li>
          </ul>
          <div style={{ background: "rgba(11, 27, 49, 0.04)", padding: "14px 18px", borderRadius: "4px", marginTop: "12px", border: "1px solid var(--line)" }}>
            <strong>Institutional Non-Commercialisation Guarantee:</strong> The Platform does not sell personal data or share it for third-party marketing purposes under any circumstances.
          </div>
        </section>

        {/* Section 8 */}
        <section id="cross-border" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            8. Cross-Border Data Transfers
          </h2>
          <p>
            Section 16 of the DPDP Act permits transfer of personal data outside India by default, subject to any country or territory being restricted by the Central Government by notification. Where the Platform uses cloud infrastructure, video-conferencing, or payment processors with servers or sub-processors located outside India, it will:
          </p>
          <ol style={{ paddingLeft: "24px", display: "grid", gap: "8px" }}>
            <li>Maintain an active inventory of the jurisdictions in which personal data is stored or processed;</li>
            <li>Monitor Central Government notifications restricting transfer to specific jurisdictions and cease transfers to any listed jurisdiction without delay;</li>
            <li>Impose contractual safeguards (encryption, confidentiality, audit rights) on all cross-border processors regardless of the statutory minimum;</li>
            <li>Where any litigant or dispute involves a regulated BFSI entity, separately assess sectoral cross-border restrictions imposed by the RBI, IRDAI, or SEBI, which may be narrower than the DPDP Act&rsquo;s default position.</li>
          </ol>
        </section>

        {/* Section 9 */}
        <section id="retention" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            9. Data Retention and Erasure
          </h2>
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "2px solid var(--line)" }}>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Data Category</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Retention Trigger</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Indicative Retention Period</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Case data (pleadings, evidence, award/settlement)</td>
                  <td style={{ padding: "12px 14px" }}>Conclusion of proceeding / enforcement window</td>
                  <td style={{ padding: "12px 14px" }}>Aligned to the Limitation Act, 1963 and enforcement timelines &mdash; recommended not less than 3 years (up to 12 years for decree execution under Article 136)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Session recordings</td>
                  <td style={{ padding: "12px 14px" }}>Conclusion of proceeding</td>
                  <td style={{ padding: "12px 14px" }}>Shorter of contractual necessity or 1 year post-conclusion, unless under legal hold</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Account/identity data</td>
                  <td style={{ padding: "12px 14px" }}>Account closure or 3 years of inactivity</td>
                  <td style={{ padding: "12px 14px" }}>Erasure or anonymisation upon trigger, subject to Section 8(7) notice-before-erasure requirements</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Payment/financial records</td>
                  <td style={{ padding: "12px 14px" }}>Statutory retention under tax and accounting law</td>
                  <td style={{ padding: "12px 14px" }}>As mandated by the Income Tax Act and applicable accounting standards (8 financial years)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Consent records</td>
                  <td style={{ padding: "12px 14px" }}>Life of the account plus limitation period</td>
                  <td style={{ padding: "12px 14px" }}>Retained as statutory evidence of lawful processing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--slate)" }}>
            Where the DPDP Act requires the Platform to give the Data Principal notice before erasing personal data on account of inactivity or purpose completion (Section 8(7)), such notice is dispatched a reasonable period in advance through the registered contact channel. Read our complete <Link to="/data-retention" style={{ color: "var(--gold-deep)" }}>Data Retention &amp; Archival Policy</Link>.
          </p>
        </section>

        {/* Section 10 */}
        <section id="security" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            10. Security Safeguards
          </h2>
          <p>
            In accordance with Section 8(5) of the DPDP Act and as a continuation of the &ldquo;reasonable security practices&rdquo; standard under the SPDI Rules, 2011, the Platform implements:
          </p>
          <ul style={{ paddingLeft: "24px", display: "grid", gap: "8px" }}>
            <li><strong>Cryptographic Safeguards:</strong> 256-bit encryption in transit (TLS 1.3) and at rest (AES-256) across all case dockets, evidentiary vaults, and session media.</li>
            <li><strong>Role-Based Access Control (RBAC):</strong> Strict neutral-specific and case-specific access restrictions preventing unauthorized lateral visibility.</li>
            <li><strong>Multi-Factor Authentication (MFA):</strong> Enforced for administrative personnel and registry case managers.</li>
            <li><strong>Immutable Audit Logging:</strong> Tamper-proof logging of Case Data access under Section 63 BSA 2023 with SHA-256 cryptographic hashes.</li>
            <li><strong>Ephemeral &amp; Time-Bound Access:</strong> Secure, expiring access links for opposing parties and neutrals, automatically revoked upon case closure.</li>
            <li><strong>Vendor Due Diligence:</strong> Rigorous security assessments prior to onboarding Data Processors, accompanied by periodic audits.</li>
            <li><strong>Documented Incident Response:</strong> Rapid containment and breach response protocols governed by statutory reporting timelines.</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section id="dpia" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            11. Data Protection Impact Assessment (DPIA)
          </h2>
          <p>
            If and when the Platform is notified as a <strong>Significant Data Fiduciary (SDF)</strong> under Section 10 of the DPDP Act, it will conduct a formal DPIA in accordance with Section 10(2)(a), assessing the rights of Data Principals and the reasonableness of processing against the stated purpose, and will appoint an India-based Data Protection Officer reporting directly to the Board of Directors.
          </p>
          <p>
            Independent of any formal SDF designation, the Platform conducts an internal DPIA-equivalent risk assessment before launching any new processing activity involving:
          </p>
          <ul style={{ paddingLeft: "24px", margin: "8px 0" }}>
            <li>Hearing session audio/video recording or automated transcription;</li>
            <li>Biometric identity authentication (e.g., Aadhaar e-KYC);</li>
            <li>Automated case-allocation, risk mapping, or outcome-prediction algorithms;</li>
            <li>Integration with a new category of third-party processor or infrastructure provider.</li>
          </ul>
        </section>

        {/* Section 12 */}
        <section id="rights" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            12. Rights of Data Principals
          </h2>
          <p>
            Under Chapter III (Sections 11 to 14) of the DPDP Act, 2023, Data Principals are entitled to exercise the following statutory rights:
          </p>
          <ul style={{ paddingLeft: "24px", display: "grid", gap: "10px" }}>
            <li>
              <strong>Right to Access Information (Section 11):</strong> Request a summary of personal data being processed, processing activities undertaken, and the identities of all Data Fiduciaries and Processors with whom data has been shared.
            </li>
            <li>
              <strong>Right to Correction &amp; Erasure (Section 12):</strong> Request correction of inaccurate or misleading data, completion of incomplete records, and erasure of personal data that is no longer necessary for the dispute resolution proceeding (subject to statutory arbitral archival requirements).
            </li>
            <li>
              <strong>Right of Grievance Redressal (Section 13):</strong> Avail readily accessible grievance redressal mechanisms through our designated Grievance Officer before approaching the Data Protection Board of India.
            </li>
            <li>
              <strong>Right to Nominate (Section 14):</strong> Nominate an individual who shall, in the event of death or incapacity of the Data Principal, exercise these statutory rights on their behalf.
            </li>
          </ul>
        </section>

        {/* Section 13 */}
        <section id="children" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            13. Children&rsquo;s Data and Persons with Disability
          </h2>
          <p>
            Where a litigant is a minor represented through a lawful guardian, or a person with a disability represented through a legal guardian, the Platform applies the strict protective safeguards mandated under Section 9 of the DPDP Act:
          </p>
          <ul style={{ paddingLeft: "24px", margin: "8px 0" }}>
            <li>Verifiable consent is obtained from the parent or lawful guardian prior to processing;</li>
            <li>The Platform strictly prohibits tracking, behavioural monitoring, or targeted advertising directed at such Data Principals;</li>
            <li>Only strictly necessary cookies and operational dockets are deployed for such accounts.</li>
          </ul>
        </section>

        {/* Section 14 */}
        <section id="roadmap" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            14. Transition Roadmap to Full DPDP Act Commencement
          </h2>
          <p>
            The DPDP Act is being brought into force by staggered notification, with substantive commencement anticipated around May 2027. The Platform adopts the following phased transition roadmap:
          </p>
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "2px solid var(--line)" }}>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Phase</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Timing</th>
                  <th style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Phase 1 &mdash; Baseline</td>
                  <td style={{ padding: "12px 14px", color: "var(--gold-deep)", fontWeight: 600 }}>Current (Active)</td>
                  <td style={{ padding: "12px 14px" }}>Apply SPDI Rules 2011 standard; adopt this Framework and subordinate policies as internal best practice ahead of legal mandate.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Phase 2 &mdash; Readiness</td>
                  <td style={{ padding: "12px 14px" }}>12&ndash;18 months before commencement</td>
                  <td style={{ padding: "12px 14px" }}>Finalise RoPA; contractually update all Data Processor agreements; build itemised consent and Consent Manager integration capability; assess Significant Data Fiduciary exposure.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Phase 3 &mdash; Pre-commencement testing</td>
                  <td style={{ padding: "12px 14px" }}>3&ndash;6 months before commencement</td>
                  <td style={{ padding: "12px 14px" }}>Run DPIA-equivalent assessment; test breach notification workflow against Rule-prescribed timelines; appoint/confirm Grievance Officer and, if applicable, DPO.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ink)" }}>Phase 4 &mdash; Commencement</td>
                  <td style={{ padding: "12px 14px", color: "#0F766E", fontWeight: 600 }}>On notified date (expected May 2027)</td>
                  <td style={{ padding: "12px 14px" }}>Switch consent notices, breach notification timelines, and Consent Manager integration live; retire SPDI-only provisions.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 15 */}
        <section id="review" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            15. Review, Amendment &amp; Grievance Redressal Desk
          </h2>
          <p>
            This Framework is reviewed at least annually and upon: (a) any amendment to the DPDP Act, DPDP Rules, or sectoral regulation applicable to BFSI litigants; (b) any material change to the Platform&rsquo;s processing activities; (c) any personal data breach; or (d) any adverse observation by the Data Protection Board of India or a court. Amendments are approved by the Board and cascaded to the Privacy Notice and subordinate policies.
          </p>

          <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", padding: "22px 26px", borderRadius: "6px", marginTop: "20px" }}>
            <h3 style={{ fontSize: "17px", color: "var(--ink)", margin: "0 0 14px" }}>Designated Grievance &amp; Privacy Desk</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div>
                <strong style={{ color: "var(--ink)", display: "block", fontSize: "12.5px", textTransform: "uppercase", fontFamily: "var(--mono)" }}>Grievance Officer &amp; Registrar</strong>
                <span style={{ fontSize: "14.5px", color: "var(--ink)" }}>Adv. Rajeshwar Sharma</span>
              </div>
              <div>
                <strong style={{ color: "var(--ink)", display: "block", fontSize: "12.5px", textTransform: "uppercase", fontFamily: "var(--mono)" }}>Official Email</strong>
                <a href="mailto:grievance@justnivaran.in" style={{ color: "var(--gold-deep)", fontSize: "14.5px", textDecoration: "none" }}>grievance@justnivaran.in</a>
              </div>
              <div>
                <strong style={{ color: "var(--ink)", display: "block", fontSize: "12.5px", textTransform: "uppercase", fontFamily: "var(--mono)" }}>Helpline Desk</strong>
                <a href="tel:+911149876500" style={{ color: "var(--gold-deep)", fontSize: "14.5px", textDecoration: "none" }}>+91 11 4987 6500</a>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", fontSize: "13px", color: "var(--slate)", lineHeight: "1.6" }}>
              <strong>Notice Address:</strong> JustNivaran Private Limited (CIN: U62020DC2026PTC473641), DC-12, 1st Floor, District Centre, Janakpuri, New Delhi – 110058, India.<br />
              <strong>Statutory Service Level Agreement:</strong> Mandatory acknowledgment within <strong>24 hours</strong>; substantive resolution within <strong>15 calendar days</strong> under DPDP Act 2023 &amp; IT Rules 2021.
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
