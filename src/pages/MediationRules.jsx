import { useState } from "react";
import { Link } from "react-router-dom";

export default function MediationRules({ onOpenFileModal }) {
  const [activeSection, setActiveSection] = useState("all");

  const SECTIONS = [
    { id: "title-application", label: "Title & Application (R. 1–2)" },
    { id: "initiation", label: "Initiation (R. 3–5)" },
    { id: "appointment-role", label: "Mediator Appointment (R. 6–9)" },
    { id: "conduct-online", label: "Conduct of Online Mediation (R. 10–14)" },
    { id: "duration-settlement", label: "Duration & Settlement (R. 15–17)" },
    { id: "confidentiality-privilege", label: "Confidentiality & Privilege (R. 18–20)" },
    { id: "fees-admin", label: "Fees & Charges (R. 21–23)" },
    { id: "platform-admin", label: "Platform Administration (R. 24–26)" },
    { id: "fairness-safeguards", label: "Fairness & Special Safeguards (R. 27–29)" },
    { id: "court-interaction", label: "Court Proceedings & Urgent Relief (R. 30–31)" },
    { id: "post-mediation", label: "Enforcement & Post-Mediation (R. 32–34)" },
    { id: "general-provisions", label: "General & Miscellaneous (R. 35–42)" },
    { id: "schedule-1", label: "Schedule I: 9-Stage Flow" },
    { id: "schedule-2", label: "Schedule II: 10 Principles" },
    { id: "schedule-3", label: "Schedule III: Online Protocol" }
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
          <b>Statutory Procedure Framework</b> Mediation Act, 2023 &bull; Effective 28.07.2026
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: "1.15", margin: "0 0 14px", color: "var(--ink)" }}>
          JustNivaran Mediation (Mediation Procedure) Rules, 2026
        </h1>
        
        <p className="lede" style={{ color: "#33455F", maxWidth: "900px", margin: "0 0 28px" }}>
          Official statutory rules governing voluntary, pre-litigation, court-referred, and institutional online mediations administered through the JustNivaran Online Dispute Resolution (ODR) Platform.
        </p>

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
              Statutory Authority
            </span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
              Mediation Act, 2023
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>Read with Section 12A Commercial Courts Act</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Effective Date &amp; Status
            </span>
            <div style={{ fontWeight: 600, color: "var(--gold-deep)", marginTop: "4px" }}>
              28.07.2026
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>Institutional ODR Rules</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Statutory Timeline
            </span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
              120 Days (+60 Days Ext.)
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>Expeditious Digital Proceedings</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Legal Enforceability
            </span>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>
              Decree of Civil Court
            </div>
            <div style={{ fontSize: "12px", color: "var(--slate)" }}>Section 27 Mediation Act, 2023</div>
          </div>
        </div>
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

      {/* Main Rules Content */}
      <div style={{ display: "grid", gap: "48px", fontSize: "15px", color: "#3B4E68", lineHeight: "1.8" }}>
        
        {/* Section 1 */}
        <section id="title-application" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            1. Short Title and Application
          </h2>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>1.1</strong> These Rules shall be known as the <strong>JustNivaran Mediation (Mediation Procedure) Rules, 2026</strong> (&ldquo;Rules&rdquo;).</p>
            <p><strong>1.2</strong> These Rules govern mediation proceedings administered through the JustNivaran online dispute resolution platform (&ldquo;Platform&rdquo;).</p>
            <p><strong>1.3</strong> The Rules shall apply where:</p>
            <ul style={{ paddingLeft: "24px" }}>
              <li><strong>(a)</strong> the parties have agreed to resolve their dispute through mediation administered by the Platform;</li>
              <li><strong>(b)</strong> a court, tribunal, authority or other competent body has referred the dispute for mediation; or</li>
              <li><strong>(c)</strong> the parties voluntarily elect to use the Platform for mediation in accordance with applicable law.</li>
            </ul>
            <p><strong>1.4</strong> These Rules shall be read subject to the <strong>Mediation Act, 2023</strong>, the rules and regulations made thereunder, and any other applicable law. Where any provision of these Rules is inconsistent with a mandatory requirement of law, the statutory requirement shall prevail.</p>
            <p><strong>1.5</strong> The parties may, by mutual agreement, modify the procedural arrangements contained in these Rules, provided that such modification does not defeat any mandatory statutory requirement or compromise the independence, neutrality, confidentiality or integrity of the mediation process.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            2. Nature and Purpose of Mediation
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>2.1</strong> Mediation under these Rules is a voluntary, confidential and facilitated process in which an independent and impartial mediator assists the parties in identifying issues, communicating their interests and exploring mutually acceptable solutions.</p>
            <p><strong>2.2</strong> The mediator shall not adjudicate the dispute, impose a decision upon the parties or act as an advocate for any party.</p>
            <p><strong>2.3</strong> The purpose of mediation is to enable the parties to arrive at a mutually acceptable resolution in a manner that is efficient, accessible and proportionate to the nature of the dispute.</p>
            <p><strong>2.4</strong> Participation in mediation shall not, by itself, amount to an admission of liability, acceptance of a claim or waiver of any legal right, unless expressly agreed otherwise in writing.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="initiation" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Initiation of Mediation
          </h2>
          
          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>3. Request for Mediation</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>3.1</strong> A mediation may be initiated by: (a) a party to the dispute; (b) all parties jointly; (c) a court, tribunal or competent authority; or (d) any other person or institution having authority to refer the dispute for mediation.</p>
            <p><strong>3.2</strong> A party seeking to initiate mediation shall submit a Request through the Platform in the prescribed electronic form.</p>
            <p><strong>3.3</strong> The Request should, to the extent applicable, contain:</p>
            <ul style={{ paddingLeft: "24px" }}>
              <li><strong>(a)</strong> names and contact details of the parties;</li>
              <li><strong>(b)</strong> details of authorised representatives, advocates or other persons appearing for the parties;</li>
              <li><strong>(c)</strong> a brief description of the dispute;</li>
              <li><strong>(d)</strong> the nature of the relief or resolution sought;</li>
              <li><strong>(e)</strong> details of any existing mediation agreement or mediation clause;</li>
              <li><strong>(f)</strong> details of any pending court, tribunal or other proceedings relating to the dispute;</li>
              <li><strong>(g)</strong> the preferred language of mediation;</li>
              <li><strong>(h)</strong> any specific requirement concerning the mediator;</li>
              <li><strong>(i)</strong> relevant documents which the initiating party wishes to place before the mediator; and</li>
              <li><strong>(j)</strong> any other information reasonably required for commencing the mediation.</li>
            </ul>
            <p><strong>3.4</strong> The Platform may seek clarification or additional information where necessary for processing the Request.</p>
            <p><strong>3.5</strong> Upon registration of the Request, the Platform shall notify the other party or parties and invite them to participate in accordance with the applicable procedure.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            4. Mediation Where There Is No Prior Agreement
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>4.1</strong> A party may invite another party to participate in mediation even where there is no prior mediation agreement.</p>
            <p><strong>4.2</strong> The Platform may communicate such invitation to the other party and provide reasonable information concerning the mediation process.</p>
            <p><strong>4.3</strong> No mediation shall proceed against a party who has not consented to mediation, except where participation is required pursuant to an applicable law or valid order of a competent court or authority.</p>
            <p><strong>4.4</strong> Where the invited party accepts the proposal, the mediation shall commence in accordance with these Rules.</p>
            <p><strong>4.5</strong> Where the invitation is declined, or no consent is received within the period specified by the Platform, the proposed mediation shall not proceed unless otherwise required by law or by an order of a competent authority.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            5. Pre-Litigation and Court-Connected Mediation
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>5.1</strong> The Platform may administer pre-litigation mediation in accordance with the Mediation Act, 2023 and applicable rules.</p>
            <p><strong>5.2</strong> Where a dispute is referred by a court, tribunal or statutory authority, the mediation shall be conducted in accordance with the terms of the referral, subject to applicable law.</p>
            <p><strong>5.3</strong> Nothing in these Rules shall prevent a party from seeking urgent or interim relief from a competent court where such relief is permitted by law.</p>
            <p><strong>5.4</strong> The mediator shall not be responsible for deciding whether a party is entitled to approach a court or other authority for interim or protective relief.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="appointment-role" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Appointment and Role of the Mediator
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>6. Selection of Mediator</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>6.1</strong> The parties may mutually agree upon the appointment of a mediator from the panel maintained by the Platform.</p>
            <p><strong>6.2</strong> Where the parties do not agree upon a mediator, the Platform shall appoint a suitable mediator having regard to: (a) the nature and complexity of the dispute; (b) the subject matter and value of the dispute; (c) the mediator&rsquo;s qualifications and experience; (d) language and communication requirements; (e) availability; (f) any specific requirements arising from the dispute; and (g) the need to maintain actual and perceived independence and impartiality.</p>
            <p><strong>6.3</strong> The Platform may use an automated or administrative matching mechanism for suggesting mediators, provided that the final appointment remains consistent with applicable law and the principles of neutrality and independence.</p>
            <p><strong>6.4</strong> The parties may jointly request the appointment of more than one mediator where the nature of the dispute makes a co-mediation arrangement appropriate.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            7. Eligibility and Disclosure by Mediator
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>7.1</strong> Before accepting an appointment, the proposed mediator shall confirm availability and provide the disclosures required under applicable law.</p>
            <p><strong>7.2</strong> The mediator shall disclose any circumstance that may reasonably give rise to a conflict of interest, apprehension of bias or doubt concerning the mediator&rsquo;s independence or impartiality.</p>
            <p><strong>7.3</strong> The mediator shall make continuing disclosure throughout the mediation if any new circumstance arises that may affect the mediator&rsquo;s independence or impartiality.</p>
            <p><strong>7.4</strong> Upon receiving a disclosure, the parties shall be given a reasonable opportunity to raise an objection.</p>
            <p><strong>7.5</strong> Where circumstances warrant, the Platform may replace the mediator in accordance with these Rules and applicable law.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            8. Challenge or Replacement of Mediator
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>8.1</strong> A party may request replacement of the mediator where there are reasonable grounds relating to conflict of interest, bias, lack of independence, inability to act impartially or any other circumstance recognised under applicable law.</p>
            <p><strong>8.2</strong> The request shall state the grounds relied upon and shall be made without unnecessary delay after the relevant circumstance becomes known.</p>
            <p><strong>8.3</strong> The Platform shall consider the request in accordance with the Act and these Rules.</p>
            <p><strong>8.4</strong> The mediation may be kept in abeyance while the request is considered where continuation may prejudice the fairness or integrity of the process.</p>
            <p><strong>8.5</strong> Nothing in this provision shall be interpreted as permitting a party to seek replacement merely because the mediator has adopted a view, asked difficult questions or proposed a settlement option during the mediation.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            9. Functions and Limits of the Mediator
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>9.1</strong> The mediator shall: (a) remain neutral and impartial; (b) facilitate communication between the parties; (c) assist the parties in identifying disputed and undisputed issues; (d) encourage informed discussion and exploration of settlement options; (e) maintain confidentiality in accordance with law; (f) conduct the process fairly and efficiently; and (g) perform all statutory duties applicable to a mediator.</p>
            <p><strong>9.2</strong> The mediator shall not: (a) impose a settlement upon the parties; (b) determine the rights or liabilities of the parties; (c) act as legal counsel for any party; (d) compel a party to accept a proposal; or (e) use confidential information obtained during mediation for an unrelated purpose.</p>
            <p><strong>9.3</strong> The mediator may communicate separately with individual parties (caucus sessions) where appropriate.</p>
            <p><strong>9.4</strong> Information disclosed during a private session shall not be communicated to another party without the permission of the party that disclosed it, except where disclosure is required by law.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="conduct-online" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Conduct of Online Mediation
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>10. Commencement</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>10.1</strong> The mediation shall be treated as commenced in accordance with the applicable provisions of the Mediation Act, 2023 and, where applicable, from the date determined under the Platform&rsquo;s electronic registration process.</p>
            <p><strong>10.2</strong> The Platform shall issue an electronic commencement notice identifying: (a) the parties; (b) the mediator; (c) the reference number; (d) the mode of mediation; and (e) the next procedural step.</p>
            <p><strong>10.3</strong> The parties shall be provided reasonable access to the procedural information necessary for participating in the mediation.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            11. Preliminary Conference
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>11.1</strong> At the beginning of the mediation, the mediator shall explain the nature and process of mediation to the parties.</p>
            <p><strong>11.2</strong> The mediator and parties may determine: (a) the issues requiring discussion; (b) the sequence of discussions; (c) the documents required; (d) the persons who may participate; (e) the use of joint and private sessions; (f) the language of proceedings; (g) the method of communication; and (h) any other procedural matter necessary for effective mediation.</p>
            <p><strong>11.3</strong> The mediator may modify the procedure during the mediation where such modification is necessary for fairness or efficiency.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            12. Online Mediation
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>12.1</strong> Mediation administered through the Platform may be conducted entirely online.</p>
            <p><strong>12.2</strong> Online mediation may include: (a) video conferencing; (b) audio conferencing; (c) secure document exchange; (d) private virtual rooms; (e) electronic messaging; (f) electronic signing; and (g) any other secure digital facility made available by the Platform.</p>
            <p><strong>12.3</strong> The mediator shall take reasonable steps to ensure that all parties have a fair opportunity to participate.</p>
            <p><strong>12.4</strong> Each participant shall ensure that the device, internet connection and communication environment used for mediation are reasonably secure and suitable for confidential discussions.</p>
            <p><strong>12.5</strong> Recording of any mediation session, whether by audio, video, screen capture or otherwise, shall not be permitted unless expressly authorised in accordance with law and by the participants where required.</p>
            <p><strong>12.6</strong> The Platform may suspend or reschedule a session where technical difficulties materially affect a party&rsquo;s ability to participate.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            13. Representation and Participation
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>13.1</strong> Parties may participate personally or through duly authorised representatives, advocates or other persons permitted by applicable law.</p>
            <p><strong>13.2</strong> A representative attending mediation shall have sufficient authority to participate meaningfully in settlement discussions.</p>
            <p><strong>13.3</strong> The mediator may request confirmation of the authority of a representative where necessary.</p>
            <p><strong>13.4</strong> The mediator may permit a person having relevant knowledge or expertise to participate where such participation is likely to assist resolution of the dispute.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            14. Documents and Communication
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>14.1</strong> Parties may upload statements, documents and other material through the Platform.</p>
            <p><strong>14.2</strong> The mediator may request additional information where reasonably necessary to understand the dispute or facilitate settlement.</p>
            <p><strong>14.3</strong> The mediator shall not conduct an adjudicatory examination of evidence.</p>
            <p><strong>14.4</strong> A party shall not knowingly submit materially false information for the purpose of misleading the mediator or another party.</p>
            <p><strong>14.5</strong> The Platform may maintain an electronic record of procedural events, notices, submissions and communications as required for administration and audit purposes under Section 63 BSA 2023.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="duration-settlement" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Time, Settlement and Termination
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>15. Duration of Mediation</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>15.1</strong> The mediation shall be conducted within the period prescribed under the <strong>Mediation Act, 2023</strong> (ordinarily 120 calendar days from commencement).</p>
            <p><strong>15.2</strong> Where the applicable law permits extension of the prescribed period, the parties may extend the mediation for the period (up to an additional 60 days) and in the manner permitted by law.</p>
            <p><strong>15.3</strong> The mediator shall endeavour to conduct the process expeditiously and shall avoid unnecessary adjournments.</p>
            <p><strong>15.4</strong> Nothing in these Rules requires the parties to continue mediation where a party is entitled to withdraw or terminate the process under applicable law.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            16. Settlement
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>16.1</strong> A settlement may be reached in relation to all or part of the dispute.</p>
            <p><strong>16.2</strong> The terms of settlement shall be reduced to writing and authenticated or executed in the manner prescribed by applicable law.</p>
            <p><strong>16.3</strong> The mediator may assist the parties in accurately recording the terms agreed between them.</p>
            <p><strong>16.4</strong> The mediator shall not certify that a settlement is commercially advantageous, legally enforceable or fair to a particular party unless such certification is specifically required by law.</p>
            <p><strong>16.5</strong> A settlement agreement reached through mediation shall have the status, enforceability and legal effect of a court decree provided under the <strong>Mediation Act, 2023</strong>.</p>
            <p><strong>16.6</strong> Where the parties settle only some issues, the unresolved issues may, subject to applicable law and agreement of the parties, be dealt with separately.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            17. Termination of Mediation
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>17.1</strong> The mediation shall conclude upon the earliest occurrence of any event recognised under applicable law, including:</p>
            <ul style={{ paddingLeft: "24px" }}>
              <li><strong>(a)</strong> execution of a mediated settlement agreement covering the dispute;</li>
              <li><strong>(b)</strong> written declaration by the parties that the dispute has been resolved;</li>
              <li><strong>(c)</strong> written withdrawal from mediation by a party where such withdrawal is legally permissible;</li>
              <li><strong>(d)</strong> determination by the mediator that further mediation is unlikely to result in settlement;</li>
              <li><strong>(e)</strong> expiry of the applicable statutory period, including any permissible extension; or</li>
              <li><strong>(f)</strong> any other circumstance requiring termination under law.</li>
            </ul>
            <p><strong>17.2</strong> The mediator shall notify the Platform of the conclusion or termination of mediation.</p>
            <p><strong>17.3</strong> Unless required by law, the mediator shall not disclose the reasons for a party&rsquo;s decision to discontinue mediation.</p>
            <p><strong>17.4</strong> Termination of mediation shall not prevent the parties from pursuing remedies otherwise available to them in law.</p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="confidentiality-privilege" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Confidentiality and Privilege
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>18. Confidential Character of Mediation</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>18.1</strong> Mediation proceedings shall be confidential to the extent provided by the <strong>Mediation Act, 2023</strong> (Section 22) and other applicable law.</p>
            <p><strong>18.2</strong> The obligation of confidentiality shall extend to: (a) the parties; (b) the mediator; (c) representatives and advisers; (d) persons assisting the mediator; (e) the Platform and its personnel; and (f) any other participant in the mediation.</p>
            <p><strong>18.3</strong> Information shared solely for the purpose of mediation shall not be used outside the mediation process except where permitted or required by law.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            19. Protection of Mediation Communications
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>19.1</strong> Statements, proposals, admissions, offers, concessions and other communications made solely in the course of mediation shall receive statutory privilege under applicable law.</p>
            <p><strong>19.2</strong> A party shall not seek to rely upon protected mediation communications as evidence in subsequent arbitral or judicial proceedings except to the extent expressly permitted by law.</p>
            <p><strong>19.3</strong> Information independently available to a party shall not become privileged merely because it was also referred to during mediation.</p>
            <p><strong>19.4</strong> The confidentiality obligations under these Rules shall survive termination of the mediation to the extent required by law.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            20. Exceptions to Confidentiality
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>20.1</strong> Confidentiality shall not prevent disclosure where disclosure: (a) is required by law or order of a competent court or authority; (b) is necessary for registration, enforcement or implementation of settlement to the extent permitted by law; (c) is necessary to prevent or establish a serious threat to public safety or life where disclosure is legally permissible; or (d) falls within any other statutory exception.</p>
            <p><strong>20.2</strong> Nothing in these Rules shall restrict a person from making a disclosure expressly permitted by the Mediation Act, 2023.</p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="fees-admin" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Fees and Administration
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>21. Platform Charges</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>21.1</strong> The Platform may prescribe fees for administering mediation proceedings.</p>
            <p><strong>21.2</strong> The applicable <Link to="/fee-schedule" style={{ color: "var(--gold-deep)" }}>fee schedule</Link> shall be communicated to the parties before payment becomes due.</p>
            <p><strong>21.3</strong> Fees may take into account: (a) the nature and complexity of the dispute; (b) the number of parties; (c) the amount involved; (d) the number of mediation sessions; (e) the appointment of one or more mediators; and (f) technological or administrative services required.</p>
            <p><strong>21.4</strong> Unless otherwise agreed or directed, administrative charges and mediator fees shall ordinarily be shared equally by the parties.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            22. Mediator&rsquo;s Fees
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>22.1</strong> Mediator fees shall be determined in accordance with the fee schedule communicated at the time of appointment.</p>
            <p><strong>22.2</strong> The fee may be calculated on the basis of: (a) fixed fee; (b) session-based charges; (c) time reasonably spent; or (d) another structure disclosed to and accepted by the parties.</p>
            <p><strong>22.3</strong> No undisclosed fee shall be payable by a party.</p>
            <p><strong>22.4</strong> Any dispute concerning fees shall not affect the mediator&rsquo;s obligation to remain independent and impartial.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            23. Non-Payment of Fees
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>23.1</strong> Where a party fails to pay an amount properly due, the Platform may provide a reasonable opportunity to cure the default.</p>
            <p><strong>23.2</strong> Subject to applicable law, the Platform may suspend administrative services where payment remains outstanding.</p>
            <p><strong>23.3</strong> No party shall be denied a statutory right or remedy solely because of a dispute concerning Platform charges.</p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="platform-admin" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Platform Administration
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>24. Responsibilities of JustNivaran</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>24.1</strong> The Platform shall provide reasonable administrative support for mediation proceedings conducted through it.</p>
            <p><strong>24.2</strong> Its functions may include: (a) receiving and registering Requests; (b) communicating with parties and mediators; (c) facilitating mediator appointment; (d) scheduling sessions; (e) providing secure digital communication facilities; (f) maintaining procedural records facilitating electronic execution of documents; and (g) providing other administrative assistance necessary for the mediation.</p>
            <p><strong>24.3</strong> The Platform shall not determine the merits of a dispute or influence the parties&rsquo; substantive settlement decisions.</p>
            <p><strong>24.4</strong> The Platform may adopt reasonable technical, security and identity-verification measures for maintaining the integrity of online proceedings.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            25. Identity and Authority
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>25.1</strong> The Platform may require parties and participants to complete reasonable identity verification (including Aadhaar e-KYC / PAN verification where mandated).</p>
            <p><strong>25.2</strong> A party shall ensure that persons accessing the mediation on its behalf are properly authorised.</p>
            <p><strong>25.3</strong> Where the identity or authority of a participant is reasonably disputed, the mediator or Platform may require appropriate verification before permitting further participation.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            26. Electronic Records
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>26.1</strong> Notices, communications and documents may be exchanged electronically through the Platform.</p>
            <p><strong>26.2</strong> Electronic records generated or maintained by the Platform may be used for establishing procedural events, including submission, receipt, scheduling and completion, subject to applicable law under Section 63 of the Bharatiya Sakshya Adhiniyam (BSA), 2023.</p>
            <p><strong>26.3</strong> The Platform may retain records for the period required by law or its applicable <Link to="/data-retention" style={{ color: "var(--gold-deep)" }}>record-retention policy</Link>.</p>
            <p><strong>26.4</strong> Retention of administrative records shall not amount to retention or disclosure of confidential mediation content beyond what is legally permissible.</p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="fairness-safeguards" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Fairness, Safeguards and Special Circumstances
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>27. Good Faith and Respectful Participation</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>27.1</strong> Parties shall participate in mediation in good faith and shall not intentionally misuse the process to harass, intimidate or delay another party.</p>
            <p><strong>27.2</strong> Participants shall maintain professional and respectful conduct during online and offline interactions.</p>
            <p><strong>27.3</strong> The mediator may regulate participation, speaking time, communication channels and private sessions to maintain a fair and productive process.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            28. Capacity and Safeguards
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>28.1</strong> Where a party is a minor, person of unsound mind, person with disability or otherwise requires legal or procedural assistance, participation shall be managed in accordance with applicable law.</p>
            <p><strong>28.2</strong> The mediator may take reasonable measures to ensure that all parties understand the nature and consequences of settlement discussions.</p>
            <p><strong>28.3</strong> The mediator may pause or terminate the process where continuing the mediation would be inconsistent with law, fairness or the safety of a participant.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            29. Domestic Violence, Coercion and Imbalance
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>29.1</strong> Where the mediator becomes aware of circumstances indicating coercion, intimidation, serious power imbalance or inability of a party to participate freely, the mediator shall take appropriate measures permitted by law.</p>
            <p><strong>29.2</strong> Such measures may include separate sessions, additional safeguards, allowing representation, postponement or termination of mediation.</p>
            <p><strong>29.3</strong> No party shall be compelled to accept a settlement.</p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="court-interaction" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Interaction with Other Proceedings
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>30. Relationship with Court or Tribunal Proceedings</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>30.1</strong> Commencement of mediation shall not, by itself, extinguish a party&rsquo;s rights before a court, tribunal or other competent authority except to the extent provided by applicable law.</p>
            <p><strong>30.2</strong> Parties shall comply with any statutory consequences arising from commencement or continuation of mediation.</p>
            <p><strong>30.3</strong> Where a mediated settlement resolves a pending proceeding, the parties shall take such steps as may be required by law to place the settlement before the relevant court, tribunal or authority.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            31. Urgent Relief
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>31.1</strong> A party may seek interim, urgent or protective relief from a competent court or authority where such relief is available under law.</p>
            <p><strong>31.2</strong> The decision to seek such relief shall not by itself amount to termination of mediation unless the applicable law or the mediator determines otherwise.</p>
            <p><strong>31.3</strong> The mediator shall not advise a party on whether a particular judicial remedy should be pursued.</p>
          </div>
        </section>

        {/* Section 11 */}
        <section id="post-mediation" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Post-Mediation Matters
          </h2>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px" }}>32. Enforcement of Settlement</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>32.1</strong> A mediated settlement agreement shall be enforceable in accordance with Section 27 of the <strong>Mediation Act, 2023</strong> and other applicable law, possessing the same legal effect as a decree passed by a civil court.</p>
            <p><strong>32.2</strong> The Platform may provide the parties with an electronic or authenticated copy of the settlement agreement.</p>
            <p><strong>32.3</strong> The Platform shall not be responsible for enforcing the substantive obligations undertaken by the parties.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            33. Challenge to Settlement
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>33.1</strong> Any challenge to a mediated settlement agreement shall be made only on grounds and in the manner permitted under Section 28 of the Mediation Act, 2023.</p>
            <p><strong>33.2</strong> The existence of a challenge shall not authorise the Platform or mediator to reconsider the merits of the dispute.</p>
          </div>

          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginTop: "24px", marginBottom: "12px" }}>
            34. Mediator&rsquo;s Subsequent Role
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <p><strong>34.1</strong> Unless otherwise permitted by law and agreed by the parties, the mediator shall not subsequently act as an adjudicator, arbitrator, expert, counsel or representative in proceedings concerning the same dispute.</p>
            <p><strong>34.2</strong> The mediator shall not be required to provide testimony concerning confidential aspects of the mediation except where disclosure is required or permitted by law.</p>
          </div>
        </section>

        {/* Section 12 */}
        <section id="general-provisions" style={{ scrollMarginTop: "140px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", borderBottom: "2px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
            Liability and General Provisions
          </h2>

          <div style={{ display: "grid", gap: "14px" }}>
            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>35. Independence of Platform and Mediator</h3>
              <p><strong>35.1</strong> The Platform acts as an administrative facilitator and does not determine the merits of any dispute. <strong>35.2</strong> The mediator acts independently and is not an agent or representative of the Platform or of any party. <strong>35.3</strong> No statement made by the Platform concerning procedure shall be construed as an opinion on the merits of the dispute.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>36. Limitation of Responsibility</h3>
              <p><strong>36.1</strong> To the extent permitted by applicable law, the Platform, its personnel and the mediator shall not be responsible for the substantive outcome of a mediation. <strong>36.2</strong> The Platform shall not guarantee that mediation will result in settlement. <strong>36.3</strong> Nothing in these Rules shall exclude or restrict liability which cannot lawfully be excluded or restricted.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>37. Force Majeure and Technical Failure</h3>
              <p><strong>37.1</strong> The Platform or mediator may reschedule a mediation session where circumstances beyond reasonable control materially interfere with the conduct of mediation. <strong>37.2</strong> Such circumstances may include significant technological failure, cyber incidents, natural disasters, governmental restrictions or other events affecting the ability to conduct the mediation securely. <strong>37.3</strong> Reasonable efforts shall be made to resume the mediation at the earliest practical opportunity.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>38. Interpretation and Procedural Directions</h3>
              <p><strong>38.1</strong> The mediator may issue procedural directions necessary for the orderly conduct of the mediation. <strong>38.2</strong> The Platform may issue administrative directions concerning registration, scheduling, technical access, payments and use of the online system. <strong>38.3</strong> Where these Rules do not expressly address a procedural matter, the mediator shall determine the procedure having regard to: (a) the Mediation Act, 2023; (b) the agreement of the parties; (c) fairness and equal opportunity; (d) confidentiality; and (e) the efficient conduct of mediation. <strong>38.4</strong> No procedural direction shall override a mandatory provision of applicable law.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>39. Language</h3>
              <p><strong>39.1</strong> The parties may agree upon the language or languages to be used in mediation. <strong>39.2</strong> In the absence of agreement, the mediator may determine an appropriate language after considering the circumstances of the parties and the dispute. <strong>39.3</strong> Where necessary, interpretation or translation may be arranged at the cost agreed between the parties.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>40. Notices</h3>
              <p><strong>40.1</strong> Notices under these Rules may be delivered electronically through the Platform, by email, or through another agreed electronic means. <strong>40.2</strong> A notice shall be treated as received in accordance with the electronic communication mechanism used by the Platform, subject to applicable law. <strong>40.3</strong> Each party shall remain responsible for keeping its contact information current.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>41. Amendment of Rules</h3>
              <p><strong>41.1</strong> The Platform may amend these Rules from time to time to reflect changes in law, technology, mediation practice or administrative requirements. <strong>41.2</strong> An amendment shall not adversely affect an ongoing mediation without reasonable notice and, where required, the consent of the parties. <strong>41.3</strong> Any amendment shall remain subject to the Mediation Act, 2023 and other applicable law.</p>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 4px" }}>42. Severability</h3>
              <p><strong>42.1</strong> If any provision of these Rules is held to be invalid, unlawful or unenforceable, the remaining provisions shall continue to operate to the extent permitted by law. <strong>42.2</strong> The invalid provision shall, where possible, be interpreted or modified to the minimum extent necessary to make it consistent with applicable law.</p>
            </div>
          </div>
        </section>

        {/* Schedule I */}
        <section id="schedule-1" style={{ scrollMarginTop: "140px", background: "var(--paper-hi)", padding: "28px", borderRadius: "8px", border: "1px solid var(--line)" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
            SCHEDULE I
          </span>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: "6px 0 16px" }}>
            Procedural Flow for Online Mediation
          </h2>
          <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 1: Registration</strong> &mdash; The initiating party submits the Request for Mediation and relevant dispute facts through the Platform.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 2: Invitation</strong> &mdash; The other party or parties are notified electronically and invited to participate.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 3: Consent and Conflict Check</strong> &mdash; Consent is obtained where required, and the proposed mediator completes mandatory independence, impartiality and conflict disclosures.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 4: Appointment</strong> &mdash; The mediator is jointly selected by the parties or appointed through the registry procedure.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 5: Preliminary Meeting</strong> &mdash; The mediator establishes the procedural roadmap, identifies issues, and determines the communication mode.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 6: Mediation Sessions</strong> &mdash; The parties participate through secure online video sessions, including joint and private caucus meetings.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 7: Settlement or Closure</strong> &mdash; The mediation concludes either with a mutually agreed settlement or upon statutory closure.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 8: Documentation</strong> &mdash; Where settlement is reached, terms are recorded, authenticated, and electronically executed under the Mediation Act, 2023.
            </div>
            <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong>Stage 9: Completion</strong> &mdash; The Platform closes the docket file and archives records strictly in accordance with statutory retention mandates.
            </div>
          </div>
        </section>

        {/* Schedule II */}
        <section id="schedule-2" style={{ scrollMarginTop: "140px", background: "var(--paper-hi)", padding: "28px", borderRadius: "8px", border: "1px solid var(--line)" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
            SCHEDULE II
          </span>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: "6px 0 16px" }}>
            Principles Governing JustNivaran Mediation
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", fontSize: "13.5px" }}>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>1. Voluntary Participation</strong>
              Settlement must arise entirely from the parties&rsquo; own informed decision.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>2. Neutrality</strong>
              The mediator shall not favour either side or advocate for any position.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>3. Independence</strong>
              The mediator remains free from inappropriate influence, conflict, or bias.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>4. Confidentiality</strong>
              All mediation communications receive the statutory protection prescribed by law.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>5. Equal Opportunity</strong>
              Each party has an equal and fair opportunity to participate and present concerns.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>6. Party Autonomy</strong>
              The parties retain absolute control over the substantive outcome of the dispute.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>7. Procedural Flexibility</strong>
              Processes are adapted to dispute requirements without compromising safeguards.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>8. Efficiency</strong>
              Mediation is conducted without unnecessary delays, adjournments, or cost.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>9. Accessibility</strong>
              Online digital tools eliminate geographical and logistical barriers to justice.
            </div>
            <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", border: "1px solid var(--line)" }}>
              <strong style={{ color: "var(--ink)", display: "block" }}>10. Enforceability</strong>
              Mediated settlement agreements receive direct court decree enforcement status.
            </div>
          </div>
        </section>

        {/* Schedule III */}
        <section id="schedule-3" style={{ scrollMarginTop: "140px", background: "var(--paper-hi)", padding: "28px", borderRadius: "8px", border: "1px solid var(--line)" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
            SCHEDULE III
          </span>
          <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: "6px 0 16px" }}>
            Online Mediation Protocol
          </h2>
          <ol style={{ paddingLeft: "20px", display: "grid", gap: "8px", fontSize: "14px" }}>
            <li>Each participant shall access the mediation through an authorised account or secure access link.</li>
            <li>Participants shall not share meeting links, passwords or private-session access with unauthorised persons.</li>
            <li>Participants shall not record, photograph, screenshot or reproduce mediation sessions except as expressly permitted by law and the mediator.</li>
            <li>Parties shall participate from a reasonably private and quiet environment.</li>
            <li>Where a participant experiences a technical interruption, the mediator may pause or reschedule the session.</li>
            <li>The mediator may move parties into separate virtual breakout rooms for confidential caucus discussions.</li>
            <li>The mediator may require a participant to identify all persons present in the physical room from which they are attending.</li>
            <li>Any suspected compromise of confidentiality or security shall be immediately brought to the attention of the mediator or Platform.</li>
            <li>The Platform may temporarily disable access where necessary to protect the integrity or security of the mediation.</li>
            <li>The mediator shall retain full control over the conduct of the mediation and may issue additional directions consistent with these Rules and applicable law.</li>
          </ol>
        </section>

        {/* Bottom CTA Bar */}
        <div style={{ textAlign: "center", padding: "32px 0 12px" }}>
          <button
            type="button"
            className="btn gold"
            onClick={onOpenFileModal}
            style={{
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(209,154,52,0.25)"
            }}
          >
            ⚖️ Initiate Mediation Online &rarr;
          </button>
        </div>

      </div>
    </main>
  );
}