import { useState } from "react";
import { PATHS } from "../data/paths";

function ResolutionExplorer() {
  const [activeTab, setActiveTab] = useState(0);

  const activePath = PATHS[activeTab];

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % PATHS.length;
      setActiveTab(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + PATHS.length) % PATHS.length;
      setActiveTab(prev);
    }
  };

  return (
    <div className="panel" aria-label="Resolution path explorer">
      <div className="panel-head">
        <p>Choose a path</p>
        <span className="docket">
          JN/{activePath.key}/2026/0417
        </span>
      </div>

      <div className="modes" role="tablist" aria-label="Modes of resolution">
        {PATHS.map((path, idx) => (
          <button
            key={path.key}
            className="mode"
            role="tab"
            aria-selected={activeTab === idx}
            onClick={() => setActiveTab(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            type="button"
          >
            {path.name}
          </button>
        ))}
      </div>

      <div className="path-body" role="tabpanel" tabIndex="0">
        <dl className="path-meta">
          <div className="meta-cell">
            <dt>Legal basis</dt>
            <dd>
              {activePath.basis} <code>{activePath.cite}</code>
            </dd>
          </div>
          <div className="meta-cell">
            <dt>Timeline</dt>
            <dd>{activePath.window}</dd>
          </div>
          <div className="meta-cell">
            <dt>What you end with</dt>
            <dd>{activePath.outcome}</dd>
          </div>
        </dl>

        <div className="rail">
          {activePath.steps.map((step, idx) => {
            const isNeutral = step.neutral ? " neutral" : "";
            const isAbsent = step.absent ? " absent" : "";
            return (
              <div
                key={idx}
                className={`step${isNeutral}${isAbsent}`}
                style={{ animationDelay: `${idx * 55}ms` }}
              >
                <span className="dot"></span>
                <span className="no">{String(idx + 1).padStart(2, "0")}</span>
                <div className="lb">{step.l}</div>
                <div className="dl">{step.d}</div>
              </div>
            );
          })}
        </div>

        <p className="path-note">
          <i></i>
          <span>{activePath.note}</span>
        </p>
      </div>
    </div>
  );
}

export default ResolutionExplorer;