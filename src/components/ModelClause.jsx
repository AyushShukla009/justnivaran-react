import { useState } from "react";

const CLAUSE_TEXT = `Any dispute, controversy or claim arising out of or relating to this contract, including its formation, validity, breach or termination, shall be submitted to and finally resolved by online dispute resolution administered by JustNivaran in accordance with its applicable rules in force at the time of filing. The seat of the proceedings shall be New Delhi, India. The proceedings shall be conducted online.`;

function ModelClause() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CLAUSE_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <section className="section" id="clause">
      <div className="wrap">
        <p className="eyebrow">
          <b>06</b> Model clause for commercial contracts
        </p>

        <div className="two">
          <div>
            <h2>Insert this into your agreements today.</h2>
            <p className="lede" style={{ margin: "18px 0 24px" }}>
              A single paragraph guarantees your counterparty must attempt
              structured online resolution before any court filing is
              maintainable.
            </p>
            <p style={{ fontSize: "14px", color: "var(--slate)" }}>
              Compatible with the Mediation Act, 2023, the Arbitration and
              Conciliation Act, 1996, and the Indian Contract Act, 1872.
            </p>
          </div>

          <div className="clause">
            <div className="clause-top">
              <span>Standard JustNivaran ADR clause</span>
              <button
                className="copy"
                type="button"
                onClick={handleCopy}
                style={{
                  background: copied ? "#27AE60" : "var(--ink)",
                  transition: "all .2s ease"
                }}
              >
                {copied ? "✓ Copied to Clipboard!" : "Copy clause"}
              </button>
            </div>
            <blockquote>
              "{CLAUSE_TEXT}"
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ModelClause;