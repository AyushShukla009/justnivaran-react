import { useState } from "react";
import { supabase } from "../lib/supabase";

function DisputeModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docketNumber, setDocketNumber] = useState("");
  const [formData, setFormData] = useState({
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    respondentName: "",
    respondentEmail: "",
    respondentPhone: "",
    claimAmount: "",
    mode: "ARB",
    disputeSummary: "",
    reliefSought: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedDocket = `JN/${formData.mode}/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    setDocketNumber(generatedDocket);

    try {
      if (supabase) {
        const defaultSummary = formData.disputeSummary.trim() || "Dispute submitted via JustNivaran Portal regarding contractual breach / unpaid invoices.";
        const defaultRelief = formData.reliefSought.trim() || `Restitution and settlement of claimed sum ₹ ${Number(formData.claimAmount || 0).toLocaleString("en-IN")}`;

        const { error } = await supabase.from("disputes").insert([
          {
            docket_number: generatedDocket,
            claimant_name: formData.claimantName.trim(),
            claimant_email: formData.claimantEmail.trim(),
            claimant_phone: formData.claimantPhone.trim(),
            respondent_name: formData.respondentName.trim(),
            respondent_email: formData.respondentEmail.trim(),
            respondent_phone: formData.respondentPhone.trim(),
            claim_amount: Number(formData.claimAmount) || 0,
            mode: formData.mode,
            dispute_summary: defaultSummary,
            relief_sought: defaultRelief,
            status: "Notice Issued"
          }
        ]);

        if (error) console.error("Database submission error:", error.message);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
      setStep(3); // Show confirmation step
    }
  };

  const handleReset = () => {
    setStep(1);
    setDocketNumber("");
    setFormData({
      claimantName: "",
      claimantEmail: "",
      claimantPhone: "",
      respondentName: "",
      respondentEmail: "",
      respondentPhone: "",
      claimAmount: "",
      mode: "ARB",
      disputeSummary: "",
      reliefSought: ""
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">Institutional Case Filing</span>
            <h3>
              {step === 1 && "Step 1: Party Details"}
              {step === 2 && "Step 2: Claim & Relief"}
              {step === 3 && "Dispute Filed Successfully"}
            </h3>
          </div>
          <button className="modal-close" onClick={handleReset} type="button">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <form onSubmit={handleNext}>
              <p style={{ fontSize: "13.5px", color: "var(--slate)", margin: "0 0 16px" }}>
                Provide contact information for the Claimant (you) and the Respondent party.
              </p>

              <h4 style={{ fontSize: "14px", margin: "0 0 10px", color: "var(--ink)" }}>Claimant (Your Details)</h4>
              <div className="form-grid">
                <div>
                  <label>Full Legal Name / Entity</label>
                  <input
                    type="text"
                    name="claimantName"
                    required
                    placeholder="e.g. Acme Tech Pvt Ltd"
                    value={formData.claimantName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Official Email</label>
                  <input
                    type="email"
                    name="claimantEmail"
                    required
                    placeholder="legal@acmetech.com"
                    value={formData.claimantEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label>Phone Number / WhatsApp for Notices</label>
                <input
                  type="tel"
                  name="claimantPhone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.claimantPhone}
                  onChange={handleChange}
                />
              </div>

              <h4 style={{ fontSize: "14px", margin: "18px 0 10px", color: "var(--ink)" }}>Respondent (Opposing Party)</h4>
              <div className="form-grid">
                <div>
                  <label>Opposing Party Name</label>
                  <input
                    type="text"
                    name="respondentName"
                    required
                    placeholder="e.g. Beta Enterprises"
                    value={formData.respondentName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Opposing Party Email</label>
                  <input
                    type="email"
                    name="respondentEmail"
                    required
                    placeholder="contact@betaenterprises.com"
                    value={formData.respondentEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label>Opposing Party Phone (Optional)</label>
                <input
                  type="tel"
                  name="respondentPhone"
                  placeholder="+91 98765 00000"
                  value={formData.respondentPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button className="btn ghost" type="button" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn gold" type="submit">
                  Continue to Claim Details →
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div>
                  <label>Preferred Resolution Mode</label>
                  <select name="mode" value={formData.mode} onChange={handleChange}>
                    <option value="NEG">Direct Negotiation (Contract Act 1872)</option>
                    <option value="MED">Institutional Mediation (Mediation Act 2023)</option>
                    <option value="CON">Conciliation</option>
                    <option value="FTA">Fast-Track Arbitration (s. 29B)</option>
                    <option value="ARB">Arbitration (Arbitration Act 1996)</option>
                    <option value="LOK">Online Lok Adalat</option>
                  </select>
                </div>
                <div>
                  <label>Disputed Claim Amount (INR)</label>
                  <input
                    type="number"
                    name="claimAmount"
                    required
                    placeholder="e.g. 1500000"
                    value={formData.claimAmount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <label>Dispute Summary &amp; Facts</label>
                <textarea
                  name="disputeSummary"
                  rows="3"
                  required
                  placeholder="Briefly state what contract was breached, unpaid invoice dates, or services defaulted..."
                  value={formData.disputeSummary}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginTop: "14px" }}>
                <label>Relief Sought (What outcome do you want?)</label>
                <input
                  type="text"
                  name="reliefSought"
                  required
                  placeholder="e.g. Immediate payment of ₹ 15,00,000 + 12% interest"
                  value={formData.reliefSought}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button className="btn ghost" type="button" onClick={handleBack} disabled={isSubmitting}>
                  ← Back
                </button>
                <button className="btn gold" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Issuing Digital Docket..." : "Issue Notice & Submit →"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(209, 154, 52, 0.15)",
                color: "var(--gold)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                marginBottom: "16px"
              }}>
                ✓
              </div>

              <h4 style={{ fontSize: "20px", color: "var(--ink)", margin: "0 0 6px" }}>
                Case Docket Issued
              </h4>
              <p style={{ fontFamily: "var(--mono)", fontSize: "16px", color: "var(--gold)", fontWeight: 600, margin: "0 0 16px" }}>
                {docketNumber}
              </p>

              <div style={{
                background: "var(--paper-hi)",
                padding: "16px",
                borderRadius: "4px",
                textAlign: "left",
                fontSize: "13.5px",
                color: "#3B4E68",
                lineHeight: "1.6",
                marginBottom: "20px"
              }}>
                <div><strong>Claimant:</strong> {formData.claimantName}</div>
                <div><strong>Respondent:</strong> {formData.respondentName}</div>
                <div><strong>Claim Value:</strong> ₹ {Number(formData.claimAmount).toLocaleString("en-IN")}</div>
                <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--line)", fontSize: "12px", color: "var(--slate)" }}>
                  📩 Digital notice dispatched to {formData.respondentEmail}. The 15-day response window is now active.
                </div>
              </div>

              <button className="btn gold" type="button" onClick={handleReset} style={{ width: "100%" }}>
                Done &amp; Close Docket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisputeModal;