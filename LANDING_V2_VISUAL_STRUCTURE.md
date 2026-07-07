# 🎨 DIFR Landing V2 - Structure Visuelle

## 📐 Layout de la Page

```
┌─────────────────────────────────────────────────────────┐
│                      HEADER STICKY                      │
│  [DIFR Logo v2.0]  [Nav Links]      [CTA Button]       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    HERO SECTION                         │
│                                                         │
│        ✨ Digital Forensics & Incident Response        │
│                                                         │
│      Detect threats. Respond faster. Stay secure.      │
│                                                         │
│    Enterprise-grade incident forensics...              │
│                                                         │
│   [Start Free Trial]  [View Documentation]             │
│                                                         │
│   🔍 Threat Detection  ⚡ Real-time Response           │
│   📊 Forensic Analysis 🔐 Compliance Ready             │
│                                                         │
│          [DEMO BOX - Router Animation]                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               MARQUEE INTEGRATIONS                      │
│  SIEM  EDR  SOAR  Cloud APIs  Slack  Teams  PagerDuty  │
│  ↻ (scrolling infinement) ↻                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              FEATURES GRID (4 COLONNES)                 │
│                                                         │
│  ┌──────┬──────┬──────┬──────┐                         │
│  │Real- │Forensic│Auto │Evidence│                      │
│  │time  │Analysis│Response│Mgmt  │                      │
│  │Detect│       │      │      │                         │
│  └──────┴──────┴──────┴──────┘                         │
│                                                         │
│  Hover: background change                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           WORKFLOW SECTION (BACKGROUND)                 │
│                                                         │
│  [LEFT]              [RIGHT GRID 3x2]                  │
│                                                         │
│  Workflow Section    [Detect] [Analyze] [Respond]      │
│  Title & CTA         [Report] [Learn]   [Prevent]      │
│  Button                                                │
│                                                         │
│  Colors: Cyan, Amber, Emerald, Info, Crimson          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           PROCESS FLOW (4 STEPS)                        │
│                                                         │
│  [01]  ──→  [02]  ──→  [03]  ──→  [04]                │
│ Threat   Intelligence   Response   Report              │
│Detected  Gathered      Executed   Generated            │
│                                                         │
│  Responsive: 4 cols (desktop) → 2 cols (tablet)        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           USE CASES (2 COLONNES)                        │
│                                                         │
│  ┌──────────────────┬──────────────────┐               │
│  │  SOC Analysts    │ Incident Resp.   │               │
│  │  - Auto logs     │ - Playbook auto  │               │
│  │  - Timeline      │ - Coordination   │               │
│  │  - Reporting     │ - Chain of cust. │               │
│  ├──────────────────┼──────────────────┤               │
│  │ Forensic Invest  │ Compliance Tms   │               │
│  │ - Audit reports  │ - Documentation  │               │
│  │ - Legal comply   │ - Regulatory     │               │
│  │ - File analysis  │ - Risk assess    │               │
│  └──────────────────┴──────────────────┘               │
│                                                         │
│  Responsive: 2 cols (desktop) → 1 col (mobile)         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           CODE EXAMPLES (TABS)                          │
│                                                         │
│  [cURL]  [JavaScript]  [Python]                        │
│  ─────────────────────────────────                     │
│  # Analyze a file...                                   │
│  curl https://api.difr.io/v1/analyze \                │
│    -H \"Authorization: Bearer $KEY\" \                 │
│    -d '{...}'                                          │
│                                                         │
│  Click tabs → code change dynamiquement                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           ANALYTICS METRICS (4 COLONNES)                │
│                                                         │
│  ┌────────────┬────────────┬────────────┬────────────┐  │
│  │  2,847     │   1.2s     │   99.8%    │   100%     │  │
│  │ Threats    │ Response   │ Uptime     │ Compliance │  │
│  │ Detected   │ Time       │            │ Score      │  │
│  └────────────┴────────────┴────────────┴────────────┘  │
│                                                         │
│  Icons + Values + Labels avec hover effect             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            FINAL CTA SECTION                            │
│                                                         │
│        Ready to secure your organization?              │
│                                                         │
│     Get started with a free trial. No CC required.     │
│                                                         │
│  [Start Free Trial]  [Request Demo]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    FOOTER                               │
│                                                         │
│  [Brand Info]  [Product]  [Company]  [Legal]           │
│  Logo & Social Links                                   │
│                                                         │
│  © 2026 DIFR | Built by security professionals         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Thème Clair vs Sombre

### 🌙 Mode Sombre (Défaut)
```
Background:    #0f1623 (Abyssal)
Cards:         #1a2235
Text:          #F0F3FA (Clair)
Secondary:     #8AAEE0 (Cyan)
Accents:       #c49a3a (Amber), #4a9e7a (Mint)
Borders:       rgba(198, 210, 235, 0.1)
```

### ☀️ Mode Clair
```
Background:    #E8EEF7
Cards:         #FFFFFF
Text:          #1A2D4D (Foncé)
Secondary:     #4A6B9A (Bleu moyen)
Accents:       #9A7220 (Amber clair), #1F7A52 (Mint foncé)
Borders:       rgba(43, 90, 158, 0.1)
```

---

## 📐 Breakpoints Responsive

```
┌────────────────────────────────────────────┐
│  Desktop                                   │
│  1200px+                                   │
│  4 colonnes | Full width                   │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  Tablet                                    │
│  900px - 1199px                            │
│  2 colonnes | Navigation masquée           │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  Mobile                                    │
│  560px - 899px                             │
│  1-2 colonnes | Stack vertical             │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  Small Mobile                              │
│  < 560px                                   │
│  1 colonne | Padding réduit                │
└────────────────────────────────────────────┘
```

---

## 🎬 Animations & Interactions

### Hero Section
```
┌─────────────────────┐
│   Glow Effect       │  Radial gradient background
│   (Shimmer)         │  Metallic text avec animation
│   Parallax?         │  Optional parallax on scroll
└─────────────────────┘
```

### Reveal Animations
```
Initial State          After Scroll into View
┌──────────────┐      ┌──────────────┐
│ opacity: 0   │ ──→  │ opacity: 1   │
│ y: +16px     │      │ y: 0         │
│ duration: 0  │      │ duration: 0.6s
└──────────────┘      └──────────────┘
```

### Marquee Scrolling
```
├─ [Item 1] ─ [Item 2] ─ [Item 3] ─ ...
├─ [Item 2] ─ [Item 3] ─ ... ─ [Item 1]
├─ [Item 3] ─ ... ─ [Item 1] ─ [Item 2]
├─ ... (infinite loop animation)
```

### Code Tabs
```
[cURL] [JavaScript] [Python]
  ↓
Click cURL
  ↓
Transition: opacity 0.2s
  ↓
Show cURL code
  ↓
Hide JavaScript/Python
```

---

## 📊 Grid Layouts

### Features Grid (Responsive)
```
Desktop (4 cols)          Tablet (2 cols)           Mobile (1 col)
┌─┬─┬─┬─┐               ┌─┬─┐                     ┌─┐
├─┼─┼─┼─┤    ──→        ├─┼─┤    ──→              ├─┤
├─┼─┼─┼─┤               ├─┼─┤                     ├─┤
└─┴─┴─┴─┘               └─┴─┘                     └─┘
```

### Analytics Grid (Responsive)
```
Desktop (4 cols)          Tablet (2 cols)           Mobile (1 col)
┌─┬─┬─┬─┐               ┌─┬─┐                     ┌─┐
├─┼─┼─┼─┤    ──→        ├─┼─┤    ──→              ├─┤
└─┴─┴─┴─┘               └─┴─┘                     └─┘
```

---

## 🎨 Système de Couleurs en Détail

### Palette Primaire
```
Dark Mode:
▮ #0f1623 ← Background primaire
▮ #1a2235 ← Cards/Panels
▮ #2a3a55 ← Borders

Light Mode:
▮ #E8EEF7 ← Background primaire
▮ #FFFFFF ← Cards/Panels
▮ #C5D4EA ← Borders
```

### Accents
```
Cyan     ▮ #638ECB (dark) / #2B5A9E (light)
Emerald  ▮ #4a9e7a (dark) / #1F7A52 (light)
Amber    ▮ #c49a3a (dark) / #9A7220 (light)
Crimson  ▮ #c45a6a (dark) / #B83248 (light)
```

---

## 📝 Typographies

```
Display Font:        Outfit
  Font-weight:       600, 700
  Usage:             Títulos (h1, h2, h3)
  
Body Font:           Inter
  Font-weight:       400, 500, 600
  Usage:             Paragraphs, descriptions
  
Mono Font:           JetBrains Mono
  Font-weight:       400, 500
  Usage:             Code, badges, labels
```

---

## 🔲 Component Showcase

### Card Hover Effect
```
Normal State              Hover State
┌──────────────┐         ┌──────────────┐
│              │         │              │
│ Card Content │ ──→     │ Card Content │
│              │         │              │
│ border: ...  │         │ border: ... ┐│
└──────────────┘         └──────────────┘
                         transform: translateY(-2px)
                         box-shadow: ↑
```

### Button Variants
```
Primary              Ghost              Disabled
┌──────────┐      ┌──────────┐      ┌──────────┐
│ Start    │      │ View Doc │      │ Coming   │
│ Trial    │      │          │      │ Soon     │
└──────────┘      └──────────┘      └──────────┘
bg: #E7E9EA      bg: transparent     opacity: 0.5
```

### Badge/Pill Component
```
Cyan          Emerald          Amber
▮ text        ▮ text           ▮ text
border: ...   border: ...      border: ...
bg: dim       bg: dim          bg: dim
```

---

## ⚡ Performance Optimizations

```
✅ CSS Animations (GPU-accelerated)
   will-change: transform, opacity

✅ Lazy Loading (Intersection Observer)
   threshold: 0.12

✅ SVG Icons (Lucide - lightweight)
   size: 16px - 24px

✅ CSS Variables (No duplication)
   --landing-gold: var(--brand-amber)

✅ Media Queries (Mobile-first)
   @media (max-width: 900px) { ... }
```

---

## 📱 Mobile-First Development

```
Step 1: Style for < 560px
         (Mobile first)
         
Step 2: Add media query @ 560px
        (Tablet adjustments)
        
Step 3: Add media query @ 900px
        (Desktop layout)
        
Step 4: Add media query @ 1200px
        (Full desktop)
```

---

## 🎯 Interactive Elements

```
Links          Buttons           Hover Zones
└─ Hover         ├─ Primary       ├─ Cards
   └─ Color      ├─ Ghost         ├─ Buttons
   └─ Underline  └─ Disabled      └─ Links
               
Tabs             Forms           Modals
├─ Active        ├─ Input        ├─ Backdrop
├─ Hover         ├─ Focus        └─ Animation
└─ Transition    └─ Error
```

---

## 📊 Component Tree

```
LandingV2
├── Header (Sticky)
│   ├── Brand
│   ├── Nav Links
│   └── CTA Buttons
│
├── Hero Section
│   ├── Eyebrow Badge
│   ├── Main Title (h1)
│   ├── Subtitle
│   ├── CTAs
│   ├── Pills/Tags
│   └── Demo Box
│
├── Marquee Section
│   └── Scrolling Integrations
│
├── Features Section
│   └── Feature Grid (4 cols)
│
├── Workflow Section
│   ├── Copy (left)
│   └── Grid (right)
│
├── Process Flow Section
│   └── 4-Step Process
│
├── Use Cases Section
│   └── 4 Cards (2 cols)
│
├── Code Section
│   ├── Tabs
│   └── Code Blocks
│
├── Analytics Section
│   └── 4 Metric Cards
│
├── Final CTA
│   └── CTAs
│
└── Footer
    ├── Links
    └── Social
```

---

## 🎬 Animation Timeline

```
Page Load
   ├─ 0ms:    Grain texture appears
   ├─ 0ms:    Header visible
   ├─ 0ms:    Hero starts (no animation)
   │
Page Scroll Down
   ├─ 500px:  Marquee section reveals
   ├─ 800px:  Features grid reveals
   ├─ 1200px: Workflow section reveals
   ├─ 1800px: Process flow reveals
   ├─ 2400px: Use cases reveals
   ├─ 3000px: Code section reveals
   ├─ 3600px: Analytics reveals
   └─ 4200px: CTA reveals
```

---

**Fait avec 💜 pour DIFR Project**

*Dernière mise à jour : 2026-07-06*
