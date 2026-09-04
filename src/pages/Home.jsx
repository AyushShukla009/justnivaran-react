import Hero from "../components/Hero";
import Backlog from "../components/Backlog";
import Process from "../components/Process";
import ADRVisualizer from "../components/ADRVisualizer";
import Platform from "../components/Platform";
import InstitutionalVision from "../components/InstitutionalVision";
import Confidentiality from "../components/Confidentiality";
import CostCalculator from "../components/CostCalculator";
import Neutrals from "../components/Neutrals";
import DocketTracker from "../components/DocketTracker";
import ModelClause from "../components/ModelClause";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";

function Home({ onOpenFileModal, onOpenEmpanelmentModal, onOpenConsultationModal }) {
  return (
    <main>
      {/* 1. Hero: Two sides. One neutral. A record that holds up. */}
      <Hero onOpenFileModal={onOpenFileModal} />

      {/* 2. 01 The Backlog */}
      <Backlog />

      {/* 3. 02 How a case moves (4 Stages) */}
      <Process />

      {/* 4. Interactive Workflow (5 Stages) */}
      <ADRVisualizer onOpenFileModal={onOpenFileModal} />

      {/* 5. 03 Platform (Dark Luxury Capabilities) */}
      <Platform />

      {/* 6. Institutional Vision (Structured ODR Environment & Trust Pillars) */}
      <InstitutionalVision onOpenFileModal={onOpenFileModal} />

      {/* 7. 04 Confidentiality (Closed Room Rebuilt Online) */}
      <Confidentiality />

      {/* 7. Cost Schedule / Dispute Cost Comparison */}
      <CostCalculator onOpenFileModal={onOpenFileModal} />

      {/* 8. 05 For Neutrals */}
      <Neutrals onOpenEmpanelmentModal={onOpenEmpanelmentModal} />

      {/* 9. 05 Public Registry / Docket Tracker */}
      <DocketTracker />

      {/* 10. 06 Model Clause */}
      <ModelClause />

      {/* 11. 07 Frequently Asked Questions */}
      <FAQ
        onOpenFileModal={onOpenFileModal}
        onOpenConsultationModal={onOpenConsultationModal}
      />

      {/* 12. CTA Band: Start the matter sitting on your desk */}
      <CTA
        onOpenFileModal={onOpenFileModal}
        onOpenConsultationModal={onOpenConsultationModal}
      />
    </main>
  );
}

export default Home;