function Platform() {
  return (
    <section className="section dark" id="platform">
      <div className="wrap">
        <p className="eyebrow">
          <b>03</b> Platform
        </p>
        <h2 style={{ maxWidth: "20ch" }}>
          Technology where it changes the outcome — nowhere else.
        </h2>
        <p className="lede" style={{ marginTop: "20px" }}>
          Nothing here decides your case. Every tool exists to make the record
          more accurate, the process faster, or the award harder to set aside.
        </p>

        <div className="caps">
          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--gold)"
              }} />
              Live
            </span>
            <h3>Speech-to-text record</h3>
            <p>
              Proceedings transcribed in real time, so what was said is not
              contested later. Transcripts attach to the docket and are available
              to both sides at the same moment.
            </p>
          </div>

          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--gold)"
              }} />
              Live
            </span>
            <h3>Award scrutiny</h3>
            <p>
              Before signature, the draft is checked for procedural lapses,
              internal inconsistencies and drafting defects — the errors that
              most often invite a challenge under Section 34.
            </p>
          </div>

          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--gold)"
              }} />
              Live
            </span>
            <h3>Multilingual proceedings</h3>
            <p>
              Real-time translation across Indian languages and scripts,
              including code-switched speech, so a party is never disadvantaged
              by the language of the hearing.
            </p>
          </div>

          <div className="cap">
            <span className="k" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--gold)"
              }} />
              Live
            </span>
            <h3>Digital audit trail</h3>
            <p>
              Every filing, view, notice and order is logged with actor and
              timestamp. The trail travels with the award to the enforcing
              court.
            </p>
          </div>

          <div className="cap soon">
            <span className="k">On the roadmap</span>
            <h3>Dispute triage</h3>
            <p>
              A structured intake that reads the nature, value and urgency of a
              claim and recommends the path most likely to close it — before any
              fee is paid.
            </p>
          </div>

          <div className="cap soon">
            <span className="k">On the roadmap</span>
            <h3>Outcome indication</h3>
            <p>
              Settlement ranges benchmarked against comparable resolved matters,
              with the reasoning shown. Released only once the case base supports
              an honest confidence interval.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Platform;