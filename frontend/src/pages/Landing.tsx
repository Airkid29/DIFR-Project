import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Play, ArrowRight, Activity, Database, Cpu } from "lucide-react";

export default function Landing() {
  const s = {
    shell: { minHeight: "100vh", background: "#0A0E1A", color: "#F9FAFB", fontFamily: "'Inter', system-ui, sans-serif" },
    header: { height: 80, borderBottom: "1px solid #1F2937", background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
    headerInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: 12 },
    logoIcon: { padding: 8, background: "linear-gradient(135deg, #3B82F6, #10B981)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: 0.5 },
    nav: { display: "flex", gap: 40, fontSize: 13, fontWeight: 600, color: "#9CA3AF" },
    navLink: { cursor: "pointer", transition: "color 0.2s", color: "#9CA3AF" },
    header_right: { display: "flex", gap: 16, alignItems: "center" },
    loginLink: { fontSize: 13, fontWeight: 600, color: "#9CA3AF", cursor: "pointer", textDecoration: "none" },
    trialBtn: { padding: "10px 20px", background: "linear-gradient(135deg, #3B82F6, #10B981)", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#0A0E1A", border: "none", cursor: "pointer", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)" },
    
    heroSection: { position: "relative", paddingTop: 120, paddingBottom: 160, overflow: "hidden" },
    heroInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 },
    heroGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" },
    heroContent: { space: "yes" },
    heroTag: { display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "8px 16px", borderRadius: 20, fontSize: 12, color: "#3B82F6", fontWeight: 600, marginBottom: 32 },
    heroPulse: { width: 6, height: 6, background: "#3B82F6", borderRadius: "50%", animation: "pulse 2s infinite" },
    heroTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 64, color: "#fff", lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 24 },
    heroDesc: { fontSize: 18, color: "#9CA3AF", lineHeight: 1.6, maxWidth: 500, marginBottom: 32, fontWeight: 300 },
    heroButtons: { display: "flex", gap: 16, flexWrap: "wrap" },
    btnPrimary: { display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "linear-gradient(135deg, #3B82F6, #10B981)", borderRadius: 8, color: "#0A0E1A", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)", transition: "all 0.2s", textDecoration: "none" },
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
    sectionTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 56, color: "#fff", lineHeight: 1.1, marginBottom: 16, textAlign: "center" },
    sectionDesc: { fontSize: 18, color: "#9CA3AF", maxWidth: 700, margin: "0 auto 80px", textAlign: "center", lineHeight: 1.6 },
    featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 },
    featureCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 32, cursor: "pointer", transition: "all 0.3s" },
    featureIcon: { width: 40, height: 40, background: "rgba(59, 130, 246, 0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, color: "#3B82F6" },
    featureTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 12 },
    featureDesc: { fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 },
    
    platformSection: { paddingTop: 128, paddingBottom: 128, borderTop: "1px solid #1F2937" },
    platformGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 },
    platformCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 28, textAlign: "center" },
    
    pricingSection: { paddingTop: 128, paddingBottom: 128, borderTop: "1px solid #1F2937", background: "rgba(17, 24, 39, 0.2)" },
    pricingGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, maxWidth: 1000, margin: "0 auto" },
    priceCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 40, display: "flex", flexDirection: "column" },
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
    priceBtnPrimary: { background: "linear-gradient(135deg, #3B82F6, #10B981)", color: "#0A0E1A", boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" },
    
    ctaSection: { paddingTop: 128, paddingBottom: 128, borderTop: "1px solid #1F2937", background: "linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)", textAlign: "center" },
    ctaInner: { maxWidth: 800, margin: "0 auto", padding: "0 24px" },
    ctaTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 56, color: "#fff", marginBottom: 24, lineHeight: 1.1 },
    ctaDesc: { fontSize: 18, color: "#9CA3AF", marginBottom: 40, lineHeight: 1.6 },
    
    footer: { borderTop: "1px solid #1F2937", paddingTop: 48, paddingBottom: 48, background: "rgba(17, 24, 39, 0.4)" },
    footerInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#9CA3AF", fontSize: 13 },
    footerLinks: { display: "flex", gap: 32 },
  };

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
            <a href="#features" style={s.navLink}>Features</a>
            <a href="#platform" style={s.navLink}>Platform</a>
            <a href="#pricing" style={s.navLink}>Pricing</a>
          </nav>

          <div style={s.header_right}>
            <Link to="/login" style={s.loginLink}>Login</Link>
            <button style={s.trialBtn}>Start Free Trial</button>
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
                <span>Enterprise Cybersecurity Platform</span>
              </div>
              <h1 style={s.heroTitle}>Next-Gen Incident Response</h1>
              <p style={s.heroDesc}>Automated evidence collection with cryptographic integrity, YARA signature scanning, and compliance-ready reports. Built for enterprise SOCs.</p>
              <div style={s.heroButtons}>
                <Link to="/login" style={s.btnPrimary}>
                  <span>Start Free Trial</span>
                  <ArrowRight size={16} />
                </Link>
                <a href="#features" style={s.btnSecondary}>
                  <Play size={16} style={{ color: "#3B82F6" }} />
                  <span>Learn More</span>
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
          <h2 style={s.sectionTitle}>Complete Incident Triage</h2>
          <p style={s.sectionDesc}>Everything needed to investigate, document, and remediate security incidents with forensic rigor and compliance.</p>
          <div style={s.featuresGrid}>
            {[
              { icon: Cpu, title: "YARA Rules Triage", desc: "Scan executables, memory dumps, and documents against industry-standard malware signatures instantly." },
              { icon: Database, title: "Cryptographic Custody", desc: "Immutable evidence chain-of-custody with SHA-256 hashing, timestamps, and compliance audit logs." },
              { icon: Activity, title: "Threat Intelligence", desc: "Correlate indicators with live security feeds and malware reputation databases in real time." }
            ].map((f, i) => (
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
          <h2 style={s.sectionTitle}>Designed for Security Teams</h2>
          <p style={s.sectionDesc}>A modern platform purpose-built for forensic analysts and SOC operations to centralize case management and automate triage.</p>
          <div style={s.platformGrid}>
            {[
              { title: "Case Coordination", desc: "Triage incidents, assign analysts, and maintain complete audit trails for compliance." },
              { title: "Evidence Integrity", desc: "Store forensic artifacts with SHA-256 provenance and immutable chain-of-custody." },
              { title: "Automated Triage", desc: "Background YARA scanning surfaces high-priority threats without tool switching." }
            ].map((p, i) => (
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
          <h2 style={s.sectionTitle}>Transparent Pricing</h2>
          <p style={s.sectionDesc}>Scale-as-you-grow plans for teams of any size. No lock-ins, no surprises.</p>
          <div style={s.pricingGrid}>
            <div style={s.priceCard}>
              <div style={{ marginBottom: 32 }}>
                <div style={s.priceTier}>For Growing Teams</div>
                <h3 style={s.priceName}>Professional</h3>
                <p style={s.priceDesc}>Mid-size companies & IR consultants</p>
                <div style={s.priceAmount}>$249<span style={{ fontSize: 14, color: "#9CA3AF" }}> / month</span></div>
              </div>
              <div style={s.priceList}>
                {["Up to 10 Active Incidents", "SHA-256 Hash Calculation", "YARA Signature Scanning", "3 Analyst Accounts"].map((item, i) => (
                  <div key={i} style={s.priceItem}>
                    <div style={s.priceBullet} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/login" style={{ ...s.priceBtn, ...s.priceBtnSecondary }}>Get Started</Link>
            </div>

            <div style={{ ...s.priceCard, ...s.priceCardActive }}>
              <div style={s.priceCardBadge}>Most Popular</div>
              <div style={{ marginBottom: 32, marginTop: 8 }}>
                <div style={s.priceTier}>For Enterprise</div>
                <h3 style={s.priceName}>Enterprise</h3>
                <p style={s.priceDesc}>Large teams & MSSPs requiring audits</p>
                <div style={s.priceAmount}>$899<span style={{ fontSize: 14, color: "#9CA3AF" }}> / month</span></div>
              </div>
              <div style={s.priceList}>
                {["Unlimited Active Incidents", "Custom YARA Signatures", "MFA, SSO & RBAC Roles", "Cryptographic Audit Logs"].map((item, i) => (
                  <div key={i} style={s.priceItem}>
                    <div style={s.priceBullet} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/login" style={{ ...s.priceBtn, ...s.priceBtnPrimary }}>Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaInner}>
          <h2 style={s.ctaTitle}>Ready to automate incident response?</h2>
          <p style={s.ctaDesc}>Join enterprise SOCs using ForensiGuard to detect, investigate, and remediate threats 10x faster.</p>
          <Link to="/login" style={s.btnPrimary}>
            <span>Start Your Free Trial</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <p>© 2026 ForensiGuard Inc. All rights reserved.</p>
          <div style={s.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}