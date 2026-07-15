// ACTIVITY HISTORY PAGE
import React, { useEffect, useState } from "react";
import { Clock, FileSearch, ShieldAlert, Database, Globe, FileText } from "lucide-react";
import { api } from "../utils/api";
import { ps } from "../utils/pageStyles";
import { t } from "../i18n";

interface ActivityItem {
  id: number;
  action_type: string;
  title: string;
  description?: string;
  resource_id?: string;
  created_at: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  scan: <FileSearch size={16} />,
  report: <FileText size={16} />,
  intel: <Globe size={16} />,
  incident: <ShieldAlert size={16} />,
  evidence: <Database size={16} />,
  timeline: <Clock size={16} />,
};

export default function History() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/api/history?limit=100")
      .then((data) => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((i) => filter === "all" || i.action_type === filter);

  return (
    <div style={ps.container}>
      <div style={ps.header}>
        <div>
          <h1 style={ps.title}>{t("history.title")}</h1>
          <p style={ps.desc}>{t("history.desc")}</p>
        </div>
      </div>

      <div style={{ ...ps.card, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={ps.muted}>{t("common.filter")} :</span>
        {["all", "scan", "intel", "incident", "evidence", "timeline", "report"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            style={{
              ...ps.btnSecondary,
              background: filter === type ? "rgba(99, 142, 203, 0.15)" : ps.btnSecondary.background,
              borderColor: filter === type ? "var(--brand-cyan)" : "var(--brand-border)",
              color: filter === type ? "var(--brand-cyan)" : "var(--brand-text-primary)",
            }}
          >
            {type === "all" ? t("common.all") : t(`history.type.${type}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={ps.muted}>{t("common.loading")}</div>
      ) : filtered.length === 0 ? (
        <div style={{ ...ps.card, textAlign: "center", padding: 40 }}>
          <Clock size={32} style={{ color: "var(--brand-text-secondary)", margin: "0 auto 12px" }} />
          <p style={ps.muted}>{t("history.empty")}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                ...ps.card,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "rgba(99, 142, 203, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand-cyan)",
                  flexShrink: 0,
                }}
              >
                {typeIcons[item.action_type] || <Clock size={16} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--brand-text-primary)", fontSize: 14 }}>{item.title}</div>
                  {item.description && (
                    <div style={{ ...ps.muted, marginTop: 4 }}>{item.description}</div>
                  )}
                  {item.resource_id && (
                    <div style={{ ...ps.mono, ...ps.muted, marginTop: 6, fontSize: 11 }}>{item.resource_id}</div>
                  )}
                </div>
                <div style={{ ...ps.muted, fontSize: 11 }} className="shrink-0 text-left sm:text-right">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
