/**
 * JustNivaran AI Dispute Assessment Wizard
 * Institutional Intake & Statutory Risk Predictor
 *
 * Design Language: Navy (--ink: #0b1b31) + Gold (--gold: #d19a34), serif headings, mono labels.
 */

import { useState, useEffect, useRef } from "react";
import { fetchAILegalOutcome, checkAIEngineHealth, generateClientInstitutionalAssessment } from "../lib/api";
import { BENCHMARK_PRESETS } from "../lib/deterministicEngine";
import LegalOutcomeReport from "../components/LegalOutcomeReport";

const ALLOWED_CATEGORIES = [
  "Commercial Contract & Supply Default",
  "MSME Delayed Payments (MSMED Act 2006)",
  "Construction, EPC & Infrastructure Delays",
  "IT Services, Software SLA & Technology Licensing",
  "Banking, NBFC & Financial Debt Recovery",
  "Partnership, Joint Venture & Shareholder Disputes",
  "Intellectual Property & Licensing Default"
];

const EVIDENCE_OPTIONS = [
  { id: "invoices", label: "Commercial Tax Invoices", icon: "📄" },
  { id: "delivery_proof", label: "Signed / Stamped Delivery Challan", icon: "📦" },
  { id: "purchase_order", label: "Purchase Order / Work Order", icon: "📑" },
  { id: "contract", label: "Executed Master Contract / Agreement", icon: "📜" },
  { id: "emails_whatsapp", label: "Email / WhatsApp Correspondence", icon: "💬" },
  { id: "part_payment_proof", label: "Bank Statement / Part-Payment Proof", icon: "🏦" },
  { id: "udyam_certificate", label: "Udyam Registration Certificate (MSE)", icon: "🏭" },
  { id: "joint_measurement_sheets", label: "Work Completion / Joint Measurement Sheet", icon: "📐" }
];

const PROGRESS_STAGES = [
  "Calculating limitation clock under Limitation Act, 1963...",
  "Assessing Section 12A Commercial Courts Act pre-institution requirements...",
  "Checking MSMED statutory interest and Section 15 credit compliance...",
  "Evaluating strength ratings and evidentiary gaps...",
  "Synthesizing institutional dossier and forum comparison matrix..."
];

function formatIndianNumber(val) {
  if (!val && val !== 0) return "";
  const numStr = String(val).replace(/[^0-9]/g, "");
  if (!numStr) return "";
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
}

function getIndianCurrencyWords(val) {
  const n = Number(String(val).replace(/[^0-9]/g, ""));
  if (isNaN(n) || n <= 0) return "";
  if (n >= 10000000) {
    return `(₹ ${(n / 10000000).toFixed(2).replace(/\.00$/, "")} Crore)`;
  }
  if (n >= 100000) {
    return `(₹ ${(n / 100000).toFixed(2).replace(/\.00$/, "")} Lakh)`;
  }
  if (n >= 1000) {
    return `(₹ ${(n / 1000).toFixed(1).replace(/\.0$/, "")} Thousand)`;
  }
  return "";
}

const INITIAL_FORM_DATA = {
  category: "Commercial Contract & Supply Default",
  claimValue: "",
  enterpriseType: "None", // 'None' | 'Micro' | 'Small' | 'Medium'
  udyamRegisteredAtContract: false,
  acceptanceDate: "",
  agreedCreditDays: 45,
  breachDate: "",
  factsSummary: "",
  hasWrittenContract: true,
  hasArbitrationClause: true,
  arbitrationClauseStatus: "Yes - Institutional Arbitration Clause (Specified Institution)",
  hasNoticeSent: false,
  urgentInterimRelief: false,
  signedWrittenAcknowledgment: false,
  acknowledgmentDate: "",
  acknowledgmentDocumentType: "",
  evidenceList: ["invoices", "delivery_proof", "contract"],
  consentAccepted: true
};

export default function LegalAssessment() {
  const [activeView, setActiveView] = useState("intake"); // 'intake' | 'report'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStageIndex, setProgressStageIndex] = useState(0);
  const [engineHealth, setEngineHealth] = useState({
    status: "active",
    keyConfigured: true,
    model: "Anthropic Claude Sonnet 5.5",
    message: "AI Dispute Assessment Active"
  });
  const [aiReport, setAiReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const abortControllerRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    let isMounted = true;
    checkAIEngineHealth().then((health) => {
      if (isMounted) setEngineHealth(health);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setProgressStageIndex((prev) => (prev < PROGRESS_STAGES.length - 1 ? prev + 1 : prev));
    }, 2400);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCurrencyChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      claimValue: rawVal
    }));
  };

  const handleEvidenceToggle = (itemId) => {
    setFormData((prev) => {
      const exists = prev.evidenceList.includes(itemId);
      const updated = exists
        ? prev.evidenceList.filter((id) => id !== itemId)
        : [...prev.evidenceList, itemId];
      return { ...prev, evidenceList: updated };
    });
  };

  const handleLoadPreset = (preset) => {
    setFormData({
      category: preset.category,
      claimValue: String(preset.claimValue),
      enterpriseType: preset.enterpriseType || "None",
      udyamRegisteredAtContract: Boolean(preset.udyamRegisteredAtContract),
      acceptanceDate: preset.acceptanceDate || "",
      agreedCreditDays: preset.agreedCreditDays || 45,
      breachDate: preset.breachDate || "",
      factsSummary: preset.factsSummary || preset.breachDetails || "",
      hasWrittenContract: preset.hasWrittenContract !== undefined ? preset.hasWrittenContract : true,
      hasArbitrationClause: Boolean(preset.hasArbitrationClause),
      arbitrationClauseStatus: preset.arbitrationClauseStatus || "Yes",
      hasNoticeSent: Boolean(preset.hasNoticeSent),
      urgentInterimRelief: Boolean(preset.urgentInterimRelief),
      signedWrittenAcknowledgment: Boolean(preset.signedWrittenAcknowledgment),
      acknowledgmentDate: preset.acknowledgmentDate || "",
      acknowledgmentDocumentType: preset.acknowledgmentDocumentType || "",
      evidenceList: Array.isArray(preset.evidenceList) ? preset.evidenceList : [],
      consentAccepted: true
    });
    setErrorMessage("");
  };

  const validateForm = () => {
    setErrorMessage("");
    const val = Number(formData.claimValue);
    if (!formData.claimValue || isNaN(val) || val <= 0) {
      setErrorMessage("Please enter a valid Disputed Claim Quantum (in INR).");
      return false;
    }
    if (!formData.factsSummary || formData.factsSummary.trim().length < 20) {
      setErrorMessage("Please provide at least 20 characters summarizing the dispute facts and nature of breach.");
      return false;
    }
    if (!formData.breachDate) {
      setErrorMessage("Please select the Date of Breach / Default to calculate statutory limitation.");
      return false;
    }
    return true;
  };

  const executeAssessment = async () => {
    if (!validateForm()) return;

    setProgressStageIndex(0);
    setIsAnalyzing(true);
    abortControllerRef.current = new AbortController();

    const payload = {
      ...formData,
      claimValue: Number(formData.claimValue)
    };

    try {
      const result = await fetchAILegalOutcome(payload, abortControllerRef.current.signal);
      if (result.success && result.data) {
        setAiReport(result.data);
        setActiveView("report");
        window.scrollTo({ top: 120, behavior: "smooth" });
      } else {
        const fallback = generateClientInstitutionalAssessment(payload);
        setAiReport(fallback);
        setActiveView("report");
        window.scrollTo({ top: 120, behavior: "smooth" });
      }
    } catch (err) {
      console.warn("Dispute assessment network fallback invoked:", err?.message || err);
      const fallback = generateClientInstitutionalAssessment(payload);
      setAiReport(fallback);
      setActiveView("report");
      window.scrollTo({ top: 120, behavior: "smooth" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAiReport(null);
    setActiveView("intake");
    setErrorMessage("");
  };

  return (
    <main className="wrap legal-assessment-main" style={{ paddingBlock: "48px 90px", maxWidth: "1100px" }}>
      {/* Top Breadcrumb & Engine Health (Screen Only) */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        <p className="eyebrow" style={{ margin: 0 }}>
          <b>Institutional Intelligence</b> JustNivaran ODR Centre
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "11.5px",
            fontFamily: "var(--mono)",
            color: "#15803d",
            fontWeight: 600
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a" }} />
          <span>{engineHealth.message || "AI Dispute Assessment Active"}</span>
        </div>
      </div>

      {/* Main Title Header (Screen Only) */}
      <div className="no-print" style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "clamp(30px, 4.2vw, 44px)", margin: "0 0 10px 0", color: "var(--ink)" }}>
          AI Dispute Assessment
        </h1>
        <p className="lede" style={{ color: "var(--slate)", margin: 0, maxWidth: "900px" }}>
          Authoritative institutional analysis uniting deterministic Indian statutory rules (Limitation Act 1963, Commercial Courts Act 2015, MSMED Act 2006) with advanced Claude Sonnet 5.5 legal reasoning.
        </p>
      </div>

      {activeView === "report" && aiReport ? (
        <LegalOutcomeReport report={aiReport} onReset={handleReset} />
      ) : (
        <div style={{ display: "grid", gap: "32px" }}>
          {/* Preset Benchmark Quick-Load Bar */}
          <section
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "20px 24px",
              boxShadow: "0 2px 8px rgba(11, 27, 49, 0.04)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                ⚡ Quick-Load Institutional Benchmark Presets (One-Click)
              </span>
              <span style={{ fontSize: "12px", color: "var(--slate)" }}>
                Pre-configured synthetic case facts for immediate demonstration
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {BENCHMARK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="btn ghost"
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    borderColor: formData.category === preset.category && formData.claimValue === String(preset.claimValue) ? "var(--gold)" : "var(--line)",
                    background: formData.category === preset.category && formData.claimValue === String(preset.claimValue) ? "rgba(209, 154, 52, 0.08)" : "#fafbfc",
                    color: "var(--ink)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  <span style={{ color: "var(--ink)" }}>{preset.label}</span>
                  <span style={{ fontSize: "11px", color: "var(--slate)", fontWeight: 400 }}>
                    {preset.category}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Intake Form Container */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeAssessment();
            }}
            style={{
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "32px",
              boxShadow: "0 6px 20px rgba(11, 27, 49, 0.05)"
            }}
          >
            {/* Section 1: Claim Profile & Statutory Quantum */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Step 1 &bull; Claim Profile &amp; Quantum
              </div>
              <h2 style={{ fontSize: "20px", margin: "0 0 20px 0", color: "var(--ink)" }}>
                Dispute Classification &amp; Financial Scope
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Commercial Dispute Category <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", fontSize: "14px", background: "#ffffff" }}
                  >
                    {ALLOWED_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Disputed Claim Quantum (INR) <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "10px", color: "var(--slate)", fontWeight: 600, fontSize: "14px" }}>₹</span>
                    <input
                      type="text"
                      name="claimValue"
                      value={formatIndianNumber(formData.claimValue)}
                      onChange={handleCurrencyChange}
                      placeholder="e.g. 15,00,000"
                      style={{ width: "100%", padding: "10px 12px 10px 28px", borderRadius: "6px", border: "1px solid var(--line)", fontSize: "14.5px", fontWeight: 600, fontFamily: "var(--mono)" }}
                    />
                  </div>
                  {formData.claimValue && (
                    <div style={{ fontSize: "12px", color: "var(--gold-deep)", marginTop: "4px", fontWeight: 500 }}>
                      Formatted: ₹ {formatIndianNumber(formData.claimValue)} {getIndianCurrencyWords(formData.claimValue)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Enterprise Classification & MSMED Act */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Step 2 &bull; Enterprise Status &amp; MSMED Act (2006)
              </div>
              <h2 style={{ fontSize: "20px", margin: "0 0 16px 0", color: "var(--ink)" }}>
                Supplier Classification (Sections 15, 16 &amp; 18)
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Enterprise Category (MSMED Act)
                  </label>
                  <select
                    name="enterpriseType"
                    value={formData.enterpriseType}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", fontSize: "14px" }}
                  >
                    <option value="None">Non-MSME / Large Corporate / Individual</option>
                    <option value="Micro">Micro Enterprise (Investment ≤ ₹1 Cr / Turnover ≤ ₹5 Cr)</option>
                    <option value="Small">Small Enterprise (Investment ≤ ₹10 Cr / Turnover ≤ ₹50 Cr)</option>
                    <option value="Medium">Medium Enterprise (Sections 15-16 do not apply)</option>
                  </select>
                </div>

                {(formData.enterpriseType === "Micro" || formData.enterpriseType === "Small") && (
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                      Held Udyam Registration at Date of Contract?
                    </label>
                    <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="udyamRegisteredAtContract"
                          checked={formData.udyamRegisteredAtContract === true}
                          onChange={() => setFormData((prev) => ({ ...prev, udyamRegisteredAtContract: true }))}
                        />
                        <span>Yes (Silpi Industries Compliant)</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="udyamRegisteredAtContract"
                          checked={formData.udyamRegisteredAtContract === false}
                          onChange={() => setFormData((prev) => ({ ...prev, udyamRegisteredAtContract: false }))}
                        />
                        <span>No / Post-Contract Registration</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {(formData.enterpriseType === "Micro" || formData.enterpriseType === "Small") && formData.udyamRegisteredAtContract && (
                <div style={{ background: "rgba(209, 154, 52, 0.08)", border: "1px solid rgba(209, 154, 52, 0.3)", borderRadius: "6px", padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Date of Goods / Service Acceptance
                    </label>
                    <input
                      type="date"
                      name="acceptanceDate"
                      value={formData.acceptanceDate}
                      onChange={handleInputChange}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "4px", border: "1px solid var(--line)", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Agreed Credit Days (Max 45 Days per Sec 15)
                    </label>
                    <input
                      type="number"
                      max="45"
                      min="0"
                      name="agreedCreditDays"
                      value={formData.agreedCreditDays}
                      onChange={handleInputChange}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "4px", border: "1px solid var(--line)", fontSize: "13px" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Material Facts & Limitation Clock */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Step 3 &bull; Chronology &amp; Limitation (Limitation Act 1963)
              </div>
              <h2 style={{ fontSize: "20px", margin: "0 0 16px 0", color: "var(--ink)" }}>
                Breach Timeline &amp; Section 18 Acknowledgment
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Date of Breach / Cause of Action <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="breachDate"
                    value={formData.breachDate}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", fontSize: "14px" }}
                  />
                  <span style={{ fontSize: "11.5px", color: "var(--slate)", marginTop: "4px", display: "block" }}>
                    Statutory 3-year clock starts from this date (Articles 55 &amp; 113).
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Signed Written Acknowledgment of Liability to Pay? (Sec 18)
                  </label>
                  <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="signedWrittenAcknowledgment"
                        checked={formData.signedWrittenAcknowledgment === true}
                        onChange={() => setFormData((prev) => ({ ...prev, signedWrittenAcknowledgment: true }))}
                      />
                      <span>Yes (Possible Reset, Subject to Review)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="signedWrittenAcknowledgment"
                        checked={formData.signedWrittenAcknowledgment === false}
                        onChange={() => setFormData((prev) => ({ ...prev, signedWrittenAcknowledgment: false }))}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {formData.signedWrittenAcknowledgment && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Date of Written Acknowledgment / Part-Payment
                    </label>
                    <input
                      type="date"
                      name="acknowledgmentDate"
                      value={formData.acknowledgmentDate}
                      onChange={handleInputChange}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "4px", border: "1px solid var(--line)", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      Document Nature (e.g. Joint Site Sheet, Balance Confirmation)
                    </label>
                    <input
                      type="text"
                      name="acknowledgmentDocumentType"
                      value={formData.acknowledgmentDocumentType}
                      onChange={handleInputChange}
                      placeholder="e.g. Joint Site Measurement Sheet / Email Admission"
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "4px", border: "1px solid var(--line)", fontSize: "13px" }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                  Material Dispute Facts &amp; Contractual Summary <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  rows="4"
                  name="factsSummary"
                  value={formData.factsSummary}
                  onChange={handleInputChange}
                  placeholder="Outline the core commercial dispute: goods/services delivered, contractual milestone, non-payment, and respondent's stated reasons..."
                  style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid var(--line)", fontSize: "14px", lineHeight: "1.6" }}
                />
                {formData.factsSummary.length > 0 && formData.factsSummary.length < 25 && (
                  <span style={{ fontSize: "12px", color: "#b45309", marginTop: "4px", display: "block" }}>
                    ⚠️ Narrative is too brief ({formData.factsSummary.length} chars). Please provide substantive details for accurate institutional analysis.
                  </span>
                )}
              </div>
            </div>

            {/* Section 4: Procedural Prerequisite Selectors */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Step 4 &bull; Procedural &amp; Institutional Governance
              </div>
              <h2 style={{ fontSize: "20px", margin: "0 0 16px 0", color: "var(--ink)" }}>
                Contractual Clauses &amp; Urgent Relief
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Written Contract Executed?
                  </label>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasWrittenContract"
                        checked={formData.hasWrittenContract === true}
                        onChange={() => setFormData((prev) => ({ ...prev, hasWrittenContract: true }))}
                      />
                      <span>Yes</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasWrittenContract"
                        checked={formData.hasWrittenContract === false}
                        onChange={() => setFormData((prev) => ({ ...prev, hasWrittenContract: false }))}
                      />
                      <span>No (Oral/Implied)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Arbitration Clause in Agreement?
                  </label>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasArbitrationClause"
                        checked={formData.hasArbitrationClause === true}
                        onChange={() => setFormData((prev) => ({ ...prev, hasArbitrationClause: true }))}
                      />
                      <span>Yes (ACA 1996 Applies)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasArbitrationClause"
                        checked={formData.hasArbitrationClause === false}
                        onChange={() => setFormData((prev) => ({ ...prev, hasArbitrationClause: false }))}
                      />
                      <span>No (Court Route / Sec 12A)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Formal Demand Notice Sent?
                  </label>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasNoticeSent"
                        checked={formData.hasNoticeSent === true}
                        onChange={() => setFormData((prev) => ({ ...prev, hasNoticeSent: true }))}
                      />
                      <span>Yes</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="hasNoticeSent"
                        checked={formData.hasNoticeSent === false}
                        onChange={() => setFormData((prev) => ({ ...prev, hasNoticeSent: false }))}
                      />
                      <span>No / Pending</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                    Urgent Interim Injunction Needed?
                  </label>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="urgentInterimRelief"
                        checked={formData.urgentInterimRelief === true}
                        onChange={() => setFormData((prev) => ({ ...prev, urgentInterimRelief: true }))}
                      />
                      <span>Yes (Sec 12A Proviso)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="urgentInterimRelief"
                        checked={formData.urgentInterimRelief === false}
                        onChange={() => setFormData((prev) => ({ ...prev, urgentInterimRelief: false }))}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Structured Evidence Multi-Select */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Step 5 &bull; Evidentiary Record
              </div>
              <h2 style={{ fontSize: "20px", margin: "0 0 8px 0", color: "var(--ink)" }}>
                Available Documentary &amp; Electronic Evidence
              </h2>
              <p style={{ fontSize: "13px", color: "var(--slate)", margin: "0 0 16px 0" }}>
                Select all verified documentary records available for submission to evaluate proof readiness and identify statutory gaps.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                {EVIDENCE_OPTIONS.map((opt) => {
                  const isChecked = formData.evidenceList.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleEvidenceToggle(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        border: `1px solid ${isChecked ? "var(--gold)" : "var(--line)"}`,
                        background: isChecked ? "rgba(209, 154, 52, 0.08)" : "#ffffff",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "13px",
                        color: isChecked ? "var(--ink)" : "var(--slate)",
                        fontWeight: isChecked ? 600 : 400
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{opt.icon}</span>
                      <span style={{ flex: 1 }}>{opt.label}</span>
                      <span style={{ color: isChecked ? "var(--gold-deep)" : "#cbd5e1", fontWeight: 700 }}>
                        {isChecked ? "✓" : "+"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  color: "#991b1b",
                  fontSize: "13.5px",
                  marginBottom: "20px"
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            {/* On-Page Privacy & AI Processing Notice */}
            <div
              style={{
                background: "rgba(11, 27, 49, 0.03)",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                padding: "14px 18px",
                marginBottom: "24px",
                fontSize: "12.5px",
                color: "var(--slate)",
                lineHeight: "1.6"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", color: "var(--ink)", fontWeight: 600 }}>
                <span>🔒</span> Privacy &amp; AI Processing Notice
              </div>
              Dispute facts, timeline events, and claims entered into this form are securely transmitted to Anthropic&rsquo;s Claude API (<code>claude-sonnet-5-5</code>) for institutional case analysis. Case submissions are not used to train Anthropic&rsquo;s models under its commercial terms; retained temporarily per Anthropic&rsquo;s data policy (see{" "}
              <a href="https://www.anthropic.com/legal/commercial-terms" style={{ color: "var(--gold-deep)", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
                Anthropic Commercial Terms
              </a>{" "}
              and{" "}
              <a href="https://www.anthropic.com/legal/privacy" style={{ color: "var(--gold-deep)", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
                Anthropic Privacy Policy
              </a>). Governed by JustNivaran&rsquo;s{" "}
              <a href="/privacy-policy" style={{ color: "var(--gold-deep)", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>.
            </div>

            {/* Submit Action Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--slate)" }}>
                Institutional predictive assessment under Indian law &bull; Confidential &amp; Encrypted
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn gold"
                style={{
                  padding: "12px 28px",
                  fontSize: "15px",
                  fontWeight: 700,
                  opacity: isAnalyzing ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                {isAnalyzing ? "Analyzing Dispute Facts..." : "Generate Institutional Assessment →"}
              </button>
            </div>
          </form>

          {/* Staged Loading Modal during Analysis */}
          {isAnalyzing && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(11, 27, 49, 0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                backdropFilter: "blur(4px)"
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  padding: "36px",
                  maxWidth: "500px",
                  width: "90%",
                  textAlign: "center",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid rgba(209, 154, 52, 0.2)",
                    borderTopColor: "var(--gold)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 20px auto"
                  }}
                />
                <h3 style={{ fontSize: "19px", color: "var(--ink)", margin: "0 0 10px 0" }}>
                  Institutional Legal Analysis in Progress
                </h3>
                <p style={{ fontSize: "13.5px", color: "var(--slate)", margin: "0 0 20px 0", minHeight: "40px" }}>
                  {PROGRESS_STAGES[progressStageIndex]}
                </p>
                <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${((progressStageIndex + 1) / PROGRESS_STAGES.length) * 100}%`,
                      height: "100%",
                      background: "var(--gold)",
                      transition: "width 0.4s ease"
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
