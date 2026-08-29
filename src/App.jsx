import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import NegotiationGuidelines from "./pages/NegotiationGuidelines";
import MediationRules from "./pages/MediationRules";
import ArbitrationRules from "./pages/ArbitrationRules";
import ForNeutrals from "./pages/ForNeutrals";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";

// Modals
import DisputeModal from "./components/DisputeModal";
import EmpanelmentModal from "./components/EmpanelmentModal";
import ConsultationModal from "./components/ConsultationModal";
import GuidelinesModal from "./components/GuidelinesModal";

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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setShowFloatingPill(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenGuidelines = (mode = "NEG") => {
    setGuidelinesMode(mode);
    setIsGuidelinesOpen(true);
  };

  return (
    <>
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <ScrollToTop />
      <Header onOpenFileModal={() => setIsDisputeOpen(true)} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              onOpenFileModal={() => setIsDisputeOpen(true)}
              onOpenEmpanelmentModal={() => setIsEmpanelmentOpen(true)}
              onOpenConsultationModal={() => setIsConsultationOpen(true)}
            />
          }
        />
        <Route
          path="/negotiation-guidelines"
          element={
            <NegotiationGuidelines
              onOpenFileModal={() => setIsDisputeOpen(true)}
            />
          }
        />
        <Route
          path="/mediation-rules"
          element={
            <MediationRules
              onOpenFileModal={() => setIsDisputeOpen(true)}
            />
          }
        />
        <Route
          path="/arbitration-rules"
          element={
            <ArbitrationRules
              onOpenFileModal={() => setIsDisputeOpen(true)}
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
        <Route
          path="/contact"
          element={
            <Contact
              onOpenFileModal={() => setIsDisputeOpen(true)}
              onOpenConsultationModal={() => setIsConsultationOpen(true)}
            />
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <Footer onOpenGuidelines={handleOpenGuidelines} />

      {/* Floating Action Pill */}
      {showFloatingPill && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 90,
            display: "flex",
            gap: "8px",
            background: "rgba(11, 27, 49, 0.92)",
            backdropFilter: "blur(12px)",
            padding: "8px 12px",
            borderRadius: "30px",
            boxShadow: "0 12px 30px rgba(11, 27, 49, 0.35)",
            border: "1px solid rgba(209, 154, 52, 0.4)",
            animation: "rise 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <button
            type="button"
            onClick={() => setIsDisputeOpen(true)}
            style={{
              background: "var(--gold)",
              color: "#241703",
              border: "none",
              padding: "7px 13px",
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