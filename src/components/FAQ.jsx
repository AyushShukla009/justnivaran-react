import { useState } from "react";

const FAQ_DATA = [
  {
    q: "Is an online arbitral award or mediated settlement legally binding in India?",
    a: "Yes. Under Section 36 of the Arbitration and Conciliation Act, 1996, an arbitral award issued through JustNivaran is enforceable in the same manner as a decree of a Civil Court. Mediated settlements are similarly enforceable under Section 27 of the Mediation Act, 2023."
  },
  {
    q: "What happens if the opposite party does not respond to a negotiation notice?",
    a: "If the counterparty does not consent within the statutory response window (typically 15 days), the negotiation concludes without settlement, and the claimant is issued an official Non-Settlement Certificate to immediately proceed to arbitration or civil court."
  },
  {
    q: "How are arbitrators and mediators appointed on JustNivaran?",
    a: "Neutrals are either mutually chosen by both parties from our certified roster or independently allocated by the JustNivaran Registry based on domain specialization and strict conflict-of-interest checks."
  },
  {
    q: "Are the proceedings and submitted evidence confidential?",
    a: "Yes. All digital filings, evidence exhibits, and video hearing transcripts are encrypted end-to-end and strictly confidential under Section 42A of the Arbitration Act and the Digital Personal Data Protection Act, 2023."
  }
];

function FAQ({ onOpenFileModal, onOpenConsultationModal }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="section" id="faq" style={{ background: "var(--paper-hi)", borderTop: "var(--rail)" }}>
      <div className="wrap two">
        {/* Left Column: Heading, Lede, and Query Card */}
        <div>
          <p className="eyebrow">
            <b>07</b> Questions &amp; Answers
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

        {/* Right Column: Accordion */}
        <div>
          {FAQ_DATA.map((item, idx) => {
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
                  <span style={{ paddingRight: "16px" }}>{item.q}</span>
                  <span style={{ fontSize: "16px", color: isOpen ? "var(--gold)" : "var(--slate)", fontWeight: 700 }}>
                    {isOpen ? "✕" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 18px 18px",
                      fontSize: "13.5px",
                      color: "#3B4E68",
                      lineHeight: "1.7"
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;