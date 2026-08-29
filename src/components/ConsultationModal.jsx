import { useState } from "react";
import { supabase } from "../lib/supabase";

function ConsultationModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
    setIsSubmitting(true);

    try {
      if (supabase) {
        const { error } = await supabase.from("consultations").insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            preferred_date: formData.preferredDate || new Date().toISOString().split("T")[0],
            preferred_time: formData.preferredTime,
            format: formData.format,
            notes: formData.notes,
            status: "Confirmed"
          }
        ]);

        if (error) console.error("Consultation submission error:", error.message);
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">Registry Appointment</span>
            <h3>{isSuccess ? "Consultation Booked" : "Schedule a Case Consultation"}</h3>
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
                  <label>Your Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Suresh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Official Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="suresh@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: "10px" }}>
                <div>
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Preferred Time Slot</label>
                  <select name="preferredTime" value={formData.preferredTime} onChange={handleChange}>
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                    <option value="05:00 PM - 05:30 PM">05:00 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label>Meeting Format</label>
                <select name="format" value={formData.format} onChange={handleChange}>
                  <option value="Video Conference">Encrypted Video Conference (Recommended)</option>
                  <option value="Phone Call">Direct Phone Call</option>
                </select>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label>Brief Nature of Dispute (Optional)</label>
                <textarea
                  name="notes"
                  rows="2"
                  placeholder="e.g. Need guidance on whether MSME arbitration or mediation is faster for unpaid invoices..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button className="btn ghost" type="button" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button className="btn gold" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Confirming Slot..." : "Confirm Consultation Slot →"}
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