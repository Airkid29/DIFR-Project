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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      padding: '32px',
      fontFamily: 'Outfit, sans-serif',
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, Outfit, sans-serif',
            fontWeight: 800,
            fontSize: '40px',
            color: 'var(--brand-text-primary)',
            marginBottom: '8px'
          }}>
            Ultra Admin Dashboard
          </h1>
          <p style={{ color: 'var(--brand-text-secondary)', fontSize: '16px' }}>
            Complete platform overview and management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[
                { label: 'Total Users', value: stats.total_users, color: 'var(--brand-blue)' },
                { label: 'Total Incidents', value: stats.total_incidents, color: 'var(--brand-red)' },
                { label: 'Total Evidence', value: stats.total_evidence, color: 'var(--brand-purple)' },
                { label: 'Total Visitors', value: stats.total_visitors, color: 'var(--brand-emerald)' },
              ].map((stat, idx) => (
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--brand-border)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(12px)',
              }}>
                <h3 style={{ fontFamily: 'Space Grotesk, Outfit, sans-serif', fontWeight: 700, color: 'var(--brand-text-primary)', marginBottom: '16px' }}>
                  Incidents by Severity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(stats.incidents_by_severity || {}).map(([severity, count]) => (
                    <div key={severity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--brand-text-secondary)' }}>{severity}</span>
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
                  Users by Role
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(stats.users_by_role || {}).map(([role, count]) => (
                    <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--brand-text-secondary)' }}>{role}</span>
                      <span style={{ color: 'var(--brand-text-primary)', fontWeight: 700 }}>{count as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {(() => {
              // Group users by organization
              const groups: Record<string, any[]> = {};
              users.forEach(user => {
                const org = user.organization_name || 'Individual Users';
                if (!groups[org]) groups[org] = [];
                groups[org].push(user);
              });
              
              return Object.entries(groups).map(([org, orgUsers]) => (
                <div key={org} style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--brand-border)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(12px)',
                  overflowX: 'auto',
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
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                          <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{user.role}</td>
                          <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{user.account_type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ));
            })()}
          </div>
        )}

        {activeTab === 'incidents' && (
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--brand-border)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
            overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{incident.severity}</td>
                    <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{incident.status}</td>
                    <td style={{ padding: '12px', color: 'var(--brand-text-primary)', borderBottom: '1px solid var(--brand-border)' }}>{incident.organization_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--brand-border)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
            overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
        )}

        {activeTab === 'audit' && (
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--brand-border)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(12px)',
            overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
}

export default UltraAdmin;
