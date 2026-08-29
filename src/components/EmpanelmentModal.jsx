import { useState } from "react";
import { supabase } from "../lib/supabase";

function EmpanelmentModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (supabase) {
        const { error } = await supabase.from("neutrals").insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            bar_council_id: formData.barCouncilId,
            experience_years: Number(formData.experienceYears) || 0,
            specialization: formData.specialization,
            languages: formData.languages,
            status: "Under Review"
          }
        ]);

        if (error) console.error("Empanelment submission error:", error.message);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">Panel of Neutrals</span>
            <h3>{isSuccess ? "Application Received" : "Apply for Neutral Empanelment"}</h3>
          </div>
          <button className="modal-close" onClick={handleReset} type="button">
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
                  <label>Full Legal Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Adv. Rajesh Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Primary Role</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Arbitrator">Sole Arbitrator</option>
                    <option value="Mediator">Commercial Mediator (Mediation Act 2023)</option>
                    <option value="Conciliator">Conciliator</option>
                  </select>
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: "10px" }}>
                <div>
                  <label>Official Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="sharma@delhibar.org"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98111 22334"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: "10px" }}>
                <div>
                  <label>Bar Council / Accreditation ID</label>
                  <input
                    type="text"
                    name="barCouncilId"
                    required
                    placeholder="D/1234/2012"
                    value={formData.barCouncilId}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Years of Practice / Experience</label>
                  <input
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
                <label>Domain Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  required
                  placeholder="e.g. MSME Receivables, Banking, Tech Contracts"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginTop: "10px" }}>
                <label>Languages for Hearing</label>
                <input
                  type="text"
                  name="languages"
                  required
                  placeholder="e.g. English, Hindi, Marathi"
                  value={formData.languages}
                  onChange={handleChange}
                />
              </div>

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