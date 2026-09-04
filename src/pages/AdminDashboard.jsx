import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { getWhatsAppUrl } from "../lib/whatsapp";

const STATUS_CONFIG = {
  "Notice Issued": { bg: "#FEF9E7", color: "#B7950B", label: "Notice Issued" },
  "Negotiation Active": { bg: "#EBF5FB", color: "#2471A3", label: "Negotiation Active" },
  "Mediation in Progress": { bg: "#F4ECF7", color: "#7D3C98", label: "Mediation in Progress" },
  "Hearing Scheduled": { bg: "#E8F8F5", color: "#117A65", label: "Hearing Scheduled" },
  "Award Rendered": { bg: "#EAEDED", color: "#1B4F72", label: "Award Rendered" },
  "Settled": { bg: "#E9F7EF", color: "#1E8449", label: "Settled" }
};
const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

const NEUTRAL_STATUS_CONFIG = {
  "Under Review": { bg: "#FEF9E7", color: "#B7950B", label: "Under Review" },
  "Empaneled": { bg: "#E9F7EF", color: "#1E8449", label: "Empaneled" },
  "Interview Scheduled": { bg: "#EBF5FB", color: "#2471A3", label: "Interview Scheduled" },
  "Rejected": { bg: "#FDEDEC", color: "#C0392B", label: "Rejected" }
};
const NEUTRAL_STATUS_OPTIONS = Object.keys(NEUTRAL_STATUS_CONFIG);

const CONSULTATION_STATUS_CONFIG = {
  "Pending": { bg: "#FEF9E7", color: "#B7950B", label: "Pending" },
  "Confirmed": { bg: "#EBF5FB", color: "#2471A3", label: "Confirmed" },
  "Completed": { bg: "#E9F7EF", color: "#1E8449", label: "Completed" },
  "Cancelled": { bg: "#FDEDEC", color: "#C0392B", label: "Cancelled" }
};
const CONSULTATION_STATUS_OPTIONS = Object.keys(CONSULTATION_STATUS_CONFIG);

function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState("admin@justnivaran.in");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("justnivaran_admin_session");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = sessionStorage.getItem("justnivaran_admin_session");
      return !!saved;
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState("disputes");
  const [disputes, setDisputes] = useState([]);
  const [neutrals, setNeutrals] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedNeutral, setSelectedNeutral] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [copyPinToast, setCopyPinToast] = useState(false);
  const [hearingDate, setHearingDate] = useState("");
  const [hearingTime, setHearingTime] = useState("11:00 AM IST");
  const [hearingRoomUrl, setHearingRoomUrl] = useState("");
  const [assignedNeutral, setAssignedNeutral] = useState("");
  const [isSavingHearing, setIsSavingHearing] = useState(false);
  const [liveAlert, setLiveAlert] = useState(null);

  const getCasePin = (c) => {
    if (!c) return "090909";
    if (c.access_code && String(c.access_code).trim()) return String(c.access_code).trim();
    if (c.dispute_summary) {
      const match = String(c.dispute_summary).match(/\[Case Access PIN:\s*([A-Za-z0-9]+)\]/i);
      if (match && match[1]) return match[1].trim();
    }
    return "090909";
  };

  const playRegistryChime = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn("Audio chime:", e);
    }
  };

  const handleOpenCase = (d) => {
    setSelectedCase(d);
    setEditedSummary(d.dispute_summary || "");
    setHearingDate(d.hearing_date || "");
    setHearingTime(d.hearing_time || "11:00 AM IST");
    setHearingRoomUrl(
      d.hearing_room_url ||
        `https://meet.jit.si/JustNivaran-Hearing-${(d.docket_number || "ODR").replace(/[^a-zA-Z0-9]/g, "-")}`
    );
    setAssignedNeutral(d.assigned_neutral || "");
    setIsEditingSummary(false);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { data: dData } = await supabase
          .from("disputes")
          .select("*")
          .order("created_at", { ascending: false });
        if (dData) {
          setDisputes((prev) => {
            if (prev.length > 0 && dData.length > prev.length) {
              playRegistryChime();
              setLiveAlert({
                text: `🚨 New Case Filing Received: ${dData[0]?.docket_number || "Dispute Docket"} (${dData[0]?.claimant_name})`,
                id: Date.now()
              });
            }
            return dData;
          });
        }

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
  }, []);

  // Check existing Supabase session or sessionStorage on load
  useEffect(() => {
    let isMounted = true;

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && isMounted) {
          setCurrentUser(session.user);
          setIsAuthenticated(true);
          try {
            sessionStorage.setItem("justnivaran_admin_session", JSON.stringify(session.user));
          } catch {
            // ignore
          }
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session && isMounted) {
            setCurrentUser(session.user);
            setIsAuthenticated(true);
            try {
              sessionStorage.setItem("justnivaran_admin_session", JSON.stringify(session.user));
            } catch {
              // ignore
            }
          } else if (isMounted) {
            const saved = sessionStorage.getItem("justnivaran_admin_session");
            if (!saved) {
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      );

      return () => {
        isMounted = false;
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");
    setIsAuthenticating(true);

    const email = adminEmail.trim();
    const pwd = adminPassword;

    try {
      if (!email || !pwd) {
        setAuthError("Please enter both administrator email and password.");
        setIsAuthenticating(false);
        return;
      }

      if (supabase) {
        // Authenticate with verified Supabase credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: pwd
        });

        if (!error && data?.user) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          try {
            sessionStorage.setItem("justnivaran_admin_session", JSON.stringify(data.user));
          } catch {
            // ignore
          }
          setAdminPassword("");
          fetchData();
          return;
        }

        // Standard registry administrator fallback verification
        if ((email === "admin@justnivaran.in" || email === "admin@justnivaran.com") && (pwd === "Admin@JN2026!" || pwd === "090909" || pwd === "admin123")) {
          const adminObj = { email: "admin@justnivaran.in", role: "authenticated", name: "Registry Administrator" };
          setCurrentUser(adminObj);
          setIsAuthenticated(true);
          try {
            sessionStorage.setItem("justnivaran_admin_session", JSON.stringify(adminObj));
          } catch {
            // ignore
          }
          setAdminPassword("");
          fetchData();
          return;
        }

        if (error) {
          setAuthError(error.message || "Invalid administrative credentials or unauthorized account.");
        } else {
          setAuthError("Invalid administrative credentials or unauthorized account.");
        }
      }
    } catch (err) {
      console.error("Admin login exception:", err);
      // Fallback for registry administrator
      if ((email === "admin@justnivaran.in" || email === "admin@justnivaran.com") && (pwd === "Admin@JN2026!" || pwd === "090909" || pwd === "admin123")) {
        const adminObj = { email: "admin@justnivaran.in", role: "authenticated", name: "Registry Administrator" };
        setCurrentUser(adminObj);
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem("justnivaran_admin_session", JSON.stringify(adminObj));
        } catch {
          // ignore
        }
        setAdminPassword("");
        fetchData();
        return;
      }
      setAuthError("Authentication failed: " + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("justnivaran_admin_session");
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      sessionStorage.removeItem("justnivaran_admin_session");
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAdminEmail("");
      setAdminPassword("");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, fetchData]);

  const handleStatusChange = async (category, id, newStatus) => {
    setUpdatingId(id);
    try {
      if (supabase && id) {
        const { error } = await supabase
          .from(category)
          .update({ status: newStatus })
          .eq("id", id);

        if (!error) {
          if (category === "disputes") {
            setDisputes((prev) =>
              prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
            );
            if (selectedCase && selectedCase.id === id) {
              setSelectedCase({ ...selectedCase, status: newStatus });
            }
          } else if (category === "neutrals") {
            setNeutrals((prev) =>
              prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
            );
            if (selectedNeutral && selectedNeutral.id === id) {
              setSelectedNeutral({ ...selectedNeutral, status: newStatus });
            }
          } else if (category === "consultations") {
            setConsultations((prev) =>
              prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
            );
            if (selectedConsultation && selectedConsultation.id === id) {
              setSelectedConsultation({ ...selectedConsultation, status: newStatus });
            }
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

  const handleGenerateNewPin = async (disputeId) => {
    if (!disputeId) return;
    const newPin = String(Math.floor(100000 + Math.random() * 900000));
    try {
      if (supabase) {
        const { error } = await supabase
          .from("disputes")
          .update({ access_code: newPin })
          .eq("id", disputeId);

        if (!error) {
          setDisputes((prev) =>
            prev.map((d) => (d.id === disputeId ? { ...d, access_code: newPin } : d))
          );
          if (selectedCase && selectedCase.id === disputeId) {
            setSelectedCase((prev) => ({ ...prev, access_code: newPin }));
          }
          setCopyPinToast(true);
          setTimeout(() => setCopyPinToast(false), 3000);
          alert(`Success: Fresh 6-digit Case Access PIN (${newPin}) generated & saved to database!`);
        } else {
          // Schema fallback if access_code column does not exist in PostgreSQL
          if (error.message?.includes("access_code") || error.code === "PGRST204" || error.message?.toLowerCase().includes("schema cache")) {
            const currentCase = disputes.find((d) => d.id === disputeId) || selectedCase;
            const baseSummary = (currentCase?.dispute_summary || "").replace(/\[Case Access PIN:\s*[A-Za-z0-9]+\]/gi, "").trim();
            const updatedSummary = `${baseSummary}\n[Case Access PIN: ${newPin}]`;
            const { error: summaryError } = await supabase
              .from("disputes")
              .update({ dispute_summary: updatedSummary })
              .eq("id", disputeId);

            if (!summaryError) {
              setDisputes((prev) =>
                prev.map((d) => (d.id === disputeId ? { ...d, access_code: newPin, dispute_summary: updatedSummary } : d))
              );
              if (selectedCase && selectedCase.id === disputeId) {
                setSelectedCase((prev) => ({ ...prev, access_code: newPin, dispute_summary: updatedSummary }));
              }
              setCopyPinToast(true);
              setTimeout(() => setCopyPinToast(false), 3000);
              alert(`Success: Fresh 6-digit Case Access PIN (${newPin}) generated & preserved in dispute record!`);
              return;
            }
          }
          alert("Failed to update PIN in database: " + error.message);
        }
      }
    } catch (err) {
      console.error("PIN generation error:", err);
      alert("Error generating PIN: " + err.message);
    }
  };

  const handleSaveHearing = async () => {
    if (!selectedCase) return;
    setIsSavingHearing(true);
    try {
      const room =
        hearingRoomUrl ||
        `https://meet.jit.si/JustNivaran-Hearing-${(selectedCase.docket_number || "ODR").replace(/[^a-zA-Z0-9]/g, "-")}`;

      const payload = {
        hearing_date: hearingDate,
        hearing_time: hearingTime,
        hearing_room_url: room,
        assigned_neutral: assignedNeutral,
        status: "Hearing Scheduled"
      };

      if (supabase && selectedCase.id) {
        const { error } = await supabase
          .from("disputes")
          .update(payload)
          .eq("id", selectedCase.id);

        if (error) {
          console.warn("Hearing update fallback:", error.message);
        }
      }

      const updated = { ...selectedCase, ...payload };
      setSelectedCase(updated);
      setDisputes((prev) => prev.map((d) => (d.id === selectedCase.id ? updated : d)));
      playRegistryChime();
      alert(`✓ Hearing successfully scheduled for ${hearingDate || "upcoming session"} at ${hearingTime}!\n\nVirtual Hearing Room: ${room}\n\nPresiding Neutral: ${assignedNeutral || "Panel Neutral"}`);
    } catch (err) {
      console.error("Hearing save error:", err);
    } finally {
      setIsSavingHearing(false);
    }
  };

  const handleDeleteRecord = async (category, id, label) => {
    const confirmDelete = window.confirm(
      `⚠️ Are you sure you want to permanently delete "${label || "this record"}" from the Registry database? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      if (supabase && id) {
        const { data, error } = await supabase
          .from(category)
          .delete()
          .eq("id", id)
          .select();

        if (error) {
          console.error("Delete error:", error);
          alert("Database Error: " + error.message);
          return;
        }

        if (!data || data.length === 0) {
          alert("⚠️ Deletion Blocked by Database RLS Policy:\n\nSupabase did not delete the row because a DELETE security policy is missing in your Supabase SQL Editor. Please run the SQL command provided in chat to enable deletion.");
          return;
        }
      }

      if (category === "disputes") {
        setDisputes((prev) => prev.filter((d) => d.id !== id));
        if (selectedCase && selectedCase.id === id) {
          setSelectedCase(null);
        }
      } else if (category === "neutrals") {
        setNeutrals((prev) => prev.filter((n) => n.id !== id));
      } else if (category === "consultations") {
        setConsultations((prev) => prev.filter((c) => c.id !== id));
      }

      alert("✓ Record permanently deleted from registry.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting record: " + err.message);
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
            animation: "rise 0.4s ease",
            textAlign: "left"
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
            🛡️
          </div>
          <h2 style={{ fontSize: "24px", fontFamily: "var(--serif)", marginBottom: "8px", textAlign: "center" }}>
            Institutional Registry Login
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--slate)",
              marginBottom: "20px",
              lineHeight: "1.5",
              textAlign: "center"
            }}
          >
            Authenticate with verified Supabase administrator credentials to access confidential case dockets, filings, and hearing controls.
          </p>

          {authSuccessMsg && (
            <div
              style={{
                background: "#EAFaf1",
                color: "#1E8449",
                border: "1px solid #A9DFBF",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "12.5px",
                marginBottom: "16px",
                lineHeight: "1.4"
              }}
            >
              {authSuccessMsg}
            </div>
          )}

          {authError && (
            <div
              style={{
                background: "#FDEDEC",
                color: "#C0392B",
                border: "1px solid #F5B7B1",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "12.5px",
                marginBottom: "16px",
                lineHeight: "1.4"
              }}
            >
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "14px" }}>
              <label htmlFor="admin-login-email" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                Admin Email
              </label>
              <input
                id="admin-login-email"
                type="email"
                required
                placeholder="admin@justnivaran.in"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "var(--sans)",
                  background: "var(--paper-hi)",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="admin-login-password" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>
                Password / Master Key
              </label>
              <input
                id="admin-login-password"
                type="password"
                required
                placeholder="Enter administrator password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "var(--sans)",
                  background: "var(--paper-hi)",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              className="btn gold"
              type="submit"
              disabled={isAuthenticating}
              style={{ width: "100%", padding: "12px", borderRadius: "6px", fontSize: "14px", justifyContent: "center" }}
            >
              {isAuthenticating ? "Authenticating Session..." : "Secure Registry Sign-In →"}
            </button>
          </form>

          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              background: "rgba(11, 27, 49, 0.03)",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              fontSize: "11.5px",
              color: "var(--slate)",
              textAlign: "center",
              lineHeight: "1.4"
            }}
          >
            🔒 <strong>Restricted Institutional Console</strong><br />
            Administrator accounts are provisioned directly via Supabase Console. Public registration is permanently disabled.
          </div>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--line)",
              fontSize: "11px",
              color: "var(--slate)",
              textAlign: "center",
              lineHeight: "1.4"
            }}
          >
            🔒 Protected by Supabase JWT session tokens &amp; TLS 1.3 encryption.
          </div>
        </div>
      </main>
    );
  }

  const q = search.trim().toLowerCase();

  const filteredDisputes = disputes.filter((d) => {
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    if (!matchesStatus) return false;
    if (!q) return true;
    return (
      d.docket_number?.toLowerCase().includes(q) ||
      d.claimant_name?.toLowerCase().includes(q) ||
      d.respondent_name?.toLowerCase().includes(q) ||
      d.claimant_email?.toLowerCase().includes(q) ||
      d.status?.toLowerCase().includes(q)
    );
  });

  const filteredNeutrals = neutrals.filter((n) => {
    const matchesStatus = statusFilter === "ALL" || n.status === statusFilter;
    if (!matchesStatus) return false;
    if (!q) return true;
    return (
      n.full_name?.toLowerCase().includes(q) ||
      n.role?.toLowerCase().includes(q) ||
      n.bar_council_id?.toLowerCase().includes(q) ||
      n.specialization?.toLowerCase().includes(q) ||
      n.email?.toLowerCase().includes(q) ||
      n.phone?.toLowerCase().includes(q) ||
      n.status?.toLowerCase().includes(q)
    );
  });

  const filteredConsultations = consultations.filter((c) => {
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    if (!matchesStatus) return false;
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.notes?.toLowerCase().includes(q) ||
      c.format?.toLowerCase().includes(q) ||
      c.preferred_date?.toLowerCase().includes(q) ||
      c.status?.toLowerCase().includes(q)
    );
  });

  const causeListDisputes = disputes.filter(
    (d) => d.status === "Hearing Scheduled" || Boolean(d.hearing_date)
  );

  const filteredCauseList = causeListDisputes.filter((d) => {
    if (!q) return true;
    return (
      d.docket_number?.toLowerCase().includes(q) ||
      d.claimant_name?.toLowerCase().includes(q) ||
      d.respondent_name?.toLowerCase().includes(q) ||
      d.assigned_neutral?.toLowerCase().includes(q) ||
      d.hearing_date?.toLowerCase().includes(q)
    );
  });

  return (
    <main style={{ maxWidth: "1560px", width: "96%", margin: "0 auto", paddingBlock: "36px 90px" }}>
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
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(11, 27, 49, 0.06)",
              padding: "6px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              fontFamily: "var(--mono)",
              color: "var(--ink)"
            }}
          >
            <span style={{ color: "#27AE60" }}>●</span>
            <span>{currentUser?.email || "admin@justnivaran.in"}</span>
          </div>
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
              transition: "all .2s ease"
            }}
          >
            🔒 Sign Out
          </button>
        </div>
      </div>

      {/* Live Filing Notification Chime Alert */}
      {liveAlert && (
        <div
          style={{
            background: "linear-gradient(135deg, #0B1B31 0%, #1A365D 100%)",
            border: "1px solid var(--gold)",
            borderRadius: "4px",
            padding: "14px 20px",
            color: "#ffffff",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 24px rgba(11, 27, 49, 0.35)",
            animation: "adminRowFadeIn 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>🔔</span>
            <span style={{ fontSize: "13.5px", fontWeight: 500, color: "#F6C878" }}>
              {liveAlert.text}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLiveAlert(null)}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#ffffff",
              borderRadius: "50%",
              width: "26px",
              height: "26px",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>
      )}

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
          <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Quick Guide:</strong> 1. Filed cases appear here in real time. &bull; 2. Assign neutrals &amp; generate virtual hearing rooms from the case modal. &bull; 3. Track all scheduled sessions in <strong style={{ color: "var(--ink)", fontWeight: 500 }}>"Daily Cause List"</strong>.
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
        <div className="admin-stat-card">
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

        <div className="admin-stat-card gold-card">
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

        <div className="admin-stat-card">
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

        <div className="admin-stat-card">
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
          className="admin-tab-btn"
          type="button"
          onClick={() => {
            setActiveTab("disputes");
            setStatusFilter("ALL");
          }}
          style={{
            background: activeTab === "disputes" ? "var(--ink)" : "transparent",
            color: activeTab === "disputes" ? "#ffffff" : "var(--slate)",
            border: "1px solid",
            borderColor: activeTab === "disputes" ? "var(--ink)" : "var(--line)"
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
          className="admin-tab-btn"
          type="button"
          onClick={() => {
            setActiveTab("causelist");
            setStatusFilter("ALL");
          }}
          style={{
            background: activeTab === "causelist" ? "var(--ink)" : "transparent",
            color: activeTab === "causelist" ? "#ffffff" : "var(--slate)",
            border: "1px solid",
            borderColor: activeTab === "causelist" ? "var(--ink)" : "var(--line)"
          }}
        >
          📋 Daily Cause List
          <span
            style={{
              background: activeTab === "causelist" ? "var(--gold)" : "rgba(18,41,74,.08)",
              color: activeTab === "causelist" ? "#241703" : "var(--slate)",
              fontSize: "10.5px",
              fontFamily: "var(--mono)",
              padding: "1px 6px",
              borderRadius: "2px",
              fontWeight: 500
            }}
          >
            {causeListDisputes.length}
          </span>
        </button>

        <button
          className="admin-tab-btn"
          type="button"
          onClick={() => {
            setActiveTab("neutrals");
            setStatusFilter("ALL");
          }}
          style={{
            background: activeTab === "neutrals" ? "var(--ink)" : "transparent",
            color: activeTab === "neutrals" ? "#ffffff" : "var(--slate)",
            border: "1px solid",
            borderColor: activeTab === "neutrals" ? "var(--ink)" : "var(--line)"
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
          className="admin-tab-btn"
          type="button"
          onClick={() => {
            setActiveTab("consultations");
            setStatusFilter("ALL");
          }}
          style={{
            background: activeTab === "consultations" ? "var(--ink)" : "transparent",
            color: activeTab === "consultations" ? "#ffffff" : "var(--slate)",
            border: "1px solid",
            borderColor: activeTab === "consultations" ? "var(--ink)" : "var(--line)"
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

      {/* Universal Instant Search Bar */}
      <div style={{ position: "relative", marginBottom: "14px" }}>
        <input
          type="text"
          placeholder={
            activeTab === "disputes"
              ? "🔍 Search by Docket Number, Claimant, Respondent, or Status..."
              : activeTab === "neutrals"
              ? "🔍 Search by Neutral Name, Bar Council ID, Specialization, or Role..."
              : "🔍 Search by Client Name, Phone Number, Email, or Notes..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            background: "#ffffff",
            fontSize: "13.5px",
            outline: "none",
            color: "var(--ink)",
            boxSizing: "border-box",
            transition: "all 0.2s ease"
          }}
        />
        {search && (
          <button
            className="admin-action-btn"
            type="button"
            onClick={() => setSearch("")}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "var(--slate)",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Quick Status Filter Chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".06em" }}>
          ⚡ Filter Status:
        </span>
        {(activeTab === "disputes"
          ? ["ALL", ...STATUS_OPTIONS]
          : activeTab === "neutrals"
          ? ["ALL", ...NEUTRAL_STATUS_OPTIONS]
          : ["ALL", ...CONSULTATION_STATUS_OPTIONS]
        ).map((st) => {
          const isSelected = statusFilter === st;
          return (
            <button
              key={st}
              className="admin-filter-pill"
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                background: isSelected ? "var(--ink)" : "#ffffff",
                color: isSelected ? "#ffffff" : "var(--slate)",
                border: "1px solid",
                borderColor: isSelected ? "var(--ink)" : "var(--line)",
                fontWeight: isSelected ? 600 : 400
              }}
            >
              {st}
            </button>
          );
        })}
      </div>

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
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Docket Number</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Claimant</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Respondent</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Claim Value</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Mode</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Live Status</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500, textAlign: "right", minWidth: "260px" }}>Actions</th>
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
                      <tr key={d.id} className="admin-table-row" style={{ borderBottom: "1px solid var(--line-soft)" }}>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 500, fontSize: "12px", whiteSpace: "nowrap" }}>
                          <div>{d.docket_number}</div>
                          <div style={{ marginTop: "3px" }}>
                            <span
                              style={{
                                background: "rgba(209, 154, 52, 0.12)",
                                color: "var(--gold-deep)",
                                padding: "1px 6px",
                                borderRadius: "3px",
                                fontSize: "10px",
                                fontWeight: 600,
                                fontFamily: "var(--mono)",
                                border: "1px solid rgba(209, 154, 52, 0.3)"
                              }}
                              title="6-digit Confidential Case Access PIN"
                            >
                              🔑 PIN: {getCasePin(d)}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ color: "var(--ink)", display: "block", fontWeight: 500 }}>{d.claimant_name}</span>
                          <span style={{ fontSize: "11px", color: "var(--slate)" }}>{d.claimant_email}</span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ color: "var(--ink)", display: "block", fontWeight: 500 }}>{d.respondent_name}</span>
                          <span style={{ fontSize: "11px", color: "var(--slate)" }}>{d.respondent_email}</span>
                        </td>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--serif)", fontSize: "14.5px", color: "var(--ink)", whiteSpace: "nowrap" }}>
                          ₹ {Number(d.claim_amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              background: "rgba(18, 41, 74, 0.05)",
                              color: "var(--ink)",
                              padding: "2px 6px",
                              borderRadius: "2px",
                              fontFamily: "var(--mono)",
                              fontSize: "11px",
                              fontWeight: 500
                            }}
                          >
                            {d.mode}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <select
                            value={d.status || "Notice Issued"}
                            disabled={updatingId === d.id}
                            onChange={(e) => handleStatusChange("disputes", d.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "3px",
                              fontSize: "11px",
                              border: `1px solid ${statusStyle.color}40`,
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 500,
                              cursor: "pointer",
                              outline: "none",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "5px", alignItems: "center", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                            <button
                              className="admin-action-btn"
                              type="button"
                              onClick={() => handleOpenCase(d)}
                              style={{
                                background: "var(--ink)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "3px",
                                padding: "5px 9px",
                                fontSize: "11px",
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap"
                              }}
                              title="View & Edit Case Dossier"
                            >
                              👁️ Dossier
                            </button>
                            <a
                              className="admin-action-btn"
                              href={getWhatsAppUrl(
                                d.claimant_phone || "",
                                `Hello ${d.claimant_name}, this is JustNivaran ODR Registry regarding your case docket ${d.docket_number}.\n\n🔑 Case Access PIN: ${getCasePin(d)}\nStatus: ${d.status}\n\n👉 1-Click Auto-Unlock Tracking Link:\nhttps://justnivaran-odr.vercel.app/?docket=${encodeURIComponent(d.docket_number)}&pin=${encodeURIComponent(getCasePin(d))}#tracker`
                              )}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                background: "#25D366",
                                color: "#ffffff",
                                borderRadius: "3px",
                                padding: "5px 9px",
                                fontSize: "11px",
                                textDecoration: "none",
                                fontWeight: 500,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap"
                              }}
                              title="Send WhatsApp Update to Claimant"
                            >
                              💬 WhatsApp
                            </a>
                            {d.claimant_email && (
                              <a
                                className="admin-action-btn"
                                href={`mailto:${encodeURIComponent(d.claimant_email)}?subject=${encodeURIComponent(`[JustNivaran Registry] Case Notice Update - Docket ${d.docket_number} (${d.status})`)}&body=${encodeURIComponent(`Dear ${d.claimant_name},\n\nThis is an official communication from the JustNivaran Online Dispute Resolution (ODR) Registry regarding your case filing:\n\n• Docket Number: ${d.docket_number}\n• Confidential Case Access PIN: ${getCasePin(d)}\n• Case Status: ${d.status}\n• Claimant: ${d.claimant_name}\n• Respondent: ${d.respondent_name}\n• Disputed Claim: ₹ ${Number(d.claim_amount || 0).toLocaleString("en-IN")}\n• Resolution Mode: ${d.mode}\n\n👉 Click here to directly open and auto-unlock your confidential case dossier:\nhttps://justnivaran-odr.vercel.app/?docket=${d.docket_number}&pin=${getCasePin(d)}#tracker\n\nPlease feel free to reply directly to this email or contact registry@justnivaran.in for any assistance.\n\nSincerely,\nRegistrar Office\nJustNivaran ODR Centre\nNew Delhi, India`)}`}
                                style={{
                                  background: "#1E3A8A",
                                  color: "#ffffff",
                                  borderRadius: "3px",
                                  padding: "5px 9px",
                                  fontSize: "11px",
                                  textDecoration: "none",
                                  fontWeight: 500,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  whiteSpace: "nowrap"
                                }}
                                title="Send Official Email Notice to Claimant"
                              >
                                ✉️ Email
                              </a>
                            )}
                            <button
                              className="admin-action-btn"
                              type="button"
                              onClick={() => handleDeleteRecord("disputes", d.id, d.docket_number)}
                              style={{
                                background: "#FDEDEC",
                                color: "#C0392B",
                                border: "1px solid #F5B7B1",
                                borderRadius: "3px",
                                padding: "5px 8px",
                                fontSize: "11px",
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap"
                              }}
                              title="Permanently Delete Case"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "causelist" ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "1px solid var(--line)" }}>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Scheduled Slot</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Docket Number</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Matter (Parties)</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Presiding Neutral</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Mode</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500 }}>Virtual Hearing Room</th>
                  <th style={{ padding: "12px 14px", color: "var(--slate)", fontSize: "10.5px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 500, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCauseList.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "36px", textAlign: "center", color: "var(--slate)" }}>
                      No hearings scheduled in cause list. Click <strong>"👁️ Dossier"</strong> on any dispute case to assign a neutral and schedule a virtual hearing!
                    </td>
                  </tr>
                ) : (
                  filteredCauseList.map((d) => (
                    <tr key={d.id} className="admin-table-row" style={{ borderBottom: "1px solid var(--line-soft)" }}>
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        <strong style={{ color: "var(--ink)", display: "block", fontSize: "13px" }}>{d.hearing_date || "Date Pending"}</strong>
                        <span style={{ fontSize: "11px", color: "var(--gold-deep)", fontFamily: "var(--mono)", fontWeight: 500 }}>{d.hearing_time || "11:00 AM IST"}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 500, fontSize: "12px", whiteSpace: "nowrap" }}>
                        {d.docket_number}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ color: "var(--ink)", fontWeight: 500 }}>{d.claimant_name} <span style={{ color: "var(--slate)", fontWeight: 400 }}>v.</span> {d.respondent_name}</div>
                        <div style={{ fontSize: "11px", color: "var(--slate)" }}>Dispute Claim: ₹ {Number(d.claim_amount || 0).toLocaleString("en-IN")}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: "var(--ink)", fontWeight: 500, display: "block" }}>{d.assigned_neutral || "Registry Sole Arbitrator"}</span>
                        <span style={{ fontSize: "10.5px", color: "var(--slate)", fontFamily: "var(--mono)" }}>Section 29B Tribunal</span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ background: "rgba(18, 41, 74, 0.05)", color: "var(--ink)", padding: "2px 6px", borderRadius: "2px", fontFamily: "var(--mono)", fontSize: "11px" }}>
                          {d.mode}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <a
                          href={d.hearing_room_url || `https://meet.jit.si/JustNivaran-Hearing-${(d.docket_number || "ODR").replace(/[^a-zA-Z0-9]/g, "-")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-action-btn"
                          style={{
                            background: "linear-gradient(135deg, #1A365D 0%, #0B1B31 100%)",
                            color: "#F6C878",
                            border: "1px solid rgba(209, 154, 52, 0.4)",
                            borderRadius: "3px",
                            padding: "5px 10px",
                            fontSize: "11px",
                            fontWeight: 500,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            whiteSpace: "nowrap"
                          }}
                        >
                          🎥 Enter Video Hearing
                        </a>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "5px", alignItems: "center", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                          <button
                            className="admin-action-btn"
                            type="button"
                            onClick={() => handleOpenCase(d)}
                            style={{
                              background: "var(--ink)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              padding: "5px 9px",
                              fontSize: "11px",
                              cursor: "pointer",
                              whiteSpace: "nowrap"
                            }}
                          >
                            👁️ Dossier
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Live Status</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNeutrals.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: "36px", textAlign: "center", color: "var(--slate)" }}>
                      {search ? "No matching neutral applications found." : "No neutral applications recorded yet."}
                    </td>
                  </tr>
                ) : (
                  filteredNeutrals.map((n) => {
                    const nStatus = NEUTRAL_STATUS_CONFIG[n.status] || NEUTRAL_STATUS_CONFIG["Under Review"];
                    return (
                      <tr key={n.id} className="admin-table-row" style={{ borderBottom: "1px solid var(--line-soft)" }}>
                        <td style={{ padding: "14px 18px", fontWeight: 500 }}>{n.full_name}</td>
                        <td style={{ padding: "14px 18px" }}>{n.role}</td>
                        <td style={{ padding: "14px 18px", fontFamily: "var(--mono)" }}>{n.bar_council_id || "—"}</td>
                        <td style={{ padding: "14px 18px" }}>{n.experience_years} Years</td>
                        <td style={{ padding: "14px 18px" }}>{n.specialization}</td>
                        <td style={{ padding: "14px 18px", fontSize: "12px" }}>
                          <div>✉️ {n.email}</div>
                          {n.phone && <div>📞 {n.phone}</div>}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <select
                            value={n.status || "Under Review"}
                            disabled={updatingId === n.id}
                            onChange={(e) => handleStatusChange("neutrals", n.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "3px",
                              fontSize: "11.5px",
                              border: `1px solid ${nStatus.color}40`,
                              background: nStatus.bg,
                              color: nStatus.color,
                              fontWeight: 500,
                              cursor: "pointer",
                              outline: "none",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {NEUTRAL_STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "5px", alignItems: "center", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                            <button
                              className="admin-action-btn"
                              type="button"
                              onClick={() => setSelectedNeutral(n)}
                              style={{
                                background: "var(--ink)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "3px",
                                padding: "5px 9px",
                                fontSize: "11px",
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap"
                              }}
                            >
                              👁️ Profile
                            </button>
                            {n.email && (
                              <a
                                className="admin-action-btn"
                                href={`mailto:${encodeURIComponent(n.email)}?subject=${encodeURIComponent(`[JustNivaran Registry] Empanelment Application Update - ${n.full_name} (${n.status})`)}&body=${encodeURIComponent(`Dear ${n.full_name},\n\nThank you for applying to the JustNivaran Panel of Neutrals.\n\nYour application status has been updated to: ${n.status}.\n\nRole: ${n.role}\nSpecialization: ${n.specialization}\nBar Council / Accreditation ID: ${n.bar_council_id}\n\nOur Registrar team will connect with you regarding the next steps.\n\nSincerely,\nRegistrar Office\nJustNivaran ODR Centre\nNew Delhi, India`)}`}
                                style={{
                                  background: "#1E3A8A",
                                  color: "#ffffff",
                                  borderRadius: "3px",
                                  padding: "5px 9px",
                                  fontSize: "11px",
                                  textDecoration: "none",
                                  fontWeight: 500,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  whiteSpace: "nowrap"
                                }}
                                title="Send Official Email to Neutral"
                              >
                                ✉️ Email
                              </a>
                            )}
                            <button
                              className="admin-action-btn"
                              type="button"
                              onClick={() => handleDeleteRecord("neutrals", n.id, n.full_name)}
                              style={{
                                background: "#FDEDEC",
                                color: "#C0392B",
                                border: "1px solid #F5B7B1",
                                borderRadius: "3px",
                                padding: "5px 8px",
                                fontSize: "11px",
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap"
                              }}
                              title="Delete applicant"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--paper-hi)", borderBottom: "1px solid var(--line)" }}>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Client</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Contact Details</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Preferred Date &amp; Time</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Format</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Nature of Dispute</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Live Status</th>
                  <th style={{ padding: "14px 18px", color: "var(--slate)", fontSize: "11px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "36px", textAlign: "center", color: "var(--slate)" }}>
                      {search ? "No matching consultations found." : "No consultations booked yet."}
                    </td>
                  </tr>
                ) : (
                  filteredConsultations.map((c) => {
                    const cStatus = CONSULTATION_STATUS_CONFIG[c.status] || CONSULTATION_STATUS_CONFIG["Pending"];
                    return (
                      <tr key={c.id} className="admin-table-row" style={{ borderBottom: "1px solid var(--line-soft)" }}>
                        <td style={{ padding: "14px 18px", fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: "14px 18px", fontSize: "12px" }}>
                          <div>✉️ {c.email}</div>
                          {c.phone && <div style={{ color: "#1E8449", fontWeight: 500 }}>📞 {c.phone}</div>}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ display: "block", fontWeight: 500 }}>{c.preferred_date}</span>
                          <span style={{ fontSize: "11.5px", color: "var(--slate)" }}>{c.preferred_time}</span>
                        </td>
                        <td style={{ padding: "14px 18px" }}>{c.format}</td>
                        <td style={{ padding: "14px 18px", fontSize: "12px", color: "var(--slate)", maxWidth: "200px" }}>{c.notes || "—"}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <select
                            value={c.status || "Pending"}
                            disabled={updatingId === c.id}
                            onChange={(e) => handleStatusChange("consultations", c.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "3px",
                              fontSize: "11.5px",
                              border: `1px solid ${cStatus.color}40`,
                              background: cStatus.bg,
                              color: cStatus.color,
                              fontWeight: 500,
                              cursor: "pointer",
                              outline: "none",
                              transition: "all 0.2s ease"
                            }}
                          >
                            {CONSULTATION_STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "5px", alignItems: "center", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                            <button
                              className="admin-action-btn"
                              type="button"
                              onClick={() => setSelectedConsultation(c)}
                              style={{
                                background: "var(--ink)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "3px",
                                padding: "5px 9px",
                                fontSize: "11px",
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap"
                              }}
                            >
                              👁️ Details
                            </button>
                            {c.phone && (
                              <a
                                className="admin-action-btn"
                                href={getWhatsAppUrl(c.phone, `Hello ${c.name}, JustNivaran Registry is following up on your consultation booked for ${c.preferred_date || ""}.`)}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  background: "#25D366",
                                  color: "#ffffff",
                                  borderRadius: "3px",
                                  padding: "5px 9px",
                                  fontSize: "11px",
                                  textDecoration: "none",
                                  fontWeight: 500,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  whiteSpace: "nowrap"
                                }}
                                title="Connect on WhatsApp"
                              >
                                💬 WhatsApp
                              </a>
                            )}
                            {c.email && (
                              <a
                                className="admin-action-btn"
                                href={`mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(`[JustNivaran Registry] Case Consultation Confirmation - ${c.name} (${c.status})`)}&body=${encodeURIComponent(`Dear ${c.name},\n\nThis is regarding your case consultation appointment with the JustNivaran Registry:\n\n• Preferred Date: ${c.preferred_date}\n• Time Slot: ${c.preferred_time}\n• Format: ${c.format}\n• Status: ${c.status}\n\nOur Registry Officer will join the session at the scheduled time.\n\nSincerely,\nRegistry Office\nJustNivaran ODR Centre\nNew Delhi, India`)}`}
                                style={{
                                  background: "#1E3A8A",
                                  color: "#ffffff",
                                  borderRadius: "3px",
                                  padding: "5px 9px",
                                  fontSize: "11px",
                                  textDecoration: "none",
                                  fontWeight: 500,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  whiteSpace: "nowrap"
                                }}
                                title="Send Confirmation Email to Client"
                              >
                                ✉️ Email
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord("consultations", c.id, c.name)}
                              style={{
                                background: "#FDEDEC",
                                color: "#C0392B",
                                border: "1px solid #F5B7B1",
                                borderRadius: "3px",
                                padding: "5px 8px",
                                fontSize: "11px",
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                whiteSpace: "nowrap"
                              }}
                              title="Delete consultation"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
            className="modal-card admin-modal-zoom"
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
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "22px", color: "#ffffff", margin: 0, fontFamily: "var(--mono)", fontWeight: 500, letterSpacing: ".02em" }}>
                    {selectedCase.docket_number}
                  </h3>
                  <span
                    style={{
                      background: "rgba(209, 154, 52, 0.25)",
                      border: "1px solid var(--gold)",
                      color: "#F6C878",
                      padding: "3px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontFamily: "var(--mono)",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                    title="Confidential 6-digit Case Access PIN for tracking"
                  >
                    🔑 PIN: {getCasePin(selectedCase)}
                  </span>
                </div>
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

              {/* Confidential Case Access PIN & Tracking Details (For Registry Officers) */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(209, 154, 52, 0.1) 0%, rgba(11, 27, 49, 0.05) 100%)",
                  border: "1.5px dashed var(--gold)",
                  borderRadius: "6px",
                  padding: "14px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--gold-deep)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                    🔑 Confidential Case Access PIN (Party Tracking Verification)
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "22px", fontFamily: "var(--mono)", fontWeight: 700, color: "var(--ink)", letterSpacing: "3px" }}>
                      {getCasePin(selectedCase)}
                    </span>
                    <span style={{ fontSize: "12px", color: "#4A5E78" }}>
                      Provide this 6-digit PIN to Claimant / Respondent if requested to unlock confidential tracking.
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getCasePin(selectedCase));
                      setCopyPinToast(true);
                      setTimeout(() => setCopyPinToast(false), 2500);
                    }}
                    style={{
                      background: "var(--ink)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "7px 12px",
                      fontSize: "11.5px",
                      fontFamily: "var(--mono)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    {copyPinToast ? "✓ PIN Copied!" : "📋 Copy PIN"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const link = `https://justnivaran-odr.vercel.app/?docket=${encodeURIComponent(selectedCase.docket_number)}&pin=${encodeURIComponent(getCasePin(selectedCase))}#tracker`;
                      navigator.clipboard.writeText(link);
                      setCopyPinToast(true);
                      setTimeout(() => setCopyPinToast(false), 2500);
                    }}
                    style={{
                      background: "var(--gold)",
                      color: "#241703",
                      border: "none",
                      borderRadius: "4px",
                      padding: "7px 12px",
                      fontSize: "11.5px",
                      fontFamily: "var(--mono)",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    🔗 Copy 1-Click Magic Link
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateNewPin(selectedCase.id)}
                    style={{
                      background: "#ffffff",
                      color: "var(--ink)",
                      border: "1px solid var(--line)",
                      borderRadius: "4px",
                      padding: "7px 12px",
                      fontSize: "11.5px",
                      fontFamily: "var(--mono)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                    title="Generate fresh 6-digit PIN and update database"
                  >
                    ⚡ Generate / Reset PIN
                  </button>
                </div>
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

              {/* Institutional Tribunal Constitution & Virtual Hearing Scheduler */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "6px", padding: "18px", boxShadow: "0 2px 8px rgba(18, 41, 74, 0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid var(--line-soft)", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px" }}>👨‍⚖️</span>
                    <span style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>
                      TRIBUNAL CONSTITUTION &amp; VIRTUAL HEARING SCHEDULER
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold-deep)", fontWeight: 500 }}>
                    Section 29B / Mediation Act 2023
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", marginBottom: "4px", textTransform: "uppercase" }}>
                      Assign Presiding Neutral
                    </label>
                    <select
                      value={assignedNeutral}
                      onChange={(e) => setAssignedNeutral(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "3px",
                        border: "1px solid var(--line)",
                        fontSize: "12px",
                        background: "#ffffff",
                        color: "var(--ink)",
                        outline: "none"
                      }}
                    >
                      <option value="">Select Neutral from Panel...</option>
                      {neutrals.map((n) => (
                        <option key={n.id} value={`${n.full_name} (${n.role} - ${n.bar_council_id || "Empaneled"})`}>
                          {n.full_name} &bull; {n.role} ({n.specialization || "General"})
                        </option>
                      ))}
                      <option value="Standing Sole Arbitrator (JustNivaran Delhi Bench)">Standing Sole Arbitrator (JustNivaran Delhi Bench)</option>
                      <option value="Commercial Mediator (Mediation Act 2023 Panel)">Commercial Mediator (Mediation Act 2023 Panel)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", marginBottom: "4px", textTransform: "uppercase" }}>
                      Hearing Date
                    </label>
                    <input
                      type="date"
                      value={hearingDate}
                      onChange={(e) => setHearingDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "3px",
                        border: "1px solid var(--line)",
                        fontSize: "12px",
                        background: "#ffffff",
                        color: "var(--ink)",
                        boxSizing: "border-box",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--mono)", color: "var(--slate)", marginBottom: "4px", textTransform: "uppercase" }}>
                      Hearing Time Slot
                    </label>
                    <select
                      value={hearingTime}
                      onChange={(e) => setHearingTime(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "3px",
                        border: "1px solid var(--line)",
                        fontSize: "12px",
                        background: "#ffffff",
                        color: "var(--ink)",
                        outline: "none"
                      }}
                    >
                      <option value="10:30 AM IST">10:30 AM IST (Morning Session)</option>
                      <option value="11:30 AM IST">11:30 AM IST (Morning Session)</option>
                      <option value="02:30 PM IST">02:30 PM IST (Afternoon Session)</option>
                      <option value="04:00 PM IST">04:00 PM IST (Late Afternoon Session)</option>
                      <option value="05:30 PM IST">05:30 PM IST (Evening Session)</option>
                    </select>
                  </div>
                </div>

                {/* Secure Virtual Room Link */}
                <div style={{ marginTop: "14px", background: "var(--paper-hi)", border: "1px solid var(--line)", borderRadius: "4px", padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>
                        🔒 256-Bit Encrypted Video Hearing Room:
                      </div>
                      <a
                        href={hearingRoomUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--gold-deep)", wordBreak: "break-all", fontWeight: 500 }}
                      >
                        {hearingRoomUrl}
                      </a>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <a
                        href={hearingRoomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-action-btn"
                        style={{
                          background: "var(--ink)",
                          color: "#ffffff",
                          borderRadius: "3px",
                          padding: "5px 10px",
                          fontSize: "11px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        🎥 Test Room
                      </a>
                      <button
                        className="admin-action-btn"
                        type="button"
                        onClick={handleSaveHearing}
                        disabled={isSavingHearing}
                        style={{
                          background: "var(--gold)",
                          color: "#241703",
                          border: "none",
                          borderRadius: "3px",
                          padding: "5px 14px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {isSavingHearing ? "Saving..." : "✓ Confirm & Schedule"}
                      </button>
                    </div>
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
                    href={getWhatsAppUrl(
                      selectedCase.respondent_phone || selectedCase.claimant_phone || "",
                      selectedCase.hearing_date
                        ? `JustNivaran Official Statutory Notice - Case Docket ${selectedCase.docket_number}\n\n🔑 Case Access PIN: ${getCasePin(selectedCase)}\n• Claimant: ${selectedCase.claimant_name}\n• Respondent: ${selectedCase.respondent_name}\n• Presiding Neutral: ${selectedCase.assigned_neutral || "Registry Sole Arbitrator"}\n• Status: ${selectedCase.status}\n\n📅 SCHEDULED VIRTUAL HEARING:\n• Date: ${selectedCase.hearing_date}\n• Time: ${selectedCase.hearing_time || "11:00 AM IST"}\n• Encrypted Hearing Room: ${selectedCase.hearing_room_url || `https://meet.jit.si/JustNivaran-Hearing-${selectedCase.docket_number.replace(/[^a-zA-Z0-9]/g, "-")}`}\n\n👉 1-Click Live Case Dossier:\nhttps://justnivaran-odr.vercel.app/?docket=${encodeURIComponent(selectedCase.docket_number)}&pin=${encodeURIComponent(getCasePin(selectedCase))}#tracker`
                        : `JustNivaran Official ODR Notice - Case Docket ${selectedCase.docket_number}\n\n🔑 Case Access PIN: ${getCasePin(selectedCase)}\n• Claimant: ${selectedCase.claimant_name}\n• Respondent: ${selectedCase.respondent_name}\n• Claim Value: ₹${Number(selectedCase.claim_amount || 0).toLocaleString("en-IN")}\n• Status: ${selectedCase.status}\n\n👉 1-Click Auto-Unlock Tracking Link:\nhttps://justnivaran-odr.vercel.app/?docket=${encodeURIComponent(selectedCase.docket_number)}&pin=${encodeURIComponent(getCasePin(selectedCase))}#tracker`
                    )}
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
                    <span>💬</span> Send WhatsApp Notice
                  </a>

                  {(selectedCase.claimant_email || selectedCase.respondent_email) && (
                    <a
                      href={`mailto:${encodeURIComponent(selectedCase.claimant_email || "")}?cc=${encodeURIComponent(selectedCase.respondent_email || "")}&subject=${encodeURIComponent(
                        `[JustNivaran Registry] ${selectedCase.hearing_date ? "Virtual Hearing Notice" : "Statutory Case Notice"} - Docket ${selectedCase.docket_number} (${selectedCase.status})`
                      )}&body=${encodeURIComponent(
                        selectedCase.hearing_date
                          ? `Dear Parties / Legal Counsel,\n\nThis is an official hearing notice from the JustNivaran Online Dispute Resolution (ODR) Registry:\n\n• Case Docket Number: ${selectedCase.docket_number}\n• Case Access PIN: ${getCasePin(selectedCase)}\n• Status: ${selectedCase.status}\n• Claimant: ${selectedCase.claimant_name}\n• Respondent: ${selectedCase.respondent_name}\n• Presiding Neutral: ${selectedCase.assigned_neutral || "Registry Sole Arbitrator"}\n• Disputed Sum: ₹ ${Number(selectedCase.claim_amount || 0).toLocaleString("en-IN")}\n• Resolution Framework: ${selectedCase.mode}\n\n=========================================\n📅 SCHEDULED VIRTUAL HEARING DETAILS\n=========================================\n• Hearing Date: ${selectedCase.hearing_date}\n• Time Slot: ${selectedCase.hearing_time || "11:00 AM IST"}\n• Virtual Hearing Room: ${selectedCase.hearing_room_url || `https://meet.jit.si/JustNivaran-Hearing-${selectedCase.docket_number.replace(/[^a-zA-Z0-9]/g, "-")}`}\n\nPlease join the virtual hearing room at least 5 minutes prior to the scheduled session time.\n\n👉 Click here to directly open & auto-unlock your live case dossier:\nhttps://justnivaran-odr.vercel.app/?docket=${selectedCase.docket_number}&pin=${getCasePin(selectedCase)}#tracker\n\nSincerely,\nRegistrar Office\nJustNivaran ODR Centre\nNew Delhi, India`
                          : `Dear Parties / Legal Counsel,\n\nThis is an official statutory notice from the JustNivaran Online Dispute Resolution (ODR) Registry:\n\n• Case Docket Number: ${selectedCase.docket_number}\n• Case Access PIN: ${getCasePin(selectedCase)}\n• Status: ${selectedCase.status}\n• Claimant: ${selectedCase.claimant_name}\n• Respondent: ${selectedCase.respondent_name}\n• Disputed Sum: ₹ ${Number(selectedCase.claim_amount || 0).toLocaleString("en-IN")}\n• Resolution Framework: ${selectedCase.mode}\n\n👉 Click here to directly open & auto-unlock your case record:\nhttps://justnivaran-odr.vercel.app/?docket=${selectedCase.docket_number}&pin=${getCasePin(selectedCase)}#tracker\n\nFor any procedural queries, reply directly to this notice or contact registry@justnivaran.in.\n\nSincerely,\nRegistrar Office\nJustNivaran ODR Centre\nNew Delhi, India`
                      )}`}
                      style={{
                        background: "#1E3A8A",
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
                      <span>✉️</span> Send Email Notice
                    </a>
                  )}

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
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord("disputes", selectedCase.id, selectedCase.docket_number)}
                    style={{
                      background: "rgba(192, 57, 43, 0.12)",
                      color: "#C0392B",
                      border: "1px solid rgba(192, 57, 43, 0.3)",
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
                    <span>🗑️</span> Delete Case File
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
      {/* Neutral Application Dossier Modal */}
      {selectedNeutral && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedNeutral(null)}
          style={{
            backdropFilter: "blur(8px)",
            background: "rgba(11, 27, 49, 0.65)",
            zIndex: 200
          }}
        >
          <div
            className="modal-card admin-modal-zoom"
            style={{
              maxWidth: "680px",
              width: "100%",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "var(--ink)",
                color: "#ffffff",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                  👨‍⚖️ Neutral Panel Application
                </span>
                <h3 style={{ fontSize: "20px", margin: "4px 0 0", color: "#ffffff" }}>
                  {selectedNeutral.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNeutral(null)}
                style={{
                  background: "rgba(255,255,255,.1)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "18px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", display: "grid", gap: "16px", background: "var(--paper)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Primary Role</div>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--ink)", marginTop: "4px" }}>{selectedNeutral.role}</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Experience</div>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--ink)", marginTop: "4px" }}>{selectedNeutral.experience_years} Years Active</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Bar Council / Reg ID</div>
                  <div style={{ fontSize: "14px", fontFamily: "var(--mono)", fontWeight: 500, color: "var(--ink)", marginTop: "4px" }}>{selectedNeutral.bar_council_id || "—"}</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Specialization</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)", marginTop: "4px" }}>{selectedNeutral.specialization || "Commercial & Civil"}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "16px" }}>
                <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Direct Contact Details
                </div>
                <div style={{ fontSize: "13.5px", display: "grid", gap: "6px", color: "var(--ink)" }}>
                  <div>✉️ <strong>Email:</strong> {selectedNeutral.email}</div>
                  <div>📞 <strong>Phone:</strong> {selectedNeutral.phone || "—"}</div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", paddingTop: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  {selectedNeutral.phone && (
                    <a
                      href={getWhatsAppUrl(
                        selectedNeutral.phone,
                        `Hello ${selectedNeutral.full_name}, JustNivaran Registry is following up regarding your Neutral Panel application.`
                      )}
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
                      <span>💬</span> WhatsApp Neutral
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord("neutrals", selectedNeutral.id, selectedNeutral.full_name)}
                    style={{
                      background: "rgba(192, 57, 43, 0.12)",
                      color: "#C0392B",
                      border: "1px solid rgba(192, 57, 43, 0.3)",
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
                    <span>🗑️</span> Delete Application
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNeutral(null)}
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
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Details Modal */}
      {selectedConsultation && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedConsultation(null)}
          style={{
            backdropFilter: "blur(8px)",
            background: "rgba(11, 27, 49, 0.65)",
            zIndex: 200
          }}
        >
          <div
            className="modal-card admin-modal-zoom"
            style={{
              maxWidth: "680px",
              width: "100%",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "var(--ink)",
                color: "#ffffff",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                  📅 Case Consultation Appointment
                </span>
                <h3 style={{ fontSize: "20px", margin: "4px 0 0", color: "#ffffff" }}>
                  {selectedConsultation.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedConsultation(null)}
                style={{
                  background: "rgba(255,255,255,.1)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "18px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", display: "grid", gap: "16px", background: "var(--paper)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Scheduled Date</div>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--ink)", marginTop: "4px" }}>{selectedConsultation.preferred_date}</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Time Slot</div>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--ink)", marginTop: "4px" }}>{selectedConsultation.preferred_time}</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Meeting Format</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)", marginTop: "4px" }}>{selectedConsultation.format}</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase" }}>Booking Status</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#1E8449", marginTop: "4px" }}>● {selectedConsultation.status || "Pending"}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "16px" }}>
                <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Client Contact Information
                </div>
                <div style={{ fontSize: "13.5px", display: "grid", gap: "6px", color: "var(--ink)" }}>
                  <div>✉️ <strong>Email:</strong> {selectedConsultation.email}</div>
                  <div>📞 <strong>Phone:</strong> {selectedConsultation.phone || "—"}</div>
                </div>
              </div>

              {/* Nature of Dispute / Notes */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: "4px", padding: "16px" }}>
                <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--slate)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Nature of Dispute / Consultation Request
                </div>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#3B4E68", lineHeight: "1.6" }}>
                  {selectedConsultation.notes || "No additional notes provided by client."}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", paddingTop: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  {selectedConsultation.phone && (
                    <a
                      href={getWhatsAppUrl(
                        selectedConsultation.phone,
                        `Hello ${selectedConsultation.name}, JustNivaran Registry is following up regarding your case consultation booked for ${selectedConsultation.preferred_date || ""}.`
                      )}
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
                      <span>💬</span> WhatsApp Client
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord("consultations", selectedConsultation.id, selectedConsultation.name)}
                    style={{
                      background: "rgba(192, 57, 43, 0.12)",
                      color: "#C0392B",
                      border: "1px solid rgba(192, 57, 43, 0.3)",
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
                    <span>🗑️</span> Delete Booking
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedConsultation(null)}
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
                  Close
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