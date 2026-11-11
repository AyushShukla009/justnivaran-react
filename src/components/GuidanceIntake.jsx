import { useState } from "react";

/**
 * Intake form for guidance-only predictor categories.
 * Everything is computed in the browser: answers are never sent to a server or AI provider.
 */
export default function GuidanceIntake({ module, onResult }) {
  const [answers, setAnswers] = useState({});
  const [privacyAck, setPrivacyAck] = useState(false);
  const [error, setError] = useState("");

  const update = (name, value) => setAnswers((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!privacyAck) {
      setError("Please confirm the privacy notice before continuing.");
      return;
    }
    const msg = module.validate(answers);
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    onResult(module.generateGuidance({ ...answers, category: module.category }));
  };

  const fieldStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid var(--line)",
    fontSize: "14px",
    background: "#ffffff"
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      style={{
        background: "#ffffff",
        border: "1px solid var(--line)",
        borderRadius: "8px",
        padding: "32px",
        boxShadow: "0 6px 20px rgba(11, 27, 49, 0.05)"
      }}
    >
      <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
        Process guidance &bull; {module.label}
      </div>
      <h2 style={{ fontSize: "20px", margin: "0 0 8px", color: "var(--ink)" }}>{module.category}</h2>
      <p style={{ fontSize: "14px", color: "var(--slate)", margin: "0 0 24px", lineHeight: 1.6 }}>
        This section gives general process guidance only. It does not rate the strength of a case or predict any outcome.
      </p>

      {/* Stronger privacy notice for personal-data categories */}
      <section
        aria-labelledby="guidance-privacy-heading"
        style={{
          background: "#fff7ed",
          border: "1px solid #fdba74",
          borderRadius: "6px",
          padding: "16px 20px",
          marginBottom: "28px",
          fontSize: "13.5px",
          color: "#7c2d12",
          lineHeight: 1.65
        }}
      >
        <h3 id="guidance-privacy-heading" style={{ fontSize: "15px", margin: "0 0 8px", color: "#7c2d12" }}>
          🔒 Sensitive personal data — please read
        </h3>
        <ul style={{ margin: "0 0 12px", paddingLeft: "20px" }}>
          <li>Your answers in this section stay in your browser. They are <strong>not sent</strong> to JustNivaran&rsquo;s servers or to any AI provider, and they are <strong>not saved</strong>.</li>
          <li><strong>Do not enter</strong> names, addresses, phone numbers, email addresses, Aadhaar, PAN or other ID numbers, children&rsquo;s details, or health information.</li>
          <li>Refreshing or closing this page erases your answers.</li>
          <li>
            See our{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#7c2d12", textDecoration: "underline" }}>
              Privacy Policy
            </a>.
          </li>
        </ul>
        <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer", fontWeight: 600 }}>
          <input type="checkbox" checked={privacyAck} onChange={(e) => setPrivacyAck(e.target.checked)} style={{ marginTop: "4px" }} />
          <span>I understand and will not enter identifying or sensitive details.</span>
        </label>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "20px" }}>
        {module.fields.map((f) => (
          <div key={f.name} style={f.type === "textarea" ? { gridColumn: "1 / -1" } : undefined}>
            <label htmlFor={`g-${f.name}`} style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
              {f.label} {f.required && <span style={{ color: "#dc2626" }}>*</span>}
            </label>
            {f.type === "select" ? (
              <select id={`g-${f.name}`} value={answers[f.name] || ""} onChange={(e) => update(f.name, e.target.value)} style={fieldStyle}>
                <option value="">Select…</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <>
                <textarea
                  id={`g-${f.name}`}
                  rows={4}
                  maxLength={f.maxLength}
                  value={answers[f.name] || ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }}
                />
                {f.maxLength && (
                  <div style={{ fontSize: "11.5px", color: "var(--slate)", marginTop: "4px", textAlign: "right" }}>
                    {(answers[f.name] || "").length}/{f.maxLength}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" style={{ marginTop: "20px", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 14px", borderRadius: "6px", fontSize: "13.5px" }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: "28px", display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" className="btn gold" style={{ padding: "12px 28px", fontSize: "14.5px", fontWeight: 700 }}>
          Show process guidance →
        </button>
      </div>
    </form>
  );
}
