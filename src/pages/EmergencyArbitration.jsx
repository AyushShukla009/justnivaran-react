import { Link } from "react-router-dom";

function EmergencyArbitration({ onOpenFileModal }) {
  return (
    <main
      className="wrap"
      style={{
        paddingBlock: "80px 100px",
        maxWidth: "760px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #0B1B31 0%, #12294A 100%)",
          border: "1.5px solid rgba(209, 154, 52, 0.45)",
          borderRadius: "8px",
          padding: "48px 32px",
          color: "#ffffff",
          boxShadow: "0 12px 36px rgba(11, 27, 49, 0.16)",
          position: "relative"
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(209, 154, 52, 0.15)",
            border: "1px solid rgba(209, 154, 52, 0.4)",
            color: "var(--gold)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            margin: "0 auto 20px"
          }}
        >
          🛡️
        </div>

        <p
          className="eyebrow"
          style={{
            color: "var(--gold)",
            marginBottom: "12px",
            letterSpacing: "0.14em"
          }}
        >
          EXPEDITED RELIEF &bull; INSTITUTIONAL ODR
        </p>

        <h1
          style={{
            fontSize: "clamp(26px, 3.2vw, 38px)",
            fontFamily: "var(--serif)",
            marginBottom: "16px",
            color: "#ffffff"
          }}
        >
          Emergency Arbitration
        </h1>

        <div style={{ marginBottom: "24px" }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 14px",
              borderRadius: "4px",
              background: "rgba(209, 154, 52, 0.2)",
              color: "var(--gold)",
              border: "1px solid rgba(209, 154, 52, 0.5)",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            Coming Soon
          </span>
        </div>

        <p
          style={{
            fontSize: "15px",
            color: "rgba(255, 255, 255, 0.85)",
            lineHeight: "1.7",
            maxWidth: "580px",
            margin: "0 auto 36px"
          }}
        >
          The dedicated portal for Emergency Arbitrator applications, expedited interim preservation, and urgent asset protection orders is coming soon. Detailed procedural rules and schedule [to be provided].
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          {onOpenFileModal ? (
            <button
              type="button"
              className="btn gold"
              onClick={() => onOpenFileModal("ARB")}
              style={{ padding: "12px 24px" }}
            >
              File Urgent Dispute →
            </button>
          ) : null}
          <Link
            to="/emergency-relief"
            className="btn ghost"
            style={{
              padding: "12px 24px",
              textDecoration: "none",
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.3)"
            }}
          >
            Interim Relief Desk →
          </Link>
          <Link
            to="/"
            className="btn ghost"
            style={{
              padding: "12px 24px",
              textDecoration: "none",
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.3)"
            }}
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

export default EmergencyArbitration;
