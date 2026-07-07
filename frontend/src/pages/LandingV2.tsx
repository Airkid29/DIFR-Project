import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Zap,
  LineChart,
  Lock,
  Clock,
  Database,
  Code2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import "../styles/landingv2.css";
import { api } from "../utils/api";

export default function LandingV2() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [activeTab, setActiveTab] = useState("curl");

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "dark";
      setTheme(newTheme);
    };
    window.addEventListener("storage", handleThemeChange);
    
    // Log visitor
    try {
      void api.post("/api/visitor/log");
    } catch (error) {
      console.error("Failed to log visitor:", error);
    }
    
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="landing-v2" data-theme={theme}>
      <div className="grain"></div>

      {/* Header */}
      <header className="landing-header">
        <div className="landing-nav-wrap">
          <div className="landing-brand">
            <ShieldAlert className="landing-mark" size={24} />
            <span>DIFR</span>
            <span className="landing-beta-badge">v2.0</span>
          </div>
          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#analytics">Analytics</a>
            <a href="#docs">Documentation</a>
          </nav>
          <div className="landing-nav-right">
            <button className="landing-btn landing-btn-primary">Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-glow"></div>
        <div className="landing-wrap">
          <div className="landing-eyebrow">
            <span className="landing-dot"></span>
            Digital Forensics & Incident Response Platform
          </div>

          <h1 className="landing-h1">
            Detect threats. <span className="landing-metallic">Respond faster.</span> Stay secure.
          </h1>

          <p className="landing-sub">
            Enterprise-grade incident forensics, real-time threat detection, and automated response. All in one platform.
          </p>

          <div className="landing-hero-ctas">
            <button className="landing-btn landing-btn-primary landing-btn-lg">Start Free Trial</button>
            <button className="landing-btn landing-btn-ghost landing-btn-lg">View Demo</button>
          </div>

          <div className="landing-provider-row">
            <span className="landing-pill"> Threat Detection</span>
            <span className="landing-pill"> Real-time Response</span>
            <span className="landing-pill"> Forensic Analysis</span>
            <span className="landing-pill"> Compliance Ready</span>
          </div>

          <div className="landing-hero-demo reveal">
            <div className="landing-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="landing-screen">
              <div className="landing-router-anim">
                <span className="landing-chip">Your System</span>
                <span>→</span>
                <span className="landing-chip" style={{ color: "var(--brand-cyan)" }}>
                  DIFR Detector
                </span>
                <span>→</span>
                <span className="landing-chip" style={{ color: "var(--brand-emerald)" }}>
                  Response Engine
                </span>
              </div>
              <code>POST /api/v1/analyze · real-time threat assessment</code>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="landing-marquee-section">
        <p className="landing-marquee-label">Integrates with your security stack</p>
        <div className="landing-marquee">
          <div className="landing-marquee-track">
            <span>SIEM</span>
            <span>EDR</span>
            <span>SOAR</span>
            <span>Cloud APIs</span>
            <span>Log Aggregators</span>
            <span>Slack</span>
            <span>Teams</span>
            <span>PagerDuty</span>
            <span>SIEM</span>
            <span>EDR</span>
            <span>SOAR</span>
            <span>Cloud APIs</span>
            <span>Log Aggregators</span>
            <span>Slack</span>
            <span>Teams</span>
            <span>PagerDuty</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section" id="features">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <div className="landing-kicker">Platform</div>
            <h2 className="landing-h2">Everything for digital forensics</h2>
            <p>Complete toolkit for incident analysis, threat hunting, and forensic investigations.</p>
          </div>

          <div className="landing-grid-4 reveal">
            <div className="landing-fcard">
              <div className="landing-ficon">
                <ShieldAlert size={20} />
              </div>
              <h3>Real-time Detection</h3>
              <p>AI-powered threat detection with sub-second response times across your infrastructure.</p>
              <a className="landing-flink" href="#docs">
                Learn more <ArrowRight size={13} />
              </a>
            </div>

            <div className="landing-fcard">
              <div className="landing-ficon">
                <LineChart size={20} />
              </div>
              <h3>Forensic Analysis</h3>
              <p>Deep investigation tools with timeline reconstruction and evidence preservation.</p>
              <a className="landing-flink" href="#docs">
                Learn more <ArrowRight size={13} />
              </a>
            </div>

            <div className="landing-fcard">
              <div className="landing-ficon">
                <Zap size={20} />
              </div>
              <h3>Automated Response</h3>
              <p>Customizable playbooks for instant threat containment and mitigation.</p>
              <a className="landing-flink" href="#docs">
                Learn more <ArrowRight size={13} />
              </a>
            </div>

            <div className="landing-fcard">
              <div className="landing-ficon">
                <Database size={20} />
              </div>
              <h3>Evidence Management</h3>
              <p>Secure chain-of-custody tracking and audit-ready forensic documentation.</p>
              <a className="landing-flink" href="#docs">
                Learn more <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="landing-section landing-money-section" id="workflow">
        <div className="landing-wrap landing-money-layout">
          <div className="landing-money-copy reveal">
            <div className="landing-kicker">How it Works</div>
            <h2 className="landing-h2">Incident response in seconds</h2>
            <p>From detection to remediation: our platform streamlines the entire incident lifecycle with intelligent automation.</p>
            <button className="landing-btn landing-btn-primary">See It In Action</button>
          </div>

          <div className="landing-money-grid reveal">
            <div className="landing-mchip">
              <div className="landing-swatch" style={{ background: "var(--brand-cyan)" }}></div>
              Detect
            </div>
            <div className="landing-mchip">
              <div className="landing-swatch" style={{ background: "var(--brand-amber)" }}></div>
              Analyze
            </div>
            <div className="landing-mchip">
              <div className="landing-swatch" style={{ background: "var(--brand-emerald)" }}></div>
              Respond
            </div>
            <div className="landing-mchip">
              <div className="landing-swatch" style={{ background: "var(--brand-info)" }}></div>
              Report
            </div>
            <div className="landing-mchip">
              <div className="landing-swatch" style={{ background: "var(--brand-crimson)" }}></div>
              Learn
            </div>
            <div className="landing-mchip">
              <div className="landing-swatch" style={{ background: "var(--brand-cyan)" }}></div>
              Prevent
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="landing-section" id="workflow-detail">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <div className="landing-kicker">Process</div>
            <h2 className="landing-h2">Every incident, methodically handled</h2>
            <p>Forensically-sound procedures from initial alert to final report.</p>
          </div>

          <div className="landing-flow reveal">
            <div className="landing-flow-step">
              <span className="landing-num">01</span>
              <h4>Threat Detected</h4>
              <div className="landing-mono-box">Alert triggered from sensors</div>
              <div className="landing-flow-arrow">→</div>
            </div>

            <div className="landing-flow-step">
              <span className="landing-num">02</span>
              <h4>Intelligence Gathered</h4>
              <div className="landing-mono-box">Correlate with threat intel</div>
              <div className="landing-flow-arrow">→</div>
            </div>

            <div className="landing-flow-step">
              <span className="landing-num">03</span>
              <h4>Response Executed</h4>
              <div className="landing-mono-box">Automated or manual action</div>
              <div className="landing-flow-arrow">→</div>
            </div>

            <div className="landing-flow-step">
              <span className="landing-num">04</span>
              <h4>Report Generated</h4>
              <div className="landing-mono-box">Complete forensic documentation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="landing-section" id="usecases">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <div className="landing-kicker">Use Cases</div>
            <h2 className="landing-h2">Built for security teams</h2>
          </div>

          <div className="landing-grid-2 reveal">
            <div className="landing-ucard">
              <h3>SOC Analysts</h3>
              <p>Investigate threats without manual log analysis.</p>
              <ul>
                <li>Automated log correlation</li>
                <li>Visual timeline reconstruction</li>
                <li>One-click reporting</li>
              </ul>
            </div>

            <div className="landing-ucard">
              <h3>Incident Responders</h3>
              <p>Containment and remediation at scale.</p>
              <ul>
                <li>Playbook automation</li>
                <li>Cross-system coordination</li>
                <li>Chain of custody tracking</li>
              </ul>
            </div>

            <div className="landing-ucard">
              <h3>Forensic Investigators</h3>
              <p>Evidence preservation and analysis made simple.</p>
              <ul>
                <li>Audit-ready reports</li>
                <li>Legal compliance</li>
                <li>Deep file analysis</li>
              </ul>
            </div>

            <div className="landing-ucard">
              <h3>Compliance Teams</h3>
              <p>Demonstrate readiness and response capability.</p>
              <ul>
                <li>Incident documentation</li>
                <li>Regulatory reports</li>
                <li>Risk assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Section */}
      <section className="landing-section" id="docs">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <div className="landing-kicker">Developer Ready</div>
            <h2 className="landing-h2">Integrate in minutes</h2>
          </div>

          <div className="landing-code-panel reveal">
            <div className="landing-tabs">
              <div
                className={`landing-tab ${activeTab === "curl" ? "active" : ""}`}
                onClick={() => toggleTab("curl")}
              >
                cURL
              </div>
              <div
                className={`landing-tab ${activeTab === "js" ? "active" : ""}`}
                onClick={() => toggleTab("js")}
              >
                JavaScript
              </div>
              <div
                className={`landing-tab ${activeTab === "py" ? "active" : ""}`}
                onClick={() => toggleTab("py")}
              >
                Python
              </div>
            </div>

            {activeTab === "curl" && (
              <pre className="landing-code-block">
                {`# Analyze a file or URL for threats
curl https://api.difr.io/v1/analyze \\
  -H "Authorization: Bearer $DIFR_KEY" \\
  -d '{"file_path": "/path/to/file", "scan_type": "deep"}' \\
  --upload-file "./suspicious.exe"`}
              </pre>
            )}

            {activeTab === "js" && (
              <pre className="landing-code-block">
                {`// Analyze threat and get response
const response = await fetch("https://api.difr.io/v1/analyze", {
  method: "POST",
  headers: { "Authorization": \`Bearer \${DIFR_KEY}\` },
  body: JSON.stringify({
    file_path: "/data/sample.exe",
    scan_type: "deep"
  })
});
const result = await response.json();`}
              </pre>
            )}

            {activeTab === "py" && (
              <pre className="landing-code-block">
                {`# Analyze and get forensic report
import requests

response = requests.post(
  "https://api.difr.io/v1/analyze",
  headers={"Authorization": f"Bearer {DIFR_KEY}"},
  json={"file_path": "/data/sample.exe", "scan_type": "deep"}
)
report = response.json()`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="landing-section landing-analytics" id="analytics">
        <div className="landing-wrap">
          <div className="landing-section-head reveal">
            <div className="landing-kicker">Insights</div>
            <h2 className="landing-h2">Real-time intelligence</h2>
            <p>Monitor, track, and improve your security posture with comprehensive analytics.</p>
          </div>

          <div className="landing-analytics-grid reveal">
            <div className="landing-analytics-card">
              <div className="landing-metric">
                <ShieldAlert size={24} />
              </div>
              <div className="landing-metric-value">2,847</div>
              <div className="landing-metric-label">Threats Detected</div>
            </div>

            <div className="landing-analytics-card">
              <div className="landing-metric">
                <Clock size={24} />
              </div>
              <div className="landing-metric-value">1.2s</div>
              <div className="landing-metric-label">Avg Response Time</div>
            </div>

            <div className="landing-analytics-card">
              <div className="landing-metric">
                <LineChart size={24} />
              </div>
              <div className="landing-metric-value">99.8%</div>
              <div className="landing-metric-label">Platform Uptime</div>
            </div>

            <div className="landing-analytics-card">
              <div className="landing-metric">
                <Lock size={24} />
              </div>
              <div className="landing-metric-value">100%</div>
              <div className="landing-metric-label">Compliance Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta" id="start">
        <div className="landing-wrap">
          <h2 className="landing-h2">Ready to secure your organization?</h2>
          <p>Get started with a free trial. No credit card required.</p>
          <div className="landing-hero-ctas">
            <button className="landing-btn landing-btn-primary landing-btn-lg">Start Free Trial</button>
            <button className="landing-btn landing-btn-ghost landing-btn-lg">Request Demo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-wrap">
          <div className="landing-foot-top">
            <div className="landing-foot-brand">
              <div className="landing-brand" style={{ fontSize: "16px" }}>
                <ShieldAlert size={20} />
                DIFR
              </div>
              <p>Enterprise digital forensics and incident response platform.</p>
              <div className="landing-socials">
                <a href="#">GitHub</a>
                <a href="#">Twitter</a>
                <a href="#">LinkedIn</a>
                <a href="#">Blog</a>
              </div>
            </div>

            <div className="landing-foot-col">
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#analytics">Analytics</a>
            </div>

            <div className="landing-foot-col">
              <h5>Company</h5>
              <a href="#about">About</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
            </div>

            <div className="landing-foot-col">
              <h5>Legal</h5>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>

          <div className="landing-foot-bottom">
            <span>© 2026 DIFR. All rights reserved.</span>
            <span>Built for security, by security professionals</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
