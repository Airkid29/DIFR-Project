import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Play, ArrowRight, Activity, Database, Cpu } from "lucide-react";
import { t } from "../i18n";

export default function Landing() {
  const s: Record<string, React.CSSProperties> = {
    shell: { minHeight: "100vh", background: "#0A0E1A", color: "#F9FAFB", fontFamily: "'Inter', system-ui, sans-serif" },
    header: { height: 80, borderBottom: "1px solid #1F2937", background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
    headerInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: 12 },
    logoIcon: { padding: 8, background: "#FFFFFF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: 0.5 },
    nav: { display: "flex", gap: 40, fontSize: 13, fontWeight: 600, color: "#9CA3AF" },
    navLink: { cursor: "pointer", transition: "color 0.2s", color: "#9CA3AF" },
    header_right: { display: "flex", gap: 16, alignItems: "center" },
    loginLink: { fontSize: 13, fontWeight: 600, color: "#9CA3AF", cursor: "pointer", textDecoration: "none" },
    trialBtn: { padding: "10px 20px", background: "#FFFFFF", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#0A0E1A", border: "none", cursor: "pointer", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)" },
    
    heroSection: { position: "relative", paddingTop: 120, paddingBottom: 160, overflow: "hidden" },
    heroInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 },
    heroGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" },
    heroContent: { display: "flex", flexDirection: "column" as const, gap: 12 },
    heroTag: { display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "8px 16px", borderRadius: 20, fontSize: 12, color: "#3B82F6", fontWeight: 600, marginBottom: 32 },
    heroPulse: { width: 6, height: 6, background: "#3B82F6", borderRadius: "50%", animation: "pulse 2s infinite" },
    heroTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 24 },
    heroDesc: { fontSize: 18, color: "#9CA3AF", lineHeight: 1.6, maxWidth: 500, marginBottom: 32, fontWeight: 300 },
    heroButtons: { display: "flex", gap: 16, flexWrap: "wrap" },
    btnPrimary: { display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#FFFFFF", borderRadius: 8, color: "#0A0E1A", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)", transition: "all 0.2s", textDecoration: "none" },
    btnSecondary: { display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all 0.2s", textDecoration: "none" },
    
    terminalBox: { background: "#0A0E1A", borderRadius: 12, border: "1px solid #1F2937", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" },
    terminalHeader: { background: "linear-gradient(to right, #0A0E1A, #111827)", borderBottom: "1px solid #1F2937", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    terminalDots: { display: "flex", gap: 8 },
    dot: { width: 12, height: 12, borderRadius: "50%" },
    redDot: { background: "#EF4444", opacity: 0.8 },
    yellowDot: { background: "#FBBF24", opacity: 0.8 },
    greenDot: { background: "#10B981", opacity: 0.8 },
    terminalTitle: { fontSize: 11, color: "#6B7280", fontFamily: "'JetBrains Mono', monospace" },
    terminalBody: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: 24, color: "#9CA3AF", lineHeight: 1.8, background: "#0A0E1A", overflow: "auto", maxHeight: 400 },
    terminalCyan: { color: "#3B82F6" },
    terminalGreen: { color: "#10B981" },
    terminalRed: { color: "#EF4444" },
    
    featuresSection: { paddingTop: 128, paddingBottom: 128, borderTop: "1px solid #1F2937", background: "rgba(17, 24, 39, 0.2)" },
    featuresInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px" },
    sectionTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 56, color: "#fff", lineHeight: 1.1, marginBottom: 16, textAlign: "center" as const },
    sectionDesc: { fontSize: 18, color: "#9CA3AF", maxWidth: 700, margin: "0 auto 80px", textAlign: "center" as const, lineHeight: 1.6 },
    featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 },
    featureCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 32, cursor: "pointer", transition: "all 0.3s" },
    featureIcon: { width: 40, height: 40, background: "rgba(59, 130, 246, 0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, color: "#3B82F6" },
    featureTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 12 },
    featureDesc: { fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 },
    
    platformSection: { paddingTop: 128, paddingBottom: 128, borderTop: "1px solid #1F2937" },
    platformGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 },
    platformCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 28, textAlign: "center" as const },
    
    pricingSection: { paddingTop: 128, paddingBottom: 128, borderTop: "1px solid #1F2937", background: "rgba(17, 24, 39, 0.2)" },
    pricingGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, maxWidth: 1000, margin: "0 auto" },
    priceCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 40, display: "flex", flexDirection: "column" as const },
    priceCardActive: { background: "rgba(59, 130, 246, 0.05)", borderColor: "rgba(59, 130, 246, 0.3)", position: "relative" },
    priceCardBadge: { position: "absolute", top: -16, left: 24, padding: "6px 12px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: 20, fontSize: 10, fontWeight: 700, color: "#3B82F6" },
    priceTier: { fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
    priceName: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 28, color: "#fff", marginBottom: 8 },
    priceDesc: { fontSize: 13, color: "#9CA3AF", marginBottom: 24, lineHeight: 1.6 },
    priceAmount: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 48, color: "#fff", marginBottom: 32 },
    priceList: { flex: 1, marginBottom: 32 },
    priceItem: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16, fontSize: 14, color: "#9CA3AF" },
    priceBullet: { width: 6, height: 6, background: "#3B82F6", borderRadius: "50%", flexShrink: 0 },
    priceBtn: { width: "100%", padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", transition: "all 0.2s", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" },
    priceBtnSecondary: { background: "rgba(255, 255, 255, 0.05)", border: "1px solid #1F2937", color: "#F9FAFB" },
    priceBtnPrimary: { background: "#FFFFFF", color: "#0A0E1A", boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" },
    
    ctaSection: { paddingTop: 128, paddingBottom: 128, borderTop: "1px solid #1F2937", background: "linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)", textAlign: "center" as const },
    ctaInner: { maxWidth: 800, margin: "0 auto", padding: "0 24px" },
    ctaTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 56, color: "#fff", marginBottom: 24, lineHeight: 1.1 },
    ctaDesc: { fontSize: 18, color: "#9CA3AF", marginBottom: 40, lineHeight: 1.6 },
    
    footer: { borderTop: "1px solid #1F2937", paddingTop: 48, paddingBottom: 48, background: "rgba(17, 24, 39, 0.4)" },
    footerInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#9CA3AF", fontSize: 13 },
    footerLinks: { display: "flex", gap: 32 },
  };

  const features = [
    { icon: Cpu, title: t("landing.feature1Title"), desc: t("landing.feature1Desc") },
    { icon: Database, title: t("landing.feature2Title"), desc: t("landing.feature2Desc") },
    { icon: Activity, title: t("landing.feature3Title"), desc: t("landing.feature3Desc") },
  ];

  const platformItems = [
    { title: t("landing.platform1Title"), desc: t("landing.platform1Desc") },
    { title: t("landing.platform2Title"), desc: t("landing.platform2Desc") },
    { title: t("landing.platform3Title"), desc: t("landing.platform3Desc") },
  ];

  const proFeatures = [
    t("landing.proFeature1"),
    t("landing.proFeature2"),
    t("landing.proFeature3"),
    t("landing.proFeature4"),
  ];

  const enterpriseFeatures = [
    t("landing.enterpriseFeature1"),
    t("landing.enterpriseFeature2"),
    t("landing.enterpriseFeature3"),
    t("landing.enterpriseFeature4"),
  ];

  return (
    <div style={s.shell}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
        a { color: inherit; text-decoration: none; }
        a:hover { opacity: 0.8; }
      `}</style>

      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>
            <div style={s.logoIcon}>
              <ShieldCheck size={24} color="#fff" />
            </div>
            <span style={s.logoText}>Forensi<span style={{ color: "#3B82F6" }}>Guard</span></span>
          </div>

          <nav style={s.nav}>
            <a href="#features" style={s.navLink}>{t("landing.features")}</a>
            <a href="#platform" style={s.navLink}>{t("landing.platform")}</a>
            <a href="#pricing" style={s.navLink}>{t("landing.pricing")}</a>
          </nav>

          <div style={s.header_right}>
            <Link to="/login" style={s.loginLink}>{t("landing.login")}</Link>
            <Link to="/register" style={s.trialBtn}>{t("landing.startTrial")}</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={s.heroSection}>
        <div style={s.heroInner}>
          <div style={s.heroGrid}>
            <div>
              <div style={s.heroTag}>
                <div style={s.heroPulse} />
                <span>{t("landing.heroTag")}</span>
              </div>
              <h1 style={s.heroTitle}>{t("landing.heroTitle")}</h1>
              <p style={s.heroDesc}>{t("landing.heroDesc")}</p>
              <div style={s.heroButtons}>
                <Link to="/register" style={s.btnPrimary}>
                  <span>{t("landing.startTrial")}</span>
                  <ArrowRight size={16} />
                </Link>
                <a href="#features" style={s.btnSecondary}>
                  <Play size={16} style={{ color: "#3B82F6" }} />
                  <span>{t("landing.learnMore")}</span>
                </a>
              </div>
            </div>

            {/* Terminal */}
            <div style={s.terminalBox}>
              <div style={s.terminalHeader}>
                <div style={s.terminalDots}>
                  <div style={{ ...s.dot, ...s.redDot }} />
                  <div style={{ ...s.dot, ...s.yellowDot }} />
                  <div style={{ ...s.dot, ...s.greenDot }} />
                </div>
                <span style={s.terminalTitle}>forensiguard.terminal</span>
              </div>
              <div style={s.terminalBody}>
                <p style={s.terminalCyan}>$ forensiguard init-case --name "APT-29"</p>
                <p style={s.terminalGreen}>[✓] Workspace INC-2026-004 created</p>
                <p style={s.terminalCyan}>$ forensiguard upload --file payload.exe</p>
                <p>Computing hashes: SHA-256...</p>
                <p style={{ color: "#4B5563" }}>→ 4f129a738c8230b0b8dbd2ae8f...</p>
                <p style={s.terminalCyan}>$ forensiguard yara-scan --ruleset apt_beacons</p>
                <p style={s.terminalRed}>[!] CobaltStrike_Beacon detected</p>
                <p style={s.terminalGreen}>[✓] Chain of Custody: EVID-9021</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={s.featuresSection}>
        <div style={s.featuresInner}>
          <h2 style={s.sectionTitle}>{t("landing.featuresTitle")}</h2>
          <p style={s.sectionDesc}>{t("landing.featuresDesc")}</p>
          <div style={s.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} style={s.featureCard} onMouseOver={e => e.currentTarget.style.borderColor = "#3B82F6"} onMouseOut={e => e.currentTarget.style.borderColor = "#1F2937"}>
                <div style={s.featureIcon}><f.icon size={24} /></div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" style={s.platformSection}>
        <div style={s.featuresInner}>
          <h2 style={s.sectionTitle}>{t("landing.platformTitle")}</h2>
          <p style={s.sectionDesc}>{t("landing.platformDesc")}</p>
          <div style={s.platformGrid}>
            {platformItems.map((p, i) => (
              <div key={i} style={s.platformCard} onMouseOver={e => e.currentTarget.style.borderColor = "#3B82F6"} onMouseOut={e => e.currentTarget.style.borderColor = "#1F2937"}>
                <h3 style={{ ...s.featureTitle, marginBottom: 12 }}>{p.title}</h3>
                <p style={s.featureDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={s.pricingSection}>
        <div style={s.featuresInner}>
          <h2 style={s.sectionTitle}>{t("landing.pricingTitle")}</h2>
          <p style={s.sectionDesc}>{t("landing.pricingDesc")}</p>
          <div style={s.pricingGrid}>
            <div style={s.priceCard}>
              <div style={{ marginBottom: 32 }}>
                <div style={s.priceTier}>{t("landing.proTier")}</div>
                <h3 style={s.priceName}>{t("landing.proName")}</h3>
                <p style={s.priceDesc}>{t("landing.proDesc")}</p>
                <div style={s.priceAmount}>$249<span style={{ fontSize: 14, color: "#9CA3AF" }}>{t("common.perMonth")}</span></div>
              </div>
              <div style={s.priceList}>
                {proFeatures.map((item, i) => (
                  <div key={i} style={s.priceItem}>
                    <div style={s.priceBullet} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" style={{ ...s.priceBtn, ...s.priceBtnSecondary }}>{t("landing.getStarted")}</Link>
            </div>

            <div style={{ ...s.priceCard, ...s.priceCardActive }}>
              <div style={s.priceCardBadge}>{t("landing.mostPopular")}</div>
              <div style={{ marginBottom: 32, marginTop: 8 }}>
                <div style={s.priceTier}>{t("landing.enterpriseTier")}</div>
                <h3 style={s.priceName}>{t("landing.enterpriseName")}</h3>
                <p style={s.priceDesc}>{t("landing.enterpriseDesc")}</p>
                <div style={s.priceAmount}>$899<span style={{ fontSize: 14, color: "#9CA3AF" }}>{t("common.perMonth")}</span></div>
              </div>
              <div style={s.priceList}>
                {enterpriseFeatures.map((item, i) => (
                  <div key={i} style={s.priceItem}>
                    <div style={s.priceBullet} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" style={{ ...s.priceBtn, ...s.priceBtnPrimary }}>{t("landing.contactSales")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaInner}>
          <h2 style={s.ctaTitle}>{t("landing.ctaTitle")}</h2>
          <p style={s.ctaDesc}>{t("landing.ctaDesc")}</p>
          <Link to="/register" style={s.btnPrimary}>
            <span>{t("landing.startYourTrial")}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <p>{t("landing.footerRights")}</p>
          <div style={s.footerLinks}>
            <a href="#">{t("landing.privacy")}</a>
            <a href="#">{t("landing.terms")}</a>
            <a href="#">{t("landing.docs")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
