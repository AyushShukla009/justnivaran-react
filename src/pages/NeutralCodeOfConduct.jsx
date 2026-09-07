import { Link } from "react-router-dom";

function NeutralCodeOfConduct({ onOpenEmpanelmentModal }) {
  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "1040px" }}>
      {/* Header Banner */}
      <div style={{ marginBottom: "36px" }}>
        <p className="eyebrow">
          <b>Institutional Charter</b> Core Values &bull; Ethical Standards &bull; Neutral Code of Conduct
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: "1.15", margin: "0 0 16px", color: "var(--ink)" }}>
          Core Values &amp; Code of Conduct
        </h1>
        
        <p className="lede" style={{ color: "#33455F", maxWidth: "860px", margin: "0 0 28px" }}>
          The foundational principles, institutional responsibilities, professional standards, and mandatory ethical codes governing JustNivaran, its case administrators, empanelled neutrals, and technology platform.
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
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Promulgated By</span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px", fontSize: "14.5px" }}>JustNivaran Private Limited</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Governing Scope</span>
            <div style={{ fontWeight: 600, color: "var(--gold-deep)", marginTop: "4px", fontSize: "14.5px" }}>Neutrals, Administrators &amp; Technology</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ethical Framework</span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px", fontSize: "14.5px" }}>5th &amp; 7th Schedules &bull; Mediation Act 2023</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Human Oversight</span>
            <div style={{ fontWeight: 600, color: "var(--gold)", marginTop: "4px", fontSize: "14.5px" }}>Mandatory Human Review of AI Tools</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "48px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.75" }}>
        
        {/* SECTION 1: CORE VALUES OF JUSTNIVARAN */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>🏛️</span>
            <h2 style={{ fontSize: "24px", color: "var(--ink)", margin: 0 }}>
              Core Values of JustNivaran
            </h2>
          </div>
          <p style={{ color: "var(--slate)", marginBottom: "28px" }}>
            The five fundamental pillars guiding the architectural design, dispute administration, and institutional ethos of JustNivaran:
          </p>

          <div style={{ display: "grid", gap: "24px" }}>
            {/* 1. Inclusivity */}
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--gold)",
              borderRadius: "0 6px 6px 0",
              padding: "24px 28px",
              boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>🌐</span>
                <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: 0, fontFamily: "var(--serif)" }}>
                  1. Inclusivity
                </h3>
              </div>
              <p style={{ margin: "0 0 12px" }}>
                Our platform, JustNivaran is built on the belief that access to dispute resolution should not depend upon a person's location, financial circumstances, education, technological familiarity, language, or physical ability. Moving dispute resolution online should not simply replace a physical courtroom or meeting room with a digital interface. It should remove the barriers that may prevent a person from participating effectively.
              </p>
              <p style={{ margin: "0 0 12px" }}>
                Our Platform is therefore intended to be simple to use, accessible across devices, and responsive to users with different levels of digital literacy. Wherever practicable, the Platform should support multiple languages and appropriate accessibility features for persons with disabilities. The objective is to ensure that technology does not become an additional barrier to participation. Inclusivity also requires that the process itself be easy to understand. Users should be able to determine how to initiate a dispute, what information and documents are required, what the applicable costs may be, what happens at each stage, and what options are available to them. Legal, procedural, and technical information should therefore be communicated in clear and understandable language.
              </p>
              <p style={{ margin: 0 }}>
                The Platform should permit parties to participate on their own while also allowing them to be assisted or represented by lawyers, authorised representatives, or other persons where appropriate. Where a participant encounters difficulty in accessing or using the technology, reasonable assistance should be available. For JustNivaran, true digital access means ensuring that technology opens the door to dispute resolution rather than creating a new barrier to it.
              </p>
            </div>

            {/* 2. Responsibility */}
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderLeft: "4px solid #1C3A63",
              borderRadius: "0 6px 6px 0",
              padding: "24px 28px",
              boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>⚖️</span>
                <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: 0, fontFamily: "var(--serif)" }}>
                  2. Responsibility
                </h3>
              </div>
              <p style={{ margin: "0 0 12px" }}>
                Dispute resolution can directly affect a person's financial interests, relationships, rights, and obligations. A platform entrusted with facilitating such processes must therefore operate with clearly defined responsibilities and appropriate institutional safeguards. JustNivaran seeks to maintain clarity regarding the respective roles of the institution, case administrators, mediators, conciliators, arbitrators, technical personnel, and other persons involved in the dispute resolution process. Users should know who is responsible for each aspect of the process and where they may raise a concern or grievance. The functioning of the Platform should remain consistent with the legal framework applicable in India, including the Arbitration and Conciliation Act, 1996, the Mediation Act, 2023, the Information Technology Act, 2000, and other applicable laws and regulations.
              </p>
              <p style={{ margin: "0 0 12px" }}>
                Responsibility must also extend to the technology through which the process is delivered. Appropriate records, defined procedures, review mechanisms, safeguards against conflicts of interest, measures for dealing with technical failures, and accessible grievance mechanisms should form part of the Platform's administration. Where technology, automated systems, or artificial intelligence are used, their role should remain subject to appropriate human oversight. Technology may support administration, communication, organisation, and other aspects of the process, but responsibility for the proper and fair conduct of the proceedings should remain attributable to identifiable persons and institutions.
              </p>
              <p style={{ margin: 0 }}>
                Responsibility, therefore, means that JustNivaran remains accountable not only for the technology it provides, but also for the manner in which that technology is used to facilitate dispute resolution.
              </p>
            </div>

            {/* 3. Professional Excellence */}
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--gold)",
              borderRadius: "0 6px 6px 0",
              padding: "24px 28px",
              boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>🏆</span>
                <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: 0, fontFamily: "var(--serif)" }}>
                  3. Professional Excellence
                </h3>
              </div>
              <p style={{ margin: "0 0 12px" }}>
                The effectiveness of an ODR process depends not only upon the technology used but also upon the people who conduct and administer the proceedings. JustNivaran therefore places importance on ensuring that mediators, arbitrators, conciliators, case managers, and other professionals associated with the Platform possess the knowledge, experience, and skills necessary for their respective roles. Competence in an online environment extends beyond knowledge of substantive law and procedural requirements. ODR professionals must also be capable of communicating effectively through digital channels, managing virtual proceedings, facilitating discussions, handling documents electronically, and responding appropriately to difficulties that may arise during online participation. The Platform must also recognise the different circumstances of its users. Participants may have varying levels of digital familiarity, limited connectivity, language difficulties, or other challenges associated with online participation. Those administering proceedings should be capable of identifying such difficulties and taking reasonable steps to ensure that they do not unfairly affect a party's participation.
              </p>
              <p style={{ margin: 0 }}>
                Professional development should therefore include continuing learning in dispute resolution, online communication, digital processes, cybersecurity, data protection, technology, and emerging tools including artificial intelligence. The same standard of reliability should apply to the technology supporting the process. The Platform should be designed to function consistently, securely and efficiently, with appropriate systems for document management, communication, virtual hearings, authentication, and handling technical interruptions. Professional excellence at JustNivaran therefore means bringing together capable professionals, sound procedures, dependable technology, and continuous improvement so that disputes can be handled effectively in an online environment.
              </p>
            </div>

            {/* 4. Trust and Protection */}
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderLeft: "4px solid #1C3A63",
              borderRadius: "0 6px 6px 0",
              padding: "24px 28px",
              boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>🔒</span>
                <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: 0, fontFamily: "var(--serif)" }}>
                  4. Trust and Protection
                </h3>
              </div>
              <p style={{ margin: "0 0 12px" }}>
                People are more likely to participate meaningfully in dispute resolution when they have confidence that their information, communications, and proceedings will be appropriately protected. This is particularly important in an ODR environment, where substantial amounts of sensitive information may be created, transmitted, and stored electronically. The JustNivaran Platform may handle personal information, financial records, contracts, identity documents, pleadings, evidence, settlement communications, and other confidential material. Appropriate safeguards should therefore operate throughout the lifecycle of a dispute. These safeguards may include secure communication channels, authentication mechanisms, access controls, encryption, appropriate storage arrangements, and measures designed to prevent unauthorised access, alteration, loss, or disclosure of information. Access to information should be limited to persons who are authorised or otherwise have a legitimate reason to receive it.
              </p>
              <p style={{ margin: "0 0 12px" }}>
                Users should also be able to understand how their information is handled. Information regarding what data is collected, why it is required, how it may be used, where it is stored, and applicable retention practices should be communicated in a clear and accessible manner. The Platform should maintain appropriate procedures for responding to security incidents, unauthorised access, accidental disclosure, data loss, or other technology-related risks.
              </p>
              <p style={{ margin: 0 }}>
                Trust, however, is broader than cybersecurity. It also arises from impartial processes, transparent procedures, responsible administration, and respect for the confidentiality of dispute resolution proceedings. For JustNivaran, protection means creating an environment in which participants can engage with the process with confidence that their information, communications, and participation are being handled responsibly.
              </p>
            </div>

            {/* 5. User Agency */}
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--gold)",
              borderRadius: "0 6px 6px 0",
              padding: "24px 28px",
              boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>🧭</span>
                <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: 0, fontFamily: "var(--serif)" }}>
                  5. User Agency
                </h3>
              </div>
              <p style={{ margin: "0 0 12px" }}>
                JustNivaran is intended to enable parties to participate meaningfully in resolving their disputes. Technology should increase a user's ability to understand and engage with the process rather than make the user dependent upon the platform. ODR can reduce many of the difficulties associated with conventional dispute resolution, including travel, paperwork, geographical limitations, repeated physical appearances, and unnecessary delays. Participants should be able to access their case information, communicate with the relevant persons, submit documents, and participate in proceedings remotely, subject to the nature and requirements of the dispute.
              </p>
              <p style={{ margin: "0 0 12px" }}>
                User agency goes beyond convenience. Participants should understand the process, their available options, and the consequences of decisions they are required to make. They should have a meaningful opportunity to present their position, respond to the other side, communicate with the neutral, and participate in decisions concerning settlement or other resolution. This is particularly important in mediation, conciliation, and negotiation, where the parties themselves have an important role in shaping the outcome. The Platform should facilitate communication and informed decision-making without directing or pressuring a party towards a particular outcome.
              </p>
              <p style={{ margin: 0 }}>
                JustNivaran should also recognise that users may differ significantly in their legal and technological understanding. Guided processes, clear explanations, assistance features, and the ability to obtain professional representation can help ensure that differences in knowledge do not become differences in effective participation. User agency ultimately means that technology should strengthen the participant's ability to engage with dispute resolution. The system should assist people in navigating the process while preserving their ability to make informed choices about their dispute.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: MANDATORY NEUTRAL CODE OF CONDUCT */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>👨‍⚖️</span>
            <h2 style={{ fontSize: "24px", color: "var(--ink)", margin: 0 }}>
              Neutral Code of Conduct &amp; Disclosure Policy
            </h2>
          </div>
          <p style={{ color: "var(--slate)", marginBottom: "24px" }}>
            Mandatory statutory guidelines governing all empanelled Arbitrators, Mediators, and Conciliators administering proceedings under JustNivaran Rules:
          </p>

          <div style={{ display: "grid", gap: "18px" }}>
            <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ fontSize: "16.5px", color: "var(--ink)", margin: "0 0 8px" }}>
                1. Absolute Independence, Impartiality &amp; No Ex-Parte Contact
              </h3>
              <p style={{ margin: 0 }}>
                Every empanelled neutral must maintain strict independence and impartiality throughout the proceedings. A neutral must not communicate ex-parte with any party regarding the substantive merits of an arbitration without prior disclosure to all parties.
              </p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ fontSize: "16.5px", color: "var(--ink)", margin: "0 0 8px" }}>
                2. Mandatory Section 12 Disclosure (Fifth &amp; Seventh Schedules)
              </h3>
              <p style={{ margin: 0 }}>
                Prior to accepting any appointment, an Arbitrator must submit a formal declaration in writing disclosing any circumstances falling within the <strong>Fifth and Seventh Schedules</strong> of the Arbitration and Conciliation Act, 1996 and <strong>IBA Guidelines on Conflicts of Interest</strong> that may give rise to justifiable doubts as to independence, impartiality, or availability.
              </p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ fontSize: "16.5px", color: "var(--ink)", margin: "0 0 8px" }}>
                3. Challenge &amp; Recusal Mechanism (Section 13)
              </h3>
              <p style={{ margin: 0 }}>
                Any party may challenge the appointment of an Arbitrator within 15 days of becoming aware of circumstances justifying doubts under Section 13. The Registrar shall review the challenge and refer the matter for reconstitution if justifiable statutory grounds exist.
              </p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ fontSize: "16.5px", color: "var(--ink)", margin: "0 0 8px" }}>
                4. Confidentiality of Mediation Caucuses (Section 22 Mediation Act 2023)
              </h3>
              <p style={{ margin: 0 }}>
                In mediation and conciliation, all private caucus disclosures made by a party to the mediator remain strictly confidential and cannot be revealed to the opposing party without express written consent.
              </p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
              <h3 style={{ fontSize: "16.5px", color: "var(--ink)", margin: "0 0 8px" }}>
                5. Diligence, Punctuality &amp; Technological Competence
              </h3>
              <p style={{ margin: 0 }}>
                Empanelled neutrals must conduct virtual proceedings punctually, manage digital hearing rooms with decorum, issue reasoned procedural orders without undue delay, and observe institutional cybersecurity protocols.
              </p>
            </div>
          </div>
        </section>

        {/* Institutional Promulgation Box */}
        <div style={{
          background: "rgba(18, 41, 74, 0.03)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          padding: "20px 24px",
          fontSize: "13px",
          color: "var(--slate)"
        }}>
          <strong>Institutional Governance:</strong> Published by JustNivaran Private Limited (CIN: U62020DC2026PTC473641) &bull; New Delhi, India &bull; Compliance Desk: <a href="mailto:compliance@justnivaran.in" style={{ color: "var(--gold-deep)" }}>compliance@justnivaran.in</a> &bull; Effective Date: 28 July 2026.
        </div>

        {/* Call to Actions */}
        <div style={{
          display: "flex",
          gap: "14px",
          justifyContent: "center",
          flexWrap: "wrap",
          paddingTop: "12px"
        }}>
          <button
            className="btn gold"
            onClick={onOpenEmpanelmentModal}
            type="button"
            style={{ padding: "12px 28px", fontSize: "14.5px" }}
          >
            Apply for Neutral Empanelment →
          </button>
          <Link
            to="/arbitration-rules"
            className="btn ghost"
            style={{ padding: "12px 24px", fontSize: "14px", border: "1px solid var(--line)", textDecoration: "none" }}
          >
            📜 View Arbitration Rules
          </Link>
          <Link
            to="/mediation-rules"
            className="btn ghost"
            style={{ padding: "12px 24px", fontSize: "14px", border: "1px solid var(--line)", textDecoration: "none" }}
          >
            ⚖️ View Mediation Rules
          </Link>
        </div>

      </div>
    </main>
  );
}

export default NeutralCodeOfConduct;

