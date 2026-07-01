// TIMELINE PAGE — API-backed with incident linking
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Clock } from "lucide-react";
import { api } from "../utils/api";
import { ps } from "../utils/pageStyles";
import { t } from "../i18n";

interface TimelineEvent {
  id: number;
  incident_id: string;
  timestamp: string;
  category: string;
  title: string;
  details?: string;
  source?: string;
  importance: "high" | "medium" | "low";
}

interface Incident {
  id: string;
  title: string;
}

export default function Timeline() {
  const [searchParams] = useSearchParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentId, setIncidentId] = useState(searchParams.get("incident") || "");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "network",
    importance: "medium" as TimelineEvent["importance"],
    details: "",
    source: "",
  });

  useEffect(() => {
    api.get("/api/incidents").then(setIncidents).catch(console.error);
  }, []);

  useEffect(() => {
    if (!incidentId && incidents.length > 0) {
      setIncidentId(incidents[0].id);
    }
  }, [incidents, incidentId]);

  useEffect(() => {
    if (!incidentId) return;
    setLoading(true);
    api.get(`/api/timeline?incident_id=${encodeURIComponent(incidentId)}`)
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidentId]);

  const filtered = events.filter((e) => activeCategory === "all" || e.category === activeCategory);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentId || !form.title.trim()) return;
    try {
      const created = await api.post("/api/timeline", {
        incident_id: incidentId,
        category: form.category,
        title: form.title,
        details: form.details || undefined,
        source: form.source || undefined,
        importance: form.importance,
      });
      setEvents((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setForm({ title: "", category: "network", importance: "medium", details: "", source: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={ps.container}>
      <div style={ps.header}>
        <div>
          <h1 style={ps.title}>{t("timeline.title")}</h1>
          <p style={ps.desc}>{t("timeline.desc")}</p>
        </div>
        <button type="button" style={ps.btnPrimary} onClick={() => setIsModalOpen(true)} disabled={!incidentId}>
          <Plus size={16} />
          <span>{t("timeline.addEvent")}</span>
        </button>
      </div>

      <div style={{ ...ps.card, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ ...ps.label, marginBottom: 0 }}>{t("timeline.linkedIncident")}</label>
        <select style={ps.select} value={incidentId} onChange={(e) => setIncidentId(e.target.value)}>
          {incidents.map((inc) => (
            <option key={inc.id} value={inc.id}>{inc.id} — {inc.title}</option>
          ))}
        </select>
        <span style={ps.muted}>{t("common.filter")} :</span>
        {["all", "network", "process", "malware", "auth", "system"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            style={{
              ...ps.btnSecondary,
              padding: "6px 12px",
              fontSize: 10,
              background: activeCategory === cat ? "rgba(99,142,203,0.15)" : ps.btnSecondary.background,
              borderColor: activeCategory === cat ? "var(--brand-cyan)" : "var(--brand-border)",
              color: activeCategory === cat ? "var(--brand-cyan)" : "var(--brand-text-secondary)",
            }}
          >
            {cat === "all" ? t("common.all") : t(`common.${cat}`)}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ borderLeft: "2px solid var(--brand-border)", paddingLeft: 20 }}>
          {loading ? (
            <div style={ps.muted}>{t("common.loading")}</div>
          ) : filtered.length === 0 ? (
            <div style={{ ...ps.card, textAlign: "center", padding: 32 }}>
              <Clock size={28} style={{ opacity: 0.3, margin: "0 auto 8px" }} />
              <p style={ps.muted}>{t("timeline.noEvents")}</p>
            </div>
          ) : (
            filtered.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                style={{
                  ...ps.card,
                  marginBottom: 14,
                  cursor: "pointer",
                  borderColor: selectedEvent?.id === event.id ? "var(--brand-cyan)" : "var(--brand-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ ...ps.mono, fontSize: 10, ...ps.muted }}>{new Date(event.timestamp).toLocaleString()}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: event.importance === "high" ? "var(--brand-crimson)" : "var(--brand-amber)", textTransform: "uppercase" }}>
                    {t(`common.${event.importance}`)}
                  </span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--brand-text-primary)", marginBottom: 4 }}>{event.title}</h3>
                <p style={{ ...ps.muted, fontSize: 11 }}>{event.details}</p>
              </div>
            ))
          )}
        </div>

        <div>
          {selectedEvent ? (
            <div style={ps.card}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--brand-cyan)", textTransform: "uppercase" }}>{t(`common.${selectedEvent.category}`)}</span>
                <button type="button" onClick={() => setSelectedEvent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-secondary)" }}>×</button>
              </div>
              <h3 style={{ fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 12 }}>{selectedEvent.title}</h3>
              <div style={{ ...ps.input, ...ps.mono, fontSize: 11, whiteSpace: "pre-wrap", marginBottom: 12 }}>{selectedEvent.details}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ ...ps.card, padding: 10 }}>
                  <span style={ps.label}>{t("common.source")}</span>
                  <p style={{ fontSize: 11, color: "var(--brand-text-primary)" }}>{selectedEvent.source || "—"}</p>
                </div>
                <div style={{ ...ps.card, padding: 10 }}>
                  <span style={ps.label}>{t("incidents.caseId")}</span>
                  <p style={{ ...ps.mono, fontSize: 11, color: "var(--brand-cyan)" }}>{selectedEvent.incident_id}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...ps.card, textAlign: "center", padding: 40 }}>
              <Clock size={32} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
              <p style={ps.muted}>{t("timeline.selectEvent")}</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div style={ps.modalOverlay}>
          <div style={ps.modalBackdrop} onClick={() => setIsModalOpen(false)} />
          <div style={ps.modal}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--brand-text-primary)" }}>{t("timeline.modalTitle")}</h3>
            <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={ps.label}>{t("timeline.eventTitle")}</label><input type="text" style={ps.input} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={ps.label}>{t("timeline.category")}</label>
                  <select style={ps.input} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                    {["network", "process", "malware", "auth", "system"].map((c) => (
                      <option key={c} value={c}>{t(`common.${c}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={ps.label}>{t("timeline.importance")}</label>
                  <select style={ps.input} value={form.importance} onChange={(e) => setForm((p) => ({ ...p, importance: e.target.value as TimelineEvent["importance"] }))}>
                    <option value="high">{t("common.high")}</option>
                    <option value="medium">{t("common.medium")}</option>
                    <option value="low">{t("common.low")}</option>
                  </select>
                </div>
              </div>
              <div><label style={ps.label}>{t("common.source")}</label><input type="text" style={ps.input} value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} /></div>
              <div><label style={ps.label}>{t("common.details")}</label><textarea style={{ ...ps.input, minHeight: 80 }} value={form.details} onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))} /></div>
              <button type="submit" style={ps.btnPrimary}>{t("timeline.addEvent")}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
