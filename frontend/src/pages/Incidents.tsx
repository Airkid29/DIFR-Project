// INCIDENTS PAGE — API-backed with interactive detail panel
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Clock, Database, X, ChevronRight } from "lucide-react";
import { api } from "../utils/api";
import { ps, severityColors } from "../utils/pageStyles";
import { t } from "../i18n";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "triage" | "resolved";
  created_at: string;
  description?: string;
  owner_id?: number;
}

export default function Incidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeverity, setNewSeverity] = useState<Incident["severity"]>("medium");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadIncidents = () => {
    setLoading(true);
    api.get("/api/incidents")
      .then((data) => setIncidents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadIncidents(); }, []);

  const filtered = incidents.filter(
    (inc) =>
      (inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.id.toLowerCase().includes(search.toLowerCase())) &&
      (filterSeverity === "all" || inc.severity === filterSeverity)
  );

  const stats = {
    open: incidents.filter((i) => i.status === "open" || i.status === "triage").length,
    critical: incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    setError("");
    try {
      await api.post("/api/incidents", {
        title: newTitle,
        severity: newSeverity,
        description: newDesc || undefined,
      });
      setIsModalOpen(false);
      setNewTitle("");
      setNewDesc("");
      loadIncidents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("common.serverError"));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: Incident["status"]) => {
    try {
      const updated = await api.patch(`/api/incidents/${id}`, { status });
      setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
      if (selected?.id === id) setSelected(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const updateSeverity = async (id: string, severity: Incident["severity"]) => {
    try {
      const updated = await api.patch(`/api/incidents/${id}`, { severity });
      setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
      if (selected?.id === id) setSelected(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={ps.container}>
      <div style={ps.header}>
        <div style={{ flex: 1 }}>
          <h1 style={ps.title}>{t("incidents.title")}</h1>
          <p style={ps.desc}>{t("incidents.desc")}</p>
        </div>
        <button type="button" style={ps.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>{t("incidents.logIncident")}</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        {[
          { label: t("incidents.openCases"), value: stats.open, color: "var(--brand-text-primary)" },
          { label: t("incidents.critical"), value: stats.critical, color: "var(--brand-crimson)" },
          { label: t("incidents.resolved"), value: stats.resolved, color: "var(--brand-emerald)" },
        ].map((s) => (
          <div key={s.label} style={ps.card}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--brand-text-secondary)" }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...ps.card, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240, maxWidth: 360 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--brand-text-secondary)" }} />
          <input type="text" style={{ ...ps.input, paddingLeft: 40 }} placeholder={t("incidents.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select style={ps.select} value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
          <option value="all">{t("incidents.allSeverities")}</option>
          <option value="critical">{t("common.critical")}</option>
          <option value="high">{t("common.high")}</option>
          <option value="medium">{t("common.medium")}</option>
          <option value="low">{t("common.low")}</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: 20, alignItems: "start" }}>
        <div style={ps.table}>
          {loading ? (
            <div style={{ padding: 32, textAlign: "center", ...ps.muted }}>{t("common.loading")}</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", ...ps.muted }}>{t("incidents.noIncidents")}</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--brand-border)" }}>
                  {[t("incidents.caseId"), t("common.title"), t("incidents.severity"), t("incidents.status"), t("incidents.created")].map((h) => (
                    <th key={h} style={{ padding: 16, textAlign: "left", fontSize: 10, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inc) => {
                  const sev = severityColors[inc.severity];
                  const isSelected = selected?.id === inc.id;
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => setSelected(inc)}
                      style={{
                        ...ps.rowHover,
                        borderBottom: "1px solid var(--brand-border)",
                        background: isSelected ? "var(--theme-white-bg-tint)" : "transparent",
                      }}
                    >
                      <td style={{ padding: 16, ...ps.mono, fontWeight: 700, color: "var(--brand-cyan)" }}>{inc.id}</td>
                      <td style={{ padding: 16, color: "var(--brand-text-primary)", fontWeight: 600 }}>
                        <div>{inc.title}</div>
                        {inc.description && <div style={{ ...ps.muted, marginTop: 4, fontSize: 11 }}>{inc.description}</div>}
                      </td>
                      <td style={{ padding: 16 }}>
                        <span style={{ ...ps.badge, background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                          {t(`common.${inc.severity}`)}
                        </span>
                      </td>
                      <td style={{ padding: 16, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: inc.status === "resolved" ? "var(--brand-emerald)" : "var(--brand-cyan)" }}>
                        {t(`common.${inc.status}`)}
                      </td>
                      <td style={{ padding: 16, ...ps.mono, fontSize: 11, color: "var(--brand-text-secondary)" }}>
                        {new Date(inc.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div style={{ ...ps.card, position: "sticky", top: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, color: "var(--brand-text-primary)", fontSize: 16 }}>{selected.id}</h3>
              <button type="button" onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-secondary)" }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontWeight: 600, marginBottom: 8, color: "var(--brand-text-primary)" }}>{selected.title}</p>
            {selected.description && <p style={{ ...ps.muted, marginBottom: 16, lineHeight: 1.5 }}>{selected.description}</p>}

            <div style={{ marginBottom: 16 }}>
              <label style={ps.label}>{t("incidents.status")}</label>
              <select
                style={ps.select}
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value as Incident["status"])}
              >
                <option value="open">{t("common.open")}</option>
                <option value="triage">{t("common.triage")}</option>
                <option value="resolved">{t("common.resolved")}</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={ps.label}>{t("incidents.severity")}</label>
              <select
                style={ps.select}
                value={selected.severity}
                onChange={(e) => updateSeverity(selected.id, e.target.value as Incident["severity"])}
              >
                {(["low", "medium", "high", "critical"] as const).map((s) => (
                  <option key={s} value={s}>{t(`common.${s}`)}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="button"
                style={ps.btnSecondary}
                onClick={() => navigate(`/timeline?incident=${selected.id}`)}
              >
                <Clock size={14} />
                {t("incidents.viewTimeline")}
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </button>
              <button
                type="button"
                style={ps.btnSecondary}
                onClick={() => navigate("/evidence")}
              >
                <Database size={14} />
                {t("incidents.linkEvidence")}
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </button>
              <button
                type="button"
                style={ps.btnPrimary}
                onClick={() => navigate(`/analysis`)}
              >
                {t("incidents.analyzeArtifact")}
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={ps.modalOverlay}>
          <div style={ps.modalBackdrop} onClick={() => setIsModalOpen(false)} />
          <div style={ps.modal}>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--brand-text-primary)", marginBottom: 16 }}>{t("incidents.modalTitle")}</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={ps.label}>{t("common.title")}</label>
                <input type="text" style={ps.input} placeholder={t("incidents.titlePlaceholder")} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
              </div>
              <div>
                <label style={ps.label}>{t("incidents.description")}</label>
                <textarea style={{ ...ps.input, minHeight: 80, resize: "vertical" }} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder={t("incidents.descPlaceholder")} />
              </div>
              <div>
                <label style={ps.label}>{t("incidents.severity")}</label>
                <select style={ps.input} value={newSeverity} onChange={(e) => setNewSeverity(e.target.value as Incident["severity"])}>
                  {(["low", "medium", "high", "critical"] as const).map((s) => (
                    <option key={s} value={s}>{t(`common.${s}`)}</option>
                  ))}
                </select>
              </div>
              {error && <div style={{ ...ps.danger, fontSize: 12 }}>{error}</div>}
              <button type="submit" style={ps.btnPrimary} disabled={saving}>
                {saving ? t("common.loading") : t("incidents.createIncident")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
