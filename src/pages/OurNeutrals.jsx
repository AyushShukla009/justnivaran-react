import { useState } from "react";
import { useLocation } from "react-router-dom";
import neutralsData from "../data/neutrals.json";

const ROLES = ["Arbitrator", "Mediator", "Conciliator"];

/**
 * Public roster of JustNivaran neutrals.
 *
 * Data source: src/data/neutrals.json
 * Only entries with consent_confirmed === true are ever shown publicly.
 * Unconsented entries (e.g. the layout placeholders) are visible only in
 * local development or when the URL carries ?preview=1, and are always
 * labelled "PREVIEW — not public".
 */
function isValidEntry(n) {
  return (
    n &&
    typeof n.name === "string" &&
    n.name.trim() !== "" &&
    ROLES.includes(n.role)
  );
}

function initials(name) {
  return name
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function NeutralCard({ neutral, isPreview }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = neutral.photo && !photoFailed;

  return (
    <article
      style={{
        background: "#ffffff",
        border: isPreview ? "1.5px dashed #d19a34" : "1px solid var(--line)",
        borderRadius: "8px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: "0 2px 8px rgba(11,27,49,0.04)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {showPhoto ? (
          <img
            src={neutral.photo}
            alt={neutral.name}
            loading="lazy"
            width="64"
            height="64"
            onError={() => setPhotoFailed(true)}
            style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--line)", flexShrink: 0 }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--ink)",
              color: "var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--serif, Georgia, serif)",
              fontSize: "22px",
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            {initials(neutral.name) || "JN"}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: "17px", margin: "0 0 6px", color: "var(--ink)", lineHeight: 1.3 }}>{neutral.name}</h2>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--mono)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "3px 9px",
              borderRadius: "10px",
              background: "rgba(209, 154, 52, 0.12)",
              color: "var(--gold-deep)",
              fontWeight: 700
            }}
          >
            {neutral.role}
          </span>
        </div>
      </div>

      {neutral.profile && (
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.65, color: "#3B4E68" }}>{neutral.profile}</p>
      )}

      {isPreview && (
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#b45309", fontWeight: 700 }}>
          PREVIEW — consent not confirmed, not shown publicly
        </div>
      )}
    </article>
  );
}

export default function OurNeutrals() {
  const location = useLocation();
  const [roleFilter, setRoleFilter] = useState("All");

  const previewMode =
    import.meta.env.DEV || new URLSearchParams(location.search).get("preview") === "1";

  const all = (Array.isArray(neutralsData) ? neutralsData : []).filter(isValidEntry);
  const visible = all.filter((n) => n.consent_confirmed === true || previewMode);
  const filtered = roleFilter === "All" ? visible : visible.filter((n) => n.role === roleFilter);

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px", maxWidth: "1080px" }}>
      <p className="eyebrow">
        <b>Panel Registry</b> Our Neutrals
      </p>
      <h1 style={{ marginBottom: "14px" }}>Our Neutrals</h1>
      <p className="lede" style={{ marginBottom: "28px", maxWidth: "820px" }}>
        Arbitrators, Mediators and Conciliators on the JustNivaran panel. Profiles are published only with each neutral&rsquo;s confirmed consent.
      </p>

      {previewMode && (
        <div
          role="note"
          style={{
            background: "#fffbeb",
            border: "1px solid #f59e0b",
            borderRadius: "6px",
            padding: "12px 16px",
            fontSize: "13px",
            color: "#92400e",
            marginBottom: "24px"
          }}
        >
          <strong>Preview mode:</strong> entries without confirmed consent are shown here for layout review only. Public visitors see only neutrals with <code>consent_confirmed: true</code>.
        </div>
      )}

      <div role="group" aria-label="Filter neutrals by role" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
        {["All", ...ROLES].map((r) => {
          const active = roleFilter === r;
          const count = r === "All" ? visible.length : visible.filter((n) => n.role === r).length;
          return (
            <button
              key={r}
              type="button"
              aria-pressed={active}
              onClick={() => setRoleFilter(r)}
              style={{
                background: active ? "var(--ink)" : "var(--paper-hi)",
                color: active ? "#ffffff" : "var(--ink)",
                border: "1px solid var(--line)",
                padding: "8px 14px",
                borderRadius: "4px",
                fontSize: "13px",
                fontFamily: "var(--mono)",
                cursor: "pointer"
              }}
            >
              {r === "All" ? "All" : `${r}s`} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "18px" }}>
          {filtered.map((n, i) => (
            <NeutralCard key={`${n.name}-${i}`} neutral={n} isPreview={n.consent_confirmed !== true} />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "var(--paper-hi)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            padding: "36px 24px",
            textAlign: "center",
            color: "var(--slate)",
            fontSize: "14.5px"
          }}
        >
          {visible.length === 0
            ? "The JustNivaran panel is being finalised. Neutral profiles will be published here once consent is confirmed."
            : `No ${roleFilter.toLowerCase()}s are listed yet.`}
        </div>
      )}
    </main>
  );
}
