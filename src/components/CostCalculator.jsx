import { useState } from "react";

function CostCalculator({ onOpenFileModal }) {
  const [claimAmount, setClaimAmount] = useState(1000000);

  const courtCost = Math.round(claimAmount * 0.18 + 150000);
  const odrCost = Math.round(claimAmount * 0.035 + 15000);
  const savings = courtCost - odrCost;

  return (
    <section className="section" id="calculator" style={{ background: "var(--paper-hi)", borderTop: "var(--rail)" }}>
      <div className="wrap two">
        {/* Left Column: Heading, Lede, and Slider */}
        <div>
          <p className="eyebrow">
            <b>Economic Value</b> Dispute Cost &amp; Timeline Comparison
          </p>
          <h2>Compare Court Litigation vs. JustNivaran ODR</h2>
          <p className="lede" style={{ margin: "16px 0 24px" }}>
            Traditional litigation drains working capital in legal fees and multi-year delays. Move the slider to see the real numbers for your claim value.
          </p>

          {/* Interactive Slider Box */}
          <div style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(18, 41, 74, .04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
              <label style={{ fontFamily: "var(--mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--slate)" }}>
                Claim Value (INR)
              </label>
              <span style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--ink)", fontWeight: 500 }}>
                ₹ {Number(claimAmount).toLocaleString("en-IN")}
              </span>
            </div>

            <input
              type="range"
              min="100000"
              max="10000000"
              step="100000"
              value={claimAmount}
              onChange={(e) => setClaimAmount(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--gold)", cursor: "pointer" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", marginTop: "6px" }}>
              <span>₹ 1 Lakh</span>
              <span>₹ 50 Lakhs</span>
              <span>₹ 1 Crore</span>
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <button className="btn gold" onClick={onOpenFileModal} type="button" style={{ width: "100%" }}>
              File Dispute Under ODR →
            </button>
          </div>
        </div>

        {/* Right Column: Comparative Expense Cards */}
        <div style={{ display: "grid", gap: "16px" }}>
          {/* Traditional Court Box */}
          <div style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            padding: "20px"
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10.5px", color: "#C0392B", textTransform: "uppercase", marginBottom: "4px", letterSpacing: ".1em" }}>
              Traditional Court Litigation
            </div>
            <h3 style={{ fontSize: "22px", margin: "0 0 12px" }}>
              ₹ {courtCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "var(--slate)", fontWeight: "normal" }}>est. expense</small>
            </h3>
            <div style={{ fontSize: "13px", color: "#3B4E68", display: "grid", gap: "8px" }}>
              <div>⏱️ <strong>Resolution Time:</strong> 3 to 6 Years</div>
              <div>📍 <strong>Hearings:</strong> 25+ in-person court appearances</div>
              <div>📄 <strong>Advocate Costs:</strong> Per-hearing billings &amp; adjournments</div>
            </div>
          </div>

          {/* JustNivaran ODR Box */}
          <div style={{
            background: "var(--ink-deep)",
            color: "#fff",
            borderRadius: "4px",
            padding: "20px",
            border: "1px solid var(--gold)",
            boxShadow: "0 10px 24px rgba(11, 27, 49, .2)"
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10.5px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "4px", letterSpacing: ".1em" }}>
              JustNivaran ODR Platform
            </div>
            <h3 style={{ fontSize: "22px", margin: "0 0 12px", color: "#fff" }}>
              ₹ {odrCost.toLocaleString("en-IN")} <small style={{ fontSize: "11px", color: "var(--gold-soft)", fontWeight: "normal" }}>flat schedule</small>
            </h3>
            <div style={{ fontSize: "13px", color: "#AEC0D6", display: "grid", gap: "8px" }}>
              <div>⏱️ <strong>Resolution Time:</strong> 3 to 8 Weeks</div>
              <div>📍 <strong>Hearings:</strong> 100% Remote Video Sessions</div>
              <div>💰 <strong>Direct Savings:</strong> <span style={{ color: "var(--gold)", fontWeight: 600 }}>₹ {savings.toLocaleString("en-IN")} saved</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CostCalculator;