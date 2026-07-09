import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, Shield, Zap } from 'lucide-react';

const Documentation: React.FC = () => {
  const navigate = useNavigate();

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
    listItem: {
      marginBottom: '12px',
      fontSize: '14px',
      color: 'var(--brand-text-secondary)',
      lineHeight: '1.6',
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
  };

  return (
    <div style={s.container}>
      <div style={s.content}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <h1 style={s.title}>
          <BookOpen size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--brand-cyan)' }} />
          ForensiGuard Documentation
        </h1>
        <p style={s.subtitle}>
          Everything you need to get started with ForensiGuard
        </p>

        {/* Getting Started Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <Zap size={20} style={{ color: 'var(--brand-cyan)' }} />
            Getting Started
          </div>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={s.listItem}>
              <strong>Create an account</strong>: Sign up for a free account to get started
            </li>
            <li style={s.listItem}>
              <strong>Complete onboarding</strong>: Set up your organization and preferences
            </li>
            <li style={s.listItem}>
              <strong>Configure integrations</strong>: Connect VirusTotal, AlienVault OTX, and Slack
            </li>
            <li style={s.listItem}>
              <strong>Analyze your first file</strong>: Upload or link a file for analysis
            </li>
          </ul>
        </div>

        {/* API Documentation Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <Code size={20} style={{ color: 'var(--brand-cyan)' }} />
            API Usage
          </div>
          <p style={{ fontSize: '14px', color: 'var(--brand-text-secondary)', marginBottom: '8px' }}>
            Send your first analysis request using the API:
          </p>
          <div style={s.codeBlock}>
            curl https://api.forensiguard.com/v1/analyze \<br />
            &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
            &nbsp;&nbsp;-d "file_url=https://example.com/suspicious.bin&scan_type=yara"
          </div>
        </div>

        {/* Slack Integration Section */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <Shield size={20} style={{ color: 'var(--brand-cyan)' }} />
            Slack Integration
          </div>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={s.listItem}>
              <strong>Create a Slack webhook</strong>: Go to <code>https://api.slack.com/messaging/webhooks</code>
            </li>
            <li style={s.listItem}>
              <strong>Configure in ForensiGuard</strong>: Add the webhook URL in Settings → Integrations
            </li>
            <li style={s.listItem}>
              <strong>Get notifications</strong>: Alerts for new incidents, updates, and evidence
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
