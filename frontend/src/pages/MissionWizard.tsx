import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Shield, FileSearch, Compass, CheckCircle2 } from "lucide-react";

export default function MissionWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [incident, setIncident] = useState({ title: "", severity: "high", description: "" });
  const [evidence, setEvidence] = useState({ name: "", category: "Disk Image", hash: "", location: "" });
  const [summary, setSummary] = useState("");

  const steps = [
    { id: 1, title: "Incident", icon: Shield },
    { id: 2, title: "Preuves", icon: FileSearch },
    { id: 3, title: "Analyse", icon: Compass },
    { id: 4, title: "Clà´ture", icon: CheckCircle2 },
  ];

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", gap: 20 },
    card: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 16, padding: 24 },
    title: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: "var(--brand-text-primary)" },
    desc: { color: "var(--brand-text-secondary)", fontSize: 14, lineHeight: 1.6 },
    input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--brand-border)", background: "var(--brand-card)", color: "var(--brand-text-primary)" },
    btn: { padding: "10px 16px", borderRadius: 10, background: "var(--brand-cyan)", color: "#fff", border: "none", cursor: "pointer" },
    btnSecondary: { padding: "10px 16px", borderRadius: 10, background: "transparent", border: "1px solid var(--brand-border)", color: "var(--brand-text-primary)", cursor: "pointer" },
  };

  return (
    <div style={s.container}>
      <button type="button" style={{ ...s.btnSecondary, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8 }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16}/> Retour
      </button>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {steps.map(({ id, title, icon: Icon }) => (
            <div key={id} style={{ borderRadius: 999, padding: "8px 12px", border: step >= id ? "1px solid var(--brand-cyan)" : "1px solid var(--brand-border)", color: step >= id ? "var(--brand-cyan)" : "var(--brand-text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon size={14} /> {title}
            </div>
          ))}
        </div>
        <h1 style={s.title}>Assistant de mission forensique</h1>
        <p style={s.desc}>Guide pas à  pas pour déclarer un incident, collecter des preuves et préparer un rapport scellé.</p>

        {step === 1 && (
          <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
            <input style={s.input} placeholder="Titre de lâ€™incident" value={incident.title} onChange={(e) => setIncident({ ...incident, title: e.target.value })} />
            <select style={s.input} value={incident.severity} onChange={(e) => setIncident({ ...incident, severity: e.target.value })}>
              <option value="critical">Critique</option>
              <option value="high">à‰levée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
            <textarea style={{ ...s.input, minHeight: 110 }} placeholder="Description de lâ€™incident" value={incident.description} onChange={(e) => setIncident({ ...incident, description: e.target.value })} />
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
            <input style={s.input} placeholder="Nom de la preuve" value={evidence.name} onChange={(e) => setEvidence({ ...evidence, name: e.target.value })} />
            <input style={s.input} placeholder="Hash SHA-256" value={evidence.hash} onChange={(e) => setEvidence({ ...evidence, hash: e.target.value })} />
            <input style={s.input} placeholder="Localisation" value={evidence.location} onChange={(e) => setEvidence({ ...evidence, location: e.target.value })} />
          </div>
        )}

        {step === 3 && (
          <div style={{ marginTop: 20, color: "var(--brand-text-secondary)" }}>
            Le triage YARA et la recherche dâ€™indicateurs peuvent être lancés depuis la page dâ€™analyse. Les résultats sont ensuite intégrés au rapport final.
          </div>
        )}

        {step === 4 && (
          <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
            <textarea style={{ ...s.input, minHeight: 110 }} placeholder="Résumé final et signature électronique" value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button type="button" style={s.btnSecondary} onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Précédent</button>
          <button type="button" style={s.btn} onClick={() => setStep(Math.min(4, step + 1))}>{step === 4 ? "Terminer" : "Suivant"}</button>
        </div>
      </div>
    </div>
  );
}
