import { useState } from "react";

function ModelClause() {
  const [copied, setCopied] = useState(false);
  const [seat, setSeat] = useState("New Delhi, India");
  const [track, setTrack] = useState("comprehensive");
  const [contractName, setContractName] = useState("");

  const getClauseText = () => {
    const seatText = seat || "New Delhi, India";
    const refText = contractName ? `this agreement (${contractName})` : "this contract";

    if (track === "arbitration") {
      return `Any dispute, controversy or claim arising out of or relating to ${refText}, including its formation, validity, breach or termination, shall be submitted to and finally resolved by Fast-Track Arbitration administered by JustNivaran in accordance with Section 29B of the Arbitration and Conciliation Act, 1996. The seat of the arbitration shall be ${seatText}. The proceedings shall be conducted online.`;
    }

    if (track === "mediation") {
      return `Any dispute, controversy or claim arising out of or relating to ${refText} shall first be submitted to institutional online mediation administered by JustNivaran in accordance with the Mediation Act, 2023. Any settlement agreement arrived at shall be final and enforceable under Section 27 of the Act. The seat of the proceedings shall be ${seatText}.`;
    }

    return `Any dispute, controversy or claim arising out of or relating to ${refText}, including its formation, validity, breach or termination, shall be submitted to and finally resolved by online dispute resolution (ODR) administered by JustNivaran in accordance with its applicable institutional rules in force at the time of filing. The seat of the proceedings shall be ${seatText}. The proceedings shall be conducted online.`;
  };

  const currentClause = getClauseText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentClause);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // fallback
    }
  };

  const handlePrintAddendum = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>JustNivaran - Dispute Resolution Contract Addendum</title>
          <style>
            @page { size: A4 portrait; margin: 16mm 18mm; }
            * { box-sizing: border-box; }
            body { font-family: 'Times New Roman', Times, serif; color: #0B1B31; line-height: 1.45; margin: 0; padding: 0; }
            .header-table { width: 100%; border-collapse: collapse; border-bottom: 2px solid #0B1B31; padding-bottom: 10px; margin-bottom: 16px; }
            .inst-title { font-size: 17pt; font-weight: bold; letter-spacing: 0.04em; color: #0B1B31; text-transform: uppercase; margin: 0; }
            .inst-sub { font-size: 8.5pt; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
            .doc-badge { display: inline-block; border: 1px solid #0B1B31; padding: 5px 10px; font-family: 'Courier New', monospace; font-size: 8pt; text-align: left; background: #fafafa; line-height: 1.35; }
            h2 { font-size: 12pt; text-align: center; text-transform: uppercase; letter-spacing: 0.8px; margin: 14px 0 2px; }
            .sub-h2 { text-align: center; font-size: 8.5pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
            p { font-size: 9.5pt; color: #222; text-align: justify; margin: 8px 0; }
            .clause-container { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #0B1B31; padding: 12px 16px; font-size: 10pt; font-style: italic; margin: 12px 0; line-height: 1.55; }
            .statutory-list { font-size: 8.5pt; color: #333; margin: 8px 0 16px; padding-left: 18px; }
            .statutory-list li { margin-bottom: 4px; }
            .sig-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .sig-box { width: 48%; border: 1px solid #0B1B31; padding: 12px 14px; vertical-align: top; background: #fff; }
            .sig-party-title { font-weight: bold; font-size: 8.5pt; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 1px solid #0B1B31; padding-bottom: 4px; margin-bottom: 10px; color: #0B1B31; }
            .sig-field { margin-bottom: 8px; font-size: 8.5pt; }
            .sig-line-box { border-bottom: 1px solid #555; height: 16px; margin-top: 2px; }
            .seal-stamp { text-align: center; font-size: 7.5pt; font-family: 'Courier New', monospace; color: #555; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 8px; letter-spacing: 0.5px; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td style="vertical-align: middle; width: 62%;">
                <div class="inst-title">JUSTNIVARAN ODR CENTRE</div>
                <div class="inst-sub">Statutory Digital Dispute Resolution Registry &bull; Seat: ${seat.toUpperCase()}</div>
              </td>
              <td style="vertical-align: middle; text-align: right; width: 38%;">
                <div class="doc-badge">
                  <strong>REF:</strong> JN-ADR-ADDENDUM-2026<br/>
                  <strong>DATE:</strong> ${todayStr}
                </div>
              </td>
            </tr>
          </table>

          <h2>Institutional Dispute Resolution Annexure</h2>
          <div class="sub-h2">(Standard Model Commercial Contract Addendum)</div>

          <p><strong>To Contracting Parties &amp; Legal Counsel:</strong> By incorporating this annexure into the underlying commercial contract, purchase order, vendor agreement, or terms of service, the parties agree to resolve all disputes via institutional online dispute resolution administered by JustNivaran.</p>

          <div class="clause-container">
            "${currentClause}"
          </div>

          <p><strong>Statutory Enforceability &amp; Governing Framework:</strong></p>
          <ul class="statutory-list">
            <li><strong>Mediation Act, 2023 (Sections 27 &amp; 28):</strong> Mediated Settlement Agreements authenticated by the Registry possess statutory enforceability (subject to Central Government commencement notifications and Section 27 procedures).</li>
            <li><strong>Arbitration and Conciliation Act, 1996 (Sections 7, 29A &amp; 29B):</strong> Mandates binding arbitral awards within statutory ceilings enforceable under Section 36.</li>
            <li><strong>Bharatiya Sakshya Adhiniyam, 2023 (Section 63) &amp; IT Act 2000:</strong> Electronic records, case audit timestamps, and digital awards are admissible as primary electronic evidence.</li>
            <li><strong>Information Technology Act, 2000 (Section 10A):</strong> Validates the legal enforceability of contracts and settlement terms executed electronically.</li>
          </ul>

          <table class="sig-table">
            <tr>
              <td class="sig-box">
                <div class="sig-party-title">FIRST PARTY (CLAIMANT / PRINCIPAL)</div>
                <div class="sig-field">Authorized Signatory Name:</div>
                <div class="sig-line-box"></div>
                <div class="sig-field" style="margin-top: 8px;">Designation &amp; Entity:</div>
                <div class="sig-line-box"></div>
                <div class="sig-field" style="margin-top: 8px;">Signature &amp; Corporate Seal:</div>
                <div class="sig-line-box" style="height: 28px;"></div>
              </td>
              <td style="width: 4%;"></td>
              <td class="sig-box">
                <div class="sig-party-title">SECOND PARTY (RESPONDENT / COUNTERPARTY)</div>
                <div class="sig-field">Authorized Signatory Name:</div>
                <div class="sig-line-box"></div>
                <div class="sig-field" style="margin-top: 8px;">Designation &amp; Entity:</div>
                <div class="sig-line-box"></div>
                <div class="sig-field" style="margin-top: 8px;">Signature &amp; Corporate Seal:</div>
                <div class="sig-line-box" style="height: 28px;"></div>
              </td>
            </tr>
          </table>

          <div class="seal-stamp">
            [ INSTITUTIONAL SEAL ] &bull; JUSTNIVARAN ONLINE DISPUTE RESOLUTION CENTRE &bull; NEW DELHI, INDIA
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section className="section" id="clause">
      <div className="wrap">
        <p className="eyebrow">
          <b>07</b> Model clause for commercial contracts
        </p>

        <div className="two">
          {/* Left Column: Heading, Lede, & Customizer Controls */}
          <div>
            <h2>Insert this into your agreements today.</h2>
            <p className="lede" style={{ margin: "16px 0 20px" }}>
              Incorporating this institutional clause contractually mandates pre-litigation negotiation or fast-track arbitration under Section 8 of the Arbitration and Conciliation Act, 1996 before traditional litigation can proceed.
            </p>

            {/* Interactive Clause Customizer Controls */}
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "18px",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(18, 41, 74, .04)"
            }}>
              <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px", letterSpacing: ".1em" }}>
                ⚙️ Dynamic Clause Customizer
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--slate)", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                    Resolution Framework
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      border: "1px solid var(--line)",
                      borderRadius: "3px",
                      fontSize: "13px",
                      outline: "none",
                      background: "#fff"
                    }}
                  >
                    <option value="comprehensive">Comprehensive ODR (Mediation + Fast-Track Arbitration)</option>
                    <option value="arbitration">Fast-Track Arbitration (Section 29B - 180 Days)</option>
                    <option value="mediation">Pre-Litigation Mediation (Mediation Act 2023)</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--slate)", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                      Seat of Proceedings
                    </label>
                    <select
                      value={seat}
                      onChange={(e) => setSeat(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        border: "1px solid var(--line)",
                        borderRadius: "3px",
                        fontSize: "13px",
                        outline: "none",
                        background: "#fff"
                      }}
                    >
                      <option value="New Delhi, India">New Delhi, India</option>
                      <option value="Mumbai, India">Mumbai, India</option>
                      <option value="Bengaluru, India">Bengaluru, India</option>
                      <option value="Hyderabad, India">Hyderabad, India</option>
                      <option value="Chennai, India">Chennai, India</option>
                      <option value="Kolkata, India">Kolkata, India</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--slate)", display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                      Contract Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Master Service Agreement"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        border: "1px solid var(--line)",
                        borderRadius: "3px",
                        fontSize: "13px",
                        outline: "none",
                        background: "#fff",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handlePrintAddendum}
                className="btn ghost"
                style={{
                  fontSize: "13px",
                  padding: "8px 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid var(--line)"
                }}
              >
                <span>📥</span> Download Contract Addendum (PDF)
              </button>
            </div>
          </div>

          {/* Right Column: Live Customized Clause Box */}
          <div className="clause">
            <div className="clause-top">
              <span>Customized JustNivaran ADR clause</span>
              <button
                className="copy"
                type="button"
                onClick={handleCopy}
                style={{
                  background: copied ? "#27AE60" : "var(--ink)",
                  transition: "all .2s ease"
                }}
              >
                {copied ? "✓ Copied!" : "Copy clause"}
              </button>
            </div>
            <blockquote>
              "{currentClause}"
            </blockquote>
          </div>
        </div>
      </div>

      {copied && (
        <div className="floating-toast" role="status">
          <span style={{ color: "#27AE60", fontSize: "16px" }}>✓</span>
          <span>Customized ADR Clause copied to clipboard!</span>
        </div>
      )}
    </section>
  );
}

export default ModelClause;