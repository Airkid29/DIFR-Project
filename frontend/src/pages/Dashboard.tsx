// DASHBOARD PAGE
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Cpu, Database, Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, MapPinned, Play, Sparkles, ArrowRight } from "lucide-react";
import { t } from "../i18n";
import { api } from "../utils/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showInvestigationHub, setShowInvestigationHub] = useState(false);

  useEffect(() => {
    api.get("/api/auth/me")
      .then((data) => setProfile(data))
      .catch(console.error);
  }, []);

  const openOnboardingModal = () => {
    setShowOnboardingModal(true);
    setOnboardingStep(0);
  };

  const closeOnboardingModal = () => {
    setShowOnboardingModal(false);
  };

  const finishOnboarding = async () => {
    setShowOnboarding(false);
    setShowOnboardingModal(false);
    try {
      await api.put("/api/auth/me", { onboarding_completed: true });
      setProfile((prev) => (prev ? { ...prev, onboarding_completed: true } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  const openInvestigationHub = () => {
    setShowInvestigationHub(true);
  };

  const closeInvestigationHub = () => {
    setShowInvestigationHub(false);
  };

  const runInvestigationFlow = (path: string) => {
    setShowInvestigationHub(false);
    navigate(path);
  };

  const onboardingSteps = [
    {
      title: t("dashboard.onboardingStep1Title"),
      description: t("dashboard.onboardingStep1Desc"),
      bullets: [
        t("dashboard.onboardingStep1Bullet1"),
        t("dashboard.onboardingStep1Bullet2"),
      ],
    },
    {
      title: t("dashboard.onboardingStep2Title"),
      description: t("dashboard.onboardingStep2Desc"),
      bullets: [
        t("dashboard.onboardingStep2Bullet1"),
        t("dashboard.onboardingStep2Bullet2"),
      ],
    },
    {
      title: t("dashboard.onboardingStep3Title"),
      description: t("dashboard.onboardingStep3Desc"),
      bullets: [
        t("dashboard.onboardingStep3Bullet1"),
        t("dashboard.onboardingStep3Bullet2"),
      ],
    },
  ];

  const investigationOptions = [
    { label: t("dashboard.hubAnalyzeFile"), path: "/analysis", description: t("dashboard.hubAnalyzeFileDesc"), icon: Play },
    { label: t("dashboard.hubCreateIncident"), path: "/incidents", description: t("dashboard.hubCreateIncidentDesc"), icon: ShieldAlert },
    { label: t("dashboard.hubThreatSearch"), path: "/intel", description: t("dashboard.hubThreatSearchDesc"), icon: Sparkles },
    { label: t("dashboard.hubReviewEvidence"), path: "/evidence", description: t("dashboard.hubReviewEvidenceDesc"), icon: Database },
  ];

  const actionButtons = [
    { label: t("dashboard.startNewInvestigation"), onClick: () => navigate("/analysis"), icon: Play, description: t("dashboard.startNewInvestigationDesc") },
    { label: t("dashboard.openIncident") , onClick: () => navigate("/incidents"), icon: ShieldAlert, description: t("dashboard.openIncidentDesc") },
    { label: t("dashboard.searchThreatIntel"), onClick: () => navigate("/intel"), icon: Sparkles, description: t("dashboard.searchThreatIntelDesc") },
  ];

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column", gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
    headerText: { flex: "1 1 280px" },
    title: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 800, fontSize: 34, color: "var(--brand-text-primary)", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 14, color: "var(--brand-text-secondary)", lineHeight: 1.6 },
    headerButtons: { display: "flex", gap: 12, flexWrap: "wrap" },
    btn: { padding: "12px 18px", background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 10, color: "var(--brand-text-primary)", fontWeight: 600, fontSize: 13, cursor: "pointer" },
    btnPrimary: { background: "var(--brand-cyan)", border: "none", color: "#ffffff" },
    modalBackdrop: { position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", background: "rgba(0, 0, 0, 0.6)", padding: 20 },
    modalCard: { width: "min(1100px, 100%)", maxWidth: 1120, background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 24, padding: 28, boxShadow: "0 24px 80px rgba(0, 0, 0, 0.15)" },
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
    listItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--brand-border)", fontSize: 12, color: "var(--brand-text-primary)" }
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
          <button style={s.btn} onClick={openInvestigationHub}>{t("dashboard.openInvestigationHub")}</button>
          <button style={s.btn} onClick={() => navigate('/incidents')}>{t("dashboard.manageIncidents")}</button>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={() => navigate('/analysis')}>+ {t("dashboard.fileScanner")}</button>
        </div>
      </div>

      {profile && !profile.onboarding_completed && showOnboarding && (
        <div style={{ ...s.card, borderColor: "var(--brand-cyan)", background: "rgba(95, 203, 155, 0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-text-primary)" }}>{t("dashboard.welcomeBack", { name: profile.name.split(" ")[0] })}</div>
              <p style={{ fontSize: 13, color: "var(--brand-text-secondary)", maxWidth: 760, marginTop: 8 }}>{t("dashboard.onboardingHint")}</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={finishOnboarding} style={{ ...s.btnPrimary, borderRadius: 10, minWidth: 180 }}>
                {t("dashboard.finishTour")}
              </button>
              <button onClick={openOnboardingModal} style={{ ...s.btn, borderRadius: 10, minWidth: 180 }}>
                {t("dashboard.previewOnboarding")}
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 24 }}>
            {actionButtons.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} onClick={item.onClick} style={{ background: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 18, textAlign: "left", cursor: "pointer", minHeight: 130, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 12, background: "rgba(95, 203, 155, 0.1)", color: "var(--brand-cyan)" }}><Icon size={18} /></span>
                    <div style={{ fontWeight: 700, color: "var(--brand-text-primary)", fontSize: 14 }}>{item.label}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--brand-text-secondary)" }}>{item.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4">
        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.incidentVolume")}</h3>
          <div style={{ height: 300 }}>
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] gap-4">
        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.activityTimeline")}</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentData}>
                <CartesianGrid stroke="var(--brand-border)" opacity={0.3} />
                <XAxis dataKey="day" stroke="var(--brand-text-secondary)" />
                <YAxis stroke="var(--brand-text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--brand-card)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)" }} />
                <Line type="monotone" dataKey="activity" stroke="var(--brand-cyan)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.incidentMapping")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {incidentMap.map((item) => (
              <div key={item.region} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--theme-subtle-bg)", border: "1px solid var(--brand-border)", borderRadius: 8, padding: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--brand-text-primary)", fontSize: 12 }}><MapPinned size={14} style={{ color: "var(--brand-cyan)" }} />{item.region}</span>
                <span style={{ color: item.severity >= 4 ? "var(--brand-crimson)" : "var(--brand-amber)", fontWeight: 700, fontSize: 12 }}>{t("dashboard.severityLabel", { level: String(item.severity) })}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.cardTitle}>{t("dashboard.correlationGraph")}</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={correlationData}>
                <PolarGrid stroke="var(--brand-border)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "var(--brand-text-secondary)", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar dataKey="value" stroke="var(--brand-cyan)" fill="var(--brand-cyan)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      {showOnboardingModal && (
        <div style={s.modalBackdrop}>
          <div style={s.modalCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: "var(--brand-text-primary)" }}>{onboardingSteps[onboardingStep].title}</h2>
                <p style={{ marginTop: 10, color: "var(--brand-text-secondary)", fontSize: 14, maxWidth: 520 }}>{onboardingSteps[onboardingStep].description}</p>
              </div>
              <button onClick={closeOnboardingModal} style={{ ...s.btn, borderRadius: 10 }}>
                {t("dashboard.close")}
              </button>
            </div>
            <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
              {onboardingSteps[onboardingStep].bullets.map((line, index) => (
                <div key={index} style={{ padding: 14, borderRadius: 12, background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)" }}>
                  <span style={{ color: "var(--brand-text-primary)", fontSize: 13 }}>{line}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, gap: 12, flexWrap: "wrap" }}>
              <button
                style={{ ...s.btn, minWidth: 140, opacity: onboardingStep === 0 ? 0.5 : 1, cursor: onboardingStep === 0 ? "not-allowed" : "pointer" }}
                onClick={() => setOnboardingStep((step) => Math.max(0, step - 1))}
                disabled={onboardingStep === 0}
              >
                {t("dashboard.previous")}
              </button>
              <div style={{ flex: 1 }} />
              {onboardingStep < onboardingSteps.length - 1 ? (
                <button style={{ ...s.btnPrimary, minWidth: 160 }} onClick={() => setOnboardingStep((step) => Math.min(onboardingSteps.length - 1, step + 1))}>
                  {t("dashboard.nextStep")}
                </button>
              ) : (
                <button style={{ ...s.btnPrimary, minWidth: 160 }} onClick={finishOnboarding}>
                  {t("dashboard.completeOnboarding")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showInvestigationHub && (
        <div style={s.modalBackdrop}>
          <div style={s.modalCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: "var(--brand-text-primary)" }}>{t("dashboard.investigationHubTitle")}</h2>
                <p style={{ marginTop: 10, color: "var(--brand-text-secondary)", fontSize: 14, maxWidth: 520 }}>{t("dashboard.investigationHubDesc")}</p>
              </div>
              <button onClick={closeInvestigationHub} style={{ ...s.btn, borderRadius: 10 }}>
                {t("dashboard.close")}
              </button>
            </div>
            <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
              {investigationOptions.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} onClick={() => runInvestigationFlow(item.path)} style={{ display: "flex", gap: 14, alignItems: "center", padding: 18, borderRadius: 16, border: "1px solid var(--brand-border)", background: "var(--theme-white-bg-tint)", cursor: "pointer" }}>
                    <span style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 12, background: "rgba(95, 203, 155, 0.12)", color: "var(--brand-cyan)" }}><Icon size={20} /></span>
                    <div style={{ textAlign: "left", flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--brand-text-primary)" }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "var(--brand-text-secondary)", marginTop: 4 }}>{item.description}</div>
                    </div>
                    <ArrowRight size={16} color="var(--brand-text-secondary)" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
