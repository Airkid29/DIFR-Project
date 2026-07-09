import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { Sun, Moon, Code, Zap, Shield, BarChart, ArrowRight, ExternalLink } from "lucide-react";
import SlackIcon from "../assets/slack-removebg-preview.png";
import GitHubIcon from "../assets/github-removebg-preview.png";
import LinkedinIcon from "../assets/linkedin-removebg-preview.png";
import XIcon from "../assets/x-removebg-preview.png";
import VirusTotalIcon from "../assets/virustotal.webp";
import AlienVaultIcon from "../assets/alienvault.png";
import YaraIcon from "../assets/Yara-removebg-preview.png";
import { api } from "../utils/api";

export default function Landing() {
  const { theme, toggleTheme, language, toggleLanguage } = useSettings();
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "js" | "py">("curl");

  // Track page visit
  useEffect(() => {
    api.post("/api/visitor/log").catch((err) => console.warn("Failed to log visit:", err));
  }, []);

  // Scroll reveal Intersection Observer in React
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [language]); // re-observe on language change since texts change height/renders

  const trans = {
    en: {
      meta: {
        beta: "Beta",
        startTrial: "Start building for free",
        viewDocs: "View documentation",
        topUp: "Top up with Mobile Money",
        getStarted: "Start for free",
        pricing: "View pricing"
      },
      nav: {
        features: "Features",
        pricing: "Pricing",
        insights: "Insights",
        docs: "Docs",
        about: "About",
        help: "Help"
      },
      hero: {
        eyebrow: "Africa's Forensic Infrastructure Platform",
        title1: "Access the world's best",
        title2: "forensic threat engines",
        subtitle: "One Platform. Fifty-plus engines. Pay the way Africa pays — with Mobile Money."
      },
      marqueeLabel: "Works with the tools you already use",
      platform: {
        kicker: "Platform",
        title: "Everything you need to triage threats",
        sub: "A single integration point between your infrastructure and the world's threat intelligence.",
        f1Title: "One unified API",
        f1Desc: "Swap analyzers with a single parameter. No custom agent SDKs to maintain.",
        f1Link: "View docs →",
        f2Title: "50+ security engines",
        f2Desc: "YARA, VirusTotal, OTX, and AI decoders, ranked live by speed and confidence.",
        f2Link: "Browse engines →",
        f3Title: "Idea to production",
        f3Desc: "Ingest events today and scale the same integration to millions of logs.",
        f3Link: "Start building →",
        f4Title: "Real-time analytics",
        f4Desc: "Track scan latency, threat score distribution, and posture trends.",
        f4Link: "See dashboard →"
      },
      howItWorks: {
        kicker: "How it works",
        title: "Every request, routed in milliseconds",
        sub: "The real path an artifact takes from ingestion to sealed evidence.",
        step1: "Your agent sends an alert",
        step1Mono: "POST /api/v1/analyze",
        step2: "ForensiGuard routes it",
        step2Mono: "scan: \"yara/virustotal\"",
        step3: "Analyzers respond",
        step4: "Logged & Sealed",
        step4Mono: "200 OK · sealed evidence"
      },
      useCases: {
        kicker: "Use cases",
        title: "Built for how security teams actually respond",
        uc1Title: "SOC Analysts",
        uc1Desc: "Investigate threats faster without manual log correlation or complex scripting.",
        uc1B1: "Automated log correlation",
        uc1B2: "Visual timeline reconstruction",
        uc1B3: "One-click executive reporting",
        uc2Title: "Incident Responders",
        uc2Desc: "Contain and remediate threats at scale across your infrastructure.",
        uc2B1: "Automated playbooks",
        uc2B2: "Cross-system coordination",
        uc2B3: "Chain of custody tracking",
        uc3Title: "Forensic Investigators",
        uc3Desc: "Preserve evidence and document events with audit-ready security.",
        uc3B1: "SHA-256 integrity logs",
        uc3B2: "Legal-standard compliance",
        uc3B3: "Deep file analysis",
        uc4Title: "Compliance Teams",
        uc4Desc: "Demonstrate threat readiness and document historical workflows.",
        uc4B1: "Immutable audit log exports",
        uc4B2: "Regulatory reports",
        uc4B3: "Risk assessment"
      },
      devReady: {
        kicker: "Developer ready",
        title: "Three lines to your first analysis report"
      },
      finalCta: {
        title: "Ready to secure your operations?",
        desc: "Create an API key, top up with Mobile Money, and scan your first file today."
      },
      footer: {
        desc: "The forensic infrastructure layer built for African security teams.",
        col1: "Product",
        col2: "Company",
        col3: "Help & legal"
      }
    },
    fr: {
      meta: {
        beta: "Bêta",
        startTrial: "Essai gratuit",
        viewDocs: "Voir la documentation",
        topUp: "Recharger par Mobile Money",
        getStarted: "Commencer gratuit",
        pricing: "Voir les tarifs"
      },
      nav: {
        features: "Fonctionnalités",
        pricing: "Tarifs",
        insights: "Analyses",
        docs: "Docs",
        about: "À propos",
        help: "Aide"
      },
      hero: {
        eyebrow: "Plateforme d'infrastructure de tri forensique en Afrique",
        title1: "Accédez au meilleur du",
        title2: "tri forensique en Afrique",
        subtitle: "Une seule plateforme. Cinquante moteurs. Payez par Mobile Money."
      },
      marqueeLabel: "Fonctionne avec les outils que vous utilisez déjà",
      platform: {
        kicker: "Plateforme",
        title: "Tout le nécessaire pour trier les menaces",
        sub: "Un point d'intégration unique entre vos systèmes et la threat intelligence mondiale.",
        f1Title: "Une API unifiée",
        f1Desc: "Changez d'analyseur avec un seul paramètre. Aucun SDK spécifique à maintenir.",
        f1Link: "Voir les docs →",
        f2Title: "50+ moteurs de sécurité",
        f2Desc: "Signatures YARA, VirusTotal, OTX et décodeurs IA, classés par vitesse et confiance.",
        f2Link: "Parcourir les moteurs →",
        f3Title: "Idée à la production",
        f3Desc: "Intégrez des événements aujourd'hui et passez à l'échelle sur des millions de logs.",
        f3Link: "Commencer →",
        f4Title: "Analyses en temps réel",
        f4Desc: "Suivez la latence d'analyse, la répartition des menaces et l'état de votre sécurité.",
        f4Link: "Voir le dashboard →"
      },
      payments: {
        kicker: "Paiements",
        title: "Payez comme l'Afrique paye",
        desc: "Rechargez votre solde directement avec Mobile Money — sans carte internationale ni friction."
      },
      howItWorks: {
        kicker: "Comment ça fonctionne",
        title: "Chaque requête, routée en millisecondes",
        sub: "Le chemin réel qu'emprunte un fichier de l'ingestion à la preuve scellée.",
        step1: "Votre agent envoie une alerte",
        step1Mono: "POST /api/v1/analyze",
        step2: "ForensiGuard l'oriente",
        step2Mono: "scan: \"yara/virustotal\"",
        step3: "Les moteurs répondent",
        step4: "Consigné & Scellé",
        step4Mono: "200 OK · preuve scellée"
      },
      useCases: {
        kicker: "Cas d'usages",
        title: "Conçu pour la réponse réelle des équipes de sécurité",
        uc1Title: "Analystes SOC",
        uc1Desc: "Enquêtez sur les menaces rapidement sans corrélations manuelles de logs fastidieuses.",
        uc1B1: "Corrélation automatisée de logs",
        uc1B2: "Chronologies d'attaque interactives",
        uc1B3: "Rapports exécutifs en un clic",
        uc2Title: "Intervenants sur incident",
        uc2Desc: "Contenez et remédiez aux menaces à grande échelle sur toutes vos infrastructures.",
        uc2B1: "Playbooks de confinement automatisés",
        uc2B2: "Orchestration multi-systèmes",
        uc2B3: "Suivi de chaîne de garde",
        uc3Title: "Enquêteurs forensiques",
        uc3Desc: "Préservez les preuves et documentez les cas avec une sécurité absolue.",
        uc3B1: "Traçabilité SHA-256 immuable",
        uc3B2: "Conformité aux standards judiciaires",
        uc3B3: "Analyse heuristique profonde",
        uc4Title: "Équipes conformité",
        uc4Desc: "Prouvez votre préparation aux menaces et auditez l'historique des incidents.",
        uc4B1: "Exports de journaux d'audit chiffrés",
        uc4B2: "Génération de rapports réglementaires",
        uc4B3: "Revue de posture continue"
      },
      devReady: {
        kicker: "Prêt pour les développeurs",
        title: "Trois lignes pour votre premier rapport d'analyse"
      },
      finalCta: {
        title: "Prêt à sécuriser vos opérations ?",
        desc: "Générez une clé API, rechargez par Mobile Money et scannez votre premier fichier dès aujourd'hui."
      },
      footer: {
        desc: "L'infrastructure de tri forensique conçue pour les équipes de sécurité en Afrique.",
        col1: "Produit",
        col2: "Entreprise",
        col3: "Aide & légal"
      }
    }
  };

  const currentStrings = trans[language];

  // Marquee list of tool logos
  const tools = [
    "VS Code", "Cursor", "Windsurf", "Zed", "n8n", "Zapier", 
    "Make", "Python", "Node.js", "Splunk", "CrowdStrike", 
    "SentinelOne", "Slack", "Jira", "Docker", "Git", "GitHub", "Kubernetes"
  ];

  return (
    <div className="landing-root" data-theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        /* Minimalist Vercel / RodiumAI variables */
        .landing-root {
          --ink: #050505;
          --panel: #191c19;
          --panel-2: #20241f;
          --line: rgba(236, 234, 227, 0.10);
          --line-strong: rgba(236, 234, 227, 0.18);
          --text: #ECEAE3;
          --text-dim: #9B9C93;
          --text-faint: #6b6c66;
          --metal-1: #E7E9EA;
          --metal-2: #9AA0A6;
          --metal-3: #565b60;
          --gold: #F2A93B;
          --gold-dim: rgba(242, 169, 59, 0.14);
          --mint: #5FCB9B;
          --mint-dim: rgba(95, 203, 155, 0.14);
          --radius: 14px;
          --font-display: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          background: var(--ink);
          color: var(--text);
          font-family: var(--font-body);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          position: relative;
          min-height: 100vh;
        }

        /* Light Mode adaptation of the exact same palette layout */
        .landing-root[data-theme="light"] {
          --ink: #f0f4f8 ;
          --panel: #ffffff;
          --panel-2: #f1f3f0;
          --line: rgba(18, 20, 18, 0.08);
          --line-strong: rgba(18, 20, 18, 0.15);
          --text: #121412;
          --text-dim: #5a5c56;
          --text-faint: #8c8d86;
          --metal-1: #121412;
          --metal-2: #5a5c56;
          --metal-3: #8c8d86;
          --gold: #c07f28;
          --gold-dim: rgba(192, 127, 40, 0.1);
          --mint: #3b9c70;
          --mint-dim: rgba(59, 156, 112, 0.1);
        }

        .landing-root html {
          scroll-behavior: smooth;
        }
        .landing-root a {
          color: #000000;
          text-decoration: none;
        }
        .landing-root ul {
          list-style: none;
        }
        .landing-root svg {
          display: block;
        }
        .landing-root .wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .landing-root section {
          position: relative;
        }

        .landing-root ::selection {
          background: var(--gold);
          color: #241503;
        }

        /* Background grain */
        .landing-root .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.035;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .landing-root[data-theme="light"] .grain {
          opacity: 0.02;
        }

        /* Header */
        .landing-root header {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(14px);
          background: rgba(18, 20, 18, 0.72);
          border-bottom: 1px solid var(--line);
        }
        .landing-root[data-theme="light"] header {
          background: rgba(249, 249, 247, 0.82);
        }
        .landing-root .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
        }
        .landing-root .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          letter-spacing: -0.01em;
        }
        .landing-root .mark {
          height: 22px;
          width: auto;
        }
        .landing-root .beta-badge {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.04em;
          color: var(--gold);
          border: 1px solid var(--gold-dim);
          background: var(--gold-dim);
          padding: 2px 7px;
          border-radius: 100px;
          text-transform: uppercase;
        }
        .landing-root .nav-links {
          display: flex;
          align-items: center;
          gap: 34px;
        }
        .landing-root .nav-links a {
          font-size: 14.5px;
          color: var(--text-dim);
          transition: color .2s;
        }
        .landing-root .nav-links a:hover {
          color: var(--text);
        }
        .landing-root .nav-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .landing-root .lang {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--text-faint);
          border: 1px solid var(--line);
          padding: 5px 10px;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
        }
        .landing-root .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid var(--line-strong);
          transition: all .18s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        .landing-root .btn-primary {
          background: var(--metal-1);
          color: var(--ink);
          border-color: transparent;
        }
        .landing-root .btn-primary:hover {
          background: #fff;
          transform: translateY(-1px);
        }
        .landing-root[data-theme="light"] .btn-primary:hover {
          background: #000;
          color: #fff;
        }
        .landing-root .btn-ghost {
          color: var(--text);
          background: transparent;
        }
        .landing-root .btn-ghost:hover {
          border-color: var(--line-strong);
          background: rgba(255, 255, 255, 0.03);
        }
        .landing-root[data-theme="light"] .btn-ghost:hover {
          background: rgba(0, 0, 0, 0.03);
        }

        /* Hero */
        .landing-root .hero {
          padding: 108px 0 64px;
          text-align: center;
          position: relative;
        }
        .landing-root .hero-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 520px;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(154, 160, 166, 0.16), rgba(242, 169, 59, 0.05) 45%, transparent 70%);
        }
        .landing-root .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--mint);
          border: 1px solid var(--mint-dim);
          background: var(--mint-dim);
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 26px;
          position: relative;
          z-index: 2;
        }
        .landing-root .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--mint);
          box-shadow: 0 0 0 3px var(--mint-dim);
        }
        .landing-root h1 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(2.4rem, 5.4vw, 4.6rem);
          letter-spacing: -0.03em;
          line-height: 1.04;
          max-width: 920px;
          margin: 0 auto 22px;
          position: relative;
          z-index: 2;
        }
        .landing-root .metallic {
          background: linear-gradient(120deg, var(--metal-2) 10%, var(--metal-1) 35%, #fff 48%, var(--metal-1) 60%, var(--metal-3) 85%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 220% 100%;
          animation: sheen 7s linear infinite;
        }
        .landing-root[data-theme="light"] .metallic {
          background: linear-gradient(120deg, var(--metal-2) 10%, var(--metal-1) 35%, #121412 48%, var(--metal-1) 60%, var(--metal-3) 85%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .landing-root .hero p.sub {
          font-size: 18px;
          color: var(--text-dim);
          max-width: 560px;
          margin: 0 auto 34px;
          position: relative;
          z-index: 2;
        }
        .landing-root .hero-ctas {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-bottom: 52px;
          position: relative;
          z-index: 2;
        }
        .landing-root .btn-lg {
          padding: 13px 24px;
          font-size: 15px;
          border-radius: 12px;
        }
        .landing-root .provider-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          position: relative;
          z-index: 2;
          margin-bottom: 64px;
        }
        .landing-root .pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--text-dim);
          border: 1px solid var(--line);
          background: var(--panel);
          padding: 7px 14px 7px 10px;
          border-radius: 100px;
        }
        .landing-root .pill i {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          background: var(--metal-2);
          flex-shrink: 0;
        }

        .landing-root .hero-demo {
          max-width: 960px;
          margin: 0 auto;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--line-strong);
          background: var(--panel);
          box-shadow: 0 40px 90px -30px rgba(0,0,0,0.6);
          position: relative;
        }
        .landing-root .hero-demo .bar {
          display: flex;
          gap: 6px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--line);
        }
        .landing-root .hero-demo .bar span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--line-strong);
        }
        .landing-root .hero-demo .screen {
          aspect-ratio: 16/9;
          background:
            linear-gradient(180deg, rgba(95,203,155,0.05), transparent 40%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 64px),
            #15170f;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 14px;
        }
        .landing-root[data-theme="light"] .hero-demo .screen {
          background:
            linear-gradient(180deg, rgba(59,156,112,0.05), transparent 40%),
            repeating-linear-gradient(90deg, rgba(18,20,18,0.02) 0 1px, transparent 1px 64px),
            #fbfbf9;
        }
        .landing-root .screen code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--mint);
        }
        .landing-root .screen .router-anim {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-dim);
        }
        .landing-root .router-anim .chip {
          border: 1px solid var(--line-strong);
          padding: 6px 12px;
          border-radius: 8px;
          background: var(--panel-2);
        }

        /* Marquee section */
        .landing-root .marquee-section {
          padding: 50px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .landing-root .marquee-label {
          text-align: center;
          font-size: 13px;
          color: var(--text-faint);
          margin-bottom: 26px;
          letter-spacing: 0.02em;
        }
        .landing-root .marquee {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .landing-root .marquee-track {
          display: flex;
          gap: 52px;
          width: max-content;
          animation: scroll 32s linear infinite;
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .landing-root .marquee-track span {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-faint);
          white-space: nowrap;
        }

        /* Section headers */
        .landing-root .section {
          padding: 96px 0;
        }
        .landing-root .section-head {
          max-width: 600px;
          margin-bottom: 56px;
        }
        .landing-root .kicker {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 14px;
        }
        .landing-root h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        .landing-root .section-head p {
          color: var(--text-dim);
          font-size: 16px;
          max-width: 520px;
        }
        .landing-root .center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }

        /* Feature grid */
        .landing-root .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
        }
        .landing-root .fcard {
          background: var(--ink);
          padding: 32px 28px;
          transition: background .2s;
        }
        .landing-root .fcard:hover {
          background: var(--panel);
        }
        .landing-root .ficon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--panel-2);
          border: 1px solid var(--line-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }
        .landing-root .fcard h3 {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .landing-root .fcard p {
          font-size: 14px;
          color: var(--text-dim);
          margin-bottom: 18px;
          line-height: 1.6;
        }
        .landing-root .flink {
          font-size: 13.5px;
          color: var(--metal-1);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .landing-root[data-theme="light"] .flink {
          color: var(--ink);
        }
        .landing-root .flink svg {
          width: 13px;
          height: 13px;
        }

        /* Mobile money */
        .landing-root .money-section {
          background: var(--panel);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .landing-root .money-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .landing-root .money-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .landing-root .mchip {
          aspect-ratio: 1.3;
          border: 1px solid var(--line-strong);
          border-radius: 12px;
          background: var(--panel-2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-dim);
          text-align: center;
          padding: 10px;
        }
        .landing-root .mchip .swatch {
          width: 26px;
          height: 26px;
          border-radius: 7px;
        }
        .landing-root .money-copy h2 {
          margin-bottom: 16px;
        }
        .landing-root .money-copy p {
          color: var(--text-dim);
          margin-bottom: 26px;
          font-size: 15.5px;
          max-width: 440px;
        }

        /* How it works */
        .landing-root .flow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 56px;
        }
        .landing-root .flow-step {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel);
          padding: 22px;
          position: relative;
        }
        .landing-root .flow-step .num {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--gold);
          margin-bottom: 14px;
          display: block;
        }
        .landing-root .flow-step h4 {
          font-family: var(--font-display);
          font-size: 14.5px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .landing-root .flow-step .mono-box {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--mint);
          background: var(--ink);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 10px;
          word-break: break-word;
        }
        .landing-root .flow-step .latency {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          border-top: 1px solid var(--line);
          padding-top: 8px;
          margin-top: 8px;
        }
        .landing-root .flow-arrow {
          position: absolute;
          right: -24px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-faint);
          font-size: 18px;
          z-index: 2;
        }
        .landing-root .flow-step:last-child .flow-arrow {
          display: none;
        }

        /* Use cases */
        .landing-root .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .landing-root .ucard {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 32px;
          background: var(--panel);
          transition: border-color .2s;
        }
        .landing-root .ucard:hover {
          border-color: var(--line-strong);
        }
        .landing-root .ucard h3 {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .landing-root .ucard p {
          color: var(--text-dim);
          font-size: 14.5px;
          margin-bottom: 18px;
        }
        .landing-root .ucard ul {
          margin-bottom: 20px;
        }
        .landing-root .ucard li {
          font-size: 13.5px;
          color: var(--text-dim);
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          align-items: flex-start;
        }
        .landing-root .ucard li:before {
          content: "—";
          color: var(--gold);
          flex-shrink: 0;
        }

        /* Code tabs */
        .landing-root .code-panel {
          border: 1px solid var(--line-strong);
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--panel);
        }
        .landing-root .tabs {
          display: flex;
          border-bottom: 1px solid var(--line);
        }
        .landing-root .tab {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--text-faint);
          padding: 13px 20px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .landing-root .tab.active {
          color: var(--text);
          border-color: var(--gold);
        }
        .landing-root pre {
          font-family: var(--font-mono);
          font-size: 12.8px;
          line-height: 1.75;
          padding: 26px;
          overflow-x: auto;
          color: var(--text-dim);
          display: none;
          background: #0d0e0d;
        }
        .landing-root pre.active {
          display: block;
        }
        .landing-root pre .k { color: var(--mint); }
        .landing-root pre .s { color: var(--gold); }
        .landing-root pre .c { color: var(--text-faint); }

        /* Final CTA */
        .landing-root .final-cta {
          text-align: center;
          padding: 110px 0;
        }
        .landing-root .final-cta h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 16px;
        }
        .landing-root .final-cta p {
          color: var(--text-dim);
          margin-bottom: 34px;
        }

        /* Footer */
        .landing-root footer {
          border-top: 1px solid var(--line);
          padding: 64px 0 32px;
        }
        .landing-root .foot-top {
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 1fr);
          gap: 40px;
          margin-bottom: 56px;
        }
        .landing-root .foot-brand p {
          color: var(--text-faint);
          font-size: 13.5px;
          margin: 14px 0 22px;
          max-width: 260px;
        }
        .landing-root .socials {
          display: flex;
          gap: 12px;
        }
        .landing-root .socials a {
          width: 32px;
          height: 32px;
          border: 1px solid var(--line);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          font-family: var(--font-mono);
          font-size: 13px;
        }
        .landing-root .foot-col h5 {
          font-size: 12.5px;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }
        .landing-root .foot-col a {
          display: block;
          font-size: 14px;
          color: var(--text-dim);
          margin-bottom: 12px;
        }
        .landing-root .foot-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 28px;
          border-top: 1px solid var(--line);
          font-size: 12.5px;
          color: var(--text-faint);
          flex-wrap: wrap;
          gap: 12px;
        }

        /* Scroll reveal styling */
        .landing-root .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .landing-root .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive Breakpoints matching template style */
        @media (max-width: 1024px) {
          .landing-root .grid-4 { grid-template-columns: repeat(2, 1fr); }
          .landing-root .money-layout { grid-template-columns: 1fr; gap: 40px; }
          .landing-root .flow { grid-template-columns: repeat(2, 1fr); }
          .landing-root .flow-arrow { display: none; }
          .landing-root .foot-top { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .landing-root .nav-links { display: none; }
          .landing-root .hero { padding: 80px 0 40px; }
          .landing-root .hero h1 { font-size: clamp(2rem, 6vw, 3rem); }
          .landing-root .provider-row { justify-content: center; }
        }
        @media (max-width: 560px) {
          .landing-root .wrap { padding: 0 16px; }
          .landing-root .nav { height: auto; padding: 12px 0; gap: 12px; flex-wrap: wrap; }
          .landing-root .grid-4 { grid-template-columns: 1fr; }
          .landing-root .flow { grid-template-columns: 1fr; }
          .landing-root .hero-ctas { flex-direction: column; align-items: stretch; }
          .landing-root .foot-top { grid-template-columns: 1fr; }
          .landing-root .brand { gap: 8px; }
        }
      `}</style>

      {/* Background grain texture */}
      <div className="grain"></div>

      {/* Header Sticky */}
      <header>
        <div className="wrap nav">
          <div className="brand">
            <img 
              src={theme === "light" ? "/logo-light.png" : "/logo-dark.png"} 
              alt="ForensiGuard" 
              className="mark" 
            />
            <span className="beta-badge">{currentStrings.meta.beta}</span>
          </div>

          <nav className="nav-links">
            <a href="#features">{currentStrings.nav.features}</a>
            <a href="#payment">{currentStrings.nav.pricing}</a>
            <a href="#how">{currentStrings.nav.insights}</a>
            <Link to="/docs">{currentStrings.nav.docs}</Link>
            <a href="#usecases">{currentStrings.nav.about}</a>
            <a href="#help">{currentStrings.nav.help}</a>
          </nav>

          <div className="nav-right">
            {/* Language Selector */}
            <button onClick={toggleLanguage} className="lang">
              {language.toUpperCase()}
            </button>

            {/* Light/Dark Toggle */}
            <button 
              onClick={toggleTheme} 
              className="lang" 
              style={{ padding: "5px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {/* Start building button */}
            <Link to="/register" className="btn btn-primary">
              {currentStrings.meta.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot"></span> {currentStrings.hero.eyebrow}
          </div>
          <h1>
            {currentStrings.hero.title1}{" "}
            <span className="metallic">{currentStrings.hero.title2}</span>
          </h1>
          <p className="sub">{currentStrings.hero.subtitle}</p>
          
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary btn-lg">
              {currentStrings.meta.startTrial}
            </Link>
            <Link to="/docs" className="btn btn-ghost btn-lg" style={{ border: "1px solid var(--line-strong)" }}>
              {currentStrings.meta.viewDocs}
            </Link>
          </div>

          {/* Provider Pills */}
          <div className="provider-row">
            <span className="pill"><i style={{ backgroundColor: "#5FCB9B" }}></i> YARA Engine</span>
            <span className="pill"><i style={{ backgroundColor: "#F2A93B" }}></i> VirusTotal</span>
            <span className="pill"><i style={{ backgroundColor: "#ECEAE3" }}></i> AlienVault OTX</span>
          </div>

          {/* Router Demo Simulation */}
          <div className="hero-demo reveal">
            <div className="bar"><span></span><span></span><span></span></div>
            <div className="screen" style={{ padding: 0, overflow: "hidden" }}>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/id-DxNv41DM" 
                title="ForensiGuard Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                style={{ border: "none", width: "100%", height: "100%", aspectRatio: "16/9" }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="marquee-section">
        <p className="marquee-label">{currentStrings.marqueeLabel}</p>
        <div className="marquee">
          <div className="marquee-track">
            {tools.concat(tools).map((tool, idx) => (
              <span key={idx}>{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="section" id="features">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">{currentStrings.platform.kicker}</div>
            <h2>{currentStrings.platform.title}</h2>
            <p>{currentStrings.platform.sub}</p>
          </div>

          <div className="grid-4 reveal">
            {/* Card 1 */}
            <div className="fcard">
              <div className="ficon" style={{ color: "var(--gold)" }}><Code size={20} /></div>
              <h3>{currentStrings.platform.f1Title}</h3>
              <p>{currentStrings.platform.f1Desc}</p>
              <Link className="flink" to="/docs">
              {currentStrings.platform.f1Link} <ArrowRight size={13} />
            </Link>
            </div>

            {/* Card 2 */}
            <div className="fcard">
              <div className="ficon" style={{ color: "var(--mint)" }}><Shield size={20} /></div>
              <h3>{currentStrings.platform.f2Title}</h3>
              <p>{currentStrings.platform.f2Desc}</p>
              <a className="flink" href="#docs">
                {currentStrings.platform.f2Link} <ArrowRight size={13} />
              </a>
            </div>

            {/* Card 3 */}
            <div className="fcard">
              <div className="ficon" style={{ color: "var(--text)" }}><Zap size={20} /></div>
              <h3>{currentStrings.platform.f3Title}</h3>
              <p>{currentStrings.platform.f3Desc}</p>
              <Link className="flink" to="/register">
                {currentStrings.platform.f3Link} <ArrowRight size={13} />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="fcard">
              <div className="ficon" style={{ color: "var(--metal-2)" }}><BarChart size={20} /></div>
              <h3>{currentStrings.platform.f4Title}</h3>
              <p>{currentStrings.platform.f4Desc}</p>
              <Link className="flink" to="/login">
                {currentStrings.platform.f4Link} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      

      {/* How it Works Section */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">{currentStrings.howItWorks.kicker}</div>
            <h2>{currentStrings.howItWorks.title}</h2>
            <p>{currentStrings.howItWorks.sub}</p>
          </div>

          <div className="flow reveal">
            <div className="flow-step">
              <span className="num">01</span>
              <h4>{currentStrings.howItWorks.step1}</h4>
              <div className="mono-box">{currentStrings.howItWorks.step1Mono}</div>
              <div className="flow-arrow">→</div>
            </div>
            <div className="flow-step">
              <span className="num">02</span>
              <h4>{currentStrings.howItWorks.step2}</h4>
              <div className="mono-box">{currentStrings.howItWorks.step2Mono}</div>
              <div className="flow-arrow">→</div>
            </div>
            <div className="flow-step">
              <span className="num">03</span>
              <h4>{currentStrings.howItWorks.step3}</h4>
              <div className="latency"><span>YARA</span><span>20ms</span></div>
              <div className="latency"><span>VirusTotal</span><span>450ms</span></div>
              <div className="flow-arrow">→</div>
            </div>
            <div className="flow-step">
              <span className="num">04</span>
              <h4>{currentStrings.howItWorks.step4}</h4>
              <div className="mono-box">{currentStrings.howItWorks.step4Mono}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section" id="usecases">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">{currentStrings.useCases.kicker}</div>
            <h2>{currentStrings.useCases.title}</h2>
          </div>

          <div className="grid-2 reveal">
            {/* UC 1 */}
            <div className="ucard">
              <h3>{currentStrings.useCases.uc1Title}</h3>
              <p>{currentStrings.useCases.uc1Desc}</p>
              <ul>
                <li>{currentStrings.useCases.uc1B1}</li>
                <li>{currentStrings.useCases.uc1B2}</li>
                <li>{currentStrings.useCases.uc1B3}</li>
              </ul>
            </div>

            {/* UC 2 */}
            <div className="ucard">
              <h3>{currentStrings.useCases.uc2Title}</h3>
              <p>{currentStrings.useCases.uc2Desc}</p>
              <ul>
                <li>{currentStrings.useCases.uc2B1}</li>
                <li>{currentStrings.useCases.uc2B2}</li>
                <li>{currentStrings.useCases.uc2B3}</li>
              </ul>
            </div>

            {/* UC 3 */}
            <div className="ucard">
              <h3>{currentStrings.useCases.uc3Title}</h3>
              <p>{currentStrings.useCases.uc3Desc}</p>
              <ul>
                <li>{currentStrings.useCases.uc3B1}</li>
                <li>{currentStrings.useCases.uc3B2}</li>
                <li>{currentStrings.useCases.uc3B3}</li>
              </ul>
            </div>

            {/* UC 4 */}
            <div className="ucard">
              <h3>{currentStrings.useCases.uc4Title}</h3>
              <p>{currentStrings.useCases.uc4Desc}</p>
              <ul>
                <li>{currentStrings.useCases.uc4B1}</li>
                <li>{currentStrings.useCases.uc4B2}</li>
                <li>{currentStrings.useCases.uc4B3}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Developer Ready Section */}
      <section className="section" id="docs">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="kicker">{currentStrings.devReady.kicker}</div>
            <h2>{currentStrings.devReady.title}</h2>
          </div>

          <div className="code-panel reveal">
            <div className="tabs">
              <div 
                className={`tab ${activeCodeTab === "curl" ? "active" : ""}`} 
                onClick={() => setActiveCodeTab("curl")}
              >
                cURL
              </div>
              <div 
                className={`tab ${activeCodeTab === "js" ? "active" : ""}`} 
                onClick={() => setActiveCodeTab("js")}
              >
                JavaScript
              </div>
              <div 
                className={`tab ${activeCodeTab === "py" ? "active" : ""}`} 
                onClick={() => setActiveCodeTab("py")}
              >
                Python
              </div>
            </div>

            <pre className={activeCodeTab === "curl" ? "active" : ""}>
              <span className="c"># send your first analysis request</span><br />
              curl https://api.forensiguard.com/v1/analyze \<br />
              &nbsp;&nbsp;-H <span className="s">"Authorization: Bearer $FG_KEY"</span> \<br />
              &nbsp;&nbsp;-d '&#123;<span className="k">"file_url"</span>: <span className="s">"https://bucket/suspicious.bin"</span>, <span className="k">"scan_type"</span>: <span className="s">"yara"</span>&#125;'
            </pre>

            <pre className={activeCodeTab === "js" ? "active" : ""}>
              <span className="c">// send your first analysis request</span><br />
              <span className="k">const</span> res = <span className="k">await</span> fetch(<span className="s">"https://api.forensiguard.com/v1/analyze"</span>, &#123;<br />
              &nbsp;&nbsp;method: <span className="s">"POST"</span>,<br />
              &nbsp;&nbsp;headers: &#123; Authorization: <span className="s">`Bearer $&#123;FG_KEY&#125;`</span>, <span className="s">"Content-Type"</span>: <span className="s">"application/json"</span> &#125;,<br />
              &nbsp;&nbsp;body: JSON.stringify(&#123; file_url: <span className="s">"https://bucket/suspicious.bin"</span>, scan_type: <span className="s">"yara"</span> &#125;)<br />
              &#125;);
            </pre>

            <pre className={activeCodeTab === "py" ? "active" : ""}>
              <span className="c"># send your first analysis request</span><br />
              <span className="k">import</span> requests<br />
              requests.post(<span className="s">"https://api.forensiguard.com/v1/analyze"</span>,<br />
              &nbsp;&nbsp;headers=&#123;<span className="s">"Authorization"</span>: <span className="s">f"Bearer &#123;FG_KEY&#125;"</span>&#125;,<br />
              &nbsp;&nbsp;json=&#123;<span className="s">"file_url"</span>: <span className="s">"https://bucket/suspicious.bin"</span>, <span className="s">"scan_type"</span>: <span className="s">"yara"</span>&#125;)
            </pre>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta" id="start">
        <div className="wrap">
          <h2>{currentStrings.finalCta.title}</h2>
          <p>{currentStrings.finalCta.desc}</p>
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary btn-lg">
              {currentStrings.meta.getStarted}
            </Link>
            <a href="#payment" className="btn btn-ghost btn-lg" style={{ border: "1px solid var(--line-strong)" }}>
              {currentStrings.meta.pricing}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <div className="brand" style={{ fontSize: "16px" }}>
                <img 
                  src={theme === "light" ? "/logo-light.png" : "/logo-dark.png"} 
                  alt="ForensiGuard" 
                  className="mark" 
                />
              </div>
              <p>{currentStrings.footer.desc}</p>
              <div className="socials" style={{ display: "flex", gap: "12px" }}>
                <a href="https://github.com/forensiguard" aria-label="GitHub">
                  <img src={GitHubIcon} alt="GitHub" style={{ width: "24px", height: "24px" }} />
                </a>
                <a href="https://twitter.com/forensiguard" aria-label="X">
                  <img src={XIcon} alt="X" style={{ width: "24px", height: "24px" }} />
                </a>
                <a href="https://linkedin.com/company/forensiguard" aria-label="LinkedIn">
                  <img src={LinkedinIcon} alt="LinkedIn" style={{ width: "24px", height: "24px" }} />
                </a>
                <a href="https://join.slack.com/t/forensiguard/shared_invite/..." aria-label="Slack">
                  <img src={SlackIcon} alt="Slack" style={{ width: "24px", height: "24px" }} />
                </a>
              </div>
            </div>
            <div className="foot-col">
              <h5>{currentStrings.footer.col1}</h5>
              <a href="#features">{currentStrings.nav.features}</a>
              <a href="#payment">{currentStrings.nav.pricing}</a>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="foot-col">
              <h5>{currentStrings.footer.col2}</h5>
              <a href="#usecases">{currentStrings.nav.about}</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
            </div>
            <div className="foot-col">
              <h5>{currentStrings.footer.col3}</h5>
              <a href="#help">Help center</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} ForensiGuard. All rights reserved.</span>
            <span>Moyens de paiments bientot disponibles...</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
