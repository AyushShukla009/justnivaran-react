import { useState } from "react";

const SCENARIOS = [
  {
    label: "MSME Unpaid Invoice",
    prompt: "A client hasn't cleared an overdue invoice of ₹ 18 Lakhs for over 90 days despite multiple reminders.",
    mode: "Fast-Track Arbitration (s. 29B)",
    time: "3 to 6 Months",
    statute: "Arbitration & Conciliation Act, 1996",
    reason: "Fast-track arbitration decided on documents without mandatory oral hearings provides a binding award enforceable as a court decree in minimal time."
  },
  {
    label: "Vendor Delivery Breach",
    prompt: "Supplier delivered defective industrial equipment and is refusing replacement or refund under the contract terms.",
    mode: "Commercial Mediation (s. 27)",
    time: "30 to 60 Days",
    statute: "Mediation Act, 2023",
    reason: "Mediation facilitates commercial settlement while preserving the ongoing supplier relationship, with the settlement having full force of a civil court decree."
  },
  {
    label: "Partnership / Shareholder Issue",
    prompt: "Co-founders or business partners disagreeing on profit distribution and exit valuation clauses.",
    mode: "Direct Negotiation & Conciliation",
    time: "15 to 30 Days",
    statute: "Indian Contract Act, 1872",
    reason: "Confidential private negotiation protects trade reputation and allows custom structured settlement terms without public litigation."
  }
];

function AIAssistant({ onOpenFileModal }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (promptText) => {
    const textToAnalyze = promptText || query;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      // Intelligent rule-based matching
      const lower = textToAnalyze.toLowerCase();
      let match = SCENARIOS[0];

      if (lower.includes("partner") || lower.includes("shareholder") || lower.includes("agreement")) {
        match = SCENARIOS[2];
      } else if (lower.includes("vendor") || lower.includes("delivery") || lower.includes("defective") || lower.includes("service")) {
        match = SCENARIOS[1];
      }

      setResult(match);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleSelectScenario = (sc) => {
    setQuery(sc.prompt);
    handleAnalyze(sc.prompt);
  };

  return (
    <section className="section" style={{ background: "var(--paper)", borderTop: "var(--rail)" }}>
      <div className="wrap">
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <b>AI Dispute Triage</b> Jupitice-Inspired Smart Analyzer
          </p>
          <h2 style={{ textAlign: "center", marginBottom: "12px" }}>
            Not sure which resolution path fits your dispute?
          </h2>
          <p className="lede" style={{ textAlign: "center", margin: "0 auto 28px" }}>
            Describe your dispute in plain words, or select a scenario. Our statutory triage engine analyzes the urgency, value, and legal basis to recommend the optimal path.
          </p>

          {/* Quick Scenario Chips */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
            {SCENARIOS.map((sc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectScenario(sc)}
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  fontFamily: "var(--sans)",
                  cursor: "pointer",
                  color: "var(--ink)",
                  transition: "all .2s ease"
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
              >
                💡 {sc.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            padding: "16px",
            boxShadow: "0 4px 16px rgba(18,41,74,.05)"
          }}>
            <textarea
              rows="3"
              placeholder="Describe what happened, the disputed claim amount, and what outcome you want..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontFamily: "var(--sans)",
                fontSize: "15px",
                lineHeight: "1.6",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", borderTop: "1px solid var(--line-soft)", paddingTop: "12px" }}>
              <button
                type="button"
                className="btn gold"
                onClick={() => handleAnalyze(query)}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing Legal Merits..." : "Analyze Dispute Path →"}
              </button>
            </div>
          </div>

          {/* Analysis Recommendation Output */}
          {result && (
            <div style={{
              background: "var(--ink-deep)",
              color: "#fff",
              borderRadius: "4px",
              padding: "24px 28px",
              marginTop: "24px",
              border: "1px solid var(--gold)",
              animation: "rise .3s ease-out"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid rgba(255,255,255,.15)", paddingBottom: "14px" }}>
                <div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold)", textTransform: "uppercase" }}>
                    Recommended ODR Route
                  </span>
                  <h3 style={{ color: "#fff", fontSize: "20px", marginTop: "4px" }}>{result.mode}</h3>
                </div>
                <span style={{
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  background: "rgba(209,154,52,.2)",
                  color: "var(--gold)",
                  padding: "4px 10px",
                  borderRadius: "2px"
                }}>
                  ⏱️ Timeline: {result.time}
                </span>
              </div>

              <p style={{ color: "#AEC0D6", fontSize: "14px", lineHeight: "1.6", marginTop: "14px", marginBottom: "18px" }}>
                <strong>Legal Rationale:</strong> {result.reason}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "#8FA4BE" }}>
                  Governing Framework: {result.statute}
                </span>
                <button
                  type="button"
                  className="btn gold"
                  onClick={onOpenFileModal}
                >
                  Start This Path Now →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;