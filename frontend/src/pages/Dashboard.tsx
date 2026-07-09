// DASHBOARD PAGE - SIMPLIFIED
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Cpu, Database, Clock, TrendingUp, TrendingDown, AlertTriangle, Play, Sparkles, ArrowRight } from "lucide-react";
import { t } from "../i18n";
import { api } from "../utils/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const incidentData = [
  { day: "Mon", open: 3, resolved: 2, activity: 18 },
  { day: "Tue", open: 5, resolved: 4, activity: 24 },
  { day: "Wed", open: 7, resolved: 3, activity: 29 },
  { day: "Thu", open: 4, resolved: 5, activity: 22 },
  { day: "Fri", open: 9, resolved: 6, activity: 33 },
  { day: "Sat", open: 2, resolved: 2, activity: 16 },
  { day: "Sun", open: 1, resolved: 3, activity: 14 }
];

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  account_type: string;
  organization_name?: string;
  mfa_enabled: boolean;
  onboarding_completed: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    api.get("/api/auth/me")
      .then((data) => setProfile(data))
      .catch(console.error);
  }, []);

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
    headerText: { flex: "1 1 280px" },
    title: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 800, fontSize: 34, color: "var(--brand-text-primary)", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 14, color: "var(--brand-text-secondary)", lineHeight: 1.6 },
    headerButtons: { display: "flex", gap: 12, flexWrap: "wrap" },
    btn: { padding: "12px 18px", background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 10, color: "var(--brand-text-primary)", fontWeight: 600, fontSize: 13, cursor: "pointer" },
    btnPrimary: { background: "var(--brand-cyan)", border: "none", color: "#ffffff" },
    metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 },
    metricCard: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", minHeight: 124 },
    metricContent: { display: "flex", flexDirection: "column", gap: 8 },
    metricLabel: { fontSize: 10, fontWeight: 700, color: "var(--brand-text-secondary)", textTransform: "uppercase", letterSpacing: 0.6 },
    metricValue: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 800, fontSize: 26, color: "var(--brand-text-primary)" },
    metricTrend: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--brand-text-secondary)" },
    metricIcon: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "1px solid" },
    card: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20 },
    cardTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--brand-text-primary)", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--brand-border)" },
    threatItem: { background: "var(--theme-subtle-bg)", border: "1px solid var(--brand-border)", borderRadius: 10, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  };

  const metrics = [
    { title: t("dashboard.activeIncidents"), value: 12, change: t("dashboard.activeIncidentsChange"), trend: "up", icon: ShieldAlert, color: "#EF4444" },
    { title: t("dashboard.evidenceTriaged"), value: 38, change: t("dashboard.evidenceTriagedChange"), trend: "up", icon: Cpu, color: "#3B82F6" },
    { title: t("dashboard.integrityVerified"), value: "100%", change: t("dashboard.integrityChange"), trend: "up", icon: Database, color: "#10B981" },
    { title: t("dashboard.avgTriage"), value: "14m", change: t("dashboard.avgTriageChange"), trend: "down", icon: Clock, color: "#06B6D4" },
  ];

  const quickActions = [
    { label: t("dashboard.fileScanner"), path: "/analysis", icon: Play, description: "Analyze a suspicious file" },
    { label: t("dashboard.openIncident"), path: "/incidents", icon: ShieldAlert, description: "Create a new incident" },
    { label: t("dashboard.searchThreatIntel"), path: "/intel", icon: Sparkles, description: "Search threat intelligence" },
  ];

  const threats = [
    { type: "Malicious IP", details: "198.51.100.245 (C2)", source: "AlienVault OTX", confidence: "94%" },
    { type: "Malware Hash", details: "f48a912c... (Mimikatz)", source: "VirusTotal", confidence: "100%" },
    { type: "Domain indicator", details: "update-server-secure.org", source: "Threat Feed L2", confidence: "87%" },
  ];

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.headerText}>
          <h1 style={s.title}>{t("dashboard.title")}</h1>
          <p style={s.desc}>{t("dashboard.desc")}</p>
        </div>
        <div style={s.headerButtons}>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={() => navigate('/analysis')}>+ {t("dashboard.fileScanner")}</button>
          <button style={s.btn} onClick={() => navigate('/incidents')}>{t("dashboard.manageIncidents")}</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => navigate(item.path)} style={{ ...s.card, textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 12, background: "rgba(95, 203, 155, 0.1)", color: "var(--brand-cyan)" }}><Icon size={18} /></span>
              <div style={{ fontWeight: 700, color: "var(--brand-text-primary)", fontSize: 14 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "var(--brand-text-secondary)" }}>{item.description}</div>
            </button>
          );
        })}
      </div>

      <div style={s.metricsGrid}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} style={s.metricCard}>
              <div style={s.metricContent}>
                <span style={s.metricLabel}>{m.title}</span>
                <h3 style={s.metricValue}>{m.value}</h3>
                <div style={s.metricTrend}>
                  {m.trend === "up" && <TrendingUp size={12} style={{ color: "#10B981" }} />}
                  {m.trend === "down" && <TrendingDown size={12} style={{ color: "#EF4444" }} />}
                  <span>{m.change}</span>
                </div>
              </div>
              <div style={{ ...s.metricIcon, color: m.color, background: `rgba(59, 130, 246, 0.1)`, borderColor: `rgba(59, 130, 246, 0.2)` }}>
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>{t("dashboard.incidentVolume")}</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incidentData}>
                  <defs>
                    <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-cyan)" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="var(--brand-cyan)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--brand-border)" opacity={0.3} />
                  <XAxis dataKey="day" stroke="var(--brand-text-secondary)" />
                  <YAxis stroke="var(--brand-text-secondary)" />
                  <Tooltip contentStyle={{ backgroundColor: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)" }} />
                  <Area type="monotone" dataKey="open" stroke="var(--brand-cyan)" fill="url(#colorOpen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>{t("dashboard.threatFeed")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {threats.map((t, i) => (
                <div key={i} style={s.threatItem}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <AlertTriangle size={14} style={{ color: "var(--brand-amber)" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-text-primary)" }}>{t.type}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--brand-text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>{t.details}</p>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11 }}>
                    <div style={{ color: "var(--brand-cyan)", fontWeight: 600, marginBottom: 4 }}>{t.source}</div>
                    <span style={{ background: "rgba(255, 95, 95, 0.1)", color: "var(--brand-crimson)", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{t.confidence}</span>
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/intel')} style={{ ...s.btn, width: "100%", marginTop: 8 }}>
                View all threats <ArrowRight size={12} style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
