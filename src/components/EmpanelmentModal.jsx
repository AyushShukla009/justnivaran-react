import { useState } from "react";
import { supabase } from "../lib/supabase";

function EmpanelmentModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [consents, setConsents] = useState({
    goodStanding: false,
    dpdpConsent: false
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Arbitrator",
    barCouncilId: "",
    experienceYears: "",
    specialization: "Commercial Contracts & MSME",
    languages: "English, Hindi"
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConsentChange = (e) => {
    setConsents({ ...consents, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!consents.goodStanding || !consents.dpdpConsent) {
      setErrorMessage("Please confirm both the professional standing declaration and DPDP consent.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (supabase) {
        let currentPayload = {
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          bar_council_id: formData.barCouncilId.trim(),
          experience_years: Number(formData.experienceYears) || 0,
          specialization: formData.specialization.trim(),
          languages: formData.languages.trim(),
          status: "Under Review"
        };

        let insertError = null;
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
          attempts++;
          const res = await supabase.from("neutrals").insert([currentPayload]);
          insertError = res.error;
          if (!insertError) break;

          const errMsg = insertError.message || "";
          const colMatch =
            errMsg.match(/Could not find the '([^']+)' column of/i) ||
            errMsg.match(/column "([^"]+)" of relation/i) ||
            errMsg.match(/column '([^']+)' does not exist/i) ||
            errMsg.match(/Could not find column '([^']+)'/i);

          if (colMatch && colMatch[1]) {
            const missingCol = colMatch[1];
            delete currentPayload[missingCol];
            continue;
          }
          break;
        }

        if (insertError) {
          console.error("Empanelment submission error:", insertError.message);
          setErrorMessage(`Application submission failed: ${insertError.message}. Please try again.`);
          setIsSubmitting(false);
          return;
        }

        setIsSuccess(true);
      } else {
        setErrorMessage("Database service is offline.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage(`Unexpected error: ${err.message}. Please retry.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage("");
    setConsents({ goodStanding: false, dpdpConsent: false });
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "Arbitrator",
      barCouncilId: "",
      experienceYears: "",
      specialization: "Commercial Contracts & MSME",
      languages: "English, Hindi"
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="empanelment-modal-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">Panel of Neutrals</span>
            <h3 id="empanelment-modal-title">{isSuccess ? "Application Received" : "Apply for Neutral Empanelment"}</h3>
          </div>
          <button className="modal-close" onClick={handleReset} type="button" aria-label="Close empanelment modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {isSuccess ? (
            <div style={{ textAlign: "center", padding: "14px 0" }}>
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
              <h4 style={{ fontSize: "19px", color: "var(--ink)", margin: "0 0 6px" }}>
                Empanelment Dossier Submitted
              </h4>
              <p style={{ fontSize: "14px", color: "#3B4E68", lineHeight: "1.6", margin: "0 0 20px" }}>
                Thank you, <strong>{formData.fullName}</strong>. Our Registrar will verify your credentials and Bar Council registration within 2 business days.
              </p>
              <button className="btn gold" type="button" onClick={handleReset} style={{ width: "100%" }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: "13.5px", color: "var(--slate)", margin: "0 0 16px" }}>
                For retired judges, senior advocates (7+ yrs), certified mediators, and domain specialists.
              </p>

              <div className="form-grid">
                <div>
                  <label htmlFor="empanelment-fullname">Full Legal Name</label>
                  <input
                    id="empanelment-fullname"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    required
                    placeholder="Enter full legal name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="empanelment-role">Primary Role</label>
                  <select id="empanelment-role" name="role" value={formData.role} onChange={handleChange}>
                    <option value="Arbitrator">Sole Arbitrator</option>
                    <option value="Mediator">Commercial Mediator (Mediation Act 2023)</option>
                    <option value="Conciliator">Conciliator</option>
                  </select>
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: "10px" }}>
                <div>
                  <label htmlFor="empanelment-email">Official Email</label>
                  <input
                    id="empanelment-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="Enter official email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="empanelment-phone">Contact Phone</label>
                  <input
                    id="empanelment-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: "10px" }}>
                <div>
                  <label htmlFor="empanelment-bar-id">Bar Council / Accreditation ID</label>
                  <input
                    id="empanelment-bar-id"
                    type="text"
                    name="barCouncilId"
                    required
                    placeholder="Enter Bar Council / Enrollment ID"
                    value={formData.barCouncilId}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="empanelment-experience">Years of Practice / Experience</label>
                  <input
                    id="empanelment-experience"
                    type="number"
                    name="experienceYears"
                    required
                    placeholder="e.g. 14"
                    value={formData.experienceYears}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="empanelment-specialization">Domain Specialization</label>
                <input
                  id="empanelment-specialization"
                  type="text"
                  name="specialization"
                  required
                  placeholder="e.g. MSME Receivables, Banking, Tech Contracts"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="empanelment-languages">Languages for Hearing</label>
                <input
                  id="empanelment-languages"
                  type="text"
                  name="languages"
                  required
                  placeholder="e.g. English, Hindi, Marathi"
                  value={formData.languages}
                  onChange={handleChange}
                />
              </div>

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  background: "rgba(11, 27, 49, 0.03)",
                  border: "1px solid var(--line)",
                  borderRadius: "4px"
                }}
              >
                <label htmlFor="empanelment-standing" className="modal-checkbox-label">
                  <input
                    id="empanelment-standing"
                    type="checkbox"
                    name="goodStanding"
                    required
                    checked={consents.goodStanding}
                    onChange={handleConsentChange}
                  />
                  <span>
                    I affirm that I am an enrolled advocate / accredited mediator / arbitrator in good standing with no adverse ethical findings.
                  </span>
                </label>

                <label htmlFor="empanelment-dpdp" className="modal-checkbox-label" style={{ marginBottom: 0 }}>
                  <input
                    id="empanelment-dpdp"
                    type="checkbox"
                    name="dpdpConsent"
                    required
                    checked={consents.dpdpConsent}
                    onChange={handleConsentChange}
                  />
                  <span>
                    I consent to the verification and processing of my credentials for institutional empanelment under the <strong>DPDP Act, 2023</strong>.
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div
                  style={{
                    marginTop: "12px",
                    background: "#FDEDEC",
                    color: "#C0392B",
                    border: "1px solid #F5B7B1",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="modal-actions">
                <button className="btn ghost" type="button" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button className="btn gold" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Application..." : "Submit Empanelment Application →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpanelmentModal;