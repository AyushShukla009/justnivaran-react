import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// 1. Auto-recover from deployment version mismatches / stale chunks
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

// 2. Anti-Inspect & Anti-Tamper Protections
if (import.meta.env.PROD) {
  // Disable Right-Click Context Menu
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Block Developer Shortcut Keys (F12, Cmd+Opt+I, Ctrl+Shift+I, View Source)
  document.addEventListener("keydown", (e) => {
    // F12
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I / Cmd+Option+I / Cmd+Option+J / Cmd+Option+C
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.shiftKey || e.altKey) &&
      ["i", "I", "j", "J", "c", "C"].includes(e.key)
    ) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U / Cmd+Option+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      return false;
    }
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);