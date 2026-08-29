import { useState } from "react";
import { supabase } from "../lib/supabase";

function DocketTracker() {
  const [docketInput, setDocketInput] = useState("");
  const [caseData, setCaseData] = useState(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddendum, setShowAddendum] = useState(false);
  const [addendumText, setAddendumText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setDocketInput(val);
    if (!val.trim()) {
      setCaseData(null);
      setSearched(false);
      setShowAddendum(false);
      setNoteSuccess(false);
    }
  };

  const handleClear = () => {
    setDocketInput("");
    setCaseData(null);
    setSearched(false);
    setShowAddendum(false);
    setNoteSuccess(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!docketInput.trim()) {
      handleClear();
      return;
    }

    setIsLoading(true);
    setSearched(true);
    setShowAddendum(false);
    setNoteSuccess(false);

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("disputes")
          .select("*")
          .ilike("docket_number", docketInput.trim())
          .limit(1);

        if (data && data.length > 0 && !error) {
          setCaseData(data[0]);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Lookup error:", err);
    }

    setCaseData(null);
    setIsLoading(false);
  };

  const handleAddendumSubmit = async (e) => {
    e.preventDefault();
    if (!addendumText.trim() || !caseData) return;

    setIsSubmittingNote(true);
    const timeStamp = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const updatedSummary = `${caseData.dispute_summary || ""}\n\n[Supplementary Statement — ${timeStamp}]:\n${addendumText.trim()}`;

    try {
      if (supabase && caseData.id) {
        const { error } = await supabase
          .from("disputes")
          .update({ dispute_summary: updatedSummary })
          .eq("id", caseData.id);

        if (error) {
          console.error("Supabase update error:", error);
          alert("Could not update Supabase: " + error.message);
        } else {
          setCaseData({ ...caseData, dispute_summary: updatedSummary });
          setNoteSuccess(true);
          setAddendumText("");
          setShowAddendum(false);
        }
      } else {
        setCaseData({ ...caseData, dispute_summary: updatedSummary });
        setNoteSuccess(true);
        setAddendumText("");
        setShowAddendum(false);
      }
    } catch (err) {
      console.error("Addendum error:", err);
      alert("Error submitting note: " + err.message);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <section className="section" id="tracker" style={{ background: "var(--paper)", borderTop: "var(--rail)" }}>
      <div className="wrap">
        <p className="eyebrow" style={{ color: "var(--slate)" }}>
          <b>05</b> Public Registry
        </p>

        <h2 style={{ fontSize: "clamp(26px, 3.6vw, 44px)" }}>Search &amp; Track Active Dockets</h2>
        <p className="lede" style={{ margin: "16px 0 32px" }}>
          Verify the real-time institutional status of any JustNivaran notice, mediation mandate, or arbitration docket.
        </p>

        <form onSubmit={handleSearch} style={{ maxWidth: "640px", marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 280px" }}>
              <input
                type="text"
                placeholder="E.G. JN/ARB/2026/2375"
                value={docketInput}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 40px 13px 18px",
                  border: "1px solid var(--line)",
                  borderRadius: "3px",
                  fontFamily: "var(--mono)",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  background: "#fff"
                }}
              />
              {docketInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "var(--slate)",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "4px"
                  }}
                  title="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>
            <button className="btn gold" type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Track Case →"}
            </button>
            {searched && (
              <button
                className="btn ghost"
                type="button"
                onClick={handleClear}
                style={{ padding: "12px 18px" }}
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {noteSuccess && (
          <div
            style={{
              padding: "12px 16px",
              background: "#E8F8F0",
              border: "1px solid #27AE60",
              color: "#1E8449",
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "14px"
            }}
          >
            ✓ Statement registered and attached to docket record.
          </div>
        )}

        {searched && !caseData && !isLoading && (
          <div
            style={{
              padding: "20px 24px",
              background: "#FFF9E6",
              border: "1px solid #FFE082",
              color: "#8A6D3B",
              borderRadius: "4px",
              fontSize: "14px",
              lineHeight: "1.5"
            }}
          >
            ⚠️ <strong>Docket Not Found:</strong> No active proceeding matches docket <strong>"{docketInput}"</strong>. Please verify the docket ID from your official JustNivaran notice.
          </div>
        )}

        {searched && caseData && (
          <div
            style={{
              background: "var(--ink-deep)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.15)",
              borderRadius: "6px",
              padding: "clamp(20px, 4vw, 32px)",
              boxShadow: "0 12px 32px rgba(11,27,49,.4)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                borderBottom: "1px solid rgba(255,255,255,.15)",
                paddingBottom: "16px",
                marginBottom: "20px"
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    letterSpacing: ".1em",
                    color: "var(--gold)",
                    textTransform: "uppercase"
                  }}
                >
                  ● Public Case File
                </span>
                <h3 style={{ fontSize: "22px", margin: "4px 0 0", color: "#fff" }}>
                  {caseData.docket_number}
                </h3>
              </div>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  background: "rgba(209,154,52,.2)",
                  color: "var(--gold)",
                  padding: "6px 12px",
                  borderRadius: "2px",
                  border: "1px solid rgba(209,154,52,.4)"
                }}
              >
                {caseData.status}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "24px"
              }}
            >
              <div>
                <dt style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--slate-light)", textTransform: "uppercase" }}>
                  Claimant
                </dt>
                <dd style={{ margin: "4px 0 0", fontSize: "15px", color: "#fff", fontWeight: 500 }}>
                  {caseData.claimant_name}
                </dd>
              </div>
              <div>
                <dt style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--slate-light)", textTransform: "uppercase" }}>
                  Respondent
                </dt>
                <dd style={{ margin: "4px 0 0", fontSize: "15px", color: "#fff", fontWeight: 500 }}>
                  {caseData.respondent_name}
                </dd>
              </div>
              <div>
                <dt style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--slate-light)", textTransform: "uppercase" }}>
                  Claim Value
                </dt>
                <dd style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--gold)", fontFamily: "var(--serif)" }}>
                  ₹ {Number(caseData.claim_amount || 0).toLocaleString("en-IN")}
                </dd>
              </div>
              <div>
                <dt style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--slate-light)", textTransform: "uppercase" }}>
                  Assigned Neutral
                </dt>
                <dd style={{ margin: "4px 0 0", fontSize: "14px", color: "#fff" }}>
                  {caseData.assigned_neutral || "Registry Appointed"}
                </dd>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.05)",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid rgba(255,255,255,.1)"
              }}
            >
              <div style={{ fontFamily: "var(--mono)", fontSize: "10.5px", color: "var(--gold)", marginBottom: "6px" }}>
                DISPUTE SUMMARY / RECORD NOTES
              </div>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#DCE5F0", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                {caseData.dispute_summary}
              </p>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setShowAddendum(!showAddendum)}
                style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)", fontSize: "13px", padding: "8px 16px" }}
              >
                {showAddendum ? "Cancel Note" : "+ Submit Case Note / Statement"}
              </button>
            </div>

            {showAddendum && (
              <form onSubmit={handleAddendumSubmit} style={{ marginTop: "16px" }}>
                <textarea
                  rows="3"
                  placeholder="Enter supplementary facts, settlement offer, or procedural update for the case record..."
                  value={addendumText}
                  onChange={(e) => setAddendumText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "rgba(255,255,255,.08)",
                    border: "1px solid rgba(255,255,255,.2)",
                    borderRadius: "3px",
                    color: "#fff",
                    fontFamily: "var(--sans)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    marginBottom: "10px"
                  }}
                />
                <button className="btn gold" type="submit" disabled={isSubmittingNote} style={{ fontSize: "13px", padding: "8px 18px" }}>
                  {isSubmittingNote ? "Registering..." : "Post to Case File →"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DocketTracker;