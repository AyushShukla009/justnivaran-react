import { useState, useEffect, useRef } from "react";

const STAGES = [
  {
    no: "Stage 01",
    title: "File",
    desc: "Upload the contract, the claim and the supporting documents. The platform opens a docket, checks the dispute clause, and confirms which paths are available to you."
  },
  {
    no: "Stage 02",
    title: "Notice & consent",
    desc: "Digital notice issues to the other side with a response window. For consensual paths, the case proceeds on their consent; for arbitration, on the clause itself."
  },
  {
    no: "Stage 03",
    title: "Hearing",
    desc: "Video hearings with live transcription, timestamped exhibits and a locked document trail. Switch paths mid-case without restarting from the pleadings."
  },
  {
    no: "Stage 04",
    title: "Award",
    desc: "Draft passes automated scrutiny for procedural and drafting defects, is signed digitally, and issues with the full case record attached for enforcement."
  }
];

function Process() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect(); // Run animation only once per page visit
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="process" ref={sectionRef}>
      <div className="wrap">
        <p className="eyebrow">
          <b>02</b> How a case moves
        </p>
        <h2 style={{ maxWidth: "18ch" }}>
          Four stages, each one on the record.
        </h2>

        {/* Journey Progress Track */}
        <div className="process-journey-wrap" style={{ marginTop: "44px", position: "relative" }}>
          {/* Progressive connecting progress line */}
          <div
            className={`process-track-line ${hasAnimated ? "animated" : ""}`}
            aria-hidden="true"
          />

          <div className="steps process-steps-grid">
            {STAGES.map((st, idx) => {
              const isSelected = activeHover === idx;
              return (
                <div
                  key={idx}
                  className={`cell process-cell ${hasAnimated ? "revealed" : ""} ${isSelected ? "active-stage" : ""}`}
                  style={{
                    animationDelay: hasAnimated ? `${idx * 100}ms` : "0ms"
                  }}
                  onMouseEnter={() => setActiveHover(idx)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="no">{st.no}</span>
                    <span
                      className="process-node-indicator"
                      aria-hidden="true"
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: isSelected ? "var(--gold)" : "var(--line)",
                        transition: "background 0.2s ease"
                      }}
                    />
                  </div>
                  <h3>{st.title}</h3>
                  <p>{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;