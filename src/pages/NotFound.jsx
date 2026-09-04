import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main
      className="wrap"
      style={{
        paddingBlock: "100px 120px",
        maxWidth: "600px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(209, 154, 52, 0.12)",
          color: "var(--gold)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          marginBottom: "20px"
        }}
      >
        ⚖️
      </div>

      <p className="eyebrow" style={{ color: "var(--gold-deep)", marginBottom: "8px" }}>
        <b>404 Error</b> Record Not Found
      </p>

      <h1 style={{ fontSize: "32px", fontFamily: "var(--serif)", marginBottom: "16px", color: "var(--ink)" }}>
        Page or Docket Not Located
      </h1>

      <p style={{ fontSize: "15px", color: "#3B4E68", lineHeight: "1.6", marginBottom: "32px" }}>
        The requested URL, statutory rule page, or case registry route is not active in the JustNivaran institutional registry index.
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/" className="btn gold" style={{ padding: "12px 24px" }}>
          ← Return to Registry Home
        </Link>
        <Link to="/#tracker" className="btn ghost" style={{ padding: "12px 24px" }}>
          🔍 Track Active Docket
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
