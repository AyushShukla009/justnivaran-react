import { useState } from "react";

function CostCalculator({ onOpenFileModal }) {
  const [claimAmount, setClaimAmount] = useState(1000000);
  const [showFeeTable, setShowFeeTable] = useState(false);

  const courtCost = Math.round(claimAmount * 0.18 + 150000);
  const odrCost = Math.round(claimAmount * 0.035 + 15000);
  const savings = courtCost - odrCost;

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
              Traditional litigation drains working capital in multi-year procedural delays. Adjust the claim value to inspect illustrative operational benchmarks.
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
              ℹ️ Illustrative operational targets—not guaranteed resolution timelines.
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
                JustNivaran ODR Platform
              </div>
              <h3 style={{ fontSize: "22px", margin: "0 0 12px", color: "#fff" }}>
                ₹ {odrCost.toLocaleString("en-IN")}{" "}
                <small style={{ fontSize: "11px", color: "var(--gold-soft)", fontWeight: "normal" }}>
                  statutory capped scale
                </small>
              </h3>
              <div style={{ fontSize: "13px", color: "#AEC0D6", display: "grid", gap: "8px" }}>
                <div>⏱️ <strong>Target Timeline:</strong> 4 to 8 Weeks (Target Fast-Track Benchmark)*</div>
                <div>📍 <strong>Hearings:</strong> 100% Encrypted Virtual Video Rooms</div>
                <div>
                  💰 <strong>Estimated Model Savings:</strong>{" "}
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                    ₹ {savings.toLocaleString("en-IN")} (Illustrative Model)*
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "var(--slate)", margin: "16px 0 0", lineHeight: "1.5" }}>
          *Disclaimer: Traditional litigation costs and timeframes are illustrative estimates derived from National Judicial Data Grid (NJDG) commercial dispute averages and statutory court fee ad-valorem schedules. JustNivaran timelines represent target administrative benchmarks and do not constitute a legal guarantee of dispute duration or outcome.
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
                  STATUTORY ADMINISTRATIVE FEE STRUCTURE
                </span>
                <h3 style={{ fontSize: "19px", margin: "4px 0 0", color: "var(--ink)" }}>
                  Institutional Fee Schedule (Model Fourth Schedule)
                </h3>
              </div>
              <span style={{ fontSize: "12px", color: "var(--slate)" }}>*Capped statutory neutral honorarium</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--paper-hi)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Claim Value Slab</th>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Mediation Fee</th>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Fast-Track Arbitration Fee</th>
                    <th style={{ padding: "10px 14px", color: "var(--slate)", fontFamily: "var(--mono)", textTransform: "uppercase", fontSize: "10.5px" }}>Statutory Turnaround</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 500 }}>Up to ₹ 5,00,000 (MSME Tier)</td>
                    <td style={{ padding: "12px 14px", color: "#1E8449" }}>₹ 4,500 flat</td>
                    <td style={{ padding: "12px 14px", color: "var(--ink)" }}>₹ 8,500 flat</td>
                    <td style={{ padding: "12px 14px", fontFamily: "var(--mono)" }}>15 - 30 Days</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 500 }}>₹ 5,00,001 to ₹ 25,00,000</td>
                    <td style={{ padding: "12px 14px", color: "#1E8449" }}>₹ 12,000 flat</td>
                    <td style={{ padding: "12px 14px", color: "var(--ink)" }}>₹ 22,500 flat</td>
                    <td style={{ padding: "12px 14px", fontFamily: "var(--mono)" }}>30 - 45 Days</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 500 }}>₹ 25,00,001 to ₹ 1,00,00,000</td>
                    <td style={{ padding: "12px 14px", color: "#1E8449" }}>₹ 25,000 + 0.5%</td>
                    <td style={{ padding: "12px 14px", color: "var(--ink)" }}>₹ 45,000 + 1%</td>
                    <td style={{ padding: "12px 14px", fontFamily: "var(--mono)" }}>45 - 60 Days</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 14px", fontWeight: 500 }}>Above ₹ 1,00,00,000 (Commercial)</td>
                    <td style={{ padding: "12px 14px", color: "#1E8449" }}>Capped Schedule</td>
                    <td style={{ padding: "12px 14px", color: "var(--ink)" }}>S. 29B Flat Schedule</td>
                    <td style={{ padding: "12px 14px", fontFamily: "var(--mono)" }}>60 - 90 Days</td>
                  </tr>
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