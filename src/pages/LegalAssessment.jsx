import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchAILegalOutcome, checkAIEngineHealth } from "../lib/api";
import {
  ALLOWED_CATEGORIES,
  ALLOWED_ARBITRATION_STATUSES,
  validateAssessmentPayload,
  MANDATORY_LEGAL_DISCLAIMER
} from "../lib/legalAssessmentValidation";
import LegalOutcomeReport from "../components/LegalOutcomeReport";

const PROGRESS_STAGES = [
  "Structuring material facts & dispute timeline",
  "Mapping contractual provisions & statutory doctrines",
  "Checking curated Supreme Court authorities repository",
  "Evaluating competing legal arguments & evidentiary gaps",
  "Formulating probable outcome scenarios & settlement ranges"
];

const SAMPLE_DISPUTE_DATA = {
  category: "Commercial Contract & Supply Default",
  claimValue: "1500000",
  breachDetails: "Non-payment of final commercial supply invoice overdue by 90 days.",
  factualChronology:
    "1. On 10 January 2026, Company A entered into a Master Supply Agreement with Company B for commercial goods worth ₹15,00,000.\n2. On 15 February 2026, goods were delivered and acknowledged by Company B.\n3. Final invoice was due within 30 days.\n4. Payment remains overdue by 90 days. Company B now alleges delayed delivery as grounds to withhold payment.",
  primaryClaims:
    "1. Recovery of outstanding principal invoice sum of INR 15,00,000.\n2. Statutory pre-award and post-award interest under Section 31(7)(a) of the Arbitration and Conciliation Act, 1996.\n3. Institutional arbitration costs.",
  expectedDefenses:
    "Company B alleges delayed delivery of user manuals and seeks set-off or waiver.",
  contractualClauses:
    "Clause 14 (Dispute Resolution): All disputes arising out of or in connection with this agreement shall be referred to arbitration in New Delhi under the Arbitration and Conciliation Act, 1996.\nClause 18 (Governing Law): This agreement is governed by the laws of India.",
  governingLaw: "Laws of India",
  arbitrationClauseStatus: "Yes - Institutional Arbitration Clause (Specified Institution)",
  availableEvidence:
    "1. Signed Master Supply Agreement.\n2. Delivery receipt note signed by Company B.\n3. Commercial Tax Invoices.\n4. Email admissions of debt.",
  missingEvidence:
    "Formal physical inspection certificate for user manuals.",
  desiredResolution:
    "Full recovery of principal sum of ₹15,00,000 with statutory interest and costs.",
  consentAccepted: true
};

const INITIAL_FORM_DATA = {
  category: "Commercial Contract & Supply Default",
  claimValue: "",
  breachDetails: "",
  factualChronology: "",
  primaryClaims: "",
  expectedDefenses: "",
  contractualClauses: "",
  governingLaw: "Laws of India",
  arbitrationClauseStatus: "Yes - Institutional Arbitration Clause (Specified Institution)",
  availableEvidence: "",
  missingEvidence: "",
  desiredResolution: "",
  consentAccepted: false
};

export default function LegalAssessment() {
  const [activeView, setActiveView] = useState("intake"); // 'intake' | 'report'
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStageIndex, setProgressStageIndex] = useState(0);
  const [engineHealth, setEngineHealth] = useState({
    status: "unavailable",
    keyConfigured: false,
    providerVerified: false,
    message: "Checking AI engine..."
  });
  const [aiReport, setAiReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const abortControllerRef = useRef(null);

  // Form State (Clean empty initial values)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Check Engine Health on mount
  useEffect(() => {
    let isMounted = true;
    checkAIEngineHealth().then((health) => {
      if (isMounted) {
        setEngineHealth(health);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Animate progress stages during inference
  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setProgressStageIndex((prev) => (prev < PROGRESS_STAGES.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateStep = (stepNumber) => {
    setErrorMessage("");

    if (stepNumber === 1) {
      if (!formData.category || !ALLOWED_CATEGORIES.includes(formData.category)) {
        setErrorMessage("Please select a valid commercial dispute category.");
        return false;
      }
      const val = Number(formData.claimValue);
      if (isNaN(val) || val <= 0) {
        setErrorMessage("Please enter a valid positive claim amount in INR.");
        return false;
      }
      if (!formData.breachDetails || formData.breachDetails.trim().length < 5) {
        setErrorMessage("Please state the approximate date and summary nature of breach.");
        return false;
      }
    }

    if (stepNumber === 2) {
      const len = formData.factualChronology.trim().length;
      if (len < 100) {
        setErrorMessage(`Factual chronology must contain at least 100 characters (currently ${len}).`);
        return false;
      }
      const claimsLen = formData.primaryClaims.trim().length;
      if (claimsLen < 50) {
        setErrorMessage(`Primary claims must contain at least 50 characters (currently ${claimsLen}).`);
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsAnalyzing(false);
    setErrorMessage("Assessment request was cancelled.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const clientValidation = validateAssessmentPayload(formData);
    if (!clientValidation.isValid) {
      setErrorMessage(clientValidation.errors[0] || "Please check all required parameters.");
      return;
    }

    setProgressStageIndex(0);
    setIsAnalyzing(true);
    abortControllerRef.current = new AbortController();

    try {
      const result = await fetchAILegalOutcome(formData, abortControllerRef.current.signal);

      if (result.success && result.data) {
        setAiReport(result.data);
        setActiveView("report");
        window.scrollTo({ top: 100, behavior: "smooth" });
      } else {
        setErrorMessage(result.message || "Failed to generate AI outcome assessment.");
      }
    } catch (err) {
      console.error("AI Predictor invocation error:", err);
      setErrorMessage("An unexpected network error occurred while connecting to the AI assessment engine.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAiReport(null);
    setActiveView("intake");
    setStep(1);
    setErrorMessage("");
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_DISPUTE_DATA);
    setErrorMessage("");
  };

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrorMessage("");
    setStep(1);
  };

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "1060px" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
          <p className="eyebrow" style={{ color: "var(--slate)", margin: 0 }}>
            <b>Primary USP</b> Institutional Decision-Support System
          </p>

          {/* Honest Live AI Status Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background:
                engineHealth.status === "active"
                  ? "rgba(34, 197, 94, 0.12)"
                  : engineHealth.status === "configured_not_verified"
                  ? "rgba(209, 154, 52, 0.12)"
                  : "rgba(100, 116, 139, 0.12)",
              border: `1px solid ${
                engineHealth.status === "active"
                  ? "rgba(34, 197, 94, 0.35)"
                  : engineHealth.status === "configured_not_verified"
                  ? "rgba(209, 154, 52, 0.35)"
                  : "rgba(100, 116, 139, 0.35)"
              }`,
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontFamily: "var(--mono)",
              color:
                engineHealth.status === "active"
                  ? "#15803d"
                  : engineHealth.status === "configured_not_verified"
                  ? "var(--gold-deep)"
                  : "var(--slate)",
              fontWeight: 600
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background:
                  engineHealth.status === "active"
                    ? "#16a34a"
                    : engineHealth.status === "configured_not_verified"
                    ? "var(--gold-deep)"
                    : "#94a3b8"
              }}
            />
            <span>{engineHealth.message}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: 0, color: "var(--ink)" }}>
            Legal Outcome AI Predictor
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
            AI Beta
          </span>
        </div>

        <p className="lede" style={{ color: "var(--slate)", maxWidth: "900px", margin: 0 }}>
          Analyse the relative strength of claims and defences, identify potentially applicable legal principles and explore probable outcome scenarios before selecting the next dispute-resolution step.
        </p>
      </div>

      {/* Top Anonymization & Privacy Guard Notice */}
      <div
        style={{
          background: "rgba(11, 27, 49, 0.04)",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          padding: "16px 20px",
          marginBottom: "32px",
          display: "flex",
          gap: "14px",
          alignItems: "flex-start"
        }}
      >
        <span style={{ fontSize: "20px", lineHeight: 1 }}>🛡️</span>
        <div style={{ fontSize: "12.5px", color: "var(--ink)", lineHeight: "1.6" }}>
          <strong>PRIVACY &amp; ANONYMIZATION PROTOCOL:</strong> Please replace real party, enterprise, or individual names with generic placeholders such as <code>Claimant</code>, <code>Respondent</code>, <code>Party A</code>, and <code>Party B</code>. Do not enter Aadhaar/PAN numbers or upload confidential documents in this beta version. Submissions are processed in a secure ephemeral sandbox and are <strong>not</strong> retained for public model training.
        </div>
      </div>

      {/* View Switcher if Report is Available */}
      {aiReport && (
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            type="button"
            onClick={() => setActiveView("report")}
            className={activeView === "report" ? "btn gold" : "btn ghost"}
            style={{ padding: "8px 18px", fontSize: "13px" }}
          >
            📊 View AI Outcome Dossier
          </button>
          <button
            type="button"
            onClick={() => setActiveView("intake")}
            className={activeView === "intake" ? "btn gold" : "btn ghost"}
            style={{ padding: "8px 18px", fontSize: "13px" }}
          >
            📝 Edit Input Parameters
          </button>
        </div>
      )}

      {/* REPORT VIEW */}
      {activeView === "report" && aiReport && (
        <LegalOutcomeReport report={aiReport} onReset={handleReset} />
      )}

      {/* INTAKE FORM VIEW */}
      {activeView === "intake" && (
        <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "8px", padding: "36px" }}>
          {isAnalyzing ? (
            /* Loading Experience Panel */
            <div
              style={{ textAlign: "center", padding: "48px 16px" }}
              role="status"
              aria-live="polite"
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  border: "3px solid var(--line)",
                  borderTopColor: "var(--gold)",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 24px"
                }}
              />
              <h2 style={{ fontSize: "22px", color: "var(--ink)", marginBottom: "8px" }}>
                AI Legal Outcome Predictor in Progress
              </h2>
              <p style={{ color: "var(--slate)", fontSize: "14px", maxWidth: "600px", margin: "0 auto 28px" }}>
                Analyzing structured facts against Supreme Court precedents and commercial contract principles...
              </p>

              {/* Progress Stage Tracker */}
              <div
                style={{
                  maxWidth: "540px",
                  margin: "0 auto 32px",
                  background: "var(--paper-hi)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  padding: "16px 20px",
                  textAlign: "left"
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Pipeline Stage {progressStageIndex + 1} of {PROGRESS_STAGES.length}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                  ⏳ {PROGRESS_STAGES[progressStageIndex]}
                </div>
                <div style={{ height: "4px", background: "var(--line)", borderRadius: "2px", overflow: "hidden", marginTop: "12px" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${((progressStageIndex + 1) / PROGRESS_STAGES.length) * 100}%`,
                      background: "var(--gold)",
                      transition: "width 0.4s ease"
                    }}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "var(--slate)", marginTop: "8px" }}>
                  * Progress indicator reflects pipeline processing stages. Maximum timeout: 30s.
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelAnalysis}
                className="btn ghost"
                style={{ padding: "8px 20px", fontSize: "13px" }}
              >
                Cancel Analysis
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Quick Actions Toolbar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--paper-hi)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div style={{ fontSize: "12.5px", color: "var(--slate)" }}>
                  💡 Enter your matter details below, or load our synthetic commercial dispute benchmark:
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="btn ghost"
                    style={{ padding: "5px 12px", fontSize: "12px", height: "auto" }}
                  >
                    📋 Load Benchmark Sample
                  </button>
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="btn ghost"
                    style={{ padding: "5px 12px", fontSize: "12px", height: "auto", color: "var(--slate)" }}
                  >
                    🧹 Clear Form
                  </button>
                </div>
              </div>

              {/* Step Progress Header */}
              <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", fontFamily: "var(--mono)", color: "var(--slate)" }}>
                  <span>
                    STEP {step} OF 5: {
                      step === 1 ? "DISPUTE PROFILE & QUANTUM" :
                      step === 2 ? "FACTUAL CHRONOLOGY & CLAIMS" :
                      step === 3 ? "CONTRACTUAL CLAUSES & GOVERNING LAW" :
                      step === 4 ? "DOCUMENTARY EVIDENCE & GAPS" :
                      "RELIEF, CONSENT & INFERENCE"
                    }
                  </span>
                  <span>{step * 20}% COMPLETE</span>
                </div>
                <div style={{ height: "4px", background: "var(--line)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${step * 20}%`, background: "var(--gold)", transition: "width 0.3s ease" }} />
                </div>
              </div>

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
                  role="alert"
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* STEP 1: Dispute Profile & Quantum */}
              {step === 1 && (
                <div style={{ display: "grid", gap: "20px" }}>
                  <div>
                    <label htmlFor="category" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                      1. Commercial Dispute Category <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "14px",
                        background: "#ffffff"
                      }}
                    >
                      {ALLOWED_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label htmlFor="claimValue" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                        2. Disputed Claim Quantum (INR) <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        id="claimValue"
                        type="number"
                        name="claimValue"
                        value={formData.claimValue}
                        onChange={handleInputChange}
                        placeholder="e.g. 8500000"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid var(--line)",
                          borderRadius: "4px",
                          fontSize: "14px"
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "var(--slate)", marginTop: "4px", display: "block" }}>
                        Total principal amount claimed (excluding unquantified speculative interest).
                      </span>
                    </div>

                    <div>
                      <label htmlFor="breachDetails" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                        3. Date &amp; Nature of Breach <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        id="breachDetails"
                        type="text"
                        name="breachDetails"
                        value={formData.breachDetails}
                        onChange={handleInputChange}
                        placeholder="e.g. Unpaid milestone invoices following UAT signoff on 28 Nov 2024"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid var(--line)",
                          borderRadius: "4px",
                          fontSize: "14px"
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "var(--slate)", marginTop: "4px", display: "block" }}>
                        Defines limitation accrual and causa causans under Indian law.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Facts & Claims */}
              {step === 2 && (
                <div style={{ display: "grid", gap: "20px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <label htmlFor="factualChronology" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
                        4. Material Factual Chronology <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)" }}>
                        {formData.factualChronology.length} / 10,000 chars (Min 100)
                      </span>
                    </div>
                    <textarea
                      id="factualChronology"
                      name="factualChronology"
                      rows={6}
                      value={formData.factualChronology}
                      onChange={handleInputChange}
                      placeholder="Outline dates of contract execution, deliverable milestones, payments made, breach event, and demand notices. Use 'Claimant' and 'Respondent' instead of real names..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "13.5px",
                        fontFamily: "inherit",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <label htmlFor="primaryClaims" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
                        5. Claimant&apos;s Specific Claims <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)" }}>
                        {formData.primaryClaims.length} / 5,000 chars (Min 50)
                      </span>
                    </div>
                    <textarea
                      id="primaryClaims"
                      name="primaryClaims"
                      rows={3}
                      value={formData.primaryClaims}
                      onChange={handleInputChange}
                      placeholder="Specify monetary claims, milestone recoveries, damages, statutory interest claims..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "13.5px",
                        fontFamily: "inherit",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="expectedDefenses" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                      6. Expected Counterclaims or Defences by Respondent
                    </label>
                    <textarea
                      id="expectedDefenses"
                      name="expectedDefenses"
                      rows={2}
                      value={formData.expectedDefenses}
                      onChange={handleInputChange}
                      placeholder="e.g. Liquidated damages deductions for delay, alleged defect in service, force majeure notice..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "13.5px",
                        fontFamily: "inherit",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Contractual Clauses & Law */}
              {step === 3 && (
                <div style={{ display: "grid", gap: "20px" }}>
                  <div>
                    <label htmlFor="contractualClauses" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                      7. Key Contractual Provisions / Excerpts
                    </label>
                    <textarea
                      id="contractualClauses"
                      name="contractualClauses"
                      rows={4}
                      value={formData.contractualClauses}
                      onChange={handleInputChange}
                      placeholder="Paste key clause excerpts: Liquidated Damages, Limitation of Liability caps, Termination clauses, Indemnity provisions..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "13.5px",
                        fontFamily: "inherit",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label htmlFor="governingLaw" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                        8. Governing Law &amp; Seat
                      </label>
                      <input
                        id="governingLaw"
                        type="text"
                        name="governingLaw"
                        value={formData.governingLaw}
                        onChange={handleInputChange}
                        placeholder="e.g. Laws of India (New Delhi Seat)"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid var(--line)",
                          borderRadius: "4px",
                          fontSize: "14px"
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="arbitrationClauseStatus" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                        9. Arbitration Clause Status
                      </label>
                      <select
                        id="arbitrationClauseStatus"
                        name="arbitrationClauseStatus"
                        value={formData.arbitrationClauseStatus}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid var(--line)",
                          borderRadius: "4px",
                          fontSize: "14px",
                          background: "#ffffff"
                        }}
                      >
                        {ALLOWED_ARBITRATION_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Evidence & Gaps */}
              {step === 4 && (
                <div style={{ display: "grid", gap: "20px" }}>
                  <div>
                    <label htmlFor="availableEvidence" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                      10. Available Documentary Evidence Summary
                    </label>
                    <textarea
                      id="availableEvidence"
                      name="availableEvidence"
                      rows={4}
                      value={formData.availableEvidence}
                      onChange={handleInputChange}
                      placeholder="List executed contracts, signed purchase orders, delivery/UAT acceptances, unpaid invoices, formal legal demand notices..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "13.5px",
                        fontFamily: "inherit",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="missingEvidence" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                      11. Identified Missing Evidence / Unverified Documents
                    </label>
                    <textarea
                      id="missingEvidence"
                      name="missingEvidence"
                      rows={3}
                      value={formData.missingEvidence}
                      onChange={handleInputChange}
                      placeholder="e.g. Unsigned change orders, missing server timestamp certificates under Section 63 BSA 2023..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "13.5px",
                        fontFamily: "inherit",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Relief, Consent & Submission */}
              {step === 5 && (
                <div style={{ display: "grid", gap: "20px" }}>
                  <div>
                    <label htmlFor="desiredResolution" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                      12. Desired Resolution &amp; Assessment Goal
                    </label>
                    <input
                      id="desiredResolution"
                      type="text"
                      name="desiredResolution"
                      value={formData.desiredResolution}
                      onChange={handleInputChange}
                      placeholder="e.g. Full recovery of INR 85,00,000 or evaluating settlement corridor for institutional mediation"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--line)",
                        borderRadius: "4px",
                        fontSize: "14px"
                      }}
                    />
                  </div>

                  {/* Mandatory Legal Disclaimer & Consent Checkbox */}
                  <div
                    style={{
                      background: "rgba(209, 154, 52, 0.08)",
                      border: "1px solid rgba(209, 154, 52, 0.35)",
                      borderRadius: "6px",
                      padding: "16px",
                      marginTop: "12px"
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "var(--ink)", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="consentAccepted"
                        checked={formData.consentAccepted}
                        onChange={handleInputChange}
                        style={{ marginTop: "3px", accentColor: "var(--gold-deep)" }}
                      />
                      <span>
                        <strong>MANDATORY ACKNOWLEDGMENT:</strong> I understand that this is an indicative AI-assisted assessment and not legal advice, an arbitral award, a judicial decision or a guarantee of outcome.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "32px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--line)"
                }}
              >
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn ghost"
                    style={{ padding: "8px 18px", fontSize: "13.5px" }}
                  >
                    ← Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn gold"
                    style={{ padding: "9px 22px", fontSize: "13.5px" }}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isAnalyzing || !formData.consentAccepted}
                    className="btn gold"
                    style={{
                      padding: "11px 26px",
                      fontSize: "14px",
                      fontWeight: 600,
                      opacity: isAnalyzing || !formData.consentAccepted ? 0.6 : 1,
                      cursor: isAnalyzing || !formData.consentAccepted ? "not-allowed" : "pointer"
                    }}
                  >
                    {isAnalyzing ? "Analyzing Dispute Parameters..." : "Generate AI Outcome Assessment →"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* Cross-linking to ADR Mechanisms */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "13.5px", color: "var(--slate)", marginBottom: "12px" }}>
          Ready to initiate formal institutional dispute proceedings?
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          <Link to="/fast-track-arbitration" className="btn ghost" style={{ fontSize: "13px", padding: "8px 16px" }}>
            ⚡ Fast-Track Arbitration (s. 29B)
          </Link>
          <Link to="/emergency-relief" className="btn ghost" style={{ fontSize: "13px", padding: "8px 16px" }}>
            🚨 Emergency Relief (48–72h)
          </Link>
          <Link to="/mediation-rules" className="btn ghost" style={{ fontSize: "13px", padding: "8px 16px" }}>
            ⚖️ Institutional Mediation
          </Link>
        </div>
      </div>
    </main>
  );
}
