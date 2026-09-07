import { useState } from "react";
import { Link } from "react-router-dom";

export default function ArbitrationRules({ onOpenFileModal }) {
  const [activeSection, setActiveSection] = useState("all");

  const SECTIONS = [
    { id: "preamble", label: "Preamble" },
    { id: "general-rules", label: "Part 1: General Rules" },
    { id: "definitions", label: "Definitions & Interpretation" },
    { id: "general-provisions", label: "Part I: General Provisions (R. 1–4)" },
    { id: "communications-time", label: "Communications & Time (R. 5–7)" },
    { id: "commencement", label: "Commencement (R. 8–11)" },
    { id: "tribunal", label: "Arbitral Tribunal (R. 12–17)" },
    { id: "conduct", label: "Conduct of Proceedings (R. 18–23)" },
    { id: "hearings", label: "Hearings & Defaults (R. 24–25)" },
    { id: "jurisdiction-interim", label: "Jurisdiction & Interim (R. 26–28)" },
    { id: "seat-venue", label: "Seat, Venue & Language (R. 29–31)" },
    { id: "award", label: "The Award & Costs (R. 32–35)" },
    { id: "correction", label: "Correction & Clarification (R. 36)" },
    { id: "recourse", label: "Recourse & Termination (R. 37–38)" },
    { id: "confidentiality", label: "Confidentiality & Records (R. 39–40)" },
    { id: "applicable-law", label: "Applicable Law (R. 41–42)" },
    { id: "admin-misc", label: "Admin & Miscellaneous (R. 43–48)" }
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
          <b>Institutional Procedure</b> Arbitration &amp; Conciliation Act, 1996 &bull; Effective 28.07.2026
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: "1.15", margin: "0 0 16px", color: "var(--ink)" }}>
          JustNivaran Arbitration (Arbitration Procedure) Rules, 2026
        </h1>
        
        <p className="lede" style={{ color: "#33455F", maxWidth: "880px", margin: "0 0 28px" }}>
          Official statutory and procedural rules governing domestic and international commercial arbitrations, fast-track proceedings, and emergency interim relief administered through the JustNivaran Online Dispute Resolution (ODR) Platform.
        </p>

        {/* Metadata Grid */}
        <div style={{
          background: "var(--paper-hi)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          boxShadow: "0 2px 8px rgba(18, 41, 74, 0.04)"
        }}>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Administering Body</span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px", fontSize: "14.5px" }}>JustNivaran Private Limited</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Statutory Foundation</span>
            <div style={{ fontWeight: 600, color: "var(--gold-deep)", marginTop: "4px", fontSize: "14.5px" }}>Arbitration &amp; Conciliation Act, 1996</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Effective Date</span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px", fontSize: "14.5px" }}>28 July 2026 (28.07.2026)</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Emergency Relief</span>
            <div style={{ fontWeight: 600, color: "var(--gold)", marginTop: "4px", fontSize: "14.5px" }}>Rule 28 &bull; 14-Day Emergency Procedure</div>
          </div>
        </div>
      </div>

      {/* Quick Jump Pills */}
      <div style={{
        position: "sticky",
        top: "92px",
        zIndex: 40,
        background: "rgba(237, 241, 245, 0.95)",
        backdropFilter: "blur(12px)",
        padding: "12px 0",
        marginBottom: "32px",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        scrollbarWidth: "none"
      }}>
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollToSection(sec.id)}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontFamily: "var(--sans)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: activeSection === sec.id ? "var(--ink)" : "var(--line)",
              background: activeSection === sec.id ? "var(--ink)" : "#fff",
              color: activeSection === sec.id ? "#fff" : "var(--ink)",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Full Document Body */}
      <div style={{ display: "grid", gap: "40px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        
        {/* PREAMBLE */}
        <section id="preamble" style={{ scrollMarginTop: "150px" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(18, 41, 74, 0.04) 0%, rgba(209, 154, 52, 0.06) 100%)",
            borderLeft: "4px solid var(--gold)",
            borderTop: "1px solid var(--line)",
            borderRight: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            borderRadius: "0 6px 6px 0",
            padding: "28px"
          }}>
            <h2 style={{ fontSize: "22px", fontFamily: "var(--serif)", color: "var(--ink)", marginTop: 0, marginBottom: "14px" }}>
              PREAMBLE
            </h2>
            <p style={{ margin: "0 0 14px" }}>
              JustNivaran Private Limited (<strong>&ldquo;JustNivaran&rdquo;</strong>) is an online dispute resolution institution and AI-enabled dispute resolution service provider established to facilitate the efficient, accessible, secure, and structured resolution of disputes through digital mode of dispute resolution. Through its AI-enabled infrastructure and online dispute resolution platform (<strong>&ldquo;ODR Platform&rdquo;</strong>), JustNivaran enables parties to access and participate in arbitration, mediation, conciliation, negotiation, settlement, and such other dispute resolution processes as may be made available from time to time.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              Our ODR Platform is designed to provide an integrated framework for the administration and facilitation of dispute resolution proceedings, including initiation and registration of disputes, communication between participants, submission and exchange of documents and evidence, appointment and engagement of neutrals, scheduling and conduct of proceedings, virtual hearings, settlement facilitation, issuance and communication of procedural orders, settlements, awards or other outcomes, and completion or termination of proceedings, as may be applicable to the nature of the dispute and the applicable legal framework.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              The objective of JustNivaran is to make dispute resolution accessible, efficient, transparent, technology-enabled, cost-effective, and time-conscious, while maintaining the principles of party autonomy, procedural fairness, neutrality, confidentiality, security, and due process. The ODR Platform is intended to reduce procedural and logistical barriers associated with conventional dispute resolution while ensuring that technology remains an enabler of, and not a substitute for, the legal rights and procedural safeguards available to the parties. With a view to establishing a consistent and reliable framework for the initiation, conduct, administration, and conclusion of proceedings facilitated through the ODR Platform, these rules have been formulated to provide the procedural and administrative framework governing the use of the Platform and the dispute resolution processes conducted through it.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              These rules shall be known as the <strong>&ldquo;JustNivaran ODR Rules&rdquo; (&ldquo;Rules&rdquo;)</strong> and shall be read together with the applicable agreement between the parties, the relevant procedural framework, applicable laws, and such schedules, protocols, practice directions, policies, and other instruments as may be issued or incorporated by JustNivaran from time to time.
            </p>
            <p style={{ margin: 0 }}>
              These Rules are intended to promote the fair, expeditious, economical, secure, and effective resolution of disputes and shall be interpreted and administered consistently with applicable law and the fundamental principles governing the relevant dispute resolution process.
            </p>
          </div>
        </section>

        {/* PART 1: GENERAL RULES */}
        <section id="general-rules" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "24px", color: "var(--ink)", borderBottom: "2px solid var(--gold)", paddingBottom: "8px", marginBottom: "20px" }}>
            GENERAL RULES — SHORT TITLE, EXTENT AND APPLICATION
          </h2>
          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "16px" }}>Part 1: General Rules</h3>

          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <h4 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>1. Scope and Application of the JustNivaran ODR Platform</h4>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.1 Agreement to the JustNivaran Rules:</strong> Where the parties have agreed by contract, consent, referral, or otherwise to refer their disputes to JustNivaran for resolution through arbitration, mediation, conciliation, negotiation, or any other dispute resolution process offered through the JustNivaran online dispute resolution (&ldquo;ODR&rdquo;) platform, the parties shall be deemed to have agreed that such proceedings shall be conducted and administered through the JustNivaran ODR platform in accordance with these Rules, as amended from time to time. These Rules shall be referred to as the &ldquo;JustNivaran Rules&rdquo; or &ldquo;Rules&rdquo; and shall govern the conduct, administration, communication, and use of the ODR platform to the extent applicable to the dispute resolution process selected by the parties.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.2 Scope of Application:</strong> These Rules shall apply to domestic and international disputes that are referred to JustNivaran under a contract, agreement, statute, court or statutory authority referral, or any other valid instrument or arrangement between the parties. The Rules may apply to proceedings conducted wholly or partly through the JustNivaran ODR platform, including:
              </p>
              <ul style={{ margin: "0 0 8px 24px" }}>
                <li>arbitration;</li>
                <li>mediation;</li>
                <li>conciliation;</li>
                <li>negotiation or facilitated settlement;</li>
                <li>pre-litigation dispute resolution; and</li>
                <li>such other dispute resolution processes as may be offered or facilitated by JustNivaran from time to time.</li>
              </ul>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.3 Incorporation of the Rules and Platform Terms:</strong> The JustNivaran Rules shall include, as applicable, the rules, schedules, guidelines, protocols, procedural directions, codes of conduct, terms and conditions, privacy and data policies, platform protocols, and other documents issued or adopted by JustNivaran for the effective functioning of its ODR platform. Such documents shall be read together with these Rules and shall form part of the procedural framework applicable to the relevant dispute resolution proceeding.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.4 Effective Date and Application:</strong> These Rules shall come into force on <strong>28.07.2026</strong> and, unless otherwise agreed by the parties or required by applicable law, shall apply to all proceedings commenced under the JustNivaran Rules on or after such date. JustNivaran may amend, modify, supplement, or replace these Rules from time to time. The version of the Rules applicable to a proceeding shall be determined in accordance with the applicable agreement between the parties, the terms governing the relevant proceeding, and the mandatory applicable law.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.5 Proceedings Referred by Courts or Authorities:</strong> Where a dispute is referred to JustNivaran by a court, statutory authority, governmental authority, regulator, tribunal, or other competent body, the dispute shall be administered in accordance with the applicable rules, regulations, directions, orders, guidelines, or terms prescribed by such referring authority, to the extent applicable. In the event of any inconsistency between these Rules and a binding direction or mandatory requirement of the referring authority, the latter shall prevail to the extent of such inconsistency.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.6 Prevailing Law and Mandatory Provisions:</strong> These Rules shall govern the conduct and administration of proceedings conducted through the JustNivaran ODR platform, except to the extent that any provision of these Rules is inconsistent with a mandatory provision of law applicable to the relevant proceeding from which the parties cannot lawfully derogate. In such circumstances, the applicable mandatory provision of law shall prevail. For arbitration proceedings, the applicable provisions of the Arbitration and Conciliation Act, 1996, as amended from time to time, and any other mandatory applicable law shall prevail over these Rules to the extent of any inconsistency. For mediation proceedings, the applicable provisions of the Mediation Act, 2023, as amended from time to time, and any other mandatory applicable law shall prevail to the extent applicable.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.7 Commencement and Continuation of Proceedings:</strong> JustNivaran may accept, administer, or facilitate a dispute resolution proceeding only where the dispute falls within the scope of the relevant dispute resolution process and the applicable agreement, referral, or legal framework permits such proceeding. JustNivaran may decline to initiate or may discontinue the administration of a proceeding where it is evident that the claim or dispute is barred by applicable law, including by limitation, statutory prohibition, lack of jurisdiction, non-arbitrability, or any other legal restriction. The determination of any such legal bar shall be made by the competent authority, Registrar, mediator, conciliator, arbitral tribunal, or other duly authorised person, as applicable and in accordance with law.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.8 Neutrality and Limited Role of JustNivaran:</strong> JustNivaran shall act as a neutral ODR platform and facilitator and shall not, merely by providing technological, administrative, or procedural support, assume the role of an adjudicator, arbitrator, mediator, conciliator, or representative of any party. Except where expressly authorised under applicable law or the agreement of the parties, JustNivaran shall not determine the merits of a dispute, decide the rights or liabilities of the parties, or provide legal advice to any party. The adjudicatory or facilitative functions shall be performed by the arbitrator, arbitral tribunal, mediator, conciliator, or other duly appointed neutral, as applicable.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.9 Electronic Communication and Platform Use:</strong> The parties agree that notices, statements, pleadings, applications, evidence, submissions, orders, awards, settlement communications, correspondence, and other documents or communications may, where permitted, be transmitted, exchanged, uploaded, stored, or otherwise processed through the JustNivaran ODR platform. The use of electronic records, electronic signatures, authentication mechanisms, digital communication, video or audio conferencing, and other technology-enabled processes shall be subject to applicable law and the procedures prescribed by JustNivaran for the relevant proceeding.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.10 Personal and Non-Personal Information:</strong> In connection with the use of the JustNivaran ODR platform, JustNivaran may collect, process, store, and use Personal Information and Non-Personal Information in accordance with applicable law and its applicable privacy and data protection policies. Non-Personal Information may include anonymised or aggregated usage information, demographic data, referring/exit URLs, platform/device info, preferences, click patterns, and aggregated dispute outcomes. Personal Information may include names, contact details, identification records, claims, submissions, evidence, and settlement records.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.11 Practice Directions and Procedural Guidance:</strong> JustNivaran, through its authorised officer, Registrar, administrator, or other competent authority, may issue practice directions, procedural guidance, protocols, or instructions from time to time for the effective implementation and administration of these Rules.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>1.12 Interpretation:</strong> These Rules shall be interpreted in a manner that facilitates the fair, efficient, expeditious, economical, secure, and technology-enabled resolution of disputes while preserving natural justice, party autonomy, confidentiality, neutrality, and due process.
              </p>
              <p style={{ margin: 0 }}>
                <strong>1.13 Acceptance of the ODR Framework:</strong> By registering a dispute with JustNivaran, participating in a proceeding administered or facilitated through the JustNivaran ODR platform, or otherwise consenting to resolution through JustNivaran, the parties acknowledge and agree to comply with these Rules and platform procedures.
              </p>
            </div>
          </div>
        </section>

        {/* DEFINITIONS AND INTERPRETATIONS */}
        <section id="definitions" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "24px", color: "var(--ink)", borderBottom: "2px solid var(--gold)", paddingBottom: "8px", marginBottom: "20px" }}>
            DEFINITIONS AND INTERPRETATIONS
          </h2>

          <div style={{ display: "grid", gap: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>1. Short Title and Applicability</h3>
              <p style={{ margin: "0 0 8px" }}><strong>1.1 Short Title:</strong> Known as the &ldquo;JustNivaran Online Dispute Resolution Rules&rdquo; (&ldquo;JustNivaran Rules&rdquo; or &ldquo;Rules&rdquo;).</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.2 Agreement to Apply the Rules:</strong> Acceptance arises from dispute clauses, separate agreements, invitations, court referrals, or statutory submissions.</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.3 Nature and Scope of Proceedings:</strong> Covers arbitration, mediation, conciliation, negotiation, pre-litigation resolution, and hybrid online/offline proceedings.</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.4 Institutional Framework:</strong> Incorporates fee schedules, codes of conduct, data policies, and practice directions.</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.5 Commencement:</strong> Takes effect from <strong>28.07.2026</strong>.</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.6 Relationship with Law:</strong> Arbitration Act, 1996 and Mediation Act, 2023 mandatory provisions prevail over inconsistencies.</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.7 Legal Bars and Maintainability:</strong> Administrative scrutiny does not prejudice Tribunal determinations on merits or jurisdiction.</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.8 Neutrality:</strong> JustNivaran acts strictly as an independent administrative/tech platform.</p>
              <p style={{ margin: "0 0 8px" }}><strong>1.9 Electronic Administration:</strong> Encompasses e-filing, digital evidence, virtual hearings, and e-signatures.</p>
              <p style={{ margin: 0 }}><strong>1.10 Data and Information:</strong> Governed by DPDP Act, 2023 and platform data protection policies.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>2. Definitions (Rule 2.1 – 2.34)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
                {[
                  { term: "2.1 Applicant / Initiating Party", def: "Person/entity submitting a claim or request to commence proceedings." },
                  { term: "2.2 Arbitration", def: "Domestic and international commercial arbitration under applicable arbitration law." },
                  { term: "2.3 Arbitral Tribunal", def: "Sole arbitrator or panel of arbitrators duly appointed under these Rules." },
                  { term: "2.4 Arbitration Agreement", def: "Agreement submitting present/future disputes to arbitration meeting legal standards." },
                  { term: "2.5 Award", def: "Decision rendered by Tribunal (interim, partial, consent, final, or additional)." },
                  { term: "2.6 Case Administrator", def: "Designated person providing administrative, procedural, and technological support." },
                  { term: "2.7 Claim", def: "Demand, cause of action, relief, or assertion of rights submitted by a party." },
                  { term: "2.8 Claimant", def: "Party commencing or pursuing a claim in an arbitration." },
                  { term: "2.9 Communication", def: "Notices, pleadings, evidence, orders, awards, and messages transmitted." },
                  { term: "2.10 Conciliation", def: "Conciliation process under applicable statutory law." },
                  { term: "2.11 Court", def: "Court or judicial authority having territorial/subject jurisdiction." },
                  { term: "2.12 Digital Record", def: "Information created, received, stored, or processed electronically on the Platform." },
                  { term: "2.13 Document-Only Arbitration", def: "Arbitration determined principally on written submissions without oral hearing." },
                  { term: "2.14 Emergency Arbitrator", def: "Arbitrator appointed for urgent interim relief before Tribunal constitution." },
                  { term: "2.15 Invitation to Participate", def: "Formal electronic notice inviting a respondent to participate in ODR proceedings." },
                  { term: "2.16 Letter of Request", def: "Request submitted seeking dispute administration under these Rules." },
                  { term: "2.17 Mediation", def: "Structured mediation under the Mediation Act, 2023 and applicable rules." },
                  { term: "2.18 Mediator", def: "Individual empanelled/appointed to facilitate consensual mediation." },
                  { term: "2.19 Neutral", def: "Arbitrator, mediator, conciliator, or independent dispute resolution professional." },
                  { term: "2.20 ODR Platform", def: "JustNivaran's secure internet-based technological infrastructure and case management system." },
                  { term: "2.21 Party / Parties", def: "Claimant, Respondent, Applicant, or recognised participant in proceedings." },
                  { term: "2.22 Panel", def: "Roster of qualified arbitrators, mediators, and conciliators maintained by JustNivaran." },
                  { term: "2.23 Pre-Proceeding Communication", def: "Administrative/introductory verification message explaining ODR procedures." },
                  { term: "2.24 Pre-Arbitration Notice", def: "Statutory notice invoking arbitration under Section 21 of the Act." },
                  { term: "2.25 Registrar", def: "Officer performing registry and administrative functions under these Rules." },
                  { term: "2.26 Respondent", def: "Party against whom a claim, application, or relief is sought." },
                  { term: "2.27 JustNivaran", def: "JustNivaran Private Limited (CIN: U62020DC2026PTC473641)." },
                  { term: "2.28 JustNivaran Clause", def: "Contractual clause or written submission agreeing to resolve disputes via JustNivaran." },
                  { term: "2.29 JustNivaran Rules", def: "These Online Dispute Resolution Rules, protocols, and fee schedules." },
                  { term: "2.30 Proceeding", def: "Any arbitration, mediation, conciliation, or negotiation administered under the Rules." },
                  { term: "2.31 Registrar’s Office", def: "Registry department receiving filings, processing dockets, and maintaining records." },
                  { term: "2.32 Respondent’s Response", def: "Statement of defence, counterclaim, set-off, or preliminary response." },
                  { term: "2.33 Settlement", def: "Consensual agreement resolving all or part of the disputed issues." },
                  { term: "2.34 Technology", def: "Software, algorithms, AES-256 encrypted vaults, AI tools, and virtual hearing rooms." }
                ].map((d, i) => (
                  <div key={i} style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "4px" }}>
                    <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: "13.5px", marginBottom: "4px" }}>{d.term}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--slate)", lineHeight: "1.5" }}>{d.def}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>3. Rules of Interpretation (3.1 – 3.17)</h3>
              <p>
                Includes rules on statutory updates (3.1), singular/plural (3.2), gender neutrality (3.3), legal persons (3.4), non-limiting inclusions (3.5), incorporation of schedules (3.6), written electronic equivalence (3.8), e-Sign validity (3.9), calendar day calculations (3.10), Indian Standard Time (IST) default (3.11), international commercial arbitration scope (3.14), supremacy of mandatory law (3.15), severability (3.16), and purpose-driven interpretation (3.17).
              </p>
            </div>
          </div>
        </section>

        {/* PART I: GENERAL PROVISIONS (RULES 1–4) */}
        <section id="general-provisions" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            PART I: GENERAL PROVISIONS (RULES 1 – 4)
          </h2>
          
          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 1: Scope and Application</h3>
              <p style={{ margin: "0 0 6px" }}><strong>1.1</strong> Applies to all arbitrations where parties agree to arbitrate under JustNivaran Arbitration Rules 2026.</p>
              <p style={{ margin: "0 0 6px" }}><strong>1.2</strong> Agreement may be contained in an underlying contract, reference clause, or separate submission.</p>
              <p style={{ margin: "0 0 6px" }}><strong>1.3</strong> Submission to administrative framework is subject to the Arbitration and Conciliation Act, 1996.</p>
              <p style={{ margin: "0 0 6px" }}><strong>1.4</strong> In case of conflict, mandatory provisions of law prevail.</p>
              <p style={{ margin: "0 0 6px" }}><strong>1.5</strong> Applies to domestic and international commercial arbitrations.</p>
              <p style={{ margin: 0 }}><strong>1.6</strong> Party autonomy to vary procedures is preserved, provided it conforms with mandatory law.</p>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 2: Role of JustNivaran</h3>
              <p style={{ margin: "0 0 6px" }}><strong>2.1</strong> Acts as administering ODR institution.</p>
              <p style={{ margin: "0 0 6px" }}><strong>2.2</strong> Administrative functions include registration, communications, docket maintenance, scheduling, and fee management.</p>
              <p style={{ margin: "0 0 6px" }}><strong>2.3</strong> Does not determine substantive or jurisdictional disputes.</p>
              <p style={{ margin: 0 }}><strong>2.4</strong> All adjudicatory authority rests exclusively with the appointed Arbitral Tribunal.</p>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 3: Tribunal's Procedural Authority</h3>
              <p style={{ margin: "0 0 6px" }}><strong>3.1</strong> Tribunal conducts proceedings in the manner it considers appropriate under the Act.</p>
              <p style={{ margin: "0 0 6px" }}><strong>3.2</strong> Guarantees reasonable opportunity and equal treatment to all parties.</p>
              <p style={{ margin: "0 0 6px" }}><strong>3.3</strong> Tribunal fills procedural gaps having regard to the dispute circumstances.</p>
              <p style={{ margin: 0 }}><strong>3.4</strong> Exercises procedural discretion guided by proportionality, fairness, and avoidance of delay.</p>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 4: Electronic Administration</h3>
              <p style={{ margin: "0 0 6px" }}><strong>4.1</strong> Administered electronically through the JustNivaran Platform.</p>
              <p style={{ margin: "0 0 6px" }}><strong>4.2</strong> All pleadings, evidence, orders, and awards submitted and exchanged digitally.</p>
              <p style={{ margin: "0 0 6px" }}><strong>4.3</strong> Validity of proceedings is unaffected by electronic record format.</p>
              <p style={{ margin: 0 }}><strong>4.4</strong> Tribunal may direct physical inspection or original document production where necessary.</p>
            </div>
          </div>
        </section>

        {/* COMMUNICATIONS AND TIME (RULES 5–7) */}
        <section id="communications-time" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            COMMUNICATIONS AND TIME (RULES 5 – 7)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 5: Communications</h3>
              <p style={{ margin: 0 }}>Transmitted via Platform, email, courier, or registered post. Representatives served with copies to parties. Parties must promptly notify contact detail changes.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 6: Receipt of Communications</h3>
              <p style={{ margin: 0 }}>Electronic communication deemed received upon reaching recipient's electronic account or upon Platform upload availability. Tribunal determines service date where disputed.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 7: Calculation of Time</h3>
              <p style={{ margin: 0 }}>Commences day following receipt. Last day included. Tribunal holds discretion to extend or shorten procedural timelines in the interest of justice.</p>
            </div>
          </div>
        </section>

        {/* COMMENCEMENT OF ARBITRATION (RULES 8–11) */}
        <section id="commencement" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            COMMENCEMENT OF ARBITRATION (RULES 8 – 11)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 8: Request for Arbitration</h3>
              <p style={{ margin: "0 0 8px" }}>Claimant submits Request containing:</p>
              <ul style={{ margin: "0 0 8px 24px" }}>
                <li>Party particulars and authorised representatives;</li>
                <li>Arbitration agreement and underlying contract copy;</li>
                <li>Dispute description, material facts, and relief sought;</li>
                <li>Ascertainable claim amount, proposed number of arbitrators, seat, and language.</li>
              </ul>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 9: Pre-Arbitration Notice</h3>
              <p style={{ margin: 0 }}>Notice invoking arbitration under Section 21 of the 1996 Act. Legal sufficiency determined by the Tribunal.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 10: Registration &amp; Notification</h3>
              <p style={{ margin: 0 }}>Administrative registration upon fee payment. Transmitted to Respondent. Registration is administrative and does not validate jurisdiction.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 11: Response to Request</h3>
              <p style={{ margin: 0 }}>Respondent submits response within 14 days covering claim confirmation/denial, jurisdictional objections, counterclaims, and neutral appointment proposals. Non-response does not halt proceedings or imply admission.</p>
            </div>
          </div>
        </section>

        {/* CONSTITUTION OF THE TRIBUNAL (RULES 12–17) */}
        <section id="tribunal" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            CONSTITUTION OF THE ARBITRAL TRIBUNAL (RULES 12 – 17)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 12: Number of Arbitrators</h3>
              <p style={{ margin: 0 }}>Sole arbitrator or three arbitrators under the 1996 Act. Even numbers structured in accordance with law.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 13: Appointment of Sole Arbitrator</h3>
              <p style={{ margin: 0 }}>Joint nomination from JustNivaran Roster. Failing agreement, appointment follows Section 11 of the 1996 Act ensuring strict independence and impartiality.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 14: Three-Member Tribunal</h3>
              <p style={{ margin: 0 }}>Each party nominates one arbitrator; co-arbitrators nominate Presiding Arbitrator. Default appointments handled under Section 11.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 15: Disclosure and Independence</h3>
              <p style={{ margin: 0 }}>Mandatory disclosures under Section 12 (Sixth &amp; Seventh Schedules) of the Act. Continuing obligation to disclose any emerging conflict of interest.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 16 &amp; 17: Challenge &amp; Replacement</h3>
              <p style={{ margin: 0 }}>Challenges submitted under Section 13 in writing. Mandate termination and substitute appointment governed by statutory procedure under Section 15.</p>
            </div>
          </div>
        </section>

        {/* CONDUCT OF PROCEEDINGS (RULES 18–23) */}
        <section id="conduct" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            CONDUCT OF PROCEEDINGS (RULES 18 – 23)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 18: Equal Treatment &amp; Natural Justice</h3>
              <p style={{ margin: 0 }}>Absolute equality of treatment and reasonable opportunity to present case under Section 18 of the Act.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 19: Determination of Procedure</h3>
              <p style={{ margin: 0 }}>Tribunal issues procedural orders for pleadings, document admission/denial, witness affidavits, expert evidence, and expedited tracks.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 20: Document-Based Arbitration</h3>
              <p style={{ margin: 0 }}>Ordinarily conducted on written pleadings and digital documents unless an oral hearing is requested or deemed necessary by the Tribunal.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 21–23: Pleadings, Evidence &amp; Experts</h3>
              <p style={{ margin: 0 }}>Statement of Claim and Defence, counterclaims, document production orders, admissibility under Section 19, and independent Tribunal-appointed experts.</p>
            </div>
          </div>
        </section>

        {/* HEARINGS (RULES 24–25) */}
        <section id="hearings" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            HEARINGS AND DEFAULT (RULES 24 – 25)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 24: Virtual Hearings</h3>
              <p style={{ margin: 0 }}>Conducted via encrypted video conferencing on JustNivaran Platform. Notice provided in advance. Technical difficulties accommodated fairly.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 25: Failure to Participate</h3>
              <p style={{ margin: 0 }}>Tribunal may proceed ex-parte under Section 25 where a party defaults after due notice. Default is not treated as an admission of claim.</p>
            </div>
          </div>
        </section>

        {/* JURISDICTION & INTERIM MEASURES (RULES 26–28) */}
        <section id="jurisdiction-interim" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            JURISDICTION AND INTERIM MEASURES (RULES 26 – 28)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 26: Jurisdiction (Kompetenz-Kompetenz)</h3>
              <p style={{ margin: 0 }}>Tribunal rules on its own jurisdiction, including arbitration agreement validity and clause severability under Section 16.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 27: Interim Measures by Tribunal</h3>
              <p style={{ margin: 0 }}>Tribunal grants protective interim orders under Section 17 (preservation of property, securing claim amounts, interim injunctions, receiver appointment).</p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, rgba(209, 154, 52, 0.08) 0%, rgba(18, 41, 74, 0.04) 100%)",
              border: "1.5px solid rgba(209, 154, 52, 0.45)",
              borderRadius: "6px",
              padding: "20px"
            }}>
              <h3 style={{ fontSize: "17px", color: "var(--ink)", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🚨</span>
                <span>Rule 28: Emergency and Urgent Relief (Emergency Arbitrator)</span>
              </h3>
              <p style={{ margin: "0 0 8px" }}>
                <strong>28.1–28.3 Appointment in 2 Business Days:</strong> Urgent pre-constitution interim relief application. Emergency Arbitrator appointed within two (2) business days upon fee deposit.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>28.4–28.6 14-Day Timeline:</strong> Emergency proceedings concluded within fourteen (14) calendar days. Written reasoned order issued.
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>28.7–28.8 Tribunal Authority:</strong> Emergency Arbitrator does not sit on the final Tribunal. Upon constitution, Arbitral Tribunal may confirm, vary, or vacate the emergency order.
              </p>
              <p style={{ margin: 0 }}>
                <strong>28.9 Court Recourse:</strong> Preserves statutory rights to seek Section 9 interim relief from competent courts.
              </p>
            </div>
          </div>
        </section>

        {/* SEAT, VENUE AND LANGUAGE (RULES 29–31) */}
        <section id="seat-venue" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            SEAT, VENUE AND LANGUAGE (RULES 29 – 31)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 29: Juridical Seat of Arbitration</h3>
              <p style={{ margin: 0 }}>Determined by party agreement or by Tribunal under Section 20. Conducting virtual hearings does not alter the juridical seat.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 30 &amp; 31: Venue and Language</h3>
              <p style={{ margin: 0 }}>Virtual or physical venue. Language determined by agreement or Tribunal with translation requirements where needed.</p>
            </div>
          </div>
        </section>

        {/* AWARD (RULES 32–35) */}
        <section id="award" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            THE AWARD, SETTLEMENT AND COSTS (RULES 32 – 35)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 32 &amp; 33: Closure &amp; Contents of Award</h3>
              <p style={{ margin: 0 }}>Proceedings declared closed upon record completion. Award complies with Section 31 (in writing, reasoned, signed by Tribunal, digitally authenticated on Platform).</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 34: Settlement (Award on Agreed Terms)</h3>
              <p style={{ margin: 0 }}>Parties may settle at any stage. Tribunal may record consent award under Section 30 with identical legal decree enforceability.</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 35: Statutory Interest &amp; Costs</h3>
              <p style={{ margin: 0 }}>Pre-award and post-award interest awarded under Section 31(7). Costs determined under Section 31A regime following the event.</p>
            </div>
          </div>
        </section>

        {/* CORRECTION, RECOURSE & TERMINATION (RULES 36–38) */}
        <section id="correction" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            CORRECTION, RECOURSE &amp; TERMINATION (RULES 36 – 38)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rule 36: Correction &amp; Clarification</h3>
              <p style={{ margin: 0 }}>Computation, clerical, or typographical errors corrected under Section 33 within 30 days. JustNivaran does not review award merits.</p>
            </div>
            <div id="recourse" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px", scrollMarginTop: "150px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 37 &amp; 38: Recourse Against Award &amp; Termination</h3>
              <p style={{ margin: 0 }}>Enforceable as court decree under Section 36. Statutory recourse lies exclusively before competent courts under Section 34. Termination governed by Section 32.</p>
            </div>
          </div>
        </section>

        {/* CONFIDENTIALITY, GOVERNING LAW & MISC (RULES 39–48) */}
        <section id="confidentiality" style={{ scrollMarginTop: "150px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "6px", marginBottom: "16px" }}>
            CONFIDENTIALITY, GOVERNING LAW &amp; ADMIN PROVISIONS (RULES 39 – 48)
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 39 &amp; 40: Confidentiality &amp; Preservation of Records</h3>
              <p style={{ margin: 0 }}>Strict confidentiality under Section 42A. Encrypted digital archive maintained in compliance with DPDP Act 2023 and BSA 2023.</p>
            </div>

            <div id="applicable-law" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px", scrollMarginTop: "150px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 41 &amp; 42: Governing Law &amp; Statutory Compliance</h3>
              <p style={{ margin: 0 }}>Governed by Arbitration and Conciliation Act, 1996 and Indian substantive law (or agreed choice of law in international arbitrations).</p>
            </div>

            <div id="admin-misc" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px", scrollMarginTop: "150px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 8px" }}>Rules 43–48: Administrative Support, Certified Copies &amp; Severability</h3>
              <p style={{ margin: "0 0 6px" }}>Case administrators assist with technical coordination without impinging on judicial independence.</p>
              <p style={{ margin: 0 }}>Certified electronic copies issued under Section 63 BSA 2023. Unenforceable provisions severed without invalidating remaining Rules.</p>
            </div>
          </div>
        </section>

        {/* Institutional Verification Footer */}
        <div style={{
          background: "rgba(18, 41, 74, 0.03)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          padding: "20px 24px",
          fontSize: "13px",
          color: "var(--slate)"
        }}>
          <strong>Institutional Promulgation:</strong> Promulgated by JustNivaran Private Limited (CIN: U62020DC2026PTC473641) &bull; Registered Seat: New Delhi, India &bull; Inquiries: <a href="mailto:registrar@justnivaran.in" style={{ color: "var(--gold-deep)" }}>registrar@justnivaran.in</a> &bull; Effective Date: 28 July 2026.
        </div>

        {/* Call to Actions */}
        <div style={{
          display: "flex",
          gap: "14px",
          justifyContent: "center",
          flexWrap: "wrap",
          paddingTop: "20px"
        }}>
          <button
            className="btn"
            onClick={onOpenFileModal}
            type="button"
            style={{ padding: "12px 28px", fontSize: "14.5px" }}
          >
            File for Arbitration →
          </button>
          <Link
            to="/legal-assessment"
            className="nav-btn-ai"
            style={{ padding: "12px 24px", fontSize: "14px", height: "auto" }}
          >
            <span className="ai-sparkle">✨</span>
            <span>Check Claim with AI Predictor</span>
          </Link>
        </div>

      </div>
    </main>
  );
}