import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TerminalSquare } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "radial-gradient(circle at top, rgba(95,203,155,0.16), transparent 35%), var(--brand-abyssal)" }}>
      <div style={{ maxWidth: 760, width: "100%", background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 20, padding: 32, boxShadow: "0 20px 70px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <TerminalSquare size={24} color="var(--brand-cyan)" />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--brand-text-primary)" }}>Erreur 404 · Route introuvable</h1>
        </div>
        <p style={{ color: "var(--brand-text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
          La ressource que vous recherchez nâ€™est pas présente dans la chaîne dâ€™investigation. Retournez au tableau de bord ou relancez une nouvelle mission.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid var(--brand-border)", background: "transparent", color: "var(--brand-text-primary)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <ArrowLeft size={16} /> Retour
          </button>
          <button type="button" onClick={() => navigate("/dashboard")} style={{ padding: "10px 16px", borderRadius: 10, background: "var(--brand-cyan)", color: "#fff", border: "none", cursor: "pointer" }}>
            Tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}
