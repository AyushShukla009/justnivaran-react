function Neutrals({ onOpenEmpanelmentModal }) {
  return (
    <section className="section" id="neutrals">
      <div className="wrap two">
        <div>
          <p className="eyebrow">
            <b>05</b> For neutrals
          </p>
          <h2>Empanelment for arbitrators, mediators and conciliators.</h2>
          <p className="lede" style={{ marginTop: "20px" }}>
            The panel is the product. Empanelment is by application and review —
            qualification, domain, languages and disclosure of interest — with
            published conduct standards and periodic review of every listing.
          </p>
          <div className="cta-row" style={{ marginTop: "28px" }}>
            <button className="btn ghost" type="button" onClick={onOpenEmpanelmentModal}>
              Apply for empanelment
            </button>
          </div>
        </div>

        <div>
          <ul className="list">
            <li>
              Domain panels across commercial contracts, MSME payments, banking
              and finance, e-commerce, employment and service agreements.
            </li>
            <li>
              Case allocation on domain fit, language and availability — with
              conflict checks run before any file is opened.
            </li>
            <li>
              Published code of conduct, disclosure obligations and a defined
              recusal process.
            </li>
            <li>
              Platform training and certification in ODR practice, run with
              partner legal institutions.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Neutrals;