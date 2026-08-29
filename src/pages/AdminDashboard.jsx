import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const STATUS_CONFIG = {
  "Notice Issued": { bg: "#FEF9E7", color: "#B7950B", label: "Notice Issued" },
  "Negotiation Active": { bg: "#EBF5FB", color: "#2471A3", label: "Negotiation Active" },
  "Mediation in Progress": { bg: "#F4ECF7", color: "#7D3C98", label: "Mediation in Progress" },
  "Hearing Scheduled": { bg: "#E8F8F5", color: "#117A65", label: "Hearing Scheduled" },
  "Award Rendered": { bg: "#EAEDED", color: "#1B4F72", label: "Award Rendered" },
  "Settled": { bg: "#E9F7EF", color: "#1E8449", label: "Settled" }
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

function AdminDashboard() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("jn_admin_auth") === "true"
  );
  const [activeTab, setActiveTab] = useState("disputes");
  const [disputes, setDisputes] = useState([]);
  const [neutrals, setNeutrals] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === "0909") {
      setIsAuthenticated(true);
      sessionStorage.setItem("jn_admin_auth", "true");
      fetchData();
    } else {
      alert("Invalid Registry PIN.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("jn_admin_auth");
    setPin("");
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { data: dData } = await supabase
          .from("disputes")
          .select("*")
          .order("created_at", { ascending: false });
        if (dData) setDisputes(dData);

        const { data: nData } = await supabase
          .from("neutrals")
          .select("*")
          .order("created_at", { ascending: false });
        if (nData) setNeutrals(nData);

        const { data: cData } = await supabase
          .from("consultations")
          .select("*")
          .order("created_at", { ascending: false });
        if (cData) setConsultations(cData);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      if (supabase) {
        const { error } = await supabase
          .from("disputes")
          .update({ status: newStatus })
          .eq("id", id);

        if (!error) {
          setDisputes((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
          );
          if (selectedCase && selectedCase.id === id) {
            setSelectedCase({ ...selectedCase, status: newStatus });
          }
        } else {
          alert("Could not update status: " + error.message);
        }
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveSummary = async () => {
    if (!selectedCase) return;
    try {
      if (supabase && selectedCase.id) {
        const { error } = await supabase
          .from("disputes")
          .update({ dispute_summary: editedSummary })
          .eq("id", selectedCase.id);

        if (!error) {
          setSelectedCase({ ...selectedCase, dispute_summary: editedSummary });
          setDisputes((prev) =>
            prev.map((d) => (d.id === selectedCase.id ? { ...d, dispute_summary: editedSummary } : d))
          );
          setIsEditingSummary(false);
          alert("Dispute summary updated successfully!");
        } else {
          alert("Save failed: " + error.message);
        }
      }
    } catch (err) {
      console.error("Save summary error:", err);
    }
  };

  const exportToCSV = (data, category) => {
    if (!data || !data.length) {
      alert("No records to export.");
      return;
    }

    let headers;
    let formattedRows;

    if (category === "disputes") {
      headers = [
        "Docket Number",
        "Live Status",
        "Claimant Name",
        "Claimant Email",
        "Claimant Phone",
        "Respondent Name",
        "Respondent Email",
        "Respondent Phone",
        "Disputed Claim Value (INR)",
        "Resolution Mode",
        "Dispute Summary / Facts",
        "Relief Sought",
        "Filing Date & Time"
      ];

      formattedRows = data.map((d) => [
        d.docket_number || "—",
        d.status || "Notice Issued",
        d.claimant_name || "—",
        d.claimant_email || "—",
        d.claimant_phone || "—",
        d.respondent_name || "—",
        d.respondent_email || "—",
        d.respondent_phone || "—",
        `₹ ${Number(d.claim_amount || 0).toLocaleString("en-IN")}`,
        d.mode === "ARB"
          ? "Arbitration (Act 1996)"
          : d.mode === "MED"
          ? "Mediation (Act 2023)"
          : d.mode === "FTA"
          ? "Fast-Track Arbitration (s. 29B)"
          : d.mode === "NEG"
          ? "Direct Negotiation (Contract Act)"
          : (d.mode || "—"),
        (d.dispute_summary || "—").replace(/\n/g, " "),
        (d.relief_sought || "—").replace(/\n/g, " "),
        d.created_at
          ? new Date(d.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
            })
          : "—"
      ]);
    } else if (category === "neutrals") {
      headers = [
        "Full Legal Name",
        "Designation / Role",
        "Bar Council Registration ID",
        "Experience",
        "Domain Specialization",
        "Official Email",
        "Contact Phone",
        "Application Date"
      ];

      formattedRows = data.map((n) => [
        n.full_name || "—",
        n.role || "—",
        n.bar_council_id || "—",
        n.experience_years ? `${n.experience_years} Years` : "—",
        n.specialization || "—",
        n.email || "—",
        n.phone || "—",
        n.created_at
          ? new Date(n.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
            })
          : "—"
      ]);
    } else {
      headers = [
        "Client Legal Name",
        "Official Email",
        "Preferred Consultation Date",
        "Time Slot",
        "Format",
        "Case Notes & Brief",
        "Booking Date"
      ];

      formattedRows = data.map((c) => [
        c.name || "—",
        c.email || "—",
        c.preferred_date || "—",
        c.preferred_time || "—",
        c.format || "—",
        (c.notes || "—").replace(/\n/g, " "),
        c.created_at
          ? new Date(c.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
            })
          : "—"
      ]);
    }

    const csvRows = [
      headers.join(","),
      ...formattedRows.map((row) =>
        row.map((val) => `"${String(val || "").replace(/"/g, '""')}"`).join(",")
      )
    ];

    // Prepend UTF-8 BOM so Excel on Mac & Windows opens directly without warning popups
    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `JustNivaran_${category}_Registry_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalClaimValue = disputes.reduce(
    (acc, cur) => acc + (Number(cur.claim_amount) || 0),
    0
  );

  if (!isAuthenticated) {
    return (
      <main
        className="wrap"
        style={{
          paddingBlock: "100px",
          maxWidth: "460px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 40px rgba(11, 27, 49, 0.08)",
            padding: "40px 32px",
            borderRadius: "12px",
            animation: "rise 0.4s ease"
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "rgba(209, 154, 52, 0.12)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "24px"
            }}
          >
            🔐
          </div>
          <h2 style={{ fontSize: "24px", fontFamily: "var(--serif)", marginBottom: "8px" }}>
            Registry Admin Access
          </h2>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--slate)",
              marginBottom: "24px",
              lineHeight: "1.5"
            }}
          >
            Enter your institutional PIN to manage active disputes, update hearing statuses, and export spreadsheet records.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter 4-Digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "18px",
                letterSpacing: "4px",
                fontFamily: "var(--mono)",
                marginBottom: "16px",
                background: "var(--paper-hi)",
                outline: "none"
              }}
            />
            <button
              className="btn gold"
              type="submit"
              style={{ width: "100%", padding: "12px", borderRadius: "6px", fontSize: "14px" }}
            >
              Unlock Registry Console →
            </button>
          </form>
        </div>
      </main>
    );
  }

  const filteredDisputes = disputes.filter(
    (d) =>
      d.docket_number?.toLowerCase().includes(search.toLowerCase()) ||
      d.claimant_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.respondent_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="wrap" style={{ paddingBlock: "48px 90px" }}>
      {/* Top Header & Quick Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px",
          marginBottom: "24px"
        }}
      >
        <div>
          <p className="eyebrow" style={{ margin: "0 0 6px", color: "var(--slate)" }}>
            <b>INTERNAL REGISTRY PORTAL</b> JUSTNIVARAN ODR
          </p>
          <h1 style={{ fontSize: "32px", fontFamily: "var(--serif)", color: "var(--ink)", margin: 0 }}>
            Registry Management Console
          </h1>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            className="btn gold"
            type="button"
            onClick={() =>
              exportToCSV(
                activeTab === "disputes"
                  ? disputes
                  : activeTab === "neutrals"
                  ? neutrals
                  : consultations,
                activeTab
              )
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              fontSize: "12.5px",
              fontWeight: 500
            }}
          >
            <span>📥</span> Export to Excel ({activeTab.toUpperCase()})
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={fetchData}
            style={{ padding: "8px 14px", fontSize: "12.5px", fontWeight: 500 }}
          >
            ↻ Refresh
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: "transparent",
              color: "#C0392B",
              border: "1px solid rgba(192, 57, 43, 0.35)",
              padding: "8px 14px",
              borderRadius: "3px",
              fontSize: "12.5px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Quick Guide Banner */}
      <div
        style={{
          background: "var(--paper-hi)",
          border: "1px solid var(--line)",
          borderLeft: "3px solid var(--gold)",
          borderRadius: "3px",
          padding: "12px 18px",
          fontSize: "13px",
          color: "#4A5E78",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <span>💡</span>
        <span>
          <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Quick Guide:</strong> 1. Filed cases appear here in real time. &bull; 2. Update status from the dropdown to notify parties. &bull; 3. Click <strong style={{ color: "var(--ink)", fontWeight: 500 }}>"Export to Excel"</strong> anytime for offline reporting.
        </span>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "32px"
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--line)",
            padding: "20px 22px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Total Active Disputes
            </span>
            <span style={{ fontSize: "16px", opacity: 0.7 }}>⚖️</span>
          </div>
          <div style={{ fontSize: "28px", fontFamily: "var(--serif)", color: "var(--ink)", fontWeight: 400, marginTop: "6px" }}>
            {disputes.length}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(209, 154, 52, 0.35)",
            padding: "20px 22px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(209, 154, 52, 0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--gold-deep)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
              Total Dispute Value Filed
            </span>
            <span style={{ fontSize: "16px", opacity: 0.7 }}>💰</span>
          </div>
          <div style={{ fontSize: "28px", fontFamily: "var(--serif)", color: "var(--gold-deep)", fontWeight: 400, marginTop: "6px" }}>
            ₹ {totalClaimValue.toLocaleString("en-IN")}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--line)",
            padding: "20px 22px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Empaneled Neutrals
            </span>
            <span style={{ fontSize: "16px", opacity: 0.7 }}>👨‍⚖️</span>
          </div>
          <div style={{ fontSize: "28px", fontFamily: "var(--serif)", color: "var(--ink)", fontWeight: 400, marginTop: "6px" }}>
            {neutrals.length}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--line)",
            padding: "20px 22px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Booked Consultations
            </span>
            <span style={{ fontSize: "16px", opacity: 0.7 }}>📅</span>
          </div>
          <div style={{ fontSize: "28px", fontFamily: "var(--serif)", color: "var(--ink)", fontWeight: 400, marginTop: "6px" }}>
            {consultations.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "12px",
          marginBottom: "20px",
          overflowX: "auto"
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("disputes")}
          style={{
            background: activeTab === "disputes" ? "var(--ink)" : "transparent",
            color: activeTab === "disputes" ? "#ffffff" : "var(--slate)",
            border: "1px solid",
            borderColor: activeTab === "disputes" ? "var(--ink)" : "var(--line)",
            padding: "8px 16px",
            borderRadius: "3px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all .2s ease"
          }}
        >
          ⚖️ Dispute Cases
          <span
            style={{
              background: activeTab === "disputes" ? "var(--gold)" : "rgba(18,41,74,.08)",
              color: activeTab === "disputes" ? "#241703" : "var(--slate)",
              fontSize: "10.5px",
              fontFamily: "var(--mono)",
              padding: "1px 6px",
              borderRadius: "2px",
              fontWeight: 500
            }}
          >
            {disputes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("neutrals")}
          style={{
            background: activeTab === "neutrals" ? "var(--ink)" : "transparent",
            color: activeTab === "neutrals" ? "#ffffff" : "var(--slate)",
            border: "1px solid",
            borderColor: activeTab === "neutrals" ? "var(--ink)" : "var(--line)",
            padding: "8px 16px",
            borderRadius: "3px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all .2s ease"
          }}
        >
          👨‍⚖️ Neutral Applications
          <span
            style={{
              background: activeTab === "neutrals" ? "var(--gold)" : "rgba(18,41,74,.08)",
              color: activeTab === "neutrals" ? "#241703" : "var(--slate)",
              fontSize: "10.5px",
              fontFamily: "var(--mono)",
              padding: "1px 6px",
              borderRadius: "2px",
              fontWeight: 500
            }}
          >
            {neutrals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("consultations")}
          style={{
            background: activeTab === "consultations" ? "var(--ink)" : "transparent",
            color: activeTab === "consultations" ? "#ffffff" : "var(--slate)",
            border: "1px solid",
            borderColor: activeTab === "consultations" ? "var(--ink)" : "var(--line)",
            padding: "8px 16px",
            borderRadius: "3px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all .2s ease"
          }}
        >
          📅 Consultations
          <span
            style={{
              background: activeTab === "consultations" ? "var(--gold)" : "rgba(18,41,74,.08)",
              color: activeTab === "consultations" ? "#241703" : "var(--slate)",
              fontSize: "10.5px",
              fontFamily: "var(--mono)",
              padding: "1px 6px",
              borderRadius: "2px",
              fontWeight: 500
            }}
          >
            {consultations.length}
          </span>
        </button>
      </div>

      {/* Modern Search */}
      {activeTab === "disputes" && (
        <div style={{ position: "relative", marginBottom: "18px" }}>
          <input
            type="text"
            placeholder="🔍 Search by Docket Number, Claimant Name, or Respondent Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid var(--line)",
              borderRadius: "3px",
              background: "#ffffff",
              fontSize: "13.5px",
              outline: "none",
              color: "var(--ink)"
            }}
          />
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--line)",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(18, 41, 74, 0.03)"
        }}
      >
        {isLoading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--slate)" }}>
            <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>⏳</span>
            Loading registry records...
          </div>
        ) : activeTab === "disputes" ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "1px solid var(--line)" }}>
                  <th style={{ padding: "12px 16px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Docket Number</th>
                  <th style={{ padding: "12px 16px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Claimant</th>
                  <th style={{ padding: "12px 16px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Respondent</th>
                  <th style={{ padding: "12px 16px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Claim Value</th>
                  <th style={{ padding: "12px 16px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Mode</th>
                  <th style={{ padding: "12px 16px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Live Status</th>
                  <th style={{ padding: "12px 16px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisputes.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "36px", textAlign: "center", color: "var(--slate)" }}>
                      No dispute records found.
                    </td>
                  </tr>
                ) : (
                  filteredDisputes.map((d) => {
                    const statusStyle = STATUS_CONFIG[d.status] || STATUS_CONFIG["Notice Issued"];
                    return (
                      <tr key={d.id} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 500, fontSize: "12.5px" }}>
                          {d.docket_number}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ color: "var(--ink)", display: "block", fontWeight: 500 }}>{d.claimant_name}</span>
                          <span style={{ fontSize: "11.5px", color: "var(--slate)" }}>{d.claimant_email}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ color: "var(--ink)", display: "block", fontWeight: 500 }}>{d.respondent_name}</span>
                          <span style={{ fontSize: "11.5px", color: "var(--slate)" }}>{d.respondent_email}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--serif)", fontSize: "15px", color: "var(--ink)" }}>
                          ₹ {Number(d.claim_amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              background: "rgba(18, 41, 74, 0.05)",
                              color: "var(--ink)",
                              padding: "3px 7px",
                              borderRadius: "2px",
                              fontFamily: "var(--mono)",
                              fontSize: "11px",
                              fontWeight: 500
                            }}
                          >
                            {d.mode}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <select
                            value={d.status || "Notice Issued"}
                            disabled={updatingId === d.id}
                            onChange={(e) => handleStatusChange(d.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "3px",
                              fontSize: "11.5px",
                              border: `1px solid ${statusStyle.color}40`,
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 500,
                              cursor: "pointer",
                              outline: "none"
                            }}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCase(d);
                              setEditedSummary(d.dispute_summary || "");
                              setIsEditingSummary(false);
                            }}
                            style={{
                              background: "var(--ink)",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "3px",
                              padding: "5px 12px",
                              fontSize: "11.5px",
                              fontWeight: 400,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all .15s ease"
                            }}
                          >
                            👁️ View Dossier
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "neutrals" ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "1px solid var(--line)" }}>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Full Name</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Role</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Bar Council ID</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Experience</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Specialization</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {neutrals.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "36px", textAlign: "center", color: "var(--slate)" }}>
                      No neutral applications recorded yet.
                    </td>
                  </tr>
                ) : (
                  neutrals.map((n) => (
                    <tr key={n.id} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 500 }}>{n.full_name}</td>
                      <td style={{ padding: "14px 18px" }}>{n.role}</td>
                      <td style={{ padding: "14px 18px", fontFamily: "var(--mono)" }}>{n.bar_council_id}</td>
                      <td style={{ padding: "14px 18px" }}>{n.experience_years} Years</td>
                      <td style={{ padding: "14px 18px" }}>{n.specialization}</td>
                      <td style={{ padding: "14px 18px", fontSize: "12px" }}>{n.email}<br />{n.phone}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "1px solid var(--line)" }}>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Client Name</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Email</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Preferred Date</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Time Slot</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Format</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "36px", textAlign: "center", color: "var(--slate)" }}>
                      No consultations booked yet.
                    </td>
                  </tr>
                ) : (
                  consultations.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 500 }}>{c.name}</td>
                      <td style={{ padding: "14px 18px" }}>{c.email}</td>
                      <td style={{ padding: "14px 18px" }}>{c.preferred_date}</td>
                      <td style={{ padding: "14px 18px" }}>{c.preferred_time}</td>
                      <td style={{ padding: "14px 18px" }}>{c.format}</td>
                      <td style={{ padding: "14px 18px", fontSize: "12px", color: "var(--slate)" }}>{c.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Case Dossier Modal */}
      {selectedCase && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCase(null)}
          style={{
            backdropFilter: "blur(8px)",
            background: "rgba(11, 27, 49, 0.65)",
            zIndex: 200
          }}
        >
          <div
            className="modal-card"
            style={{
              maxWidth: "760px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "8px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.25)",
              border: "1px solid #E2E8F0"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Modal Header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "linear-gradient(135deg, #0B1B31 0%, #1A365D 100%)",
                color: "#ffffff",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", background: "rgba(209, 154, 52, 0.25)", color: "#F6C878", padding: "3px 8px", borderRadius: "12px", fontWeight: 500 }}>
                    JUSTNIVARAN ODR CENTRE &bull; NEW DELHI
                  </span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                    &bull; Statutory Fast-Track Record
                  </span>
                </div>
                <h3 style={{ fontSize: "22px", color: "#ffffff", margin: 0, fontFamily: "var(--mono)", fontWeight: 500, letterSpacing: ".02em" }}>
                  {selectedCase.docket_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "16px",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "clamp(16px, 3vw, 28px)", display: "grid", gap: "16px", background: "var(--paper)" }}>
              {/* Meta Rail Info */}
              <div
                style={{
                  background: "var(--paper-hi)",
                  border: "1px solid var(--line)",
                  borderRadius: "4px",
                  padding: "10px 16px",
                  fontSize: "11.5px",
                  color: "var(--slate)",
                  display: "flex",
                  gap: "18px",
                  flexWrap: "wrap",
                  alignItems: "center"
                }}
              >
                <span>🏛️ <strong>Seat:</strong> New Delhi, India</span>
                <span>⚖️ <strong>Statute:</strong> Arbitration Act 1996 (s. 29A/29B)</span>
                <span>⏳ <strong>Statutory Cap:</strong> 6 Months Fast-Track</span>
              </div>

              {/* Disputed Monetary Claim Value & Status */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--line)",
                  borderRadius: "4px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                    DISPUTED MONETARY CLAIM VALUE
                  </div>
                  <div style={{ fontSize: "26px", fontFamily: "var(--serif)", color: "var(--ink)", fontWeight: 400, marginTop: "4px" }}>
                    ₹ {Number(selectedCase.claim_amount || 0).toLocaleString("en-IN")}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "4px" }}>
                    CURRENT DOCKET STATUS
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: 500,
                      background: "#FEF9E7",
                      color: "#B7950B",
                      border: "1px solid rgba(183, 149, 11, 0.25)"
                    }}
                  >
                    ● {selectedCase.status || "Notice Issued"}
                  </span>
                </div>
              </div>

              {/* Parties 2-Column Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                {/* Claimant */}
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#EBF5FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      👤
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                        CLAIMANT PARTY
                      </div>
                      <div style={{ fontSize: "15px", color: "var(--ink)", fontWeight: 500 }}>
                        {selectedCase.claimant_name}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--slate)", display: "grid", gap: "4px", paddingLeft: "42px" }}>
                    <div>✉️ {selectedCase.claimant_email}</div>
                    <div>📞 {selectedCase.claimant_phone || "—"}</div>
                  </div>
                </div>

                {/* Respondent */}
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FEF9E7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      🏢
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                        RESPONDENT PARTY
                      </div>
                      <div style={{ fontSize: "15px", color: "var(--ink)", fontWeight: 500 }}>
                        {selectedCase.respondent_name}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--slate)", display: "grid", gap: "4px", paddingLeft: "42px" }}>
                    <div>✉️ {selectedCase.respondent_email}</div>
                    <div>📞 {selectedCase.respondent_phone || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Statement of Claim & Case Summary */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                    STATEMENT OF CLAIM &amp; CASE SUMMARY
                  </span>
                  {!isEditingSummary && (
                    <button
                      type="button"
                      onClick={() => setIsEditingSummary(true)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--line)",
                        borderRadius: "2px",
                        padding: "3px 8px",
                        fontSize: "11.5px",
                        color: "var(--ink)",
                        cursor: "pointer"
                      }}
                    >
                      ✏️ Edit / Append
                    </button>
                  )}
                </div>

                {isEditingSummary ? (
                  <div>
                    <textarea
                      rows="3"
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "3px",
                        border: "1px solid var(--line)",
                        fontSize: "13px",
                        boxSizing: "border-box",
                        fontFamily: "var(--sans)"
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", justifyContent: "flex-end" }}>
                      <button className="btn ghost" type="button" onClick={() => setIsEditingSummary(false)} style={{ padding: "5px 10px", fontSize: "11.5px" }}>
                        Cancel
                      </button>
                      <button className="btn gold" type="button" onClick={handleSaveSummary} style={{ padding: "5px 12px", fontSize: "11.5px" }}>
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#3B4E68", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                    {selectedCase.dispute_summary || "No summary recorded."}
                  </p>
                )}
              </div>

              {/* Relief & Restitution Sought */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "16px" }}>
                <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>
                  RELIEF &amp; RESTITUTION SOUGHT
                </div>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#3B4E68", lineHeight: "1.6" }}>
                  {selectedCase.relief_sought || selectedCase.dispute_summary || "Statutory relief under the Arbitration & Conciliation Act, 1996."}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", paddingTop: "8px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`JustNivaran Official Notice - Case Docket ${selectedCase.docket_number} has been logged in the Registry.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#25D366",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span>💬</span> Send Notice via WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      background: "#ffffff",
                      color: "var(--ink)",
                      border: "1px solid var(--line)",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span>🖨️</span> Print Dossier (PDF)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  style={{
                    background: "var(--ink)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "20px",
                    padding: "8px 20px",
                    fontSize: "12.5px",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminDashboard; 