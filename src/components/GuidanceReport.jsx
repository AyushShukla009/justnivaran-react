import { useState } from "react";
import logo from "../assets/logo1.jpeg";
import { TO_BE_PROVIDED } from "../lib/categories/guidanceShared.js";

function formatTimestamp(d = new Date()) {
  return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST";
}

/**
 * Report for guidance-only categories. Deliberately has NO strength ratings,
 * outcome scenarios, settlement outlook, recovery figures or fee comparison.
 * Uses the same print classes as the Case Assessment Brief.
 */
export default function GuidanceReport({ report, onReset }) {
  const [printDateTime, setPrintDateTime] = useState(() => formatTimestamp());

  const handlePrint = () => {
    setPrintDateTime(formatTimestamp());
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
        position: "relative"
      }}
    >
      <div className="print-watermark" aria-hidden="true">JustNivaran</div>

      <table className="print-report-table">
        <tfoot className="print-report-tfoot">
          <tr>
            <td>
              <div className="print-running-footer">
                Downloaded from justnivaran-odr.vercel.app on {printDateTime} | Ref {report.requestId} | General process guidance. Not legal advice.
              </div>
            </td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>
              <div className="brief-print-header">
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <img src={logo} alt="JustNivaran Logo" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "6px", border: "1px solid var(--line)" }} />
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", letterSpacing: "0.04em", fontFamily: "var(--serif, Georgia, serif)", textTransform: "uppercase" }}>
                      JustNivaran Online Dispute Resolution Centre
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--slate)", fontFamily: "var(--mono, monospace)" }}>
                      Process Guidance &bull; {report.categoryLabel}
                    </div>
                  </div>
                </div>
                <div style={{ height: "2px", background: "linear-gradient(90deg, var(--gold), #f0e0c2, var(--gold))", marginTop: "12px", marginBottom: "16px" }} />
              </div>

              {/* Screen header */}
              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "18px", marginBottom: "24px" }}>
                <div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--slate)", textTransform: "uppercase" }}>
                      Ref: <strong style={{ color: "var(--ink)" }}>{report.requestId}</strong>
                    </span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "16px", background: "rgba(209, 154, 52, 0.12)", color: "var(--gold-deep)", border: "1px solid rgba(209, 154, 52, 0.35)" }}>
                      {report.engineType}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>
                    Generated in your browser: {new Date(report.generatedAt).toLocaleString("en-IN")} IST
                  </div>
                </div>
                <button type="button" onClick={onReset} className="btn ghost" style={{ padding: "8px 14px", fontSize: "12.5px" }}>
                  ← Start again
                </button>
              </div>

              <h2 style={{ fontSize: "24px", color: "var(--ink)", margin: "0 0 6px", fontFamily: "var(--serif, Georgia, serif)" }}>
                Process guidance: {report.category}
              </h2>
              <p style={{ fontSize: "13.5px", color: "var(--slate)", margin: "0 0 24px" }}>
                General information about the process. This is not an assessment of anyone&rsquo;s case.
              </p>

              {report.notices?.map((n, i) => (
                <div key={i} role="alert" style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", borderRadius: "6px", padding: "12px 16px", fontSize: "14px", fontWeight: 600, marginBottom: "20px" }}>
                  ⚠️ {n}
                </div>
              ))}

              {report.answers?.length > 0 && (
                <section className="avoid-page-break" style={{ background: "#fafbfc", border: "1px solid var(--line)", borderRadius: "8px", padding: "18px 22px", marginBottom: "24px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                    What you told us
                  </div>
                  <dl style={{ margin: 0, display: "grid", gap: "6px", fontSize: "13.5px" }}>
                    {report.answers.map((a) => (
                      <div key={a.label} style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        <dt style={{ color: "var(--slate)" }}>{/[?:]$/.test(a.label) ? a.label : `${a.label}:`}</dt>
                        <dd style={{ margin: 0, color: "var(--ink)", fontWeight: 600 }}>{a.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <div style={{ display: "grid", gap: "18px", marginBottom: "28px" }}>
                {report.sections.map((s) => (
                  <section key={s.key} className="avoid-page-break" style={{ border: "1px solid var(--line)", borderRadius: "8px", padding: "18px 22px" }}>
                    <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 10px" }}>{s.heading}</h3>
                    <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#334155", lineHeight: 1.65 }}>
                      {s.items.map((item, i) => (
                        <li key={i} style={item === TO_BE_PROVIDED ? { color: "var(--slate)", fontStyle: "italic" } : undefined}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="avoid-page-break" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "14px 18px", fontSize: "12px", color: "var(--slate)", lineHeight: 1.6, marginBottom: "24px" }}>
                <strong>Notice:</strong> {report.disclaimer}
              </div>

              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                <button type="button" onClick={handlePrint} className="btn ghost" style={{ padding: "12px 24px", fontSize: "14px" }}>
                  📄 Download guidance (PDF)
                </button>
                <a href="/mediation-rules" className="btn gold" style={{ padding: "12px 24px", fontSize: "14px", textDecoration: "none" }}>
                  Learn about mediation →
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
