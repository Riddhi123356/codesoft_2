import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const ROLE_COLORS = {
  candidate: { bg: '#dbeafe', color: '#1d4ed8' },
  employer:  { bg: '#f3e8ff', color: '#7c3aed' },
  admin:     { bg: '#dcfce7', color: '#16a34a' },
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState({ users: 0, candidates: 0, employers: 0, jobs: 0, activeJobs: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');

  // Load stats
  useEffect(() => {
    Promise.all([
      axios.get('/api/users'),
      axios.get('/api/jobs/employer/my-jobs').catch(() => ({ data: [] })),
    ]).then(([usersRes, jobsRes]) => {
      const allUsers = usersRes.data.users || [];
      setStats({
        users: usersRes.data.total || allUsers.length,
        candidates: allUsers.filter(u => u.role === 'candidate').length,
        employers: allUsers.filter(u => u.role === 'employer').length,
        jobs: Array.isArray(jobsRes.data) ? jobsRes.data.length : 0,
        activeJobs: Array.isArray(jobsRes.data) ? jobsRes.data.filter(j => j.status === 'active').length : 0,
      });
    }).catch(() => {});
  }, []);

  // Load all users
  const loadUsers = async (role = '') => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get('/api/users', { params: role ? { role } : {} });
      setUsers(data.users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoadingUsers(false); }
  };

  // Load all jobs
  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const { data } = await axios.get('/api/jobs', { params: { limit: 50 } });
      setJobs(data.jobs || []);
      setStats(s => ({ ...s, jobs: data.total, activeJobs: (data.jobs || []).filter(j => j.status === 'active').length }));
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoadingJobs(false); }
  };
 
   useEffect(() => {
    if (tab === 'users') loadUsers(roleFilter);
    if (tab === 'jobs') loadJobs();
  }, [tab, roleFilter]);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { data } = await axios.put(`/api/users/${userId}/status`, { isActive: !currentStatus });
      setUsers(u => u.map(x => x._id === userId ? { ...x, isActive: data.isActive } : x));
      toast.success(`User ${data.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const { data } = await axios.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(u => u.map(x => x._id === userId ? { ...x, role: data.role } : x));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      await axios.put(`/api/jobs/${jobId}`, { status: newStatus });
      setJobs(j => j.map(x => x._id === jobId ? { ...x, status: newStatus } : x));
      toast.success('Job status updated');
    } catch { toast.error('Failed to update job'); }
  };

  const toggleFeatured = async (jobId, current) => {
    try {
      await axios.put(`/api/jobs/${jobId}`, { featured: !current });
      setJobs(j => j.map(x => x._id === jobId ? { ...x, featured: !current } : x));
      toast.success(`Job ${!current ? 'featured' : 'unfeatured'}`);
    } catch { toast.error('Failed to update'); }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs(j => j.filter(x => x._id !== jobId));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.headerTitle}>👑 Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Manage users, jobs, and platform settings</p>

          {/* Stats */}
          <div style={styles.statsRow}>
            {[
              { label: 'Total Users', value: stats.users, icon: '👥' },
              { label: 'Candidates', value: stats.candidates, icon: '🎓' },
              { label: 'Employers', value: stats.employers, icon: '🏢' },
              { label: 'Active Jobs', value: stats.activeJobs, icon: '💼' },
            ].map(s => (
              <div key={s.label} style={styles.statCard}>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Syne' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: 'stats', label: '📊 Overview' },
            { key: 'users', label: '👥 Users' },
            { key: 'jobs', label: '💼 Jobs' },
          ].map(t => (
            <button key={t.key}
              style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'stats' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Platform Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { label: 'Total Users', value: stats.users, icon: '👥', color: '#dbeafe', textColor: '#1d4ed8' },
                { label: 'Candidates', value: stats.candidates, icon: '🎓', color: '#f3e8ff', textColor: '#7c3aed' },
                { label: 'Employers', value: stats.employers, icon: '🏢', color: '#fef3c7', textColor: '#d97706' },
                { label: 'Total Jobs', value: stats.jobs, icon: '📋', color: '#dcfce7', textColor: '#16a34a' },
                { label: 'Active Jobs', value: stats.activeJobs, icon: '✅', color: '#cffafe', textColor: '#0891b2' },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Syne', color: s.textColor }}>{s.value}</div>
                  <div style={{ fontSize: '14px', color: s.textColor, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => setTab('users')}>Manage Users →</button>
              <button className="btn btn-outline" onClick={() => setTab('jobs')}>Manage Jobs →</button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={styles.cardTitle}>All Users ({users.length})</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['', 'candidate', 'employer'].map(r => (
                  <button key={r}
                    onClick={() => setRoleFilter(r)}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      borderColor: roleFilter === r ? '#1a56db' : '#e5e7eb',
                      background: roleFilter === r ? '#1a56db' : 'white',
                      color: roleFilter === r ? 'white' : '#374151' }}>
                    {r === '' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loadingUsers ? <div className="loading"><div className="spinner" /></div> : users.length === 0 ? (
              <div className="empty-state"><p>No users found</p></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Joined</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', overflow: 'hidden', flexShrink: 0 }}>
                              {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '14px' }}>{u.name}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <select value={u.role} onChange={e => changeUserRole(u._id, e.target.value)}
                            style={{ ...styles.selectSm, background: ROLE_COLORS[u.role]?.bg, color: ROLE_COLORS[u.role]?.color }}>
                            <option value="candidate">Candidate</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ ...styles.td, fontSize: '13px', color: '#6b7280' }}>{u.location || '—'}</td>
                        <td style={{ ...styles.td, fontSize: '13px', color: '#6b7280' }}>
                          {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: u.isActive ? '#dcfce7' : '#fee2e2', color: u.isActive ? '#16a34a' : '#dc2626' }}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => toggleUserStatus(u._id, u.isActive)}
                            style={{ padding: '4px 12px', borderRadius: '6px', border: '1.5px solid', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                              background: u.isActive ? '#fee2e2' : '#dcfce7',
                              color: u.isActive ? '#dc2626' : '#16a34a',
                              borderColor: u.isActive ? '#dc2626' : '#16a34a' }}>
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {tab === 'jobs' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>All Jobs ({jobs.length})</h2>
            {loadingJobs ? <div className="loading"><div className="spinner" /></div> : jobs.length === 0 ? (
              <div className="empty-state"><p>No jobs found</p></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Job Title</th>
                      <th style={styles.th}>Company</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Featured</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Posted</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job._id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{job.title}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{job.location}</div>
                        </td>
                        <td style={{ ...styles.td, fontSize: '13px' }}>{job.company}</td>
                        <td style={{ ...styles.td, fontSize: '13px' }}>{job.category}</td>
                        <td style={styles.td}>
                          <button onClick={() => toggleFeatured(job._id, job.featured)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                            {job.featured ? '⭐' : '☆'}
                          </button>
                        </td>
                        <td style={styles.td}>
                          <select value={job.status} onChange={e => updateJobStatus(job._id, e.target.value)}
                            style={{ ...styles.selectSm,
                              background: job.status === 'active' ? '#dcfce7' : job.status === 'closed' ? '#fee2e2' : '#f3f4f6',
                              color: job.status === 'active' ? '#16a34a' : job.status === 'closed' ? '#dc2626' : '#6b7280' }}>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                            <option value="draft">Draft</option>
                          </select>
                        </td>
                        <td style={{ ...styles.td, fontSize: '13px', color: '#6b7280' }}>
                          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => deleteJob(job._id)}
                            style={{ padding: '4px 12px', borderRadius: '6px', border: '1.5px solid #dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: '#fee2e2', color: '#dc2626' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: { background: 'linear-gradient(135deg, #1a56db, #1e3a8a)', padding: '40px 0 0' },
  headerTitle: { fontFamily: 'Syne, sans-serif', fontSize: '30px', color: 'white', marginBottom: '4px' },
  statsRow: { display: 'flex', gap: '16px', marginTop: '28px', overflowX: 'auto' },
  statCard: { background: 'rgba(255,255,255,0.12)', borderRadius: '14px', padding: '20px 28px', color: 'white', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', border: '1px solid rgba(255,255,255,0.15)' },
  tabs: { display: 'flex', gap: '4px', background: 'white', borderRadius: '12px', padding: '4px', border: '1.5px solid #e5e7eb', marginBottom: '20px', width: 'fit-content' },
  tab: { padding: '8px 20px', border: 'none', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '14px', color: '#6b7280', transition: 'all 0.2s' },
  tabActive: { background: '#1a56db', color: 'white', fontWeight: 600 },
  card: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '16px', padding: '28px' },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px', marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tableHead: { background: '#f9fafb' },
  tableRow: { borderBottom: '1px solid #f3f4f6' },
  th: { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#374151' },
  td: { padding: '12px 16px', verticalAlign: 'middle' },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 },
  selectSm: { border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '4px 8px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 },
};

export default AdminDashboard;