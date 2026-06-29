// TIMELINE PAGE
import React, { useState } from "react";
import { Plus, Filter, Clock, X, AlertTriangle, Loader } from "lucide-react";

interface TimelineEvent {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  details: string;
  source: string;
  importance: "high" | "medium" | "low";
}

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "ev-1",
      timestamp: "2026-06-27T02:45:12.000Z",
      category: "malware",
      title: "CobaltStrike Beacon DLL Invocation",
      details: "Protected process execution detected under C:\\Windows\\Temp\\rundll32.exe",
      source: "Endpoint Agent L3",
      importance: "high"
    },
    {
      id: "ev-2",
      timestamp: "2026-06-27T02:12:44.000Z",
      category: "process",
      title: "Local Administrator Privilege Escalation",
      details: "Process cmd.exe spawned by system user running powershell with bypass arguments",
      source: "Auditd Daemon",
      importance: "high"
    }
  ]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 11, color: "#9CA3AF" },
    btn: { padding: "10px 16px", background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    controlBar: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "center" },
    filterPill: { padding: "6px 12px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, border: "1px solid", cursor: "pointer", transition: "all 0.2s" },
    timelineTrack: { position: "relative" as const, paddingLeft: 24, borderLeft: "2px solid #1F2937" },
    timelineItem: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, marginBottom: 16, cursor: "pointer", transition: "all 0.2s" },
    detailPanel: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" as const, gap: 16 }
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      network: { bg: "#06B6D4", text: "rgba(6, 182, 212, 0.1)" },
      malware: { bg: "#EF4444", text: "rgba(239, 68, 68, 0.1)" },
      process: { bg: "#3B82F6", text: "rgba(59, 130, 246, 0.1)" },
      auth: { bg: "#F59E0B", text: "rgba(245, 158, 11, 0.1)" },
      system: { bg: "#9CA3AF", text: "rgba(156, 163, 175, 0.1)" }
    };
    return colors[cat as keyof typeof colors] || colors.system;
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  const filtered = events.filter(e => activeCategory === "all" || e.category === activeCategory);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Attack Timeline</h1>
          <p style={s.desc}>Chronological sequence of reconstructed attack events linked to incidents.</p>
        </div>
        <button style={s.btn} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Event</span>
        </button>
      </div>

      <div style={s.controlBar}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Filter:</span>
        {["all", "network", "process", "malware", "auth", "system"].map((cat) => (
          <button
            key={cat}
            style={{
              ...s.filterPill,
              background: activeCategory === cat ? "rgba(59, 130, 246, 0.1)" : "transparent",
              borderColor: activeCategory === cat ? "#3B82F6" : "#1F2937",
              color: activeCategory === cat ? "#3B82F6" : "#9CA3AF"
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={s.timelineTrack}>
          {filtered.map((event, i) => {
            const color = getCategoryColor(event.category);
            return (
              <div
                key={event.id}
                style={{
                  ...s.timelineItem,
                  borderColor: selectedEvent?.id === event.id ? "#3B82F6" : "#1F2937",
                  background: selectedEvent?.id === event.id ? "rgba(59, 130, 246, 0.05)" : "rgba(17, 24, 39, 0.5)"
                }}
                onClick={() => setSelectedEvent(event)}
              >
                <div style={{ position: "absolute", left: -30, top: 20, width: 12, height: 12, background: color.bg, borderRadius: "50%", border: "3px solid #0A0E1A" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#9CA3AF" }}>{formatDate(event.timestamp)}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: event.importance === "high" ? "#EF4444" : "#F59E0B", textTransform: "uppercase" }}>
                    {event.importance}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#F9FAFB", marginBottom: 6 }}>
                  {event.title}
                </h3>
                <p style={{ fontSize: 11, color: "#9CA3AF", maxWidth: 500 }}>{event.details}</p>
              </div>
            );
          })}
        </div>

        <div>
          {selectedEvent ? (
            <div style={s.detailPanel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1F2937", paddingBottom: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase" }}>{selectedEvent.category}</span>
                <button onClick={() => setSelectedEvent(null)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 18 }}>×</button>
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#F9FAFB" }}>{selectedEvent.title}</h3>
              <div style={{ background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, padding: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F9FAFB", whiteSpace: "pre-wrap" }}>
                {selectedEvent.details}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", padding: 12, borderRadius: 8 }}>
                  <span style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Source</span>
                  <p style={{ fontSize: 11, color: "#F9FAFB", marginTop: 4, fontWeight: 600 }}>{selectedEvent.source}</p>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", padding: 12, borderRadius: 8 }}>
                  <span style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Severity</span>
                  <p style={{ fontSize: 11, color: selectedEvent.importance === "high" ? "#EF4444" : "#F59E0B", marginTop: 4, fontWeight: 700, textTransform: "uppercase" }}>
                    {selectedEvent.importance}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...s.detailPanel, textAlign: "center", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <Clock size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>Select an event to view details</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} onClick={() => setIsModalOpen(false)} />
          <div style={{ position: "relative", background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 20, maxWidth: 420, width: "100%", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1F2937" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#F9FAFB" }}>Log Custom Event</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Event Title</label>
                <input type="text" style={{ width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 12, outline: "none" }} placeholder="e.g. Remote execution shell" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Category</label>
                  <select style={{ width: "100%", padding: "8px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 11 }}>
                    <option>Network</option>
                    <option>Process</option>
                    <option>Malware</option>
                    <option>Auth</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Importance</label>
                  <select style={{ width: "100%", padding: "8px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 11 }}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Details</label>
                <textarea style={{ width: "100%", padding: "10px 12px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", outline: "none", minHeight: 80 }} placeholder="Event details..." />
              </div>
              <button style={{ padding: 12, background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}