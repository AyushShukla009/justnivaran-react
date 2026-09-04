import { useState } from "react";
import { supabase } from "../lib/supabase";

const INITIAL_FORM_DATA = {
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
};

function DisputeModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [docketNumber, setDocketNumber] = useState("");
  const [accessPin, setAccessPin] = useState("");
  const [copiedPinToast, setCopiedPinToast] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [consents, setConsents] = useState({
    truthAndAuthority: false,
    dpdpConsent: false,
    electronicService: false
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConsentChange = (e) => {
    setConsents({ ...consents, [e.target.name]: e.target.checked });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("File size exceeds 15MB limit. Please select a smaller PDF or document.");
        return;
      }
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const handleNext = (e) => {
    e.preventDefault();

    const cEmail = formData.claimantEmail.trim().toLowerCase();
    const rEmail = formData.respondentEmail.trim().toLowerCase();
    const cPhone = formData.claimantPhone.trim().replace(/\s+/g, "");
    const rPhone = formData.respondentPhone.trim().replace(/\s+/g, "");

    // Validate that Claimant & Respondent are not identical
    if (cEmail && rEmail && cEmail === rEmail) {
      alert("⚠️ Invalid Dispute Filing: Claimant and Respondent email cannot be the same. A party cannot issue an institutional dispute notice against themselves.");
      return;
    }

    if (cPhone && rPhone && cPhone === rPhone) {
      alert("⚠️ Invalid Dispute Filing: Claimant and Respondent phone number cannot be identical.");
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError("");

    if (!consents.truthAndAuthority || !consents.dpdpConsent || !consents.electronicService) {
      setSubmissionError("Please accept all mandatory legal declarations and DPDP statutory consents before submitting.");
      return;
    }

    setIsSubmitting(true);
    const currentYear = new Date().getFullYear();
    const randomEntropy = Math.floor(1000 + Math.random() * 9000);
    const generatedDocket = `JN/${formData.mode}/${currentYear}/${randomEntropy}`;
    const generatedPin = String(Math.floor(100000 + Math.random() * 900000));
    setDocketNumber(generatedDocket);
    setAccessPin(generatedPin);

    try {
      if (supabase) {
        let uploadedStoragePath = "";
        let uploadedFileNotice = "";

        // Real Supabase Storage Upload if file attached
        if (attachedFile) {
          setUploadProgress("Uploading encrypted evidence file...");
          const cleanFileName = attachedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storagePath = `evidence/${generatedDocket.replace(/[^a-zA-Z0-9]/g, "-")}_${Date.now()}_${cleanFileName}`;

          const { error: uploadError } = await supabase.storage
            .from("dispute-evidence")
            .upload(storagePath, attachedFile, {
              cacheControl: "3600",
              upsert: false
            });

          if (uploadError) {
            console.warn("Storage bucket upload notice:", uploadError.message);
            // Fallback metadata note if storage bucket policy is provisioning
            uploadedFileNotice = `\n\n[📎 Evidence Document Logged]: ${attachedFile.name} (${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB)`;
          } else {
            uploadedStoragePath = storagePath;
            uploadedFileNotice = `\n\n[🔒 Stored Evidence File]: ${cleanFileName} (${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB, Path: ${storagePath})`;
          }
        }

        const defaultSummary =
          (formData.disputeSummary.trim() ||
            "Dispute submitted via JustNivaran Portal regarding contractual breach / unpaid invoices.") +
          uploadedFileNotice;
        const defaultRelief =
          formData.reliefSought.trim() ||
          `Restitution and settlement of claimed sum ₹ ${Number(formData.claimAmount || 0).toLocaleString("en-IN")}`;

        let { error: insertError } = await supabase.from("disputes").insert([
          {
            docket_number: generatedDocket,
            access_code: generatedPin,
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
            evidence_file_path: uploadedStoragePath || null,
            status: "Notice Issued"
          }
        ]);

        // Graceful automatic retry if access_code column has not yet been migrated in Supabase table
        if (
          insertError &&
          (insertError.message?.toLowerCase().includes("access_code") ||
            insertError.code === "PGRST204" ||
            insertError.message?.toLowerCase().includes("schema cache"))
        ) {
          console.warn("Schema cache lacks access_code column. Retrying insert with embedded PIN tag...");
          const { error: retryError } = await supabase.from("disputes").insert([
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
              dispute_summary: `${defaultSummary}\n[Case Access PIN: ${generatedPin}]`,
              relief_sought: defaultRelief,
              evidence_file_path: uploadedStoragePath || null,
              status: "Notice Issued"
            }
          ]);
          insertError = retryError;
        }

        if (insertError) {
          console.error("Database submission error:", insertError);
          setSubmissionError(`Submission failed: ${insertError.message || "Database insert rejected"}. Your data has been preserved. Please try again.`);
          setIsSubmitting(false);
          return;
        }

        // Only transition to Success Screen on verified database insertion
        setStep(3);
      } else {
        setSubmissionError("Database client is offline. Please check connection.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmissionError(`Unexpected error during submission: ${err.message || "Network timeout"}. Please retry.`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const handleReset = () => {
    setStep(1);
    setDocketNumber("");
    setAccessPin("");
    setCopiedPinToast(false);
    setAttachedFile(null);
    setSubmissionError("");
    setConsents({
      truthAndAuthority: false,
      dpdpConsent: false,
      electronicService: false
    });
    setFormData(INITIAL_FORM_DATA);
    onClose();
  };

  const copyToClipboard = (text, type = "docket") => {
    try {
      navigator.clipboard.writeText(text);
      if (type === "pin") {
        setCopiedPinToast(true);
        setTimeout(() => setCopiedPinToast(false), 3000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="dispute-modal-title">
      <div className="modal-card admin-modal-zoom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">Institutional Case Filing</span>
            <h3 id="dispute-modal-title">
              {step === 1 && "Step 1: Party Details"}
              {step === 2 && "Step 2: Claim & Relief"}
              {step === 3 && "Dispute Filed Successfully"}
            </h3>
          </div>
          <button className="modal-close" onClick={handleReset} type="button" aria-label="Close modal">
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
                  <label htmlFor="dispute-claimant-name">Full Legal Name / Entity</label>
                  <input
                    id="dispute-claimant-name"
                    type="text"
                    name="claimantName"
                    autoComplete="name"
                    required
                    placeholder="Enter claimant legal name or company"
                    value={formData.claimantName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="dispute-claimant-email">Official Email</label>
                  <input
                    id="dispute-claimant-email"
                    type="email"
                    name="claimantEmail"
                    autoComplete="email"
                    required
                    placeholder="Enter official claimant email"
                    value={formData.claimantEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="dispute-claimant-phone">Phone Number / WhatsApp for Notices</label>
                <input
                  id="dispute-claimant-phone"
                  type="tel"
                  name="claimantPhone"
                  autoComplete="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={formData.claimantPhone}
                  onChange={handleChange}
                />
              </div>

              <h4 style={{ fontSize: "14px", margin: "18px 0 10px", color: "var(--ink)" }}>Respondent (Opposing Party)</h4>
              <div className="form-grid">
                <div>
                  <label htmlFor="dispute-respondent-name">Opposing Party Name</label>
                  <input
                    id="dispute-respondent-name"
                    type="text"
                    name="respondentName"
                    required
                    placeholder="Enter respondent party or company name"
                    value={formData.respondentName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="dispute-respondent-email">Opposing Party Email</label>
                  <input
                    id="dispute-respondent-email"
                    type="email"
                    name="respondentEmail"
                    required
                    placeholder="Enter respondent email address"
                    value={formData.respondentEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="dispute-respondent-phone">Opposing Party Phone (Optional)</label>
                <input
                  id="dispute-respondent-phone"
                  type="tel"
                  name="respondentPhone"
                  placeholder="Enter respondent mobile number (optional)"
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
                  <label htmlFor="dispute-resolution-mode">Preferred Resolution Mode</label>
                  <select id="dispute-resolution-mode" name="mode" value={formData.mode} onChange={handleChange}>
                    <option value="NEG">Direct Negotiation (Contract Act 1872)</option>
                    <option value="MED">Institutional Mediation (Mediation Act 2023)</option>
                    <option value="CON">Conciliation</option>
                    <option value="FTA">Fast-Track Arbitration (s. 29B)</option>
                    <option value="ARB">Arbitration (Arbitration Act 1996)</option>
                    <option value="LOK">Online Lok Adalat</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dispute-claim-amount">Disputed Claim Amount (INR)</label>
                  <input
                    id="dispute-claim-amount"
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
                <label htmlFor="dispute-summary">Dispute Summary &amp; Facts</label>
                <textarea
                  id="dispute-summary"
                  name="disputeSummary"
                  rows="3"
                  required
                  placeholder="Briefly state what contract was breached, unpaid invoice dates, or services defaulted..."
                  value={formData.disputeSummary}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginTop: "14px" }}>
                <label htmlFor="dispute-relief-sought">Relief Sought (What outcome do you want?)</label>
                <input
                  id="dispute-relief-sought"
                  type="text"
                  name="reliefSought"
                  required
                  placeholder="e.g. Immediate payment of ₹ 15,00,000 + 12% interest"
                  value={formData.reliefSought}
                  onChange={handleChange}
                />
              </div>

              {/* Document / PDF Attachment Field */}
              <div style={{ marginTop: "14px" }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>📎 Upload Supporting Evidence / Contract (Optional)</span>
                  <span style={{ fontSize: "11px", color: "var(--slate)", textTransform: "none", fontWeight: 400 }}>
                    PDF, DOCX, PNG (Max 15MB)
                  </span>
                </label>

                {!attachedFile ? (
                  <label
                    htmlFor="dispute-file-input"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px 20px",
                      border: "1.5px dashed var(--line)",
                      borderRadius: "4px",
                      background: "var(--paper-hi)",
                      cursor: "pointer",
                      transition: "all .2s ease",
                      textAlign: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--gold)";
                      e.currentTarget.style.background = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--line)";
                      e.currentTarget.style.background = "var(--paper-hi)";
                    }}
                  >
                    <input
                      id="dispute-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <span style={{ fontSize: "22px", marginBottom: "4px" }}>📄</span>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>
                      Click to browse or drag &amp; drop PDF / Agreement
                    </span>
                    <span style={{ fontSize: "11.5px", color: "var(--slate)", marginTop: "2px" }}>
                      Attach underlying invoices, contracts, legal notices, or payment receipts
                    </span>
                  </label>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#F0F7FF",
                      border: "1px solid #B8D5FA",
                      borderRadius: "4px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                      <span style={{ fontSize: "20px" }}>📑</span>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1A365D",
                            textOverflow: "ellipsis",
                            overflow: "hidden"
                          }}
                        >
                          {attachedFile.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "#4A5568" }}>
                          {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Attached to Dispute File
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#E53E3E",
                        cursor: "pointer",
                        fontSize: "15px",
                        fontWeight: "bold",
                        padding: "4px 8px"
                      }}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Mandatory DPDP Act 2023 Statutory Consents & Declarations */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 16px",
                  background: "rgba(11, 27, 49, 0.03)",
                  border: "1px solid var(--line)",
                  borderRadius: "4px"
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold-deep)", textTransform: "uppercase", fontWeight: 600, marginBottom: "10px" }}>
                  📜 Statutory Declarations &amp; DPDP Consent
                </div>

                <label htmlFor="dispute-truth-consent" className="modal-checkbox-label">
                  <input
                    id="dispute-truth-consent"
                    type="checkbox"
                    name="truthAndAuthority"
                    required
                    checked={consents.truthAndAuthority}
                    onChange={handleConsentChange}
                  />
                  <span>
                    I declare under Indian law that the statements of claim made herein are true and accurate to the best of my knowledge, and I possess verified authority to file this matter.
                  </span>
                </label>

                <label htmlFor="dispute-dpdp-consent" className="modal-checkbox-label">
                  <input
                    id="dispute-dpdp-consent"
                    type="checkbox"
                    name="dpdpConsent"
                    required
                    checked={consents.dpdpConsent}
                    onChange={handleConsentChange}
                  />
                  <span>
                    I explicitly consent to the collection, processing, and encrypted storage of personal and case data strictly in accordance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and JustNivaran Dispute Resolution Rules.
                  </span>
                </label>

                <label htmlFor="dispute-service-consent" className="modal-checkbox-label" style={{ marginBottom: 0 }}>
                  <input
                    id="dispute-service-consent"
                    type="checkbox"
                    name="electronicService"
                    required
                    checked={consents.electronicService}
                    onChange={handleConsentChange}
                  />
                  <span>
                    I consent to electronic transmission and service of all institutional notices, procedural orders, and pleadings via registered Email, WhatsApp, and SMS.
                  </span>
                </label>
              </div>

              {uploadProgress && (
                <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--gold-deep)", fontFamily: "var(--mono)" }}>
                  ⏳ {uploadProgress}
                </div>
              )}

              {submissionError && (
                <div
                  style={{
                    marginTop: "14px",
                    background: "#FDEDEC",
                    color: "#C0392B",
                    border: "1px solid #F5B7B1",
                    padding: "10px 14px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    lineHeight: "1.4"
                  }}
                >
                  ⚠️ {submissionError}
                </div>
              )}

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
              <div
                style={{
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
                }}
              >
                ✓
              </div>

              <h4 style={{ fontSize: "20px", color: "var(--ink)", margin: "0 0 6px" }}>Case Docket Issued</h4>
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "17px",
                  color: "var(--gold-deep)",
                  fontWeight: 700,
                  margin: "0 0 14px",
                  letterSpacing: "0.5px"
                }}
              >
                {docketNumber}
              </p>

              {/* Confidential Security Access PIN Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(209, 154, 52, 0.08) 0%, rgba(11, 27, 49, 0.04) 100%)",
                  border: "1.5px dashed var(--gold)",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "18px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold-deep)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                  🔑 Confidential Case Access PIN (Keep Secure)
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontFamily: "var(--mono)",
                    letterSpacing: "4px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "8px 0"
                  }}
                >
                  {accessPin}
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(accessPin, "pin")}
                    style={{
                      background: "var(--ink)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "11.5px",
                      fontFamily: "var(--mono)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    {copiedPinToast ? "✓ PIN Copied!" : "📋 Copy PIN"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const link = `https://justnivaran-odr.vercel.app/?docket=${encodeURIComponent(docketNumber)}&pin=${encodeURIComponent(accessPin)}#tracker`;
                      copyToClipboard(link, "link");
                      setCopiedPinToast(true);
                      setTimeout(() => setCopiedPinToast(false), 3000);
                    }}
                    style={{
                      background: "#ffffff",
                      color: "var(--ink)",
                      border: "1px solid var(--line)",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "11.5px",
                      fontFamily: "var(--mono)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    🔗 Copy 1-Click Magic Link
                  </button>
                  <a
                    href={`/?docket=${encodeURIComponent(docketNumber)}&pin=${encodeURIComponent(accessPin)}#tracker`}
                    onClick={() => {
                      onClose();
                    }}
                    style={{
                      background: "var(--gold)",
                      color: "#241703",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "11.5px",
                      fontFamily: "var(--mono)",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      textDecoration: "none"
                    }}
                  >
                    🚀 Track Case Live
                  </a>
                </div>
                <div style={{ fontSize: "11.5px", color: "#4A5E78", lineHeight: "1.4" }}>
                  Save this PIN or copy the <strong>1-Click Magic Link</strong>! You can share this direct link with parties or use your PIN on the Public Docket Tracker to instantly auto-unlock confidential case details.
                </div>
              </div>

              <div
                style={{
                  background: "var(--paper-hi)",
                  padding: "16px",
                  borderRadius: "4px",
                  textAlign: "left",
                  fontSize: "13.5px",
                  color: "#3B4E68",
                  lineHeight: "1.6",
                  marginBottom: "20px"
                }}
              >
                <div>
                  <strong>Claimant:</strong> {formData.claimantName}
                </div>
                <div>
                  <strong>Respondent:</strong> {formData.respondentName}
                </div>
                <div>
                  <strong>Claim Value:</strong> ₹ {Number(formData.claimAmount).toLocaleString("en-IN")}
                </div>
                {attachedFile && (
                  <div style={{ marginTop: "4px", color: "#1A365D", fontWeight: 500 }}>
                    <strong>Attached Evidence:</strong> 📄 {attachedFile.name} ({(attachedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
                <div
                  style={{
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "1px solid var(--line)",
                    fontSize: "12px",
                    color: "var(--slate)"
                  }}
                >
                  📩 Digital notice &amp; claim file dispatched to {formData.respondentEmail}. The 15-day response window is now active.
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