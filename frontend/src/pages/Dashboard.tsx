// DASHBOARD PAGE
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Cpu, Database, Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, MapPinned } from "lucide-react";
import { t } from "../i18n";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const incidentData = [
  { day: "Mon", open: 3, resolved: 2, activity: 18 },
  { day: "Tue", open: 5, resolved: 4, activity: 24 },
  { day: "Wed", open: 7, resolved: 3, activity: 29 },
  { day: "Thu", open: 4, resolved: 5, activity: 22 },
  { day: "Fri", open: 9, resolved: 6, activity: 33 },
  { day: "Sat", open: 2, resolved: 2, activity: 16 },
  { day: "Sun", open: 1, resolved: 3, activity: 14 }
];

const correlationData = [
  { name: "Credential theft", value: 96 },
  { name: "Phishing", value: 88 },
  { name: "Malware", value: 92 },
  { name: "Data exfil", value: 79 },
  { name: "Recon", value: 83 }
];

const incidentMap = [
  { region: "Adakpamé", severity: 4 },
  { region: "Agoe-Zongo", severity: 2 },
  { region: "Sokodé", severity: 3 },
  { region: "Abidjan", severity: 5 }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
    headerText: { flex: 1 },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 34, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 },
    headerButtons: { display: "flex", gap: 12, flexWrap: "wrap" },
    btn: { padding: "12px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 10, color: "#F9FAFB", fontWeight: 600, fontSize: 13, cursor: "pointer" },
    btnPrimary: { background: "#FFFFFF", border: "none", color: "#000000" },
    metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 },
    metricCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 14, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", minHeight: 124 },
    metricContent: { display: "flex", flexDirection: "column", gap: 8 },
    metricLabel: { fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.6 },
    metricValue: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 26, color: "#F9FAFB" },
    metricTrend: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9CA3AF" },
    metricIcon: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "1px solid" },
    graphSection: { display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16 },
    bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    tripleGrid: { display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16 },
    card: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 14, padding: 20 },
    cardTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#F9FAFB", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #1F2937" },
    threatItem: { background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 10, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
    listItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(31, 41, 55, 0.5)", fontSize: 12, color: "#D1D5DB" }
  };

  const metrics = [
    { title: t("dashboard.activeIncidents"), value: 12, change: t("dashboard.activeIncidentsChange"), trend: "up", icon: ShieldAlert, color: "#EF4444" },
    { title: t("dashboard.evidenceTriaged"), value: 38, change: t("dashboard.evidenceTriagedChange"), trend: "up", icon: Cpu, color: "#3B82F6" },
    { title: t("dashboard.integrityVerified"), value: "100%", change: t("dashboard.integrityChange"), trend: "up", icon: Database, color: "#10B981" },
    { title: t("dashboard.avgTriage"), value: "14m", change: t("dashboard.avgTriageChange"), trend: "down", icon: Clock, color: "#06B6D4" },
    { title: t("dashboard.analystAvailability"), value: "92%", change: t("dashboard.analystChange"), trend: "up", icon: CheckCircle2, color: "#10B981" },
    { title: t("dashboard.criticalAlerts"), value: 4, change: t("dashboard.criticalChange"), trend: "neutral", icon: AlertTriangle, color: "#F59E0B" }
  ];

  const threats = [
    { type: "Malicious IP", details: "198.51.100.245 (C2)", source: "AlienVault OTX", confidence: "94%" },
    { type: "Malware Hash", details: "f48a912c... (Mimikatz)", source: "VirusTotal", confidence: "100%" },
    { type: "Domain indicator", details: "update-server-secure.org", source: "Threat Feed L2", confidence: "87%" },
    { type: "Suspicious DLL", details: "winsock32_patch.dll", source: "YARA rule local", confidence: "90%" },
    { type: "Credential Theft", details: "LSASS dump candidate", source: "Sigma rules", confidence: "96%" }
  ];

  const caseQueue = [
    { name: "Ransomware outbreak on DC01", state: "Escalated" },
    { name: "Cloud mailbox phishing campaign", state: "In review" },
    { name: "Encrypted backup anomaly", state: "Monitoring" }
  ];

  const evidenceQueue = [
    { name: "Memory image - Host 17", status: "Ready for chain-of-custody" },
    { name: "USB acquisition package", status: "Hash verified" },
    { name: "Browser artifact dump", status: "Pending analyst sign-off" }
  ];

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.headerText}>
          <h1 style={s.title}>{t("dashboard.title")}</h1>
          <p style={s.desc}>{t("dashboard.desc")}</p>
        </div>
        <div style={s.headerButtons}>
          <button style={s.btn} onClick={() => navigate('/incidents')}>{t("dashboard.manageIncidents")}</button>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={() => navigate('/analysis')}>+ {t("dashboard.fileScanner")}</button>
        </div>
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

      <div style={s.graphSection}>
        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.incidentVolume")}</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incidentData}>
                <defs>
                  <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1F2937" opacity={0.3} />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB" }} />
                <Area type="monotone" dataKey="open" stroke="#3B82F6" fill="url(#colorOpen)" />
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
                    <AlertTriangle size={14} style={{ color: "#F59E0B" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#F9FAFB" }}>{t.type}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>{t.details}</p>
                </div>
                <div style={{ textAlign: "right", fontSize: 10 }}>
                  <div style={{ color: "#3B82F6", fontWeight: 600, marginBottom: 4 }}>{t.source}</div>
                  <span style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{t.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.tripleGrid}>
        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.activityTimeline")}</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentData}>
                <CartesianGrid stroke="#1F2937" opacity={0.3} />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB" }} />
                <Line type="monotone" dataKey="activity" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.incidentMapping")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {incidentMap.map((item) => (
              <div key={item.region} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid #1F2937", borderRadius: 8, padding: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#F9FAFB", fontSize: 12 }}><MapPinned size={14} style={{ color: "#3B82F6" }} />{item.region}</span>
                <span style={{ color: item.severity >= 4 ? "#EF4444" : "#F59E0B", fontWeight: 700, fontSize: 12 }}>{t("dashboard.severityLabel", { level: String(item.severity) })}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.correlationGraph")}</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={correlationData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={s.bottomGrid}>
        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.caseQueue")}</h3>
          {caseQueue.map((item) => (
            <div key={item.name} style={s.listItem}>
              <span>{item.name}</span>
              <span style={{ color: "#10B981", fontWeight: 700 }}>{item.state}</span>
            </div>
          ))}
        </div>
        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.evidenceReadiness")}</h3>
          {evidenceQueue.map((item) => (
            <div key={item.name} style={s.listItem}>
              <span>{item.name}</span>
              <span style={{ color: "#3B82F6", fontWeight: 700 }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}