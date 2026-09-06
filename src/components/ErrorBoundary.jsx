import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("JustNivaran ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "var(--paper)",
            fontFamily: "var(--sans)",
            color: "var(--ink)"
          }}
        >
          <div
            style={{
              maxWidth: "560px",
              width: "100%",
              background: "#ffffff",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "36px 28px",
              boxShadow: "0 12px 32px rgba(11, 27, 49, 0.08)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(209, 154, 52, 0.12)",
                color: "var(--gold-deep)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                margin: "0 auto 16px"
              }}
            >
              ⚖️
            </div>

            <h2 style={{ fontSize: "22px", fontFamily: "var(--serif)", margin: "0 0 10px", color: "var(--ink)" }}>
              Institutional Registry Application Notice
            </h2>

            <p style={{ fontSize: "14px", color: "var(--slate)", lineHeight: "1.6", margin: "0 0 24px" }}>
              An unexpected client render state was encountered while processing registry data. No confidential records or case filings were compromised.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn gold"
                onClick={this.handleReload}
                style={{ padding: "10px 20px", fontSize: "13px" }}
              >
                ↻ Reload Application
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={this.handleReset}
                style={{ padding: "10px 20px", fontSize: "13px" }}
              >
                Return to Registry Home →
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details style={{ marginTop: "24px", textAlign: "left", fontSize: "11.5px", fontFamily: "var(--mono)", color: "#C0392B", background: "#FDEDEC", padding: "12px", borderRadius: "4px" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>Technical Diagnostics</summary>
                <p style={{ margin: "8px 0 0", whiteSpace: "pre-wrap" }}>{this.state.error.toString()}</p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
