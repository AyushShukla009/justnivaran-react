/**
 * JustNivaran Case Assessment Brief — neutral, judge-style.
 *
 * Structure (numbered paragraphs throughout, as in a reported judgment):
 *   I   Particulars
 *   II  Facts as stated
 *   III Statutory checks (rules engine)
 *   IV  Issues and analysis (both sides, applicable law, finding, evidence)
 *   V   Relevant precedents (verified case-bank entries only; hidden when none)
 *   VI  Points for determination and matters to verify
 *   VII Procedural route and fees
 *
 * It never shows outcome predictions, strength ratings, likelihoods or settlement outlook.
 */

import { useState, useEffect } from "react";
import logo from "../assets/logo1.jpeg";

function getFormattedPrintTimestamp() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${dateStr}, ${timeStr}`;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const S = {
  partLabel: { fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" },
  partTitle: { fontSize: "19px", color: "var(--ink)", margin: "0 0 14px", fontFamily: "var(--serif, Georgia, serif)", fontWeight: 600 },
  para: { display: "grid", gridTemplateColumns: "34px 1fr", gap: "6px", fontSize: "14.5px", color: "#24364F", lineHeight: 1.75, margin: "0 0 10px" },
  note: { fontSize: "12.5px", color: "var(--slate)", fontStyle: "italic", margin: "0 0 14px" },
  rowLabel: { fontFamily: "var(--mono)", fontSize: "11px", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: "3px" },
  cell: { padding: "10px 14px", borderBottom: "1px solid var(--line)", verticalAlign: "top", textAlign: "left" }
};

function Part({ n, title, children }) {
  return (
    <section style={{ marginBottom: "34px" }}>
      <p style={S.partLabel}>Part {ROMAN[n - 1]}</p>
      <h3 style={S.partTitle}>{title}</h3>
      {children}
    </section>
  );
}

export default function LegalOutcomeReport({ report, onReset }) {
  const [copied, setCopied] = useState(false);
  const [printDateTime, setPrintDateTime] = useState(getFormattedPrintTimestamp);

  useEffect(() => {
    const handleBeforePrint = () => setPrintDateTime(getFormattedPrintTimestamp());
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, []);

  if (!report) return null;

  const isLiveAI = Boolean(report.isLiveAI || String(report.requestId || "").startsWith("JN-AI-"));
  const brief = report.brief || { particulars: [], factsAsStated: [], statutoryChecks: [], issues: [], pointsForDetermination: [], procedure: {} };
  const msmed = report.msmed || {};
  const processComparison = report.processComparison || [];
  const precedents = (Array.isArray(report.relatedPrecedents) ? report.relatedPrecedents : []).filter((c) => c && c.verified === true && c.citation);
  const mattersToVerify = Array.from(
    new Set([...(report.claimantGaps || []), ...(report.evidenceGaps || []), ...(brief.assumptions || []).map((a) => `Assumption: ${a}`)])
  );
  const generated = report.generatedAt ? new Date(report.generatedAt) : null;

  // Continuous paragraph numbering across the whole brief
  // Numbering is done by a CSS counter (.brief-para) so it is stable on screen and in print
  const para = (key, children) => (
    <div key={key} className="brief-para" style={S.para}>
      <div>{children}</div>
    </div>
  );

  const factParas = [brief.statementOfFacts, ...(brief.statementOfFacts ? brief.factsAsStated.filter((f) => f.startsWith("Documents stated")) : brief.factsAsStated)].filter(Boolean);

  const handleCopy = () => {
    const lines = [
      "CASE ASSESSMENT BRIEF — JUSTNIVARAN ODR CENTRE",
      `Ref: ${report.requestId} | Prepared: ${generated ? `${generated.toLocaleString("en-IN")} IST` : ""} | ${isLiveAI ? "AI-assisted analysis, checked against rules engine" : "Rules engine"}`,
      "Neutral brief. Records issues, applicable law and evidence. Does not predict any outcome.",
      "",
      "I. PARTICULARS",
      ...brief.particulars.map((p) => `  ${p.label}: ${p.value}`),
      "",
      "II. FACTS AS STATED (not verified; respondent not heard)",
      ...factParas.map((f) => `  - ${f}`),
      "",
      "III. STATUTORY CHECKS",
      ...brief.statutoryChecks.map((c) => `  ${c.title} (${c.basis}): ${c.result}. ${c.detail}`),
      "",
      "IV. ISSUES",
      ...brief.issues.flatMap((i, idx) => [
        `  Issue ${idx + 1}: ${i.title}`,
        `    Claimant: ${i.claimantPosition}`,
        `    Respondent: ${i.respondentPosition}`,
        `    Law: ${(i.applicableLaw || []).join("; ")}`,
        ...(i.finding ? [`    Rules-engine finding: ${i.finding}`] : []),
        ...(i.analysis ? [`    Analysis: ${i.analysis}`] : []),
        `    Evidence that would decide: ${(i.evidenceNeeded || []).join("; ")}`
      ]),
      ...(precedents.length ? ["", "V. RELEVANT PRECEDENTS (verified)", ...precedents.map((c) => `  ${c.citation}${c.equivalent_citations?.length ? ` = ${c.equivalent_citations.join(" = ")}` : ""} — ${c.court}${c.decided_on ? `, ${c.decided_on}` : c.year ? `, ${c.year}` : ""}${c.source_link ? ` — ${c.source_link}` : ""}`)] : []),
      "",
      "VI. POINTS FOR DETERMINATION",
      ...brief.pointsForDetermination.map((p, i) => `  (${["i","ii","iii","iv","v","vi","vii","viii"][i] || i + 1}) ${p}`),
      ...(mattersToVerify.length ? ["  Matters to verify:", ...mattersToVerify.map((m) => `   - ${m}`)] : []),
      "",
      "VII. PROCEDURAL ROUTE",
      `  ${brief.procedure.route} (${brief.procedure.basis})`,
      "",
      `NOTE: ${report.disclaimer}`
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    setPrintDateTime(getFormattedPrintTimestamp());
    window.print();
  };

  const hasPrecedents = precedents.length > 0;
  const PART = { particulars: 1, facts: 2, checks: 3, issues: 4, precedents: 5, points: hasPrecedents ? 6 : 5, procedure: hasPrecedents ? 7 : 6 };

  return (
    <div
      className="case-assessment-brief-report case-brief-body"
      style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "10px", padding: "clamp(20px, 4vw, 44px)", boxShadow: "0 10px 30px rgba(11, 27, 49, 0.06)", position: "relative" }}
    >
      <div className="print-watermark" aria-hidden="true">JustNivaran</div>

      <table className="print-report-table">
        <tfoot className="print-report-tfoot">
          <tr>
            <td>
              <div className="print-running-footer">
                Downloaded from justnivaran-odr.vercel.app on {printDateTime} | Ref {report.requestId} | Neutral case brief. Not legal advice. No outcome is predicted.
              </div>
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>
              {/* Letterhead (print) */}
              <div className="brief-print-header">
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <img src={logo} alt="JustNivaran Logo" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "6px", border: "1px solid var(--line)" }} />
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", letterSpacing: "0.04em", fontFamily: "var(--serif, Georgia, serif)", textTransform: "uppercase" }}>
                      JustNivaran Online Dispute Resolution Centre
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--slate)", fontFamily: "var(--mono, monospace)" }}>Case Assessment Brief &bull; Ref {report.requestId}</div>
                  </div>
                </div>
                <div style={{ height: "2px", background: "linear-gradient(90deg, var(--gold), #f0e0c2, var(--gold))", marginTop: "12px", marginBottom: "16px" }} />
              </div>

              {/* Screen toolbar */}
              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "18px", marginBottom: "28px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--slate)" }}>
                  Ref <strong style={{ color: "var(--ink)" }}>{report.requestId}</strong> &bull; {generated ? `${generated.toLocaleString("en-IN")} IST` : ""}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button type="button" onClick={handleCopy} className="btn ghost" style={{ padding: "8px 14px", fontSize: "12.5px" }}>
                    {copied ? "✓ Copied" : "Copy text"}
                  </button>
                  <button type="button" onClick={handlePrint} className="btn ghost" style={{ padding: "8px 14px", fontSize: "12.5px" }}>
                    Download PDF
                  </button>
                  {onReset && (
                    <button type="button" onClick={onReset} className="btn ghost" style={{ padding: "8px 14px", fontSize: "12.5px" }}>
                      New assessment
                    </button>
                  )}
                </div>
              </div>

              {/* Title block */}
              <div className="brief-title-block" style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--slate)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {report.category}
                </div>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", margin: "6px 0 8px", color: "var(--ink)", fontFamily: "var(--serif, Georgia, serif)" }}>
                  Case Assessment Brief
                </h2>
                <p style={{ fontSize: "13px", color: "var(--slate)", margin: "0 auto", maxWidth: "640px", lineHeight: 1.6 }}>
                  A neutral record of the issues, the applicable law and the evidence on which each issue turns. It does not predict or recommend any outcome.
                </p>
                <div style={{ marginTop: "12px", display: "inline-block", fontFamily: "var(--mono)", fontSize: "11px", padding: "4px 12px", borderRadius: "14px", border: "1px solid var(--line)", color: "var(--slate)" }}>
                  {isLiveAI ? "Analysis drafted with AI assistance · statutory findings by rules engine" : "Prepared by rules engine"}
                </div>
              </div>

              {/* PART I */}
              <Part n={PART.particulars} title="Particulars">
                <dl className="brief-particulars-dl" style={{ margin: 0, display: "grid", gridTemplateColumns: "minmax(140px, 42%) 1fr", fontSize: "14px" }}>
                  {brief.particulars.map((p) => (
                    <div key={p.label} style={{ display: "contents" }}>
                      <dt style={{ padding: "10px 14px", borderBottom: "1px solid var(--line)", color: "var(--slate)" }}>{p.label}</dt>
                      <dd style={{ margin: 0, padding: "10px 14px", borderBottom: "1px solid var(--line)", color: "var(--ink)", fontWeight: 600 }}>{p.value}</dd>
                    </div>
                  ))}
                </dl>
              </Part>

              {/* PART II */}
              <Part n={PART.facts} title="Facts as stated">
                <p style={S.note}>As stated by the party submitting this request. The facts have not been verified and the respondent has not been heard.</p>
                {factParas.map((f, i) => para(`f-${i}`, f))}
              </Part>

              {/* PART III */}
              <Part n={PART.checks} title="Statutory checks">
                <p style={S.note}>Computed by the rules engine from the dates and values supplied.</p>
                {brief.statutoryChecks.map((c) => para(c.key, <>
                    <strong>{c.title}</strong> <span style={{ color: "var(--slate)" }}>({c.basis})</span>: {c.result}. {c.detail}
                  </>))}
                {msmed.applicable && msmed.estimatedStatutoryInterest > 0 && para("msmed-interest", <>
                    <strong>Statutory interest (indicative computation).</strong> On the stated dates, interest under Section 16 of the MSMED Act, 2006 computes to ₹ {msmed.estimatedStatutoryInterest.toLocaleString("en-IN")} from the appointed day ({msmed.appointedDay}) at {msmed.statutoryInterestRatePercent} per annum. Entitlement remains a matter for determination.
                  </>)}
              </Part>

              {/* PART IV */}
              <Part n={PART.issues} title="Issues and analysis">
                {brief.issues.map((issue, idx) => (
                  <article key={issue.id} className="avoid-page-break brief-issue-card" style={{ border: "1px solid var(--line)", borderRadius: "8px", padding: "18px 20px", marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "15.5px", color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.5 }}>
                      Issue {idx + 1}. {issue.title}
                      {issue.raisedBy === "ai" && (
                        <span style={{ marginLeft: "8px", fontFamily: "var(--mono)", fontSize: "10.5px", color: "var(--slate)", fontWeight: 400 }}>[raised on the record by AI analysis]</span>
                      )}
                    </h4>
                    <dl className="brief-issue-dl" style={{ margin: 0, display: "grid", gridTemplateColumns: "minmax(110px, 170px) 1fr", gap: "10px 16px", fontSize: "14px", color: "#24364F", lineHeight: 1.65 }}>
                      <dt style={S.rowLabel}>Claimant</dt>
                      <dd style={{ margin: 0 }}>{issue.claimantPosition}</dd>
                      <dt style={S.rowLabel}>Respondent</dt>
                      <dd style={{ margin: 0 }}>{issue.respondentPosition}</dd>
                      <dt style={S.rowLabel}>Applicable law</dt>
                      <dd style={{ margin: 0 }}>
                        <ul style={{ margin: 0, paddingLeft: "18px" }}>
                          {(issue.applicableLaw || []).map((l) => <li key={l}>{l}</li>)}
                        </ul>
                        {(issue.provisions || []).map((p) => (
                          <blockquote
                            key={p.id}
                            className="avoid-page-break"
                            style={{ margin: "12px 0 0", padding: "12px 16px", background: "#fbf8f1", borderLeft: "3px solid var(--gold)", borderRadius: "0 6px 6px 0", fontSize: "13.5px", lineHeight: 1.7, color: "#24364F" }}
                          >
                            <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "6px", fontFamily: "var(--serif, Georgia, serif)" }}>
                              Section {p.section}, {p.act} &mdash; {p.heading}
                            </div>
                            {p.text.map((t, k) => (
                              <p key={k} style={{ margin: "0 0 6px" }}>{t}</p>
                            ))}
                            <div style={{ fontFamily: "var(--mono)", fontSize: "10.5px", color: "var(--slate)", marginTop: "6px" }}>
                              Text: {p.source_name || "Official source"}
                              {p.retrieved_on ? `, retrieved ${p.retrieved_on}` : ""}
                              {p.source_link ? (
                                <>
                                  {" · "}
                                  <a href={p.source_link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--slate)" }}>source</a>
                                </>
                              ) : null}
                            </div>
                          </blockquote>
                        ))}
                      </dd>
                      {issue.finding && (
                        <>
                          <dt style={S.rowLabel}>Rules-engine finding</dt>
                          <dd style={{ margin: 0 }}>{issue.finding}</dd>
                        </>
                      )}
                      {issue.analysis && (
                        <>
                          <dt style={S.rowLabel}>Analysis</dt>
                          <dd style={{ margin: 0 }}>{issue.analysis}</dd>
                        </>
                      )}
                      <dt style={S.rowLabel}>Evidence that would decide</dt>
                      <dd style={{ margin: 0 }}>
                        <ul style={{ margin: 0, paddingLeft: "18px" }}>
                          {(issue.evidenceNeeded || []).map((e) => <li key={e}>{e}</li>)}
                        </ul>
                      </dd>
                    </dl>
                  </article>
                ))}
              </Part>

              {/* PART V — only when verified precedents exist */}
              {precedents.length > 0 && (
                <Part n={PART.precedents} title="Related precedents">
                  <p style={S.note}>Only judgments verified by JustNivaran and retrieved for this matter are listed.</p>
                  {precedents.map((c, idx) => (
                    <article key={`${c.citation}-${idx}`} className="avoid-page-break" style={{ borderLeft: "3px solid var(--gold)", padding: "6px 0 6px 16px", marginBottom: "18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: "15px", fontFamily: "var(--serif, Georgia, serif)" }}>
                        {c.source_link ? (
                          <a href={c.source_link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)" }}>{c.citation}</a>
                        ) : (
                          c.citation
                        )}
                      </div>
                      {c.equivalent_citations?.length > 0 && (
                        <div style={{ fontSize: "12.5px", color: "var(--slate)", marginTop: "2px" }}>= {c.equivalent_citations.join(" = ")}</div>
                      )}
                      <div style={{ fontFamily: "var(--mono)", fontSize: "11.5px", color: "var(--slate)", margin: "4px 0 6px" }}>
                        {[c.court, c.bench, c.decided_on || c.year].filter(Boolean).join(" · ")}
                        {c.treatment ? ` · ${c.treatment}` : ""}
                      </div>
                      <p style={{ margin: 0, fontSize: "14px", color: "#24364F", lineHeight: 1.65 }}>{c.headnote || c.holding}</p>
                      {c.source_link && (
                        <div className="print-only-url" style={{ fontSize: "11px", color: "var(--slate)", wordBreak: "break-all" }}>{c.source_link}</div>
                      )}
                    </article>
                  ))}
                </Part>
              )}

              {/* PART VI */}
              <Part n={PART.points} title="Points for determination">
                <ol style={{ margin: 0, paddingLeft: "34px", listStyleType: "lower-roman", fontSize: "14.5px", color: "#24364F", lineHeight: 1.75 }}>
                  {brief.pointsForDetermination.map((p, i) => <li key={`d-${i}`} style={{ paddingLeft: "6px", marginBottom: "6px" }}>{p}</li>)}
                </ol>
                {mattersToVerify.length > 0 && (
                  <>
                    <h4 style={{ fontSize: "14.5px", color: "var(--ink)", margin: "18px 0 8px" }}>Matters to verify before any hearing</h4>
                    <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#24364F", lineHeight: 1.7 }}>
                      {mattersToVerify.map((m) => <li key={m}>{m}</li>)}
                    </ul>
                  </>
                )}
              </Part>

              {/* PART VII */}
              <Part n={PART.procedure} title="Procedural route and fees">
                {brief.procedure.route && para("route", <>
                    <strong>Available route:</strong> {brief.procedure.route}
                    {brief.procedure.basis ? <span style={{ color: "var(--slate)" }}> ({brief.procedure.basis})</span> : null}. {brief.procedure.note}
                    {brief.procedure.alternative ? ` Alternative: ${brief.procedure.alternative}.` : ""}
                  </>)}
                {(report.recommendedNextSteps || []).map((s, i) => para(`step-${i}`, s))}
                {processComparison.length > 0 && (
                  <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: "8px", marginTop: "10px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "var(--ink)", color: "#ffffff" }}>
                          <th style={{ ...S.cell, fontWeight: 600 }}>Process</th>
                          <th style={{ ...S.cell, fontWeight: 600 }}>Timeline</th>
                          <th style={{ ...S.cell, fontWeight: 600 }}>Fee (incl. 18% GST)</th>
                          <th style={{ ...S.cell, fontWeight: 600 }}>Consent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processComparison.map((p, idx) => (
                          <tr key={p.processId || idx}>
                            <td style={{ ...S.cell, fontWeight: 600, color: "var(--ink)" }}>{p.name}</td>
                            <td style={{ ...S.cell, color: "var(--slate)" }}>{p.timeline}</td>
                            <td style={{ ...S.cell, fontFamily: "var(--mono)" }}>₹ {p.totalWithGst?.toLocaleString("en-IN")}</td>
                            <td style={{ ...S.cell, color: "#475569" }}>{p.consentRequirement}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Part>

              <div className="avoid-page-break" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "14px 18px", fontSize: "12.5px", color: "var(--slate)", lineHeight: 1.6, marginBottom: "24px" }}>
                <strong>Note:</strong> {report.disclaimer}
              </div>

              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                <button type="button" onClick={handlePrint} className="btn ghost" style={{ padding: "12px 24px", fontSize: "14px" }}>
                  📄 Download Case Assessment Brief (PDF)
                </button>
                <a href="/#file" className="btn gold" style={{ padding: "12px 28px", fontSize: "14.5px", fontWeight: 700, textDecoration: "none" }}>
                  Proceed to file with the Registry →
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
