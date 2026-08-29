function CTA({ onOpenFileModal, onOpenConsultationModal }) {
  return (
    <section className="section band" id="file">
      <div className="wrap">
        <h2>Start the matter that has been sitting on your desk.</h2>
        <p>
          Open a file in a few minutes, or walk through your dispute with the
          case management team before you commit to a path.
        </p>
        <div className="cta-row">
          <button className="btn gold" type="button" onClick={onOpenFileModal}>
            File a dispute
          </button>
          <button
            className="btn ghost"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}
            type="button"
            onClick={onOpenConsultationModal}
          >
            Book a consultation
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;