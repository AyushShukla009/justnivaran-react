import { useState } from "react";
import { Link } from "react-router-dom";
import { submitEmergencyReliefRequest } from "../lib/api";

export default function EmergencyRelief({ onOpenFileModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    respondentName: "",
    respondentEmail: "",
    respondentPhone: "",
    reliefCategory: "Stay on Invocation of Bank Guarantee / Letter of Credit",
    contractTitle: "",
    urgencyReason: "",
    irreparableHarm: "",
    noticeStatus: "Concurrent Electronic Notice Dispatched",
    claimAmount: "",
    supportingDocs: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.applicantName.trim() || !formData.applicantEmail.trim() || !formData.applicantPhone.trim()) {
      setErrorMessage("Please provide complete applicant contact details.");
      return;
    }

    if (!formData.respondentName.trim() || !formData.respondentEmail.trim()) {
      setErrorMessage("Please provide respondent name and email address for urgent notice transmission.");
      return;
    }

    if (!formData.urgencyReason || formData.urgencyReason.trim().length < 25) {
      setErrorMessage("Please specify the grounds of extreme urgency (minimum 25 characters).");
      return;
    }

    if (!formData.irreparableHarm || formData.irreparableHarm.trim().length < 25) {
      setErrorMessage("Please describe the imminent irreparable harm if relief is not granted within 72 hours.");
      return;
    }

    if (!dpdpConsent) {
      setErrorMessage("Please confirm consent to proceed with emergency filing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitEmergencyReliefRequest({
        applicant_name: formData.applicantName,
        applicant_email: formData.applicantEmail,
        applicant_phone: formData.applicantPhone,
        respondent_name: formData.respondentName,
        respondent_email: formData.respondentEmail,
        respondent_phone: formData.respondentPhone,
        relief_category: formData.reliefCategory,
        contract_title: formData.contractTitle,
        urgency_reason: formData.urgencyReason,
        irreparable_harm: formData.irreparableHarm,
        notice_status: formData.noticeStatus,
        claim_amount: Number(formData.claimAmount) || 0,
        supporting_docs: formData.supportingDocs
      });

      if (result.success) {
        setSubmissionResult(result.data);
      } else {
        setErrorMessage(result.error || "Emergency relief request could not be processed.");
      }
    } catch (err) {
      console.error("Emergency relief submission error:", err);
      setErrorMessage("Network transmission error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "1060px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p className="eyebrow" style={{ color: "var(--slate)", marginBottom: "8px" }}>
          <b>Urgent Interim Measures</b> Pre-Tribunal Constitution Protection
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: 0, color: "var(--ink)" }}>
            Emergency Arbitration &amp; Interim Relief
          </h1>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "4px",
              background: "rgba(220, 38, 38, 0.12)",
              color: "#dc2626",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            48–72h Appointment Target
          </span>
        </div>
        <p className="lede" style={{ color: "var(--slate)", maxWidth: "860px", margin: 0 }}>
          Rapid institutional deployment of an Emergency Arbitrator to hear time-critical applications for interim protective orders before the formal arbitral tribunal is constituted.
        </p>
      </div>

      {/* Mandatory Statutory Disclaimer */}
      <div
        style={{
          background: "rgba(209, 154, 52, 0.08)",
          border: "1px solid rgba(209, 154, 52, 0.35)",
          borderRadius: "6px",
          padding: "16px 20px",
          marginBottom: "36px",
          display: "flex",
          gap: "14px",
          alignItems: "flex-start"
        }}
      >
        <span style={{ fontSize: "20px", lineHeight: 1 }}>🛡️</span>
        <div style={{ fontSize: "12.5px", color: "var(--ink)", lineHeight: "1.6" }}>
          <strong>MANDATORY STATUTORY QUALIFICATION &amp; NOTICE:</strong> Emergency Arbitrator procedures under JustNivaran Institutional Rules are engineered for urgent protective relief prior to tribunal constitution. <strong>Emergency relief does not remove, restrict, or prejudice any remedy or statutory right that may be available to either party before a competent court of law under applicable law, including Section 9 of the Arbitration and Conciliation Act, 1996.</strong>
        </div>
      </div>

      {/* 48-72h Procedural Framework */}
      <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "8px", padding: "28px", marginBottom: "40px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: "0 0 16px" }}>
          Institutional Emergency Arbitrator Deployment Window
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{ borderLeft: "3px solid #dc2626", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#dc2626", fontWeight: 700 }}>0 – 12 HOURS</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Filing &amp; Registry Triage</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Immediate prima facie review of urgency and jurisdiction.</div>
          </div>

          <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold-deep)", fontWeight: 700 }}>12 – 24 HOURS</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Notice to Counterparty</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Encrypted digital notice dispatched via WhatsApp &amp; Email.</div>
          </div>

          <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold-deep)", fontWeight: 700 }}>24 – 48 HOURS</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Emergency Arbitrator Appointed</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Sole emergency arbitrator designated with conflict clearance.</div>
          </div>

          <div style={{ borderLeft: "3px solid #16a34a", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>48 – 72 HOURS</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Hearing &amp; Interim Order</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Expedited virtual hearing and interim protective order rendered.</div>
          </div>
        </div>
      </div>

      {/* Emergency Filing Form */}
      <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "8px", padding: "36px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", margin: "0 0 8px" }}>
            File Urgent Application for Emergency Interim Relief
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--slate)", margin: 0 }}>
            Submit an application to the JustNivaran Emergency Arbitrator Registry Desk for immediate administrative processing.
          </p>
        </div>

        {submissionResult ? (
          /* Submission Success View */
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(220, 38, 38, 0.12)",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                margin: "0 auto 20px"
              }}
            >
              🚨
            </div>
            <h2 style={{ fontSize: "24px", color: "var(--ink)", marginBottom: "8px" }}>
              Emergency Application Transmitted to Registry Desk
            </h2>
            <p style={{ color: "var(--slate)", fontSize: "14px", maxWidth: "620px", margin: "0 auto 24px", lineHeight: "1.6" }}>
              Your emergency interim relief application has been registered with highest institutional priority. The Registry Administrator will initiate emergency scrutiny and notify the respondent.
            </p>

            <div
              style={{
                display: "inline-block",
                background: "var(--paper-hi)",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                padding: "20px 28px",
                marginBottom: "32px",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "#dc2626", textTransform: "uppercase", fontWeight: 700 }}>
                Emergency Relief Reference
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", marginTop: "4px" }}>
                {submissionResult.docket_number || "JN/EA/2026/0101"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "6px" }}>
                Relief Type: {formData.reliefCategory} &bull; Target Window: 48–72h
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <a
                href="/#tracker"
                className="btn gold"
                style={{ padding: "10px 20px", fontSize: "13.5px" }}
              >
                Track Emergency Docket →
              </a>
              <Link
                to="/arbitration-rules"
                className="btn ghost"
                style={{ padding: "10px 20px", fontSize: "13.5px" }}
              >
                Review Institutional Arbitration Rules
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div
                style={{
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  color: "#dc2626",
                  padding: "12px 16px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  marginBottom: "24px"
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Category of Emergency Relief */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                Specific Category of Emergency Interim Relief <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                name="reliefCategory"
                value={formData.reliefCategory}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px", background: "#ffffff" }}
              >
                <option value="Stay on Invocation of Bank Guarantee / Letter of Credit">Stay on Invocation of Bank Guarantee / Letter of Credit</option>
                <option value="Preservation & Custody of Subject Matter Assets / Goods">Preservation &amp; Custody of Subject Matter Assets / Goods</option>
                <option value="Injunction against Alienation / Transfer of Shares or Real Property">Injunction against Alienation / Transfer of Shares or Property</option>
                <option value="Restraint on Wrongful Termination of Critical Contract / SLA">Restraint on Wrongful Termination of Critical Contract / SLA</option>
                <option value="Protection of Intellectual Property, Source Code & Trade Secrets">Protection of IP, Source Code &amp; Trade Secrets</option>
                <option value="Status Quo & Non-Disposal of Funds / Bank Accounts">Status Quo &amp; Non-Disposal of Bank Accounts</option>
              </select>
            </div>

            {/* Parties Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              {/* Applicant */}
              <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px" }}>
                <h4 style={{ fontSize: "14px", color: "var(--ink)", margin: "0 0 12px" }}>
                  1. Applicant (Aggrieved Party)
                </h4>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Applicant Legal Name <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apex Infra Projects Pvt. Ltd."
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Counsel / Applicant Email <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="applicantEmail"
                      value={formData.applicantEmail}
                      onChange={handleInputChange}
                      placeholder="counsel@apexinfra.com"
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Emergency Phone / WhatsApp <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="applicantPhone"
                      value={formData.applicantPhone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Respondent */}
              <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px" }}>
                <h4 style={{ fontSize: "14px", color: "var(--ink)", margin: "0 0 12px" }}>
                  2. Respondent (Counterparty)
                </h4>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Respondent Legal Name <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="respondentName"
                      value={formData.respondentName}
                      onChange={handleInputChange}
                      placeholder="e.g. National Logistics Corp."
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Respondent Email Address <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="respondentEmail"
                      value={formData.respondentEmail}
                      onChange={handleInputChange}
                      placeholder="legal@nationallogistics.com"
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Respondent Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="respondentPhone"
                      value={formData.respondentPhone}
                      onChange={handleInputChange}
                      placeholder="+91 91234 56789"
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency & Irreparable Harm */}
            <div style={{ display: "grid", gap: "18px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  Grounds of Extreme Urgency &amp; Imminent Action <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  name="urgencyReason"
                  rows={3}
                  value={formData.urgencyReason}
                  onChange={handleInputChange}
                  placeholder="State the immediate impending event (e.g., Bank guarantee invocation letter issued on 4th Sept with payment demand expiring in 48 hours)..."
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  Demonstration of Irreparable Harm &amp; Balance of Convenience <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  name="irreparableHarm"
                  rows={3}
                  value={formData.irreparableHarm}
                  onChange={handleInputChange}
                  placeholder="Explain why financial compensation will be inadequate and how failure to grant interim protection will render the subsequent main arbitration infructuous..."
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px", fontFamily: "inherit" }}
                />
              </div>
            </div>

            {/* Notice & Agreement Particulars */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  Notice Status to Respondent
                </label>
                <select
                  name="noticeStatus"
                  value={formData.noticeStatus}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px", background: "#ffffff" }}
                >
                  <option value="Concurrent Electronic Notice Dispatched">Concurrent Notice Dispatched</option>
                  <option value="Prior Demand Notice Served (48h expired)">Prior Demand Notice Served</option>
                  <option value="Ex-Parte Interim Relief Requested (Justification attached)">Ex-Parte Interim Relief Requested</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  Estimated Subject-Matter Value (INR)
                </label>
                <input
                  type="number"
                  name="claimAmount"
                  value={formData.claimAmount}
                  onChange={handleInputChange}
                  placeholder="e.g. 15000000"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                />
              </div>
            </div>

            {/* DPDP Consent */}
            <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px", marginBottom: "28px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "var(--ink)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  style={{ marginTop: "3px", accentColor: "var(--gold-deep)" }}
                />
                <span>
                  I declare that all statements made herein are truthful and made for seeking bona fide emergency interim relief under JustNivaran Institutional Rules and the <strong>Digital Personal Data Protection Act, 2023</strong>. I acknowledge the qualification that this does not restrict statutory remedies before competent courts under applicable law (including Section 9 of the Arbitration and Conciliation Act, 1996).
                </span>
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={onOpenFileModal}
                className="btn ghost"
                style={{ padding: "10px 18px", fontSize: "13.5px" }}
              >
                Standard Dispute Filing
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn gold"
                style={{
                  padding: "11px 28px",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  background: "#dc2626",
                  color: "#ffffff"
                }}
              >
                {isSubmitting ? "Submitting Emergency Application..." : "Submit Emergency Relief Application (48–72h) 🚨"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
