/**
 * Premium Case Assessment Brief Dashboard (LegalOutcomeReport.jsx)
 * Institutional Legal Outcome & Statutory Risk Report
 *
 * Design Language:
 * - Navy (#0b1b31) & Gold (#d19a34)
 * - Serif headings (Newsreader/Georgia)
 * - Monospace tags & metadata
 * - Dual qualitative strength dials
 * - Interactive Limitation timeline bar
 * - 3-Process comparison table matching /fee-schedule
 * - Printable PDF brief export
 */

import { useState, useEffect } from "react";
import logo from "../assets/logo1.jpeg";

function getStrengthLevelIndex(level) {
  const norm = String(level || "").toLowerCase();
  if (norm.includes("strong")) return 3;
  if (norm.includes("moderate")) return 2;
  if (norm.includes("weak")) return 1;
  return 2;
}

function getOutlookBadgeStyle(rating) {
  const norm = String(rating || "").toLowerCase();
  if (norm.includes("full recovery")) {
    return { bg: "#dcfce7", color: "#15803d", border: "#86efac" };
  }
  if (norm.includes("substantial")) {
    return { bg: "rgba(209, 154, 52, 0.15)", color: "var(--gold-deep)", border: "rgba(209, 154, 52, 0.4)" };
  }
  if (norm.includes("partial")) {
    return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
  }
  return { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" };
}

function getFormattedPrintTimestamp() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  return `${dateStr}, ${timeStr}`;
}

export default function LegalOutcomeReport({ report, onReset }) {
  const [copied, setCopied] = useState(false);
  const [printDateTime, setPrintDateTime] = useState(getFormattedPrintTimestamp);

  useEffect(() => {
    const handleBeforePrint = () => {
      setPrintDateTime(getFormattedPrintTimestamp());
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, []);

  if (!report) return null;

  const isLiveClaude = Boolean(report.isLiveAI || String(report.requestId || "").startsWith("JN-AI-"));
  const limitation = report.limitation || {};
  const section12A = report.section12A || {};
  const msmed = report.msmed || {};
  const forum = report.forumRecommendation || {};
  const processComparison = report.processComparison || [];
  const claimantStrength = report.claimStrength || { rating: "Moderate", reasons: [] };
  const defenceStrength = report.defenceStrength || { rating: "Moderate", reasons: [] };
  const settlementOutlook = report.settlementOutlook || {
    rating: "Substantial partial recovery likely",
    explanation: "Substantive documentary record supports principal recovery, subject to procedural negotiations."
  };

  const handleCopy = () => {
    const plainText = `JUSTNIVARAN AI DISPUTE ASSESSMENT — CASE ASSESSMENT BRIEF
Dossier ID: ${report.requestId}
Engine Type: ${isLiveClaude ? "AI-assisted assessment (Claude)" : "Rules-engine assessment"}
Generated: ${new Date(report.generatedAt).toLocaleString("en-IN")} IST
Dispute Category: ${report.category}
Claim Quantum: ${report.claimQuantumFormatted}

1. RECOMMENDED FORUM:
${forum.recommendedForum} (${forum.statutoryBasis})
Rationale: ${forum.rationale}

2. STATUTORY LIMITATION CLOCK (Limitation Act, 1963):
Status: ${limitation.status}
Breach Date: ${limitation.breachDate} | Expiry: ${limitation.expiryDate}
Days Remaining: ${limitation.daysRemaining} days

3. SECTION 12A COMMERCIAL COURTS ACT, 2015:
Status: ${section12A.status}

4. MSMED ACT, 2006 (SECTIONS 15, 16, 18 & 19):
Applicable: ${msmed.applicable ? "YES" : "NO"}
${msmed.applicable ? `Appointed Day: ${msmed.appointedDay} | Indicative Overdue Interest: ₹${msmed.estimatedStatutoryInterest?.toLocaleString("en-IN")}` : ""}

5. QUALITATIVE STRENGTH EVALUATION:
Claimant Strength: ${claimantStrength.rating}
Defence Strength: ${defenceStrength.rating}
Settlement Outlook: ${settlementOutlook.rating} (${settlementOutlook.explanation})

DISCLAIMER: ${report.disclaimer || "AI-assisted indicative assessment. Not legal advice."}`;

    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    setPrintDateTime(getFormattedPrintTimestamp());
    window.print();
  };

  return (
    <div
      className="case-assessment-brief-report"
      style={{
        background: "#ffffff",
        border: "1px solid var(--line)",
        borderRadius: "10px",
        padding: "36px",
        boxShadow: "0 10px 30px rgba(11, 27, 49, 0.06)",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        position: "relative"
      }}
    >
      {/* Light diagonal watermark for print view */}
      <div className="print-watermark" aria-hidden="true">
        JustNivaran
      </div>

      <table className="print-report-table">
        <tfoot className="print-report-tfoot">
          <tr>
            <td>
              <div className="print-running-footer">
                Downloaded from justnivaran-odr.vercel.app on {printDateTime} | Report ID {report.requestId || "JN-AI-962779"} | AI-assisted indicative assessment. Not legal advice.
              </div>
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>
              {/* Official Letterhead Header (Top of Report in Print) */}
              <div className="brief-print-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <img
                      src={logo}
                      alt="JustNivaran Logo"
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "contain",
                        borderRadius: "6px",
                        border: "1px solid var(--line)"
                      }}
                    />
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", letterSpacing: "0.04em", fontFamily: "var(--serif, Georgia, serif)", textTransform: "uppercase" }}>
                        JustNivaran Online Dispute Resolution Centre
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--slate)", fontFamily: "var(--mono, monospace)", letterSpacing: "0.03em" }}>
                        Case Assessment Brief &bull; Statutory &amp; Evidentiary Dispute Dossier
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontSize: "11px", fontFamily: "var(--mono, monospace)", color: "var(--slate)" }}>
                    <div>Dossier ID: <strong style={{ color: "var(--ink)" }}>{report.requestId}</strong></div>
                    <div>Dispute Quantum: <strong style={{ color: "var(--ink)" }}>{report.claimQuantumFormatted}</strong></div>
                  </div>
                </div>
                <div style={{ height: "2px", background: "linear-gradient(90deg, var(--gold), #f0e0c2, var(--gold))", marginTop: "12px", marginBottom: "16px" }} />
              </div>

              {/* Top Action Header Bar (Screen Only) */}
              <div
                className="no-print"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  borderBottom: "1px solid var(--line)",
                  paddingBottom: "20px",
                  marginBottom: "28px"
                }}
              >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Dossier ID: <strong style={{ color: "var(--ink)" }}>{report.requestId}</strong>
            </span>

            {/* Strict engineType badge — never a combined label */}
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "16px",
                background: isLiveClaude ? "rgba(34, 197, 94, 0.12)" : "rgba(209, 154, 52, 0.12)",
                color: isLiveClaude ? "#15803d" : "var(--gold-deep)",
                border: `1px solid ${isLiveClaude ? "rgba(34, 197, 94, 0.35)" : "rgba(209, 154, 52, 0.35)"}`
              }}
            >
              {isLiveClaude ? "AI-assisted assessment (Claude)" : "Rules-engine assessment"}
            </span>
          </div>

          <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>
            Generated: {new Date(report.generatedAt).toLocaleString("en-IN")} IST &bull; Dispute Quantum: <strong>{report.claimQuantumFormatted}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn ghost"
            style={{ padding: "8px 14px", fontSize: "12.5px" }}
          >
            {copied ? "✓ Copied to Clipboard" : "📋 Copy Dossier"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn ghost"
            style={{ padding: "8px 14px", fontSize: "12.5px" }}
          >
            🖨️ Download / Print Brief
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn gold"
            style={{ padding: "8px 16px", fontSize: "12.5px", fontWeight: 600 }}
          >
            ↺ New Assessment
          </button>
        </div>
      </div>

      {/* 1. Headline Institutional Recommendation Card */}
      <section
        className="avoid-page-break"
        style={{
          background: "linear-gradient(135deg, rgba(11, 27, 49, 0.03) 0%, rgba(209, 154, 52, 0.07) 100%)",
          border: "1px solid rgba(209, 154, 52, 0.35)",
          borderRadius: "8px",
          padding: "24px 28px",
          marginBottom: "32px",
          position: "relative"
        }}
      >
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
          Recommended Resolution Pathway
        </div>
        <h2 style={{ fontSize: "24px", color: "var(--ink)", margin: "0 0 8px 0", fontFamily: "var(--serif, Georgia, serif)" }}>
          {forum.recommendedForum || "Institutional Commercial Mediation"}
        </h2>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--slate)", marginBottom: "12px" }}>
          Statutory Framework: <span style={{ color: "var(--ink)" }}>{forum.statutoryBasis}</span>
        </div>
        <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.65", margin: 0 }}>
          {forum.rationale}
        </p>

        {section12A.statutoryAdvisory && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              fontSize: "12.5px",
              color: "var(--slate)",
              lineHeight: "1.5"
            }}
          >
            ⚖️ <strong>Statutory Note on Section 12A:</strong> {section12A.statutoryAdvisory}
          </div>
        )}
      </section>

      {/* 2. Dual Strength Gauges (Claimant vs Defence) */}
      <section className="avoid-page-break" style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          Statutory Strength Evaluation (Qualitative Bands Only)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {/* Claimant Strength Card */}
          <div style={{ background: "#fafbfc", border: "1px solid var(--line)", borderRadius: "8px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>
                Claimant's Case Strength
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "var(--mono)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: claimantStrength.rating === "Strong" ? "#dcfce7" : claimantStrength.rating === "Moderate" ? "#fef3c7" : "#fee2e2",
                  color: claimantStrength.rating === "Strong" ? "#15803d" : claimantStrength.rating === "Moderate" ? "#b45309" : "#b91c1c"
                }}
              >
                {claimantStrength.rating}
              </span>
            </div>

            {/* Visual 3-Segment Gauge */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: getStrengthLevelIndex(claimantStrength.rating) >= 1 ? "#ef4444" : "#e2e8f0" }} />
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: getStrengthLevelIndex(claimantStrength.rating) >= 2 ? "#f59e0b" : "#e2e8f0" }} />
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: getStrengthLevelIndex(claimantStrength.rating) >= 3 ? "#10b981" : "#e2e8f0" }} />
            </div>

            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
              {claimantStrength.reasons.map((r, i) => (
                <li key={i} style={{ marginBottom: "6px" }}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Defence Strength Card */}
          <div style={{ background: "#fafbfc", border: "1px solid var(--line)", borderRadius: "8px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>
                Respondent's Substantive Defense
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "var(--mono)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: defenceStrength.rating === "Strong" ? "#fee2e2" : defenceStrength.rating === "Moderate" ? "#fef3c7" : "#dcfce7",
                  color: defenceStrength.rating === "Strong" ? "#b91c1c" : defenceStrength.rating === "Moderate" ? "#b45309" : "#15803d"
                }}
              >
                {defenceStrength.rating}
              </span>
            </div>

            {/* Visual 3-Segment Gauge */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: getStrengthLevelIndex(defenceStrength.rating) >= 1 ? "#10b981" : "#e2e8f0" }} />
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: getStrengthLevelIndex(defenceStrength.rating) >= 2 ? "#f59e0b" : "#e2e8f0" }} />
              <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: getStrengthLevelIndex(defenceStrength.rating) >= 3 ? "#ef4444" : "#e2e8f0" }} />
            </div>

            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
              {defenceStrength.reasons.map((r, i) => (
                <li key={i} style={{ marginBottom: "6px" }}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Statutory Limitation Clock Bar (Limitation Act, 1963) */}
      <section className="avoid-page-break" style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "8px", padding: "22px 24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Limitation Clock &bull; Articles 55 &amp; 113, Limitation Act, 1963
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "var(--mono)",
              padding: "4px 10px",
              borderRadius: "4px",
              background: limitation.status === "In time" ? "#dcfce7" : limitation.status === "Close to expiry" ? "#fef3c7" : "#fee2e2",
              color: limitation.status === "In time" ? "#15803d" : limitation.status === "Close to expiry" ? "#b45309" : "#b91c1c"
            }}
          >
            {limitation.label || limitation.status}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ width: "100%", height: "10px", background: "#e2e8f0", borderRadius: "5px", overflow: "hidden", marginBottom: "14px" }}>
          <div
            style={{
              width: limitation.status === "Likely barred" ? "100%" : `${Math.min(100, Math.max(10, ((1095 - (limitation.daysRemaining || 0)) / 1095) * 100))}%`,
              height: "100%",
              background: limitation.status === "Likely barred" ? "#ef4444" : limitation.status === "Close to expiry" ? "#f59e0b" : "var(--gold)",
              transition: "width 0.4s ease"
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "12.5px", color: "var(--slate)" }}>
          <div>Breach Accrued: <strong style={{ color: "var(--ink)" }}>{limitation.breachDate}</strong></div>
          <div>Effective Expiry: <strong style={{ color: "var(--ink)" }}>{limitation.expiryDate}</strong></div>
          <div>
            Days Remaining:{" "}
            <strong style={{ color: limitation.daysRemaining <= 90 ? "#b91c1c" : "var(--ink)", fontFamily: "var(--mono)" }}>
              {limitation.daysRemaining !== null ? `${limitation.daysRemaining} Days` : "N/A"}
            </strong>
          </div>
          <div>COVID Exclusion: <strong>{limitation.covidExcludedDays ? `${limitation.covidExcludedDays} Days Excluded` : "None"}</strong></div>
        </div>

        {limitation.acknowledgmentReviewNote && (
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#334155", background: "#f8fafc", padding: "10px 14px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
            📝 <strong>Section 18 Limitation Note:</strong> {limitation.acknowledgmentReviewNote}
          </div>
        )}
      </section>

      {/* 4. MSMED Act Statutory Benefit Card (If applicable) */}
      {msmed.applicable && (
        <section
          className="avoid-page-break"
          style={{
            background: "rgba(209, 154, 52, 0.05)",
            border: "1px solid rgba(209, 154, 52, 0.35)",
            borderRadius: "8px",
            padding: "22px 24px",
            marginBottom: "32px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              MSMED Act 2006 &bull; Sections 15, 16 &amp; 18 Statutory Rights
            </span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)" }}>
              Registered {msmed.enterpriseType} Enterprise
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "14px" }}>
            <div>
              <div style={{ fontSize: "11.5px", color: "var(--slate)" }}>Section 15 Appointed Day</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--mono)" }}>
                {msmed.appointedDay}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11.5px", color: "var(--slate)" }}>Statutory Interest Rate (3x RBI)</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--gold-deep)", fontFamily: "var(--mono)" }}>
                {msmed.statutoryInterestRatePercent} p.a.
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11.5px", color: "var(--slate)" }}>Indicative Overdue Interest</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--mono)" }}>
                ₹ {msmed.estimatedStatutoryInterest?.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11.5px", color: "var(--slate)" }}>Total Claim + Interest</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#15803d", fontFamily: "var(--mono)" }}>
                ₹ {msmed.totalClaimWithInterest?.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <p style={{ fontSize: "12.5px", color: "#334155", margin: "0 0 10px 0", lineHeight: "1.5" }}>
            {msmed.interestStartExplanation}
          </p>

          <div style={{ fontSize: "12px", color: "var(--slate)", background: "#ffffff", padding: "10px 14px", borderRadius: "4px", border: "1px solid var(--line)" }}>
            ⚖️ {msmed.section19PreDepositRule}
          </div>
        </section>
      )}

      {/* 5. Qualitative Settlement Outlook & Probable Outcome Scenarios */}
      <section className="avoid-page-break" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Settlement Outlook &amp; Probable Scenarios
          </div>

          {/* Qualitative Settlement Outlook Badge (NO percentages, NO rupee figures from AI) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              borderRadius: "16px",
              ...getOutlookBadgeStyle(settlementOutlook.rating),
              fontSize: "12px",
              fontWeight: 700
            }}
          >
            <span>Settlement Outlook: {settlementOutlook.rating}</span>
          </div>
        </div>

        <div style={{ fontSize: "13px", color: "var(--slate)", marginBottom: "16px", fontStyle: "italic" }}>
          "{settlementOutlook.explanation}"
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {(report.likelyOutcomeScenarios || []).map((sc, idx) => (
            <div
              key={idx}
              style={{
                background: "#fafbfc",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--ink)" }}>
                    Scenario {String.fromCharCode(65 + idx)}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "var(--mono)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: sc.likelihood === "High" ? "#dcfce7" : sc.likelihood === "Medium" ? "#fef3c7" : "#fee2e2",
                      color: sc.likelihood === "High" ? "#15803d" : sc.likelihood === "Medium" ? "#b45309" : "#b91c1c"
                    }}
                  >
                    Likelihood: {sc.likelihood}
                  </span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  {sc.scenario}
                </div>
                <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.55", margin: 0 }}>
                  {sc.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Evidentiary Record & Procedural Gaps */}
      <section className="avoid-page-break" style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "8px", padding: "22px 24px", marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>
          Evidentiary Checklist &amp; Identified Gaps
        </div>

        {report.claimantGaps && report.claimantGaps.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#b45309", marginBottom: "8px" }}>
              ⚠️ Procedural Omissions &amp; Proof Deficiencies:
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
              {report.claimantGaps.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        )}

        {report.evidenceGaps && report.evidenceGaps.length > 0 && (
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
              📋 Evidentiary Requirements to Satisfy Before Filing:
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
              {report.evidenceGaps.map((gap, idx) => (
                <li key={idx}>{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {(!report.claimantGaps || report.claimantGaps.length === 0) &&
          (!report.evidenceGaps || report.evidenceGaps.length === 0) && (
            <div style={{ fontSize: "13px", color: "#15803d", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>✓</span>
              <span>All baseline documentary evidence on record. No procedural gaps detected for intake.</span>
            </div>
        )}
      </section>

      {/* 7. Statutory Process & Authoritative Fee Comparison Table */}
      <section className="avoid-page-break" style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            ADR Process &amp; Fee Schedule Comparison
          </div>
          <span style={{ fontSize: "12px", color: "var(--slate)" }}>
            Authoritative Institutional Fee Schedule v2.4 (Excl. 18% GST)
          </span>
        </div>

        <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--ink)", color: "#ffffff" }}>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Dispute Track</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Timeline</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Base Fee</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Total (18% GST)</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Consent Requirement</th>
              </tr>
            </thead>
            <tbody>
              {processComparison.map((p, idx) => (
                <tr key={p.processId || idx} style={{ borderBottom: "1px solid var(--line)", background: idx % 2 === 1 ? "#fafbfc" : "#ffffff" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--ink)" }}>
                    {p.name}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--slate)" }}>
                    {p.timeline}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--mono)", color: "var(--ink)" }}>
                    ₹ {p.baseFee?.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--mono)", fontWeight: 700, color: "var(--gold-deep)" }}>
                    ₹ {p.totalWithGst?.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "#475569" }}>
                    {p.consentRequirement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Mandatory Statutory Disclaimer */}
      <div
        className="avoid-page-break"
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          padding: "16px 20px",
          fontSize: "12px",
          color: "var(--slate)",
          lineHeight: "1.6",
          marginBottom: "28px"
        }}
      >
        <strong>Statutory Notice &amp; Legal Disclaimer:</strong> {report.disclaimer || "AI-assisted indicative assessment. Not legal advice. Outcomes depend on evidence and the neutral's independent adjudication."}
      </div>

      {/* 9. Final Institutional Action Buttons (Screen Only) */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <button
          type="button"
          onClick={handlePrint}
          className="btn ghost"
          style={{ padding: "12px 24px", fontSize: "14px" }}
        >
          📄 Download Case Assessment Brief (PDF)
        </button>

        <a
          href="/#arbitration-filing"
          className="btn gold"
          style={{
            padding: "12px 28px",
            fontSize: "14.5px",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block"
          }}
        >
          Proceed to File with Digital Registry →
        </a>
      </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
