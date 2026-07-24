import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const UltraAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'incidents' | 'evidence' | 'audit'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const me = await api.get('/api/auth/me');
        if (me.data.role !== 'UltraAdmin') {
          navigate('/dashboard');
        }
      } catch {
        navigate('/dashboard');
      }
    };
    checkRole();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);

      const [statsRes, usersRes, incidentsRes, evidenceRes, auditRes] = await Promise.all([
        api.get('/api/ultra-admin/stats'),
        api.get('/api/ultra-admin/users'),
        api.get('/api/ultra-admin/incidents'),
        api.get('/api/ultra-admin/evidence'),
        api.get('/api/ultra-admin/audit')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setIncidents(incidentsRes.data);
      setEvidence(evidenceRes.data);
      setAuditLogs(auditRes.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total_users, color: 'var(--brand-blue)' },
    { label: 'Active today', value: stats.active_users_today, color: 'var(--brand-emerald)' },
    { label: 'Total Incidents', value: stats.total_incidents, color: 'var(--brand-red)' },
    { label: 'Total Evidence', value: stats.total_evidence, color: 'var(--brand-purple)' },
    { label: 'Total Visitors', value: stats.total_visitors, color: 'var(--brand-gold)' },
  ] : [];

  const severityRank = ['critical', 'high', 'medium', 'low', 'info'];
  const incidentBySeverity = Object.entries(stats?.incidents_by_severity || {})
    .sort(([a], [b]) => severityRank.indexOf(a.toLowerCase()) - severityRank.indexOf(b.toLowerCase()));

  const roleSummary = Object.entries(stats?.users_by_role || {}).sort(([a], [b]) => a.localeCompare(b));
  const latestAudit = auditLogs.slice(0, 5);

  const userGroups = users.reduce<Record<string, any[]>>((groups, user) => {
    const org = user.organization_name || 'Individual Users';
    if (!groups[org]) groups[org] = [];
    groups[org].push(user);
    return groups;
  }, {});

  const severityPill = (severity: string) => {
    const normalized = (severity || '').toLowerCase();
    const palette: Record<string, string> = {
      critical: '#ff5a5a',
      high: '#ff9f43',
      medium: '#f7d154',
      low: '#54c0ff',
      info: '#7ad7b0',
    };
    return {
      padding: '6px 10px',
      borderRadius: '999px',
      background: `${palette[normalized] || '#64748b'}22`,
      color: palette[normalized] || '#fff',
      fontWeight: 700,
      fontSize: '12px',
      display: 'inline-flex',
      alignItems: 'center',
    };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--brand-bg)' }}>
        <div style={{ color: 'var(--brand-text-primary)', fontFamily: 'Outfit, sans-serif' }}>Loading Ultra Admin Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--brand-bg)' }}>
        <div style={{ color: 'var(--brand-red)', fontFamily: 'Outfit, sans-serif' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--brand-bg)',
      minHeight: '100vh',
      fontFamily: 'Outfit, sans-serif',
    }} className="ultraadmin-container p-4 md:p-8">
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{
              fontFamily: 'Space Grotesk, Outfit, sans-serif',
              fontWeight: 800,
              fontSize: 'var(--page-title-size, 32px)',
              color: 'var(--brand-text-primary)',
              marginBottom: '8px'
            }}>
              Ultra Admin Command Center
            </h1>
            <p style={{ color: 'var(--brand-text-secondary)', fontSize: 'var(--page-desc-size, 14px)' }}>
              Full platform oversight, security posture, and operations intelligence.
            </p>
          </div>

          <button
            onClick={() => fetchData()}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1px solid var(--brand-border)',
              background: 'var(--brand-abyssal)',
              color: 'var(--brand-text-primary)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }} className="ultraadmin-tabs">
          {[
            { key: 'dashboard', label: 'Overview' },
            { key: 'users', label: 'Users' },
            { key: 'incidents', label: 'Incidents' },
            { key: 'evidence', label: 'Evidence' },
            { key: 'audit', label: 'Audit Logs' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid var(--brand-border)',
                background: activeTab === tab.key ? 'var(--brand-gradient)' : 'var(--brand-abyssal)',
                color: 'var(--brand-text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '20px' }}>
              {statCards.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--brand-border)',
                    borderRadius: '16px',
                    padding: '24px',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-text-secondary)', marginBottom: '8px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: stat.color, fontFamily: 'Space Grotesk, Outfit, sans-serif' }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--brand-border)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(12px)',
              }}>
                <h3 style={{ fontFamily: 'Space Grotesk, Outfit, sans-serif', fontWeight: 700, color: 'var(--brand-text-primary)', marginBottom: '16px' }}>
                  Incident Severity Distribution
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {incidentBySeverity.map(([severity, count]) => (
                    <div key={severity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--brand-text-secondary)', textTransform: 'capitalize' }}>{severity}</span>
                      <span style={{ color: 'var(--brand-text-primary)', fontWeight: 700 }}>{count as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--brand-border)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(12px)',
              }}>
                <h3 style={{ fontFamily: 'Space Grotesk, Outfit, sans-serif', fontWeight: 700, color: 'var(--brand-text-primary)', marginBottom: '16px' }}>
                  Role Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {roleSummary.map(([role, count]) => (
                    <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--brand-text-secondary)' }}>{role}</span>
                      <span style={{ color: 'var(--brand-text-primary)', fontWeight: 700 }}>{count as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--brand-border)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(12px)',
              }}>
                <h3 style={{ fontFamily: 'Space Grotesk, Outfit, sans-serif', fontWeight: 700, color: 'var(--brand-text-primary)', marginBottom: '16px' }}>
                  Latest Audit Activity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {latestAudit.map((log) => (
                    <div key={log.id} style={{ borderBottom: '1px solid var(--brand-border)', paddingBottom: '8px' }}>
                      <div style={{ color: 'var(--brand-text-primary)', fontWeight: 700 }}>{log.action}</div>
                      <div style={{ color: 'var(--brand-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                        {log.user_email} • {(new Date(log.timestamp)).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(userGroups).map(([org, orgUsers]) => (
              <div key={org} style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--brand-border)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(12px)',
              }}>
                <h3 style={{
                  fontFamily: 'Space Grotesk, Outfit, sans-serif',
                  fontWeight: 700,
                  color: 'var(--brand-text-primary)',
                  marginBottom: '16px',
                  fontSize: '20px'
                }}>
                  {org} <span style={{ fontSize: '14px', color: 'var(--brand-text-secondary)', fontWeight: 400 }}>({orgUsers.length} users)</span>
                </h3>
                <div className="table-responsive-container">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }} className="ultraadmin-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Role</th>
                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Account Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgUsers.map(user => (
                        <tr key={user.id}>
                          <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{user.name}</td>
                          <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{user.email}</td>
                          <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>
                            <span style={severityPill(user.role)}>{user.role}</span>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{user.account_type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'incidents' && (
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--brand-border)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
          }}>
            <div className="table-responsive-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }} className="ultraadmin-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Title</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Severity</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(incident => (
                    <tr key={incident.id}>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{incident.id}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{incident.title}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>
                        <span style={severityPill(incident.severity)}>{incident.severity}</span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{incident.status}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{incident.organization_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--brand-border)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
          }}>
            <div className="table-responsive-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }} className="ultraadmin-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Collector</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.map(ev => (
                    <tr key={ev.id}>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{ev.id}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{ev.name}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{ev.category}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{ev.collector}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{ev.organization_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--brand-border)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
          }}>
            <div className="table-responsive-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }} className="ultraadmin-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Timestamp</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>User</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Action</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Resource</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--brand-text-secondary)', borderBottom: '1px solid var(--brand-border)' }}>Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{log.user_email}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{log.action}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{log.resource || '-'}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{log.status}</td>
                      <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{log.organization_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .ultraadmin-container {
            padding: 16px !important;
          }
          .ultraadmin-table {
            font-size: 12px !important;
          }
          .ultraadmin-table th,
          .ultraadmin-table td {
            padding: 8px !important;
          }
        }
        @media (max-width: 560px) {
          .ultraadmin-tabs button {
            padding: 8px 12px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UltraAdmin;
