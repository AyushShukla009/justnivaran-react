import { useState } from "react";
import { MANDATORY_LEGAL_DISCLAIMER } from "../lib/legalAssessmentValidation";

function getStrengthBadgeStyle(level) {
  const norm = String(level || "").toLowerCase();
  if (norm.includes("strong") && !norm.includes("moderate")) {
    return { bg: "#dcfce7", color: "#15803d", border: "#86efac" };
  }
  if (norm.includes("moderate–strong") || norm.includes("moderate-strong")) {
    return { bg: "rgba(209, 154, 52, 0.15)", color: "var(--gold-deep)", border: "rgba(209, 154, 52, 0.4)" };
  }
  if (norm.includes("moderate")) {
    return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
  }
  if (norm.includes("weak")) {
    return { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" };
  }
  return { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" };
}

function getLikelihoodBadgeStyle(band) {
  const norm = String(band || "").toLowerCase();
  if (norm.includes("more likely")) {
    return { bg: "#dcfce7", color: "#15803d" };
  }
  if (norm.includes("plausible")) {
    return { bg: "rgba(209, 154, 52, 0.15)", color: "var(--gold-deep)" };
  }
  if (norm.includes("less likely")) {
    return { bg: "#fee2e2", color: "#b91c1c" };
  }
  return { bg: "#f1f5f9", color: "#475569" };
}

export default function LegalOutcomeReport({ report, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopy = () => {
    const plainText = `JUSTNIVARAN LEGAL OUTCOME AI PREDICTOR — ASSESSMENT DOSSIER
Reference: ${report.requestId}
Date: ${new Date(report.generatedAt).toLocaleString("en-IN")}
Confidence: ${report.confidenceBand}
Model: ${report.modelUsed || "Gemini"}

--- EXECUTIVE SUMMARY ---
${report.assessmentSummary}

--- STRENGTH EVALUATION ---
- Claimant Strength: ${report.claimantStrength}
- Defence Strength: ${report.defenceStrength}
- Evidence Readiness: ${report.evidenceReadiness}

--- LIKELY OUTCOME SCENARIOS ---
${report.likelyOutcomeScenarios?.map((s, idx) => `${idx + 1}. ${s.scenarioName} [${s.likelihoodBand}]\n   Reasons: ${s.supportingReasons}\n   Risks: ${s.contraryFactors}`).join("\n\n")}

--- VERIFIED LEGAL AUTHORITIES ---
${report.verifiedAuthorities?.map((a) => `- ${a.caseName} (${a.citation})\n  Proposition: ${a.legalProposition}\n  URL: ${a.sourceUrl}`).join("\n\n")}

--- DISCLAIMER ---
${MANDATORY_LEGAL_DISCLAIMER}
`;
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const claimantStyle = getStrengthBadgeStyle(report.claimantStrength);
  const defenceStyle = getStrengthBadgeStyle(report.defenceStrength);
  const evidenceStyle = getStrengthBadgeStyle(report.evidenceReadiness);

  return (
    <div
      className="ai-outcome-report"
      style={{
        background: "#ffffff",
        border: "1px solid var(--line)",
        borderRadius: "8px",
        padding: "36px",
        boxShadow: "0 10px 30px rgba(11, 27, 49, 0.06)"
      }}
    >
      {/* Top Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "20px",
          marginBottom: "24px"
        }}
      >
        <div>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>
            Assessment Dossier &bull; {report.requestId}
          </span>
          <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "2px" }}>
            Generated: {new Date(report.generatedAt).toLocaleString("en-IN")} IST &bull; Confidence: <strong>{report.confidenceBand}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn ghost"
            style={{ padding: "7px 14px", fontSize: "12.5px" }}
          >
            {copied ? "✓ Copied to Clipboard" : "📋 Copy Dossier"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn ghost"
            style={{ padding: "7px 14px", fontSize: "12.5px" }}
          >
            🖨️ Print Dossier
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn gold"
            style={{ padding: "7px 14px", fontSize: "12.5px" }}
          >
            🔄 New Assessment
          </button>
        </div>
      </div>

      {/* Top Disclaimer Notice */}
      <div
        style={{
          background: "rgba(209, 154, 52, 0.08)",
          border: "1px solid rgba(209, 154, 52, 0.35)",
          borderRadius: "6px",
          padding: "14px 18px",
          marginBottom: "32px",
          fontSize: "12px",
          lineHeight: "1.6",
          color: "var(--ink)"
        }}
      >
        <strong>MANDATORY STATUTORY NOTICE:</strong> {MANDATORY_LEGAL_DISCLAIMER}
      </div>

      {/* Strength & Readiness Scorecards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}
      >
        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>
            Claimant Position Strength
          </span>
          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "13px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "4px",
                background: claimantStyle.bg,
                color: claimantStyle.color,
                border: `1px solid ${claimantStyle.border}`
              }}
            >
              {report.claimantStrength}
            </span>
          </div>
        </div>

        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>
            Expected Defence Exposure
          </span>
          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "13px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "4px",
                background: defenceStyle.bg,
                color: defenceStyle.color,
                border: `1px solid ${defenceStyle.border}`
              }}
            >
              {report.defenceStrength}
            </span>
          </div>
        </div>

        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>
            Evidentiary Completeness
          </span>
          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "13px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "4px",
                background: evidenceStyle.bg,
                color: evidenceStyle.color,
                border: `1px solid ${evidenceStyle.border}`
              }}
            >
              {report.evidenceReadiness}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Assessment Summary */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
          1. AI Assessment Summary
        </h3>
        <p style={{ fontSize: "14px", color: "#2d3748", lineHeight: "1.7", whiteSpace: "pre-line", margin: 0 }}>
          {report.assessmentSummary}
        </p>
      </div>

      {/* 2. Key Legal Issues */}
      {report.legalIssues && report.legalIssues.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
            2. Primary Legal &amp; Contractual Issues
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            {report.legalIssues.map((issue, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--paper-hi)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px"
                }}
              >
                <div>
                  <strong style={{ fontSize: "14px", color: "var(--ink)" }}>{issue.issueTitle}</strong>
                  <div style={{ fontSize: "12.5px", color: "var(--slate)", marginTop: "4px" }}>
                    Legal Foundation: {issue.legalBasis}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "3px",
                    background: issue.riskLevel === "High" ? "#fee2e2" : issue.riskLevel === "Medium" ? "#fef3c7" : "#dcfce7",
                    color: issue.riskLevel === "High" ? "#b91c1c" : issue.riskLevel === "Medium" ? "#b45309" : "#15803d"
                  }}
                >
                  {issue.riskLevel} Risk
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Likely Outcome Scenarios */}
      {report.likelyOutcomeScenarios && report.likelyOutcomeScenarios.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
            3. Probable Outcome Scenarios
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {report.likelyOutcomeScenarios.map((sc, idx) => {
              const scBadge = getLikelihoodBadgeStyle(sc.likelihoodBand);
              return (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid var(--line)",
                    borderRadius: "6px",
                    padding: "18px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h4 style={{ fontSize: "15px", color: "var(--ink)", margin: 0 }}>{sc.scenarioName}</h4>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "3px",
                        background: scBadge.bg,
                        color: scBadge.color
                      }}
                    >
                      {sc.likelihoodBand}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#3B4E68", lineHeight: "1.6", display: "grid", gap: "6px" }}>
                    <div>
                      <strong style={{ color: "var(--ink)" }}>Supporting Factors:</strong> {sc.supportingReasons}
                    </div>
                    {sc.contraryFactors && (
                      <div>
                        <strong style={{ color: "var(--ink)" }}>Counter Arguments / Vulnerabilities:</strong> {sc.contraryFactors}
                      </div>
                    )}
                    {sc.additionalEvidenceRequired && (
                      <div>
                        <strong style={{ color: "var(--ink)" }}>Required Evidence:</strong> {sc.additionalEvidenceRequired}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Verified Legal Authorities */}
      {report.verifiedAuthorities && report.verifiedAuthorities.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", color: "var(--ink)", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
            4. Verified Legal Authorities &amp; Judicial Precedents
          </h3>
          <div style={{ display: "grid", gap: "14px" }}>
            {report.verifiedAuthorities.map((auth, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--paper-hi)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  padding: "16px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div>
                    <a
                      href={auth.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "14.5px",
                        fontWeight: 700,
                        color: "var(--ink)",
                        textDecoration: "underline",
                        textDecorationColor: "var(--gold)"
                      }}
                    >
                      {auth.caseName} ↗
                    </a>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold-deep)", marginTop: "2px" }}>
                      {auth.citation} &bull; {auth.court} ({auth.judgmentDate})
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "#3B4E68", margin: "8px 0 6px", lineHeight: "1.5" }}>
                  <strong>Legal Proposition:</strong> {auth.legalProposition}
                </p>
                {auth.applicationToDispute && (
                  <p style={{ fontSize: "12.5px", color: "var(--slate)", margin: 0, fontStyle: "italic" }}>
                    Application: {auth.applicationToDispute}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Evidentiary Gaps & Settlement Considerations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
        {report.evidenceGaps && report.evidenceGaps.length > 0 && (
          <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px" }}>
            <h4 style={{ fontSize: "14.5px", color: "var(--ink)", margin: "0 0 10px" }}>
              ⚠️ Evidentiary Gaps to Address
            </h4>
            <ul style={{ fontSize: "12.5px", color: "#3B4E68", paddingLeft: "18px", margin: 0, lineHeight: "1.6" }}>
              {report.evidenceGaps.map((gap, idx) => (
                <li key={idx}>{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {report.settlementConsiderations && report.settlementConsiderations.length > 0 && (
          <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px" }}>
            <h4 style={{ fontSize: "14.5px", color: "var(--ink)", margin: "0 0 10px" }}>
              🤝 Settlement Opportunities
            </h4>
            <ul style={{ fontSize: "12.5px", color: "#3B4E68", paddingLeft: "18px", margin: 0, lineHeight: "1.6" }}>
              {report.settlementConsiderations.map((sc, idx) => (
                <li key={idx}>{sc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 6. Assumptions and Limitations */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "16px", marginBottom: "32px" }}>
        <h4 style={{ fontSize: "13.5px", color: "#334155", margin: "0 0 8px" }}>
          Analytical Assumptions &amp; Algorithmic Limitations
        </h4>
        <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6" }}>
          {report.assumptions?.length > 0 && (
            <div style={{ marginBottom: "6px" }}>
              <strong>Assumptions:</strong> {report.assumptions.join("; ")}
            </div>
          )}
          {report.limitations?.length > 0 && (
            <div>
              <strong>Limitations:</strong> {report.limitations.join("; ")}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div
        style={{
          borderTop: "1px solid var(--line)",
          paddingTop: "20px",
          fontSize: "11.5px",
          color: "var(--slate)",
          lineHeight: "1.6",
          textAlign: "center"
        }}
      >
        {MANDATORY_LEGAL_DISCLAIMER}
      </div>
    </div>
  );
}
