// Landing V2 Configuration
// Modifiez ces valeurs pour personnaliser la landing page

export const LANDING_CONFIG = {
  // Main CTA Links
  cta: {
    primary: "/dashboard", // Lien du bouton principal
    demo: "#docs",         // Lien de la démo
    docs: "#docs"
  },

  // Navigation
  navigation: [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "Analytics", href: "#analytics" },
    { label: "Documentation", href: "#docs" }
  ],

  // Hero Section
  hero: {
    title: "Investigate Smarter. Respond Faster.",
    subtitle: "Enterprise-grade incident forensics, real-time threat detection, AI-assisted analysis, and automated response. All in one unified platform.",
    badge: "AI-Powered Cyber Investigation Platform"
  },

  // Features
  features: [
    {
      icon: "ShieldAlert",
      title: "Real-time Detection",
      description: "AI-powered threat detection with sub-second response times across your infrastructure."
    },
    {
      icon: "LineChart",
      title: "Forensic Analysis",
      description: "Deep investigation tools with timeline reconstruction and evidence preservation."
    },
    {
      icon: "Zap",
      title: "Automated Response",
      description: "Customizable playbooks for instant threat containment and mitigation."
    },
    {
      icon: "Database",
      title: "Evidence Management",
      description: "Secure chain-of-custody tracking and audit-ready forensic documentation."
    }
  ],

  // Workflow Steps
  workflow: {
    title: "Incident response in seconds",
    subtitle: "From detection to remediation: our platform streamlines the entire incident lifecycle with intelligent automation.",
    steps: ["Detect", "Analyze", "Respond", "Report", "Learn", "Prevent"]
  },

  // Process Flow
  processFlow: [
    {
      number: "01",
      title: "Threat Detected",
      description: "Alert triggered from sensors"
    },
    {
      number: "02",
      title: "Intelligence Gathered",
      description: "Correlate with threat intel"
    },
    {
      number: "03",
      title: "Response Executed",
      description: "Automated or manual action"
    },
    {
      number: "04",
      title: "Report Generated",
      description: "Complete forensic documentation"
    }
  ],

  // Use Cases
  useCases: [
    {
      title: "SOC Analysts",
      description: "Investigate threats without manual log analysis.",
      benefits: [
        "Automated log correlation",
        "Visual timeline reconstruction",
        "One-click reporting"
      ]
    },
    {
      title: "Incident Responders",
      description: "Containment and remediation at scale.",
      benefits: [
        "Playbook automation",
        "Cross-system coordination",
        "Chain of custody tracking"
      ]
    },
    {
      title: "Forensic Investigators",
      description: "Evidence preservation and analysis made simple.",
      benefits: [
        "Audit-ready reports",
        "Legal compliance",
        "Deep file analysis"
      ]
    },
    {
      title: "Compliance Teams",
      description: "Demonstrate readiness and response capability.",
      benefits: [
        "Incident documentation",
        "Regulatory reports",
        "Risk assessment"
      ]
    }
  ],

  // Code Examples
  codeExamples: {
    curl: `# Analyze a file or URL for threats
curl https://api.difr.io/v1/analyze \\
  -H "Authorization: Bearer $DIFR_KEY" \\
  -d '{"file_path": "/path/to/file", "scan_type": "deep"}' \\
  --upload-file "./suspicious.exe"`,

    javascript: `// Analyze threat and get response
const response = await fetch("https://api.difr.io/v1/analyze", {
  method: "POST",
  headers: { "Authorization": \`Bearer \${DIFR_KEY}\` },
  body: JSON.stringify({
    file_path: "/data/sample.exe",
    scan_type: "deep"
  })
});
const result = await response.json();`,

    python: `# Analyze and get forensic report
import requests

response = requests.post(
  "https://api.difr.io/v1/analyze",
  headers={"Authorization": f"Bearer {DIFR_KEY}"},
  json={"file_path": "/data/sample.exe", "scan_type": "deep"}
)
report = response.json()`
  },

  // Analytics Metrics
  analytics: [
    { icon: "ShieldAlert", value: "2,847", label: "Threats Detected" },
    { icon: "Clock", value: "1.2s", label: "Avg Response Time" },
    { icon: "LineChart", value: "99.8%", label: "Platform Uptime" },
    { icon: "Lock", value: "100%", label: "Compliance Score" }
  ],

  // Integrations Marquee
  integrations: [
    "SIEM", "EDR", "SOAR", "Cloud APIs", 
    "Log Aggregators", "Slack", "Teams", "PagerDuty"
  ],

  // Footer Links
  footerLinks: {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Analytics", href: "#analytics" }
    ],
    company: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" }
    ],
    legal: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Security", href: "#security" }
    ]
  },

  // Social Links
  socials: [
    { label: "GitHub", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Blog", href: "#" }
  ]
};

// Theme Configuration
export const THEME_CONFIG = {
  dark: {
    primary: "#0f1623",
    card: "#1a2235",
    border: "#2a3a55",
    text: "#F0F3FA",
    textSecondary: "#8AAEE0",
    cyan: "#638ECB",
    emerald: "#4a9e7a",
    amber: "#c49a3a",
    crimson: "#c45a6a"
  },
  light: {
    primary: "#E8EEF7",
    card: "#FFFFFF",
    border: "#C5D4EA",
    text: "#1A2D4D",
    textSecondary: "#4A6B9A",
    cyan: "#2B5A9E",
    emerald: "#1F7A52",
    amber: "#9A7220",
    crimson: "#B83248"
  }
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  duration: {
    fast: "0.18s",
    normal: "0.2s",
    slow: "0.6s"
  },
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  revealThreshold: 0.12
};
