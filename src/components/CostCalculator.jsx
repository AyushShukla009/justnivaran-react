import { useState } from "react";
import { calculateAuthoritativeFee, FEE_SLABS } from "../lib/feeSchedule";

function CostCalculator({ onOpenFileModal }) {
  const [claimAmount, setClaimAmount] = useState(1000000);
  const [showFeeTable, setShowFeeTable] = useState(false);

  // Authoritative dynamic calculation
  const feeInfo = calculateAuthoritativeFee(claimAmount, "arbitration");
  const odrCost = feeInfo.baseFee;
  const courtCost = Math.round(claimAmount * 0.18 + 150000);
  const savings = Math.max(0, courtCost - odrCost);

  return (
    <section className="section" id="calculator" style={{ background: "var(--paper-hi)", borderTop: "var(--rail)" }}>
      <div className="wrap">
        <div className="two">
          {/* Left Column: Heading, Lede, and Accessible Slider */}
          <div>
            <p className="eyebrow">
              <b>Resolution Velocity</b> Economic Value &amp; Comparison
            </p>
            <h2>Compare Court Litigation vs. JustNivaran ODR</h2>
            <p className="lede" style={{ margin: "16px 0 20px" }}>
              Traditional litigation drains working capital in multi-year procedural delays. Adjust the claim value to inspect authoritative institutional fee benchmarks.
            </p>

            <div
              style={{
                display: "inline-block",
                background: "rgba(209, 154, 52, 0.12)",
                border: "1px solid rgba(209, 154, 52, 0.35)",
                padding: "6px 12px",
                borderRadius: "3px",
                fontSize: "11px",
                fontFamily: "var(--mono)",
                color: "var(--ink)",
                marginBottom: "20px"
              }}
            >
              ℹ️ Authoritative institutional fee scale (Version 2.4). All fees exclusive of 18% GST.
            </div>

            {/* Interactive Accessible Slider Box */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(18, 41, 74, .04)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                  gap: "6px"
                }}
              >
                <label
                  htmlFor="dispute-claim-slider"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    color: "var(--slate)",
                    cursor: "pointer"
                  }}
                >
                  Claim Value (INR)
                </label>
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "24px",
                    color: "var(--ink)",
                    fontWeight: 500
                  }}
                  aria-live="polite"
                >
                  ₹ {Number(claimAmount).toLocaleString("en-IN")}
                </span>
              </div>

              <input
                id="dispute-claim-slider"
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={claimAmount}
                aria-label="Dispute Claim Value in Indian Rupees"
                aria-valuemin={100000}
                aria-valuemax={10000000}
                aria-valuenow={claimAmount}
                aria-valuetext={`₹ ${Number(claimAmount).toLocaleString("en-IN")}`}
                onChange={(e) => setClaimAmount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--gold)", cursor: "pointer" }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10.5px",
                  fontFamily: "var(--mono)",
                  color: "var(--slate)",
                  marginTop: "6px"
                }}
              >
                <span>₹ 1 Lakh</span>
                <span>₹ 50 Lakhs</span>
                <span>₹ 1 Crore</span>
              </div>
            </div>

            <div style={{ marginTop: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                className="btn gold"
                onClick={() => onOpenFileModal && onOpenFileModal()}
                type="button"
                style={{ flex: "1 1 auto" }}
              >
                File Dispute Under ODR →
              </button>
              <button
                className="btn ghost"
                type="button"
                aria-expanded={showFeeTable}
                onClick={() => setShowFeeTable(!showFeeTable)}
                style={{ flex: "1 1 auto" }}
              >
                {showFeeTable ? "Hide Fee Slabs ▲" : "📋 View Institutional Fee Slabs ▼"}
              </button>
            </div>
          </div>

          {/* Right Column: Comparative Expense Cards */}
          <div style={{ display: "grid", gap: "16px" }}>
            {/* Traditional Court Box */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                padding: "20px"
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10.5px",
                  color: "#C0392B",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  letterSpacing: ".1em"
                }}
              >
                Traditional Court Litigation (Estimate)
              </div>
              <h3 style={{ fontSize: "22px", margin: "0 0 12px" }}>
                ₹ {courtCost.toLocaleString("en-IN")}{" "}
                <small style={{ fontSize: "11px", color: "var(--slate)", fontWeight: "normal" }}>
                  illustrative estimate*
                </small>
              </h3>
              <div style={{ fontSize: "13px", color: "#3B4E68", display: "grid", gap: "8px" }}>
                <div>⏱️ <strong>Resolution Time:</strong> 3 to 5 Years (NJDG commercial court average)</div>
                <div>📍 <strong>Hearings:</strong> In-person appearances, pleadings &amp; adjournments</div>
                <div>📄 <strong>Advocate Costs:</strong> Per-appearance billing &amp; court stamp duty</div>
              </div>
            </div>

            {/* JustNivaran ODR Box */}
            <div
              style={{
                background: "var(--ink-deep)",
                color: "#fff",
                borderRadius: "4px",
                padding: "20px",
                border: "1px solid var(--gold)",
                boxShadow: "0 10px 24px rgba(11, 27, 49, .2)"
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10.5px",
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  letterSpacing: ".1em"
                }}
              >
                JustNivaran Fast-Track Arbitration (s. 29B)
              </div>
              <div style={{ margin: "0 0 10px" }}>
                <h3 style={{ fontSize: "24px", margin: "0 0 4px", color: "#fff" }}>
                  ₹ {feeInfo.totalWithGst.toLocaleString("en-IN")}{" "}
                  <small style={{ fontSize: "12px", color: "var(--gold-soft)", fontWeight: "normal" }}>
                    Total Payable (incl. 18% GST)
                  </small>
                </h3>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontFamily: "var(--mono)" }}>
                  ₹ {odrCost.toLocaleString("en-IN")} Base Fee + ₹ {feeInfo.gstAmount.toLocaleString("en-IN")} GST (18%) = ₹ {feeInfo.totalWithGst.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Component breakdown */}
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  padding: "10px 12px",
                  borderRadius: "4px",
                  fontSize: "11.5px",
                  marginBottom: "12px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px"
                }}
              >
                <div>
                  <span style={{ color: "var(--slate-light)" }}>Institutional Registry (35%):</span>
                  <div style={{ color: "#fff", fontWeight: 500 }}>₹ {feeInfo.registryFee.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <span style={{ color: "var(--slate-light)" }}>Arbitrator Honorarium (65%):</span>
                  <div style={{ color: "var(--gold)", fontWeight: 500 }}>₹ {feeInfo.neutralHonorarium.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <span style={{ color: "var(--slate-light)" }}>Statutory GST (18%):</span>
                  <div style={{ color: "#fff", fontWeight: 500 }}>₹ {feeInfo.gstAmount.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <span style={{ color: "var(--slate-light)" }}>Total Invoiced Payable:</span>
                  <div style={{ color: "var(--gold)", fontWeight: 700 }}>₹ {feeInfo.totalWithGst.toLocaleString("en-IN")}</div>
                </div>
              </div>

              <div style={{ fontSize: "13px", color: "#AEC0D6", display: "grid", gap: "6px" }}>
                <div>⏱️ <strong>Target Timeline:</strong> {feeInfo.targetDays} ({feeInfo.arbitratorType})</div>
                <div>📍 <strong>Hearings:</strong> 100% Encrypted Virtual Video Rooms</div>
                <div>
                  💰 <strong>Estimated Cost Savings:</strong>{" "}
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                    ₹ {savings.toLocaleString("en-IN")}
                  </span>{" "}
                  <span style={{ fontSize: "11px", color: "var(--slate-light)" }}>
                    (Calculated on base fee before GST)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visible Source & Methodology Disclosure */}
        <div
          style={{
            marginTop: "20px",
            padding: "14px 16px",
            background: "#ffffff",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            fontSize: "11px",
            color: "var(--slate)",
            lineHeight: "1.6"
          }}
        >
          <strong style={{ color: "var(--ink)", display: "block", marginBottom: "4px" }}>
            Source &amp; Calculation Methodology:
          </strong>
          <div>
            • <strong>Court Litigation Estimates:</strong> Duration modeled from National Judicial Data Grid (NJDG) commercial dispute disposal metrics across Indian District &amp; High Courts (typically averaging 3–5 years from filing to final decree). Court expenses are estimated based on state ad-valorem court fee enactments plus standard per-hearing legal representation and procedural compliance expenses.
          </div>
          <div style={{ marginTop: "4px" }}>
            • <strong>JustNivaran Fee Schedule:</strong> Authoritative capped administrative schedule governed under Institutional Fee Schedule Version 2.4 (September 2026). All institutional dispute filings strictly adhere to the published slabs.
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "var(--slate)", margin: "14px 0 0", lineHeight: "1.5" }}>
          *Disclaimer: Traditional litigation costs and timeframes are illustrative estimates derived from National Judicial Data Grid (NJDG) commercial dispute averages and statutory court fee ad-valorem schedules. JustNivaran timelines represent target administrative benchmarks under Section 29B and do not constitute a guarantee of outcome.
        </p>

        {/* Expandable Statutory Institutional Fee Schedule Table */}
        {showFeeTable && (
          <div
            style={{
              marginTop: "32px",
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              animation: "rise 0.25s ease-out"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--mono)",
                    color: "var(--gold)",
                    textTransform: "uppercase",
                    letterSpacing: ".1em"
                  }}
                >
                  AUTHORITATIVE INSTITUTIONAL FEE SCHEDULE (VERSION 2.4)
                </span>
                <h3 style={{ fontSize: "19px", margin: "4px 0 0", color: "var(--ink)" }}>
                  Institutional Fee Schedule (Exclusive of 18% GST)
                </h3>
              </div>
              <span style={{ fontSize: "12px", color: "var(--slate)" }}>*Capped statutory neutral honorarium</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--paper-hi)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Claim Value Slab</th>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Direct Negotiation</th>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Institutional Mediation</th>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Fast-Track Arbitration (s. 29B)</th>
                  </tr>
                </thead>
                <tbody>
                  {FEE_SLABS.map((sl, idx) => (
                    <tr key={sl.id} style={{ borderBottom: "1px solid var(--line-soft)", background: idx % 2 === 1 ? "rgba(11,27,49,.02)" : "#fff" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 500 }}>{sl.label}</td>
                      <td style={{ padding: "12px 14px", color: "var(--gold-deep)", fontWeight: 600 }}>₹ {sl.negotiationFee.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "12px 14px", color: "#1E8449" }}>
                        {sl.mediationFee ? `₹ ${sl.mediationFee.toLocaleString("en-IN")}` : "0.35% of Claim"}
                      </td>
                      <td style={{ padding: "12px 14px", color: "var(--ink)", fontWeight: 500 }}>
                        {sl.fastTrackArbitrationFee ? `₹ ${sl.fastTrackArbitrationFee.toLocaleString("en-IN")} (${sl.arbitratorType})` : sl.fastTrackArbitrationDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CostCalculator;