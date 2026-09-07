import { useState } from "react";
import { Link } from "react-router-dom";

export default function ConciliationRules({ onOpenFileModal }) {
  const [activeSection, setActiveSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const SECTIONS = [
    { id: "rule-1", label: "1. Purpose & Scope" },
    { id: "rule-2", label: "2. Initiation of Proceedings" },
    { id: "rule-3", label: "3. Appointment of Conciliator" },
    { id: "rule-4", label: "4. Role of JustNivaran" },
    { id: "rule-5", label: "5. Conduct of Conciliation" },
    { id: "rule-6", label: "6. Online Proceedings" },
    { id: "rule-7", label: "7. Participation & Representation" },
    { id: "rule-8", label: "8. Confidentiality" },
    { id: "rule-9", label: "9. Settlement" },
    { id: "rule-10", label: "10. Time & Case Management" },
    { id: "rule-11", label: "11. Costs & Fees" },
    { id: "rule-12", label: "12. Cooperation by Parties" },
    { id: "rule-13", label: "13. Termination" },
    { id: "rule-14", label: "14. Independence of Conciliator" },
    { id: "rule-15", label: "15. Technology, Records & Data" },
    { id: "rule-16", label: "16. No Adjudication" },
    { id: "rule-17", label: "17. Applicable Law" },
    { id: "rule-18", label: "18. Miscellaneous" }
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
          <b>Statutory Procedure Framework</b> Mediation Act, 2023 &bull; Arbitration Act, 1996 &bull; Effective 2026
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: "1.15", margin: "0 0 14px", color: "var(--ink)" }}>
          JustNivaran Conciliation (Conciliation Procedure) Rules, 2026
        </h1>
        
        <p className="lede" style={{ color: "#33455F", maxWidth: "900px", margin: "0 0 28px" }}>
          Structured, consensual, and technology-enabled procedural framework for institutional online conciliation administered through the JustNivaran Online Dispute Resolution (ODR) Platform.
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
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Statutory Alignment</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginTop: "3px" }}>Mediation Act, 2023 &bull; Arbitration Act, 1996</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nature of Process</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--gold)", marginTop: "3px" }}>Consensual &bull; Non-Adjudicatory</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tribunal Constitution</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginTop: "3px" }}>Sole Conciliator (Default)</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Administration &amp; Platform</span>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginTop: "3px" }}>JustNivaran ODR Registry</div>
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
            ⚡ Quick Navigation (18 Rules)
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search conciliation rules..."
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
              title="Print Rules"
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

      {/* Rules Content Container */}
      <div style={{ display: "grid", gap: "32px" }}>

        {/* Rule 1 */}
        <section id="rule-1" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              1. Purpose and Scope
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-1")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>1.1</strong> These Rules provide a structured and technology-enabled framework for resolving disputes through conciliation facilitated by JustNivaran.</p>
            <p><strong>1.2</strong> They shall apply where the parties have agreed to refer their dispute to conciliation under these Rules, whether such agreement is contained in the underlying contract, a separate agreement, or is made subsequently.</p>
            <p><strong>1.3</strong> The Rules may be used for domestic as well as international disputes, to the extent that the dispute is capable of being resolved through conciliation under applicable law.</p>
            <p><strong>1.4</strong> These Rules are intended to supplement the applicable provisions of the Mediation Act, 2023, the Arbitration and Conciliation Act, 1996, where applicable, and other relevant laws. In case of inconsistency, the applicable statutory provision shall prevail.</p>
            <p><strong>1.5</strong> The parties may, by mutual agreement, modify a procedural requirement under these Rules, provided such modification is not contrary to mandatory law.</p>
          </div>
        </section>

        {/* Rule 2 */}
        <section id="rule-2" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              2. Initiation of Proceedings
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-2")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>2.1</strong> A party seeking conciliation shall submit a Request for Conciliation through the JustNivaran Platform and simultaneously notify the other party.</p>
            <p><strong>2.2</strong> The Request shall ordinarily contain:</p>
            <ul style={{ paddingLeft: "24px", margin: "4px 0", display: "grid", gap: "6px" }}>
              <li><strong>a)</strong> the names and contact details of the parties;</li>
              <li><strong>b)</strong> details of their authorised representatives, if any;</li>
              <li><strong>c)</strong> the agreement or relationship giving rise to the dispute;</li>
              <li><strong>d)</strong> a brief description of the dispute and issues involved;</li>
              <li><strong>e)</strong> the relief or resolution sought; and</li>
              <li><strong>f)</strong> such documents and information as may reasonably assist in commencing the process.</li>
            </ul>
            <p><strong>2.3</strong> JustNivaran may assist in transmitting the request and communications through the Platform.</p>
            <p><strong>2.4</strong> Conciliation shall commence upon acceptance of the invitation by the other party, unless otherwise provided by applicable law or agreed between the parties.</p>
            <p><strong>2.5</strong> If the invitation is declined or no acceptance is received within the prescribed period, JustNivaran may close the request without affecting the parties’ right to pursue any other remedy available to them.</p>
          </div>
        </section>

        {/* Rule 3 */}
        <section id="rule-3" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              3. Appointment of Conciliator
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-3")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>3.1</strong> Conciliation shall ordinarily be conducted by one Conciliator unless the parties agree otherwise.</p>
            <p><strong>3.2</strong> JustNivaran shall maintain a panel of suitably qualified and independent Conciliators from which the parties may select or nominate a Conciliator.</p>
            <p><strong>3.3</strong> Where the parties are unable to agree upon a Conciliator within the prescribed period, JustNivaran may make an appointment in accordance with its appointment procedure, subject to applicable law.</p>
            <p><strong>3.4</strong> Before accepting an appointment, the proposed Conciliator shall disclose any circumstances that may reasonably give rise to doubts concerning independence or impartiality.</p>
            <p><strong>3.5</strong> A Conciliator shall not be appointed where a conflict of interest or other circumstance exists which would materially affect the fairness or credibility of the process, unless permitted by law and expressly accepted by all parties after disclosure.</p>
            <p><strong>3.6</strong> If a Conciliator becomes unable or unwilling to continue, a substitute may be appointed through the same procedure.</p>
          </div>
        </section>

        {/* Rule 4 */}
        <section id="rule-4" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              4. Role of JustNivaran
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-4")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>4.1</strong> JustNivaran shall provide the administrative and technological infrastructure required for conducting the conciliation.</p>
            <p><strong>4.2</strong> Its functions may include registration of the dispute, communication between the parties and Conciliator, scheduling, maintenance of the electronic case record, fee administration, technical assistance and other case-management functions.</p>
            <p><strong>4.3</strong> JustNivaran shall not determine the merits of the dispute or impose any settlement upon the parties.</p>
            <p><strong>4.4</strong> The Conciliator shall remain independent in conducting the substantive process.</p>
          </div>
        </section>

        {/* Rule 5 */}
        <section id="rule-5" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              5. Conduct of Conciliation
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-5")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>5.1</strong> The Conciliator shall facilitate communication between the parties and assist them in identifying the issues in dispute, understanding their respective interests, considering possible solutions and exploring mutually acceptable outcomes.</p>
            <p><strong>5.2</strong> The Conciliator may, after consulting the parties:</p>
            <ul style={{ paddingLeft: "24px", margin: "4px 0", display: "grid", gap: "6px" }}>
              <li><strong>a)</strong> request written statements or relevant documents;</li>
              <li><strong>b)</strong> conduct joint or separate sessions;</li>
              <li><strong>c)</strong> communicate separately with either party;</li>
              <li><strong>d)</strong> seek clarification or additional information;</li>
              <li><strong>e)</strong> assist the parties in evaluating possible settlement options; and</li>
              <li><strong>f)</strong> adopt any other appropriate procedure consistent with the nature of conciliation.</li>
            </ul>
            <p><strong>5.3</strong> The Conciliator shall not impose a decision or compel a party to accept a particular settlement.</p>
            <p><strong>5.4</strong> Any settlement shall result from the voluntary agreement of the parties.</p>
          </div>
        </section>

        {/* Rule 6 */}
        <section id="rule-6" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              6. Online Proceedings
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-6")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>6.1</strong> Conciliation under these Rules shall ordinarily be conducted electronically through the JustNivaran Platform.</p>
            <p><strong>6.2</strong> Meetings may be conducted through secure video conferencing, audio communication, electronic messaging or other digital facilities made available through the Platform.</p>
            <p><strong>6.3</strong> Documents may be uploaded, exchanged and stored electronically.</p>
            <p><strong>6.4</strong> Where technical difficulties materially affect a party’s participation, the Conciliator may adjourn or modify the session and provide a reasonable opportunity for the affected party to participate.</p>
            <p><strong>6.5</strong> Where circumstances require, the parties and Conciliator may mutually agree to conduct a meeting in person.</p>
          </div>
        </section>

        {/* Rule 7 */}
        <section id="rule-7" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              7. Participation and Representation
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-7")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>7.1</strong> Parties may participate personally or through duly authorised representatives.</p>
            <p><strong>7.2</strong> A party may be represented or assisted by legal counsel or another person of its choice, subject to applicable law and the directions of the Conciliator.</p>
            <p><strong>7.3</strong> The Conciliator shall ensure that each party has a reasonable opportunity to communicate its position and respond to the issues raised by the other party.</p>
            <p><strong>7.4</strong> The Conciliator may require proof of authority where a person participates on behalf of a party.</p>
          </div>
        </section>

        {/* Rule 8 */}
        <section id="rule-8" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              8. Confidentiality
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-8")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>8.1</strong> The conciliation process, communications made during the process, documents submitted for the purposes of settlement, proposals, admissions and settlement discussions shall be treated as confidential, subject to applicable law.</p>
            <p><strong>8.2</strong> Information specifically provided to the Conciliator on the understanding that it is confidential shall not be disclosed to another party without permission, except where disclosure is required by law.</p>
            <p><strong>8.3</strong> The confidentiality obligations shall extend to the Conciliator, parties, representatives, JustNivaran personnel and other persons involved in administering the process.</p>
            <p><strong>8.4</strong> Information exchanged solely for the purpose of attempting settlement shall not be used as evidence in subsequent proceedings to the extent prohibited by applicable law.</p>
          </div>
        </section>

        {/* Rule 9 */}
        <section id="rule-9" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              9. Settlement
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-9")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>9.1</strong> Where the parties reach agreement on all or part of the dispute, the terms may be recorded electronically or in such other form as may be required by applicable law.</p>
            <p><strong>9.2</strong> A settlement may deal with the whole dispute or only particular issues.</p>
            <p><strong>9.3</strong> The Conciliator may assist the parties in recording the agreed terms but shall not impose or unilaterally determine the contents of the settlement.</p>
            <p><strong>9.4</strong> The settlement shall become binding and enforceable in accordance with the applicable law governing such settlement.</p>
            <p><strong>9.5</strong> Where the parties settle only part of the dispute, conciliation may continue in respect of the remaining issues unless the parties decide otherwise.</p>
          </div>
        </section>

        {/* Rule 10 */}
        <section id="rule-10" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              10. Time and Case Management
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-10")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>10.1</strong> The Conciliator shall endeavour to conduct the process expeditiously while allowing sufficient time for meaningful participation and settlement discussions.</p>
            <p><strong>10.2</strong> The Conciliator may establish a procedural schedule after considering the nature and complexity of the dispute.</p>
            <p><strong>10.3</strong> The schedule may be modified where required by the circumstances or with the consent of the parties.</p>
            <p><strong>10.4</strong> The use of an online process shall not prevent the Conciliator from allowing additional time where necessary to ensure a fair and effective process.</p>
          </div>
        </section>

        {/* Rule 11 */}
        <section id="rule-11" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              11. Costs and Fees
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-11")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>11.1</strong> The administrative charges of JustNivaran and the fees payable to the Conciliator shall be governed by the applicable Fee Schedule.</p>
            <p><strong>11.2</strong> Unless otherwise agreed, the parties shall share the costs of conciliation equally.</p>
            <p><strong>11.3</strong> The parties may agree upon a different allocation of costs as part of the settlement or otherwise.</p>
            <p><strong>11.4</strong> JustNivaran may require payment or deposit of applicable fees before or during the proceedings.</p>
          </div>
        </section>

        {/* Rule 12 */}
        <section id="rule-12" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              12. Cooperation by Parties
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-12")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>12.1</strong> Parties shall participate in the process in good faith and shall make reasonable efforts to assist the Conciliator in understanding and resolving the dispute.</p>
            <p><strong>12.2</strong> Parties shall comply with procedural directions concerning submission of documents, attendance at meetings and other matters necessary for conducting the process.</p>
            <p><strong>12.3</strong> A party’s failure to participate shall not permit the Conciliator to impose a settlement or determine the dispute against that party.</p>
          </div>
        </section>

        {/* Rule 13 */}
        <section id="rule-13" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              13. Termination
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-13")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>13.1</strong> Conciliation shall terminate upon:</p>
            <ul style={{ paddingLeft: "24px", margin: "4px 0", display: "grid", gap: "6px" }}>
              <li><strong>a)</strong> execution of a settlement covering the dispute;</li>
              <li><strong>b)</strong> written declaration by the parties that they no longer wish to continue;</li>
              <li><strong>c)</strong> determination by the Conciliator that further efforts are unlikely to result in settlement; or</li>
              <li><strong>d)</strong> expiry of such period as may be prescribed under applicable law or agreed by the parties.</li>
            </ul>
            <p><strong>13.2</strong> JustNivaran may administratively close the case upon receiving notice of termination.</p>
            <p><strong>13.3</strong> Termination of conciliation shall not affect any right or remedy otherwise available to the parties under law or contract.</p>
          </div>
        </section>

        {/* Rule 14 */}
        <section id="rule-14" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              14. Independence of Conciliator
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-14")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>14.1</strong> The Conciliator shall remain neutral and independent throughout the proceedings.</p>
            <p><strong>14.2</strong> The Conciliator shall not act as advocate, representative or adviser of either party in relation to the dispute being conciliated.</p>
            <p><strong>14.3</strong> Unless otherwise permitted by applicable law and agreed by all parties, the Conciliator shall not subsequently act as an arbitrator, expert or representative in proceedings arising from the same dispute.</p>
          </div>
        </section>

        {/* Rule 15 */}
        <section id="rule-15" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              15. Technology, Records and Data
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-15")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>15.1</strong> JustNivaran may maintain electronic records of the proceedings, including filings, communications, scheduling information and other case-related material, in accordance with its applicable policies and law.</p>
            <p><strong>15.2</strong> The Platform shall employ reasonable technical and organisational measures to protect the confidentiality and security of information submitted during the process.</p>
            <p><strong>15.3</strong> Electronic records and communications may be used for administration, verification, audit, compliance and enforcement purposes where permitted by law.</p>
            <p><strong>15.4</strong> The handling, storage and retention of personal information shall be governed by applicable data protection law and JustNivaran’s privacy framework.</p>
          </div>
        </section>

        {/* Rule 16 */}
        <section id="rule-16" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              16. No Adjudication
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-16")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>16.1</strong> Conciliation under these Rules is a consensual process and is not an adjudicatory proceeding.</p>
            <p><strong>16.2</strong> The Conciliator shall not decide the rights or liabilities of the parties or issue a binding determination on the merits.</p>
            <p><strong>16.3</strong> The parties remain free to accept or reject any proposal or settlement suggested during the process.</p>
          </div>
        </section>

        {/* Rule 17 */}
        <section id="rule-17" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              17. Applicable Law
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-17")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>17.1</strong> These Rules shall be interpreted consistently with the applicable laws of India, including the Mediation Act, 2023, the Arbitration and Conciliation Act, 1996, where applicable, and other relevant legislation.</p>
            <p><strong>17.2</strong> Where a mandatory statutory provision applies to any aspect of the conciliation, that provision shall prevail over any inconsistent provision of these Rules.</p>
            <p><strong>17.3</strong> The parties may agree upon the substantive law applicable to the dispute, subject to mandatory provisions of applicable law.</p>
          </div>
        </section>

        {/* Rule 18 */}
        <section id="rule-18" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
              18. Miscellaneous
            </h2>
            <button type="button" onClick={() => handleCopyLink("rule-18")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: "12px" }}>
              🔗 Copy Link
            </button>
          </div>
          <div style={{ fontSize: "14.5px", color: "#2B3C52", lineHeight: "1.75", display: "grid", gap: "12px" }}>
            <p><strong>18.1</strong> Any procedural matter not expressly addressed by these Rules may be determined by the Conciliator after considering the views of the parties and the nature of the dispute.</p>
            <p><strong>18.2</strong> No procedural irregularity shall invalidate the conciliation merely because a non-mandatory requirement of these Rules has not been strictly followed, provided the fundamental principles of voluntary participation, neutrality, fairness and confidentiality are maintained.</p>
            <p><strong>18.3</strong> If any provision of these Rules is held to be invalid or unenforceable, the remaining provisions shall continue to apply to the extent permitted by law.</p>
            <p><strong>18.4</strong> The official language of proceedings shall be English unless the parties and Conciliator agree upon another language.</p>
            <p><strong>18.5</strong> These Rules may be amended by JustNivaran from time to time, provided that the version applicable to a pending proceeding shall be determined in accordance with the parties’ agreement and applicable law.</p>
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
            Initiate Conciliation Under These Rules
          </h3>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
            Submit your Request for Conciliation to begin a structured, confidential, and voluntary online settlement dialogue administered by JustNivaran.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {onOpenFileModal && (
            <button
              type="button"
              onClick={onOpenFileModal}
              className="btn gold"
              style={{ padding: "12px 24px", fontSize: "14.5px" }}
            >
              Submit Conciliation Request
            </button>
          )}
          <Link
            to="/mediation-rules"
            className="btn ghost"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", padding: "12px 20px", fontSize: "14.5px", textDecoration: "none" }}
          >
            View Mediation Rules
          </Link>
        </div>
      </div>
    </main>
  );
}
