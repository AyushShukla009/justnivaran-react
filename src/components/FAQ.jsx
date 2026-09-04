import { useState } from "react";

const FAQ_DATA = [
  {
    q: "Is an online arbitral award or mediated settlement legally binding in India?",
    a: "Yes. Under Section 36 of the Arbitration and Conciliation Act, 1996, an arbitral award issued through JustNivaran holds the statutory force of a decree of a Civil Court for enforcement purposes. Mediated settlement agreements are similarly enforceable under Section 27 of the Mediation Act, 2023 (subject to statutory commencement notifications by the Central Government and procedural rules under the Code of Civil Procedure, 1908)."
  },
  {
    q: "How does the counterparty / respondent get notified of a dispute filing?",
    a: "Upon docket registration, the JustNivaran Registry formally transmits the dispute notice to the respondent via verified Email, WhatsApp, and SMS with SHA-256 electronic timestamping admissible under Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023 and the Information Technology Act, 2000."
  },
  {
    q: "What happens if the opposite party does not respond to a negotiation notice?",
    a: "If the counterparty does not consent within the institutional response window (typically 15 days), the negotiation concludes without settlement, and the claimant is issued an official Non-Settlement Summary to immediately escalate to fast-track arbitration or judicial proceedings."
  },
  {
    q: "Can advocates and legal counsel represent parties in online hearings?",
    a: "Yes. Advocates, corporate in-house counsels, and authorized legal representatives have full rights of audience during all JustNivaran virtual video hearings and document submission rounds."
  },
  {
    q: "How are arbitrators and mediators appointed on JustNivaran?",
    a: "Neutrals are either mutually nominated by the parties from our certified roster of retired judges and senior advocates, or independently appointed by the JustNivaran Registry following domain specialization criteria and mandatory Section 12 conflict-of-interest disclosures."
  },
  {
    q: "Are the proceedings and submitted evidence confidential?",
    a: "Yes. All digital filings, evidence exhibits, and video hearing records are protected via AES-256 encryption at rest, TLS 1.3 in transit, and maintained as confidential in accordance with Section 42A of the Arbitration Act and the Digital Personal Data Protection Act, 2023."
  }
];

function FAQ({ onOpenFileModal, onOpenConsultationModal }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="section" id="faq" style={{ background: "var(--paper-hi)", borderTop: "var(--rail)" }}>
      <div className="wrap two">
        {/* Left Column: Heading, Lede, and Query Card */}
        <div>
          <p className="eyebrow">
            <b>08</b> Questions &amp; Answers
          </p>
          <h2>Frequently Asked Questions</h2>
          <p className="lede" style={{ margin: "16px 0 28px" }}>
            Everything you need to know about statutory online dispute resolution, enforceability, and hearings.
          </p>

          {/* Prompt Box */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              padding: "20px",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(18, 41, 74, .04)"
            }}
          >
            <p style={{ fontSize: "14px", color: "var(--ink)", fontWeight: 500, margin: "0 0 14px" }}>
              Have a specific dispute query not covered here?
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button className="btn gold" type="button" onClick={onOpenFileModal} style={{ flex: "1 1 auto" }}>
                File a Dispute →
              </button>
              <button className="btn ghost" type="button" onClick={onOpenConsultationModal} style={{ flex: "1 1 auto" }}>
                Book Consultation
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Search & Accordion */}
        <div>
          {/* FAQ Live Search Filter */}
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="🔍 Search questions (e.g. binding, notice, advocate, evidence)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                background: "#ffffff",
                fontSize: "13.5px",
                outline: "none",
                color: "var(--ink)",
                boxSizing: "border-box"
              }}
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <div style={{ padding: "28px", textAlign: "center", background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--slate)" }}>
              No matching questions found for "{searchQuery}". Click "Book Consultation" to speak directly with our registry counsel.
            </div>
          ) : (
            filteredFaqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    border: isOpen ? "1.5px solid var(--gold)" : "1px solid var(--line)",
                    borderRadius: "4px",
                    marginBottom: "12px",
                    overflow: "hidden",
                    boxShadow: isOpen ? "0 4px 16px rgba(209, 154, 52, 0.08)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    style={{
                      width: "100%",
                      padding: "16px 18px",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "left",
                      fontSize: "14.5px",
                      fontWeight: 600,
                      color: "var(--ink)",
                      cursor: "pointer"
                    }}
                  >
                    <span>{item.q}</span>
                    <span
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                        color: "var(--gold)",
                        fontSize: "14px",
                        marginLeft: "12px"
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 18px 18px",
                        fontSize: "13.5px",
                        color: "#3B4E68",
                        lineHeight: "1.6",
                        borderTop: "1px solid var(--line-soft)",
                        paddingTop: "12px"
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default FAQ;