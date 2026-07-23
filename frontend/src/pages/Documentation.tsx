import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, Shield, Zap, Database, MessageSquareMore, Globe, Download, Lock, ShieldCheck, FileQuestion, AlertTriangle, CheckCircle, Server } from 'lucide-react';

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  const s: Record<string, React.CSSProperties> = {
    container: {
      background: 'var(--brand-bg)',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: 'Outfit, sans-serif',
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px',
      flexWrap: 'wrap',
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid var(--brand-border)',
      background: 'var(--glass-bg)',
      color: 'var(--brand-text-primary)',
      cursor: 'pointer',
      fontWeight: 600,
      transition: 'all 0.2s ease',
    },
    headerRight: {
      marginLeft: 'auto',
      display: 'flex',
      gap: '8px',
    },
    langBtn: {
      padding: '6px 14px',
      borderRadius: '8px',
      border: '1px solid var(--brand-border)',
      background: 'var(--glass-bg)',
      color: 'var(--brand-text-primary)',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '13px',
      transition: 'all 0.2s ease',
    },
    langBtnActive: {
      background: 'var(--brand-cyan)',
      color: 'white',
      borderColor: 'transparent',
    },
    title: {
      fontFamily: 'Space Grotesk, Outfit, sans-serif',
      fontWeight: 800,
      fontSize: '36px',
      color: 'var(--brand-text-primary)',
      marginBottom: '8px',
    },
    subtitle: {
      color: 'var(--brand-text-secondary)',
      fontSize: '16px',
      marginBottom: '32px',
    },
    section: {
      background: 'var(--glass-bg)',
      border: '1px solid var(--brand-border)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
    },
    sectionTitle: {
      fontFamily: 'Space Grotesk, Outfit, sans-serif',
      fontWeight: 700,
      fontSize: '20px',
      color: 'var(--brand-text-primary)',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    subSectionTitle: {
      fontFamily: 'Space Grotesk, Outfit, sans-serif',
      fontWeight: 600,
      fontSize: '16px',
      color: 'var(--brand-text-primary)',
      marginTop: '20px',
      marginBottom: '12px',
    },
    listItem: {
      marginBottom: '12px',
      fontSize: '14px',
      color: 'var(--brand-text-secondary)',
      lineHeight: '1.6',
    },
    listItemStrong: {
      marginBottom: '12px',
      fontSize: '14px',
      color: 'var(--brand-text-primary)',
      lineHeight: '1.6',
      fontWeight: 600,
    },
    codeBlock: {
      background: 'var(--brand-abyssal)',
      border: '1px solid var(--brand-border)',
      borderRadius: '8px',
      padding: '16px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '13px',
      color: 'var(--brand-text-primary)',
      overflowX: 'auto',
      marginTop: '12px',
    },
    badge: {
      display: 'inline-block',
      background: 'rgba(95, 203, 155, 0.1)',
      color: 'var(--brand-cyan)',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 700,
      marginLeft: '8px',
    },
  };

  const t = {
    en: {
      back: 'Back',
      title: 'DFIR-Lab Documentation',
      subtitle: 'Everything you need to get started with DFIR-Lab.',
      gettingStarted: 'Getting Started',
      createAccount: 'Create an account',
      createAccountDesc: 'Sign up for an account to get started',
      completeOnboarding: 'Complete onboarding',
      completeOnboardingDesc: 'Set up your organization and preferences',
      configureIntegrations: 'Configure integrations',
      configureIntegrationsDesc: 'Connect VirusTotal, AlienVault OTX, and Slack',
      analyzeFirstFile: 'Analyze your first file',
      analyzeFirstFileDesc: 'Upload or drag & drop a file for analysis',
      incidentMgmt: 'Incident Management',
      createIncident: 'Create a new incident',
      createIncidentSteps: [
        'Navigate to Incidents page',
        'Click "+ Log Incident" button',
        'Fill in the form (title, description, severity)',
        'Click "Create Incident"',
      ],
      evidenceMgmt: 'Evidence Management',
      registerEvidence: 'Register evidence',
      registerEvidenceSteps: [
        'Go to Evidence page',
        'Click "+ Register Evidence"',
        'Enter name, category, SHA-256 hash, and location',
        'Click "Register and Audit"',
      ],
      transferCustody: 'Transfer custody',
      transferCustodySteps: [
        'Select the evidence item',
        'Click "Transfer Custody"',
        'Enter new custodian and action taken',
        'Click "Confirm Transfer"',
      ],
      fileAnalysis: 'File Analysis',
      submitFile: 'Submit a file',
      submitFileSteps: [
        'Go to Analysis page',
        'Drag & drop file or click to select',
        'Wait for analysis to complete (track via progress bar)',
        'Review threat score and details',
      ],
      threatIntel: 'Threat Intelligence',
      threatIntelDesc: 'Search for IOCs (hashes, IPs, domains, URLs) using integrated VirusTotal and OTX',
      security: 'Security & Audit',
      securityDesc: 'All actions are logged in audit trail, chain of custody maintained for all evidence, password hashing, optional MFA',
      apiUsage: 'API Usage',
      apiDesc: 'FastAPI backend with auto-generated Swagger documentation at /docs',
    },
    fr: {
      back: 'Retour',
      title: 'Documentation DFIR-Lab',
      subtitle: 'Tout ce dont vous avez besoin pour commencer avec DFIR-Lab.',
      gettingStarted: 'Démarrage Rapide',
      createAccount: 'Créer un compte',
      createAccountDesc: 'Inscrivez-vous pour commencer',
      completeOnboarding: 'Compléter l\'onboarding',
      completeOnboardingDesc: 'Configurer votre organisation et préférences',
      configureIntegrations: 'Configurer les intégrations',
      configureIntegrationsDesc: 'Connecter VirusTotal, AlienVault OTX et Slack',
      analyzeFirstFile: 'Analyser votre premier fichier',
      analyzeFirstFileDesc: 'Téléchargez ou glissez-déposez un fichier pour analyse',
      incidentMgmt: 'Gestion des Incidents',
      createIncident: 'Créer un nouvel incident',
      createIncidentSteps: [
        'Aller à la page Incidents',
        'Cliquer sur "+ Enregistrer un Incident"',
        'Remplir le formulaire (titre, description, gravité)',
        'Cliquer sur "Créer l\'Incident"',
      ],
      evidenceMgmt: 'Gestion des Preuves',
      registerEvidence: 'Enregistrer une preuve',
      registerEvidenceSteps: [
        'Aller à la page Evidence',
        'Cliquer sur "+ Enregistrer une Preuve"',
        'Saisir nom, catégorie, hash SHA-256 et emplacement',
        'Cliquer sur "Enregistrer et Auditer"',
      ],
      transferCustody: 'Transférer la garde',
      transferCustodySteps: [
        'Sélectionner la preuve',
        'Cliquer sur "Transférer la Custodie"',
        'Saisir le nouveau gardien et l\'action réalisée',
        'Cliquer sur "Confirmer le Transfert"',
      ],
      fileAnalysis: 'Analyse de Fichiers',
      submitFile: 'Soumettre un fichier',
      submitFileSteps: [
        'Aller à la page Analyse',
        'Glissez-déposez le fichier ou cliquez pour sélectionner',
        'Attendre la fin de l\'analyse (suivre la barre de progression)',
        'Examiner le score de menace et les détails',
      ],
      threatIntel: 'Intelligence sur les Menaces',
      threatIntelDesc: 'Rechercher des IOC (hashes, IP, domaines, URL) via VirusTotal et OTX intégrés',
      security: 'Sécurité & Audit',
      securityDesc: 'Toutes les actions sont consignées dans un journal d\'audit, chaîne de garde maintenue pour toutes les preuves, hachage de mots de passe, MFA optionnel',
      apiUsage: 'Utilisation de l\'API',
      apiDesc: 'Backend FastAPI avec documentation Swagger auto-générée à /docs',
    },
  };

  const current = t[language];

  return (
    <div style={s.container}>
      <div style={s.content}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            {current.back}
          </button>
          <div style={s.headerRight}>
            <button 
              style={{ ...s.langBtn, ...(language === 'en' ? s.langBtnActive : {}) }} 
              onClick={() => setLanguage('en')}
            >
              <Globe size={14} style={{ display: 'inline', marginRight: '6px' }} />
              EN
            </button>
            <button 
              style={{ ...s.langBtn, ...(language === 'fr' ? s.langBtnActive : {}) }} 
              onClick={() => setLanguage('fr')}
            >
              <Globe size={14} style={{ display: 'inline', marginRight: '6px' }} />
              FR
            </button>
          </div>
        </div>

        <h1 style={s.title}>
          <BookOpen size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--brand-cyan)' }} />
          {current.title}
        </h1>
        <p style={s.subtitle}>{current.subtitle}</p>

        {/* Getting Started Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <Zap size={20} style={{ color: 'var(--brand-cyan)' }} />
            {current.gettingStarted}
          </div>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={s.listItem}>
              <strong>{current.createAccount}</strong>: {current.createAccountDesc}
            </li>
            <li style={s.listItem}>
              <strong>{current.completeOnboarding}</strong>: {current.completeOnboardingDesc}
            </li>
            <li style={s.listItem}>
              <strong>{current.configureIntegrations}</strong>: {current.configureIntegrationsDesc}
            </li>
            <li style={s.listItem}>
              <strong>{current.analyzeFirstFile}</strong>: {current.analyzeFirstFileDesc}
            </li>
          </ul>
        </div>

        {/* Incident Management Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <AlertTriangle size={20} style={{ color: 'var(--brand-cyan)' }} />
            {current.incidentMgmt}
          </div>
          <div style={s.subSectionTitle}>
            {current.createIncident}
          </div>
          <ol style={{ paddingLeft: '20px' }}>
            {current.createIncidentSteps.map((step, i) => (
              <li key={i} style={s.listItem}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Evidence Management Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <Database size={20} style={{ color: 'var(--brand-cyan)' }} />
            {current.evidenceMgmt}
          </div>
          <div style={s.subSectionTitle}>{current.registerEvidence}</div>
          <ol style={{ paddingLeft: '20px' }}>
            {current.registerEvidenceSteps.map((step, i) => (
              <li key={i} style={s.listItem}>{step}</li>
            ))}
          </ol>
          <div style={s.subSectionTitle}>{current.transferCustody}</div>
          <ol style={{ paddingLeft: '20px' }}>
            {current.transferCustodySteps.map((step, i) => (
              <li key={i} style={s.listItem}>{step}</li>
            ))}
          </ol>
        </div>

        {/* File Analysis Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <FileQuestion size={20} style={{ color: 'var(--brand-cyan)' }} />
            {current.fileAnalysis}
          </div>
          <div style={s.subSectionTitle}>{current.submitFile}</div>
          <ol style={{ paddingLeft: '20px' }}>
            {current.submitFileSteps.map((step, i) => (
              <li key={i} style={s.listItem}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Threat Intel Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <ShieldCheck size={20} style={{ color: 'var(--brand-cyan)' }} />
            {current.threatIntel}
          </div>
          <p style={s.listItem}>{current.threatIntelDesc}</p>
        </div>

        {/* Security Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <Lock size={20} style={{ color: 'var(--brand-cyan)' }} />
            {current.security}
          </div>
          <p style={s.listItem}>{current.securityDesc}</p>
        </div>

        {/* API Documentation Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <Code size={20} style={{ color: 'var(--brand-cyan)' }} />
            {current.apiUsage}
          </div>
          <p style={s.listItem}>{current.apiDesc}</p>
          <div style={s.codeBlock}>
            {language === 'en' ? '# API Documentation available at /docs' : '# Documentation API disponible à /docs'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
