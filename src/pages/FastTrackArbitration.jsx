import { useState } from "react";
import { Link } from "react-router-dom";
import { submitFastTrackRequest } from "../lib/api";

export default function FastTrackArbitration({ onOpenFileModal }) {
  const [consentMode, setConsentMode] = useState("unilateral"); // 'mutual' | 'unilateral'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    claimantName: "",
    claimantEntity: "Private Limited Company / Enterprise",
    claimantEmail: "",
    claimantPhone: "",
    respondentName: "",
    respondentEntity: "Private Enterprise / Sole Proprietor",
    respondentEmail: "",
    respondentPhone: "",
    contractDate: "",
    contractTitle: "",
    clauseText: "",
    claimAmount: "",
    claimSummary: "",
    reliefSought: "",
    specialization: "Commercial & Contractual Disputes"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.claimantName.trim() || !formData.claimantEmail.trim() || !formData.claimantPhone.trim()) {
      setErrorMessage("Please complete claimant contact details.");
      return;
    }

    if (!formData.respondentName.trim() || !formData.respondentEmail.trim()) {
      setErrorMessage("Please provide respondent name and email address for statutory notice dispatch.");
      return;
    }

    if (!formData.claimAmount || Number(formData.claimAmount) <= 0) {
      setErrorMessage("Please state a valid quantified claim amount in INR.");
      return;
    }

    if (!formData.claimSummary || formData.claimSummary.trim().length < 20) {
      setErrorMessage("Please provide a concise claim summary (min 20 characters).");
      return;
    }

    if (!dpdpConsent) {
      setErrorMessage("Please accept DPDP Act data processing terms to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFastTrackRequest({
        consent_mode: consentMode,
        claimant_name: formData.claimantName,
        claimant_entity: formData.claimantEntity,
        claimant_email: formData.claimantEmail,
        claimant_phone: formData.claimantPhone,
        respondent_name: formData.respondentName,
        respondent_entity: formData.respondentEntity,
        respondent_email: formData.respondentEmail,
        respondent_phone: formData.respondentPhone,
        contract_date: formData.contractDate,
        contract_title: formData.contractTitle,
        clause_text: formData.clauseText,
        claim_amount: Number(formData.claimAmount),
        claim_summary: formData.claimSummary,
        relief_sought: formData.reliefSought,
        specialization: formData.specialization
      });

      if (result.success) {
        setSubmissionResult(result.data);
      } else {
        setErrorMessage(result.error || "Fast-track filing could not be submitted.");
      }
    } catch (err) {
      console.error("Fast track submission error:", err);
      setErrorMessage("Network connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "1060px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <p className="eyebrow" style={{ color: "var(--slate)", marginBottom: "8px" }}>
          <b>Statutory Adjudication</b> Arbitration &amp; Conciliation Act, 1996
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: 0, color: "var(--ink)" }}>
            Fast-Track Arbitration under Section 29B
          </h1>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "4px",
              background: "rgba(209, 154, 52, 0.15)",
              color: "var(--gold-deep)",
              border: "1px solid rgba(209, 154, 52, 0.35)",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            6-Month Statutory Limit
          </span>
        </div>
        <p className="lede" style={{ color: "var(--slate)", maxWidth: "860px", margin: 0 }}>
          An expedited statutory arbitral mechanism under Indian law where a Sole Arbitrator resolves disputes strictly on written pleadings, digital evidence, and oral-hearing-free proceedings within 180 days.
        </p>
      </div>

      {/* Statutory Pillar Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "40px"
        }}
      >
        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Statutory Mandate</span>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Section 29B(1)</div>
          <div style={{ fontSize: "12.5px", color: "var(--slate)", marginTop: "6px", lineHeight: "1.5" }}>
            Parties agree in writing for fast-track dispute adjudication.
          </div>
        </div>

        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Tribunal Constitution</span>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Sole Arbitrator</div>
          <div style={{ fontSize: "12.5px", color: "var(--slate)", marginTop: "6px", lineHeight: "1.5" }}>
            Section 29B(2): Adjudicated exclusively by a single independent arbitrator.
          </div>
        </div>

        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Statutory Award Window</span>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--gold-deep)", marginTop: "4px" }}>Strict 6 Months</div>
          <div style={{ fontSize: "12.5px", color: "var(--slate)", marginTop: "6px", lineHeight: "1.5" }}>
            Section 29B(4): Award must be delivered within 6 months of entering reference.
          </div>
        </div>

        <div style={{ background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Legal Enforceability</span>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>Section 36 Court Decree</div>
          <div style={{ fontSize: "12.5px", color: "var(--slate)", marginTop: "6px", lineHeight: "1.5" }}>
            Binding final award enforceable directly in Civil Court under CPC 1908.
          </div>
        </div>
      </div>

      {/* Procedural Milestone Visualizer */}
      <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "8px", padding: "28px", marginBottom: "40px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--ink)", margin: "0 0 16px" }}>
          180-Day Statutory Fast-Track Milestone Timeline
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold-deep)", fontWeight: 600 }}>DAY 0 – 15</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Filing &amp; Appointment</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Notice of Reference served &amp; Sole Arbitrator confirmed.</div>
          </div>

          <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold-deep)", fontWeight: 600 }}>DAY 16 – 45</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Pleadings &amp; Defense</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Statement of Claim, Defense &amp; Counterclaim filed.</div>
          </div>

          <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold-deep)", fontWeight: 600 }}>DAY 46 – 90</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Document Scrutiny</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Evaluation of Section 63 BSA certified electronic records.</div>
          </div>

          <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--gold-deep)", fontWeight: 600 }}>DAY 91 – 135</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Optional Hearing</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Single virtual session held only if necessary or requested.</div>
          </div>

          <div style={{ borderLeft: "3px solid #16a34a", paddingLeft: "12px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>DAY 136 – 180</span>
            <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--ink)", marginTop: "2px" }}>Final Arbitral Award</div>
            <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "4px" }}>Digitally signed, stamped &amp; certified binding award rendered.</div>
          </div>
        </div>
      </div>

      {/* INTAKE / FILING DESK */}
      <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "8px", padding: "36px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--ink)", margin: "0 0 8px" }}>
            File Fast-Track Arbitration Reference (Section 29B)
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--slate)", margin: 0 }}>
            Initiate institutional fast-track arbitral proceedings or dispatch a statutory notice of reference to your counterparty.
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
                background: "rgba(34, 197, 94, 0.12)",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                margin: "0 auto 20px"
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: "24px", color: "var(--ink)", marginBottom: "8px" }}>
              Fast-Track Reference Successfully Registered
            </h2>
            <p style={{ color: "var(--slate)", fontSize: "14px", maxWidth: "620px", margin: "0 auto 24px", lineHeight: "1.6" }}>
              Your Section 29B reference has been assigned an institutional filing docket. Notice dispatch has been queued to the Respondent via official electronic registry channels.
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
              <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>
                Institutional Fast-Track Docket
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--gold-deep)", marginTop: "4px" }}>
                {submissionResult.docket_number || "JN/FT-ARB/2026/0101"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--slate)", marginTop: "6px" }}>
                Status: {submissionResult.status || (consentMode === "mutual" ? "Tribunal Constitution Active" : "Counterparty Notice Queued")} &bull; Mode: Section 29B
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <a
                href="/#tracker"
                className="btn gold"
                style={{ padding: "10px 20px", fontSize: "13.5px" }}
              >
                Track Live Docket in Registry →
              </a>
              <Link
                to="/fee-schedule"
                className="btn ghost"
                style={{ padding: "10px 20px", fontSize: "13.5px" }}
              >
                View Institutional Fee Schedule
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Consent Mode Selector */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "10px" }}>
                Arbitration Agreement &amp; Consent Status <span style={{ color: "#dc2626" }}>*</span>
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div
                  onClick={() => setConsentMode("mutual")}
                  style={{
                    border: `1.5px solid ${consentMode === "mutual" ? "var(--gold)" : "var(--line)"}`,
                    background: consentMode === "mutual" ? "rgba(209, 154, 52, 0.05)" : "var(--paper-hi)",
                    borderRadius: "6px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <input
                      type="radio"
                      name="consentMode"
                      checked={consentMode === "mutual"}
                      onChange={() => setConsentMode("mutual")}
                      style={{ accentColor: "var(--gold-deep)" }}
                    />
                    <strong style={{ fontSize: "14px", color: "var(--ink)" }}>Mutual Agreement in Place</strong>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--slate)", margin: "4px 0 0", paddingLeft: "24px" }}>
                    Underlying contract explicitly specifies Section 29B fast-track arbitration or both parties have executed joint written consent.
                  </p>
                </div>

                <div
                  onClick={() => setConsentMode("unilateral")}
                  style={{
                    border: `1.5px solid ${consentMode === "unilateral" ? "var(--gold)" : "var(--line)"}`,
                    background: consentMode === "unilateral" ? "rgba(209, 154, 52, 0.05)" : "var(--paper-hi)",
                    borderRadius: "6px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <input
                      type="radio"
                      name="consentMode"
                      checked={consentMode === "unilateral"}
                      onChange={() => setConsentMode("unilateral")}
                      style={{ accentColor: "var(--gold-deep)" }}
                    />
                    <strong style={{ fontSize: "14px", color: "var(--ink)" }}>Unilateral Reference Request</strong>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--slate)", margin: "4px 0 0", paddingLeft: "24px" }}>
                    Claimant invokes Section 21 reference notice and requests JustNivaran Registry to invite respondent to agree to Section 29B fast-track.
                  </p>
                </div>
              </div>
            </div>

            {/* Unilateral Alert Box */}
            {consentMode === "unilateral" && (
              <div
                style={{
                  background: "rgba(209, 154, 52, 0.1)",
                  border: "1px solid rgba(209, 154, 52, 0.4)",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "28px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: "20px", lineHeight: 1 }}>⚠️</span>
                <div style={{ fontSize: "12.5px", color: "var(--ink)", lineHeight: "1.6" }}>
                  <strong>COUNTERPARTY CONSENT PENDING:</strong> Under Section 29B(1) of the Arbitration &amp; Conciliation Act, 1996, fast-track proceedings require the written agreement of both parties. By submitting this request, JustNivaran Registry will dispatch a formal Section 21 Reference &amp; Section 29B Fast-Track Invitation to the Respondent. If the respondent declines or fails to reply within 30 days, the matter may proceed under Standard Arbitration (Section 29A) or Pre-Arbitral Mediation.
                </div>
              </div>
            )}

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

            {/* Section 1: Claimant Details */}
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ fontSize: "15px", color: "var(--ink)", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                1. Claimant (Filing Party) Information
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Claimant Legal Name / Entity <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="claimantName"
                    value={formData.claimantName}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Tech Solutions Pvt. Ltd."
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Entity Structure
                  </label>
                  <select
                    name="claimantEntity"
                    value={formData.claimantEntity}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px", background: "#ffffff" }}
                  >
                    <option value="Private Limited Company / Enterprise">Private Limited / Enterprise</option>
                    <option value="MSME Registered Enterprise">MSME (Udyam Registered)</option>
                    <option value="Partnership / LLP">Partnership / LLP</option>
                    <option value="Sole Proprietorship / Individual">Sole Proprietor / Individual</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Official Email <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="claimantEmail"
                    value={formData.claimantEmail}
                    onChange={handleInputChange}
                    placeholder="counsel@acme.com"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Official Phone / WhatsApp <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="claimantPhone"
                    value={formData.claimantPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Respondent Details */}
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ fontSize: "15px", color: "var(--ink)", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                2. Respondent (Counterparty) Information
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Respondent Legal Name / Entity <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="respondentName"
                    value={formData.respondentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Zenith Infra Logistics Ltd."
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Entity Structure
                  </label>
                  <select
                    name="respondentEntity"
                    value={formData.respondentEntity}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px", background: "#ffffff" }}
                  >
                    <option value="Private Enterprise / Sole Proprietor">Private Enterprise / Proprietor</option>
                    <option value="Public Limited / Corporate">Public Limited / Corporate</option>
                    <option value="LLP / Partnership">LLP / Partnership</option>
                    <option value="Government / PSU Entity">Government / PSU Entity</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Respondent Email Address <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="respondentEmail"
                    value={formData.respondentEmail}
                    onChange={handleInputChange}
                    placeholder="legal@zenith.com"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--slate)", marginTop: "4px", display: "block" }}>
                    Official statutory notice will be transmitted to this address.
                  </span>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Respondent Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="respondentPhone"
                    value={formData.respondentPhone}
                    onChange={handleInputChange}
                    placeholder="+91 91234 56789"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Dispute Particulars */}
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ fontSize: "15px", color: "var(--ink)", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                3. Dispute Particulars &amp; Arbitration Clause
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Disputed Principal Claim Amount (INR) <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="claimAmount"
                    value={formData.claimAmount}
                    onChange={handleInputChange}
                    placeholder="e.g. 4500000"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Arbitrator Specialization Domain
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "14px", background: "#ffffff" }}
                  >
                    <option value="Commercial & Contractual Disputes">Commercial &amp; Contractual Disputes</option>
                    <option value="Technology, Software & Intellectual Property">Technology, Software &amp; IP</option>
                    <option value="Construction & Infrastructure">Construction &amp; Infrastructure</option>
                    <option value="Banking, Fintech & Financial Services">Banking, Fintech &amp; Financial Services</option>
                    <option value="Supply Chain & Maritime Logistics">Supply Chain &amp; Maritime Logistics</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  Summary of Claim &amp; Default <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  name="claimSummary"
                  rows={4}
                  value={formData.claimSummary}
                  onChange={handleInputChange}
                  placeholder="Set out the concise material facts, underlying agreement reference, default event, and principal demand..."
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "4px", fontSize: "13.5px", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  Relief &amp; Final Remedy Claimed
                </label>
                <input
                  type="text"
                  name="reliefSought"
                  value={formData.reliefSought}
                  onChange={handleInputChange}
                  placeholder="e.g. Award for INR 45,00,000 + 18% p.a. interest from due date + arbitral costs"
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
                  I confirm that all submissions are accurate and made in accordance with <strong>Section 29B of the Arbitration and Conciliation Act, 1996</strong> and the <strong>Digital Personal Data Protection Act, 2023</strong>. I authorize JustNivaran Registry to issue electronic notices of reference to the Respondent.
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
                Standard Arbitration Modal
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
                  cursor: isSubmitting ? "not-allowed" : "pointer"
                }}
              >
                {isSubmitting ? "Registering Section 29B Reference..." : "File Section 29B Reference (6-Month Award) ⚖️"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
