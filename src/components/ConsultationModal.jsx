import { useState } from "react";
import { supabase } from "../lib/supabase";

function ConsultationModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "11:00 AM - 11:30 AM",
    format: "Video Conference",
    notes: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!dpdpConsent) {
      setErrorMessage("Please accept the data processing consent under DPDP Act 2023.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (supabase) {
        const { error } = await supabase.from("consultations").insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            preferred_date: formData.preferredDate || new Date().toISOString().split("T")[0],
            preferred_time: formData.preferredTime,
            format: formData.format,
            notes: formData.notes.trim(),
            status: "Pending Verification"
          }
        ]);

        if (error) {
          console.error("Consultation submission error:", error.message);
          setErrorMessage(`Appointment request failed: ${error.message}. Please try again.`);
          setIsSubmitting(false);
          return;
        }

        setIsSuccess(true);
      } else {
        setErrorMessage("Database service is unavailable.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage(`Unexpected error: ${err.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage("");
    setDpdpConsent(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "11:00 AM - 11:30 AM",
      format: "Video Conference",
      notes: ""
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">Registry Appointment</span>
            <h3 id="consultation-modal-title">{isSuccess ? "Consultation Booked" : "Schedule a Case Consultation"}</h3>
          </div>
          <button className="modal-close" onClick={handleReset} type="button" aria-label="Close consultation modal">
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
                Consultation Confirmed
              </h4>
              <p style={{ fontSize: "14px", color: "#3B4E68", lineHeight: "1.6", margin: "0 0 20px" }}>
                We have reserved your slot for <strong>{formData.preferredDate || "your selected date"}</strong> at <strong>{formData.preferredTime}</strong> via {formData.format}. A calendar invite has been sent to <strong>{formData.email}</strong>.
              </p>
              <button className="btn gold" type="button" onClick={handleReset} style={{ width: "100%" }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: "13.5px", color: "var(--slate)", margin: "0 0 16px" }}>
                Speak with a Registry Officer to evaluate your dispute, statutory options, and institutional fees.
              </p>

              <div className="form-grid">
                <div>
                  <label htmlFor="consultation-name">Your Full Name</label>
                  <input
                    id="consultation-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="consultation-email">Official Email</label>
                  <input
                    id="consultation-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your official email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="consultation-phone">Phone Number / WhatsApp for Confirmation</label>
                <input
                  id="consultation-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grid" style={{ marginTop: "10px" }}>
                <div>
                  <label htmlFor="consultation-date">Preferred Date</label>
                  <input
                    id="consultation-date"
                    type="date"
                    name="preferredDate"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="consultation-time">Preferred Time Slot</label>
                  <select id="consultation-time" name="preferredTime" value={formData.preferredTime} onChange={handleChange}>
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                    <option value="05:00 PM - 05:30 PM">05:00 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="consultation-format">Meeting Format</label>
                <select id="consultation-format" name="format" value={formData.format} onChange={handleChange}>
                  <option value="Video Conference">Encrypted Video Conference (Recommended)</option>
                  <option value="Phone Call">Direct Phone Call</option>
                </select>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="consultation-notes">Brief Nature of Dispute (Optional)</label>
                <textarea
                  id="consultation-notes"
                  name="notes"
                  rows="2"
                  placeholder="Provide brief details about your dispute, unpaid invoice, or contract issue..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginTop: "14px" }}>
                <label htmlFor="consultation-dpdp-consent" className="modal-checkbox-label">
                  <input
                    id="consultation-dpdp-consent"
                    type="checkbox"
                    required
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                  />
                  <span>
                    I consent to the collection and processing of my contact information strictly for scheduling this case consultation in accordance with the <strong>DPDP Act, 2023</strong>.
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
                  {isSubmitting ? "Submitting Request..." : "Request Case Consultation →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultationModal;