function Process() {
  return (
    <section className="section" id="process">
      <div className="wrap">
        <p className="eyebrow">
          <b>02</b> How a case moves
        </p>
        <h2 style={{ maxWidth: "18ch" }}>
          Four stages, each one on the record.
        </h2>

        <div className="steps" style={{ marginTop: "44px" }}>
          <div className="cell">
            <span className="no">Stage 01</span>
            <h3>File</h3>
            <p>
              Upload the contract, the claim and the supporting documents. The
              platform opens a docket, checks the dispute clause, and confirms
              which paths are available to you.
            </p>
          </div>
          <div className="cell">
            <span className="no">Stage 02</span>
            <h3>Notice &amp; consent</h3>
            <p>
              Digital notice issues to the other side with a response window.
              For consensual paths, the case proceeds on their consent; for
              arbitration, on the clause itself.
            </p>
          </div>
          <div className="cell">
            <span className="no">Stage 03</span>
            <h3>Hearing</h3>
            <p>
              Video hearings with live transcription, timestamped exhibits and a
              locked document trail. Switch paths mid-case without restarting
              from the pleadings.
            </p>
          </div>
          <div className="cell">
            <span className="no">Stage 04</span>
            <h3>Award</h3>
            <p>
              Draft passes automated scrutiny for procedural and drafting
              defects, is signed digitally, and issues with the full case record
              attached for enforcement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;