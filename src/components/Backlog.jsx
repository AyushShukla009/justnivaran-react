import { useState, useEffect, useRef } from "react";

function Backlog() {
  const [isVisible, setIsVisible] = useState(false);
  const [countCr, setCountCr] = useState(1);
  const [count12, setCount12] = useState(1);
  const [count6, setCount6] = useState(1);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Fire only once per visit
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const t = setTimeout(() => {
        setCountCr(5);
        setCount12(12);
        setCount6(6);
      }, 0);
      return () => clearTimeout(t);
    }

    const duration = 900;
    const stepTime = 30;
    const totalSteps = duration / stepTime;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      setCountCr(Math.max(1, Math.min(5, Math.round(progress * 5))));
      setCount12(Math.max(1, Math.min(12, Math.round(progress * 12))));
      setCount6(Math.max(1, Math.min(6, Math.round(progress * 6))));

      if (step >= totalSteps) {
        clearInterval(timer);
        setCountCr(5);
        setCount12(12);
        setCount6(6);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section className="section" id="why" ref={sectionRef}>
      <div className="wrap two">
        <div>
          <p className="eyebrow">
            <b>01</b> The backlog
          </p>
          <h2>The cost of waiting is the case.</h2>
          <p className="lede" style={{ margin: "22px 0 16px" }}>
            For an MSME waiting on a receivable, four years of litigation is not
            a remedy — it is a write-off. The delay forces settlements at a
            fraction of claim value simply to keep working capital alive.
          </p>
          <p style={{ color: "#4A5E78", fontSize: "15px", margin: 0 }}>
            Commercial disputes rarely need three appeals and six years of
            docket dates. They need an enforceable neutral view, delivered while
            the contract is still being performed.
          </p>
        </div>

        <div className="figs">
          <div className="fig">
            <div className="n">
              {countCr}
              <small>cr+</small>
            </div>
            <p>
              Cases pending across Indian courts, district to Supreme Court.
              <cite>Source: National Judicial Data Grid (NJDG)</cite>
            </p>
          </div>

          <div className="fig">
            <div className="n">
              {count12}
              <small>mo</small>
            </div>
            <p>
              Statutory ceiling for an arbitral award after pleadings close,
              under the Arbitration and Conciliation Act, 1996.
              <cite>Section 29A</cite>
            </p>
          </div>

          <div className="fig">
            <div className="n">
              {count6}
              <small>mo</small>
            </div>
            <p>
              Ceiling for a fast-track award, decided on documents unless a
              party asks for oral hearing.
              <cite>Section 29B</cite>
            </p>
          </div>

          <div className="fig">
            <div className="n">
              100<small>%</small>
            </div>
            <p>
              Digital proceedings. Every stage — filing, notice, evidence, virtual hearing,
              and award — administered 100% online.
              <cite>Zero physical travel</cite>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Backlog;