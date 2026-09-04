import { useState } from "react";

const GUIDELINES_DATA = {
  NEG: {
    title: "Negotiation Institutional Guidelines",
    statute: "Indian Contract Act, 1872",
    tag: "Voluntary & Direct",
    timeline: "15–30 Days",
    summary:
      "A voluntary, party-driven digital process to reach a mutually acceptable resolution with or without an institutional facilitator. Settlement agreements executed digitally constitute legally binding contracts under the Indian Contract Act, 1872.",
    sections: [
      {
        heading: "Rule 1: Good Faith Participation & Sincere Intent",
        body: "Parties must engage honestly, in good faith, and with a sincere desire to reach a workable settlement. Deceptive tactics, unreasonable delays, or intimidation will result in immediate termination."
      },
      {
        heading: "Rule 2: Absolute Confidentiality & 'Without Prejudice'",
        body: "All communications, settlement offers, concessions, and document exchanges during digital negotiation are strictly confidential and protected by 'without prejudice' privilege, inadmissible in any subsequent court or arbitral proceeding."
      },
      {
        heading: "Rule 3: Voluntariness & Party Autonomy",
        body: "Negotiation is voluntary. Both parties maintain full autonomy over their decisions and may accept, modify, or reject any proposal without external coercion."
      },
      {
        heading: "Rule 4: Information Sharing & Material Transparency",
        body: "Each party must provide relevant agreements, invoices, or supporting evidence to substantiate claims. Deliberate withholding of material facts or misrepresentation is strictly prohibited."
      },
      {
        heading: "Rule 5: Timely & Defined Timelines",
        body: "Negotiations proceed under a defined 15-day institutional countdown. Parties are expected to respond promptly to counter-offers to prevent procedural stagnation."
      },
      {
        heading: "Rule 6: Digital Platform Security & Electronic Signatures",
        body: "All negotiations are logged within the encrypted JustNivaran case room. Upon mutual consensus, the system generates an electronic Settlement Agreement signed with compliant e-Signatures."
      },
      {
        heading: "Rule 7: Escalation Protocol to Mediation or Arbitration",
        body: "If direct negotiation does not result in a settlement within the prescribed window, the case can be seamlessly escalated to Institutional Mediation (Mediation Act 2023) or Fast-Track Arbitration (s. 29B) with zero duplicate filing fees."
      }
    ]
  },
  MED: {
    title: "Mediation Procedural Rules",
    statute: "Mediation Act, 2023 · s. 27 & s. 28",
    tag: "Facilitative & Neutral",
    timeline: "120 Days (Statutory)",
    summary:
      "An institutional mediation process facilitated by a certified neutral mediator under the Mediation Act, 2023. Mediated settlement agreements are enforceable as a decree of the Civil Court.",
    sections: [
      {
        heading: "1. Institutional Appointment of Certified Mediator",
        body: "The JustNivaran Registry appoints a certified mediator from the institutional panel based on domain expertise and Schedule V/VII conflict-of-interest disclosures."
      },
      {
        heading: "2. Joint Sessions & Private Caucuses",
        body: "Mediators conduct joint virtual hearings and confidential private caucuses within the statutory 120-day window (extendable by 60 days with mutual party consent)."
      },
      {
        heading: "3. Absolute Confidentiality (Section 22)",
        body: "All statements, admissions, and proposals made during mediation remain strictly confidential and privileged under Section 22 of the Mediation Act, 2023."
      },
      {
        heading: "4. Enforceability as a Civil Court Decree (Section 27)",
        body: "A Mediated Settlement Agreement authenticated and registered by JustNivaran possesses the same legal force and binding enforceability as a judgment or decree of a Civil Court."
      }
    ]
  },
  ARB: {
    title: "Arbitration Procedural Rules",
    statute: "Arbitration & Conciliation Act, 1996 · s. 29A & s. 29B",
    tag: "Binding Adjudication",
    timeline: "6 to 12 Months (Statutory Cap)",
    summary:
      "Formal institutional arbitration resulting in a legally binding, final arbitral award enforceable as a court decree under Section 36 of the Arbitration Act, 1996.",
    sections: [
      {
        heading: "1. Fast-Track Arbitration Track (Section 29B)",
        body: "For commercial claims where parties agree to fast-track adjudication, the sole arbitrator decides the dispute on the basis of written pleadings and documents within a strict 6-month statutory cap."
      },
      {
        heading: "2. Digital Pleadings & Evidentiary Timestamping",
        body: "Statements of claim, defense, and counterclaims are submitted through the cryptographic digital docket compliant with Section 63 of the Bharatiya Sakshya Adhiniyam (BSA), 2023."
      },
      {
        heading: "3. Encrypted Virtual Hearings & AI Transcription",
        body: "Oral hearings (where required) take place via secure encrypted video rooms with real-time transcription attached directly to the case docket."
      },
      {
        heading: "4. Final Arbitral Award & Execution (Section 36)",
        body: "The arbitral tribunal delivers a reasoned award that is final, binding, and directly executable as a decree of the court under Section 36 of the Arbitration Act, 1996."
      }
    ]
  }
};

function GuidelinesModal({ isOpen, onClose, defaultMode = "NEG" }) {
  const [activeTab, setActiveTab] = useState(defaultMode);

  if (!isOpen) return null;

  const current = GUIDELINES_DATA[activeTab] || GUIDELINES_DATA.NEG;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guidelines-modal-title"
    >
      <div className="modal-card" style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">JustNivaran Procedural Guidelines</span>
            <h3 id="guidelines-modal-title">{current.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close guidelines modal">
            &times;
          </button>
        </div>

        {/* Mode Selector */}
        <div className="modes" style={{ padding: "0 20px" }}>
          <button
            className="mode"
            type="button"
            aria-selected={activeTab === "NEG"}
            onClick={() => setActiveTab("NEG")}
          >
            Negotiation
          </button>
          <button
            className="mode"
            type="button"
            aria-selected={activeTab === "MED"}
            onClick={() => setActiveTab("MED")}
          >
            Mediation
          </button>
          <button
            className="mode"
            type="button"
            aria-selected={activeTab === "ARB"}
            onClick={() => setActiveTab("ARB")}
          >
            Arbitration
          </button>
        </div>

        <div className="modal-body" style={{ padding: "24px" }}>
          {/* Metadata Bar */}
          <div style={{
            display: "flex",
            gap: "14px",
            background: "var(--paper-hi)",
            padding: "12px 16px",
            borderRadius: "3px",
            border: "1px solid var(--line)",
            marginBottom: "20px",
            flexWrap: "wrap",
            justifyContent: "space-between"
          }}>
            <div>
              <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Statutory Authority</span>
              <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--ink)", marginTop: "2px" }}>{current.statute}</div>
            </div>
            <div>
              <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Standard Timeline</span>
              <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--gold)", marginTop: "2px" }}>{current.timeline}</div>
            </div>
          </div>

          <p style={{ fontSize: "14.5px", color: "#33455F", lineHeight: 1.6, marginBottom: "20px" }}>
            {current.summary}
          </p>

          {/* Guidelines Section Accordion */}
          <div style={{ display: "grid", gap: "14px" }}>
            {current.sections.map((sec, idx) => (
              <div key={idx} style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "3px",
                padding: "16px"
              }}>
                <h4 style={{ margin: "0 0 6px", fontSize: "15px", color: "var(--ink)", fontWeight: 600 }}>
                  {sec.heading}
                </h4>
                <p style={{ margin: 0, fontSize: "13.5px", color: "var(--slate)", lineHeight: 1.6 }}>
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          <div className="modal-actions" style={{ marginTop: "24px" }}>
            <button className="btn gold" onClick={onClose} type="button">
              Understood &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidelinesModal;