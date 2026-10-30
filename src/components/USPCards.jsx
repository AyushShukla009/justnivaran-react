import { Link } from "react-router-dom";

function USPCards() {
  return (
    <section className="usp-cards-section" id="key-usps">
      <div className="wrap">
        <div className="usp-section-head">
          <p className="eyebrow" style={{ color: "var(--gold)" }}>
            CORE CAPABILITIES &bull; INSTITUTIONAL ODR
          </p>
          <h2 className="usp-section-title">
            Flagship Resolution Advantages
          </h2>
        </div>

        <div className="usp-cards-grid">
          {/* Card 1: Legal Outcome Predictor */}
          <div className="usp-card">
            <div>
              <div className="usp-card-top">
                <div className="usp-card-icon" aria-hidden="true">
                  ⚖️
                </div>
                <span className="usp-card-badge">AI Assessment Beta</span>
              </div>

              <h3 className="usp-card-heading">Legal Outcome Predictor</h3>

              <p className="usp-card-summary">
                Assess dispute merits, liability exposure, and data-driven settlement probabilities before formal filing.
              </p>
            </div>

            <div className="usp-card-action">
              <Link to="/legal-assessment" className="btn gold usp-card-link">
                Try Outcome Predictor →
              </Link>
            </div>
          </div>

          {/* Card 2: Emergency Arbitration */}
          <div className="usp-card">
            <div>
              <div className="usp-card-top">
                <div className="usp-card-icon" aria-hidden="true">
                  🛡️
                </div>
                <span className="usp-card-badge">Expedited Relief &bull; 48–72h</span>
              </div>

              <h3 className="usp-card-heading">Emergency Arbitration</h3>

              <p className="usp-card-summary">
                Secure urgent interim protection, stay orders, and asset preservation prior to regular tribunal constitution.
              </p>
            </div>

            <div className="usp-card-action">
              <Link to="/emergency-arbitration" className="btn gold usp-card-link">
                Explore Emergency Arbitration →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default USPCards;
