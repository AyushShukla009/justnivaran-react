import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Homepage loaded eagerly for instant First Contentful Paint
import Home from "./pages/Home";

// Subpages and Admin Dashboard lazy-loaded on-demand for lightweight client bundle
const NegotiationGuidelines = lazy(() => import("./pages/NegotiationGuidelines"));
const MediationRules = lazy(() => import("./pages/MediationRules"));
const ArbitrationRules = lazy(() => import("./pages/ArbitrationRules"));
const ForNeutrals = lazy(() => import("./pages/ForNeutrals"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Statutory Legal & Compliance Pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const FeeSchedule = lazy(() => import("./pages/FeeSchedule"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const DataRetention = lazy(() => import("./pages/DataRetention"));
const Grievance = lazy(() => import("./pages/Grievance"));
const NeutralCodeOfConduct = lazy(() => import("./pages/NeutralCodeOfConduct"));
const LegalDisclaimer = lazy(() => import("./pages/LegalDisclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Modals
import DisputeModal from "./components/DisputeModal";
import EmpanelmentModal from "./components/EmpanelmentModal";
import ConsultationModal from "./components/ConsultationModal";
import GuidelinesModal from "./components/GuidelinesModal";

const BASE_URL = "https://justnivaran-odr.vercel.app";

const ROUTE_SEO = {
  "/": {
    title: "JustNivaran — Online Dispute Resolution (ODR) Centre India",
    description: "Institutional digital dispute resolution platform for commercial, MSME, and civil matters. Negotiation, mediation, conciliation, and arbitration filed, heard, and awarded 100% online.",
    keywords: "Online Dispute Resolution India, ODR, Arbitration Act 1996, Mediation Act 2023, MSME dispute resolution, commercial arbitration, virtual hearings"
  },
  "/negotiation-guidelines": {
    title: "Negotiation Guidelines — JustNivaran ODR",
    description: "Institutional procedures, timeline windows, and digital contract execution guidelines for direct party negotiation on JustNivaran.",
    keywords: "Negotiation guidelines, direct settlement, Indian Contract Act 1872, online negotiation"
  },
  "/mediation-rules": {
    title: "Institutional Mediation Rules — JustNivaran ODR",
    description: "Comprehensive statutory mediation protocols under the Mediation Act, 2023. Caucus procedures, confidentiality rules, and authenticated settlement agreements.",
    keywords: "Mediation Rules, Mediation Act 2023, Section 12A Commercial Courts Act, pre-institution mediation"
  },
  "/arbitration-rules": {
    title: "Institutional Arbitration Rules — JustNivaran ODR",
    description: "Standard and Fast-Track Arbitration Rules under the Arbitration and Conciliation Act, 1996 (Sections 29A & 29B) with BSA 2023 electronic record certification.",
    keywords: "Arbitration Rules, Fast Track Arbitration 29B, Section 29A, Section 34 challenge, BSA 2023 Section 63"
  },
  "/for-neutrals": {
    title: "Empanelment of Neutrals — JustNivaran ODR",
    description: "Join JustNivaran's National Panel of Arbitrators, Mediators, and Conciliators. Transparent registry appointments and secure digital case docket management.",
    keywords: "Arbitrator empanelment, Mediator roster, neutral empanelment, legal dispute panel"
  },
  "/contact": {
    title: "Contact Institutional Registry — JustNivaran ODR",
    description: "Official contact channels, registered notices desk, and registry support for JustNivaran Online Dispute Resolution Platform, New Delhi.",
    keywords: "Contact JustNivaran, ODR registry, legal notices, New Delhi arbitration"
  },
  "/admin": {
    title: "Institutional Case Registry & Admin Vault — JustNivaran",
    description: "Secure administrative docket ledger, party verification desk, and case status management console.",
    keywords: "Admin portal, dispute registry console, case docket management"
  },
  "/privacy-policy": {
    title: "Privacy Policy & DPDP Compliance — JustNivaran ODR",
    description: "Comprehensive data protection notice under the Digital Personal Data Protection Act, 2023. Purpose limitation, Aadhaar/PAN masking, and Data Principal rights.",
    keywords: "DPDP Act 2023, privacy policy, data fiduciary, data principal rights, Aadhaar masking"
  },
  "/terms-of-use": {
    title: "Terms of Use & Institutional Charter — JustNivaran ODR",
    description: "Institutional terms governing dispute filings, neutral empanelment, virtual hearing conduct, and electronic record admissibility.",
    keywords: "Terms of use, user agreement, institutional charter, electronic dispute rules"
  },
  "/fee-schedule": {
    title: "Institutional Fee Schedule — JustNivaran ODR",
    description: "Transparent, ad-valorem fee schedules and fast-track caps for institutional negotiation, mediation, and sole arbitrator proceedings.",
    keywords: "ODR fee schedule, arbitration fees, mediation costs India, transparent legal fees"
  },
  "/refund-policy": {
    title: "Fee Refund & Cancellation Policy — JustNivaran ODR",
    description: "Statutory rules and milestone-based schedules governing fee refunds upon pre-session settlement, non-appearance, or withdrawal.",
    keywords: "Refund policy, fee cancellation, ADR fee refund, settlement refund"
  },
  "/data-retention": {
    title: "Data Retention & Archival Policy — JustNivaran ODR",
    description: "Protocols for Section 34 challenge window archival (3 years), Article 136 Limitation Act execution preservation (12 years), and DPDP data erasure.",
    keywords: "Data retention, Limitation Act 1963, Section 34(3), BSA 2023 evidence, data deletion"
  },
  "/grievance": {
    title: "Grievance Redressal & DPO Desk — JustNivaran ODR",
    description: "Statutory 24-hour acknowledgment and 15-day resolution grievance redressal mechanism under the DPDP Act 2023 and IT Rules 2021.",
    keywords: "Grievance redressal, Data Protection Officer, DPO New Delhi, compliance officer"
  },
  "/neutral-code-of-conduct": {
    title: "Neutral Code of Conduct & Ethics — JustNivaran ODR",
    description: "Impartiality, conflict disclosure standards under Fifth and Seventh Schedules of the Arbitration Act, and confidentiality obligations for empanelled neutrals.",
    keywords: "Neutral ethics, arbitrator conflict of interest, Fifth Schedule disclosure, mediator conduct"
  },
  "/legal-disclaimer": {
    title: "Legal Disclaimer & Platform Notice — JustNivaran ODR",
    description: "Institutional dispute administrator disclaimer: JustNivaran is an ODR platform providing administrative infrastructure and not a law firm offering legal advice.",
    keywords: "Legal disclaimer, dispute resolution provider, administrative registry notice"
  }
};

function SEOHead() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const isKnownRoute = Boolean(ROUTE_SEO[pathname]);
    const config = ROUTE_SEO[pathname] || {
      title: "404 - Page Not Found | JustNivaran ODR",
      description: "The requested dispute resolution route, statutory rule, or case docket could not be located in the JustNivaran institutional index.",
      keywords: "404, not found, JustNivaran"
    };

    // Update document title
    document.title = config.title;

    // Update or set Robots meta tag (noindex, nofollow for 404s)
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = isKnownRoute ? "index, follow" : "noindex, nofollow";

    // Update or set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = config.description;

    // Update or set Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = config.keywords;

    // Update Canonical URL (point to base if 404 to avoid indexing invalid paths)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = isKnownRoute ? `${BASE_URL}${pathname === "/" ? "" : pathname}` : `${BASE_URL}/`;

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = config.title;

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = config.description;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = isKnownRoute ? `${BASE_URL}${pathname === "/" ? "" : pathname}` : `${BASE_URL}/`;

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.content = config.title;

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.content = config.description;
  }, [location.pathname]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isEmpanelmentOpen, setIsEmpanelmentOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [guidelinesMode, setGuidelinesMode] = useState("NEG");
  const [showFloatingPill, setShowFloatingPill] = useState(false);

  // High-Performance 60fps Scroll Progress (Zero React Re-renders on Scroll)
  useEffect(() => {
    let ticking = false;
    const progressBar = document.getElementById("scroll-progress");

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (progressBar && totalHeight > 0) {
            progressBar.style.width = `${(scrollY / totalHeight) * 100}%`;
          }
          const shouldShow = scrollY > 300;
          setShowFloatingPill((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Global Keyboard Navigation (Esc to close open modals)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDisputeOpen(false);
        setIsEmpanelmentOpen(false);
        setIsConsultationOpen(false);
        setIsGuidelinesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenFileModal = () => {
    setIsDisputeOpen(true);
  };

  const handleOpenGuidelines = (mode = "NEG") => {
    setGuidelinesMode(mode);
    setIsGuidelinesOpen(true);
  };

  return (
    <>
      <div id="scroll-progress" style={{ width: "0%" }} />
      <ScrollToTop />
      <SEOHead />
      <Header onOpenFileModal={() => handleOpenFileModal()} />

      <Suspense fallback={<div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--slate)", fontFamily: "var(--mono)", fontSize: "12px" }}>LOADING JUSTNIVARAN REGISTRY...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOpenFileModal={handleOpenFileModal}
                onOpenEmpanelmentModal={() => setIsEmpanelmentOpen(true)}
                onOpenConsultationModal={() => setIsConsultationOpen(true)}
              />
            }
          />
          <Route
            path="/negotiation-guidelines"
            element={
              <NegotiationGuidelines
                onOpenFileModal={() => handleOpenFileModal()}
              />
            }
          />
          <Route
            path="/mediation-rules"
            element={
              <MediationRules
                onOpenFileModal={() => handleOpenFileModal()}
              />
            }
          />
          <Route
            path="/arbitration-rules"
            element={
              <ArbitrationRules
                onOpenFileModal={() => handleOpenFileModal()}
              />
            }
          />
          <Route
            path="/for-neutrals"
            element={
              <ForNeutrals
                onOpenEmpanelmentModal={() => setIsEmpanelmentOpen(true)}
              />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Statutory Legal & Institutional Policy Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse onOpenFileModal={handleOpenFileModal} />} />
          <Route path="/fee-schedule" element={<FeeSchedule onOpenFileModal={handleOpenFileModal} />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/data-retention" element={<DataRetention />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/neutral-code-of-conduct" element={<NeutralCodeOfConduct onOpenEmpanelmentModal={() => setIsEmpanelmentOpen(true)} />} />
          <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer
        onOpenFileModal={() => handleOpenFileModal()}
        onOpenEmpanelmentModal={() => setIsEmpanelmentOpen(true)}
        onOpenConsultationModal={() => setIsConsultationOpen(true)}
        onOpenGuidelines={handleOpenGuidelines}
      />

      {/* Floating Action Pill Bar */}
      {showFloatingPill && (
        <div
          className="admin-modal-zoom"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(11, 27, 49, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "8px 12px",
            borderRadius: "30px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(209, 154, 52, 0.4)"
          }}
        >
          <button
            type="button"
            onClick={() => handleOpenFileModal()}
            style={{
              background: "var(--gold)",
              color: "#241703",
              border: "none",
              padding: "7px 14px",
              borderRadius: "20px",
              fontFamily: "var(--sans)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            ⚖️ File Dispute
          </button>
          <button
            type="button"
            onClick={() => setIsConsultationOpen(true)}
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "7px 11px",
              borderRadius: "20px",
              fontFamily: "var(--sans)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            💬 Consultation
          </button>
        </div>
      )}

      <DisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
      />

      <EmpanelmentModal
        isOpen={isEmpanelmentOpen}
        onClose={() => setIsEmpanelmentOpen(false)}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
        defaultMode={guidelinesMode}
      />
    </>
  );
}

export default App;