import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#d97706' },
  reviewing: { bg: '#dbeafe', color: '#1d4ed8' },
  shortlisted: { bg: '#f3e8ff', color: '#7c3aed' },
  interview: { bg: '#cffafe', color: '#0891b2' },
  offered: { bg: '#dcfce7', color: '#16a34a' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
  withdrawn: { bg: '#f3f4f6', color: '#6b7280' },
};

const EmployerDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', bio: user?.bio || '', company: { name: user?.company?.name || '', website: user?.company?.website || '', industry: user?.company?.industry || '', size: user?.company?.size || '', description: user?.company?.description || '' } });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    axios.get('/api/jobs/employer/my-jobs')
      .then(r => setJobs(r.data))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));
  }, []);

  const loadApplications = async (jobId) => {
    setLoadingApps(true);
    setSelectedJob(jobId);
    setTab('applications');
    try {
      const { data } = await axios.get(`/api/applications/job/${jobId}`);
      setApplications(data);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoadingApps(false); }
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.put(`/api/applications/${appId}/status`, { status });
      setApplications(apps => apps.map(a => a._id === appId ? { ...a, status } : a));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const updateJobStatus = async (jobId, newStatus) => {
  try {
    await axios.put(`/api/jobs/${jobId}`, { status: newStatus });
    setJobs(jobs => jobs.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
    toast.success('Job status updated!');
  } catch {
    toast.error('Failed to update status');
  }
};

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs(j => j.filter(x => x._id !== jobId));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await axios.put('/api/users/profile', profileForm);
      updateUser(data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save'); }
    finally { setSavingProfile(false); }
  };

  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={styles.header}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={styles.headerTitle}>Employer Dashboard</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Welcome back, {user?.name}!</p>
            </div>
            <Link to="/employer/post-job" className="btn btn-secondary">+ Post New Job</Link>
          </div>
          <div style={styles.statsRow}>
            {[
              { label: 'Total Jobs', value: jobs.length, icon: '💼' },
              { label: 'Active Jobs', value: activeJobs, icon: '✅' },
              { label: 'Total Applications', value: totalApps, icon: '📋' },
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
        <div style={styles.tabs}>
          {['jobs', 'applications', 'profile'].map(t => (
            <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }} onClick={() => setTab(t)}>
              {t === 'jobs' ? '💼 My Jobs' : t === 'applications' ? '📋 Applications' : '⚙️ Profile'}
            </button>
          ))}
        </div>

        {tab === 'jobs' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>My Job Postings ({jobs.length})</h2>
            {loadingJobs ? <div className="loading"><div className="spinner" /></div> : jobs.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '48px' }}>💼</div>
                <h3>No jobs posted yet</h3>
                <Link to="/employer/post-job" className="btn btn-primary" style={{ marginTop: '16px' }}>Post Your First Job</Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th>Job Title</th><th>Category</th><th>Type</th><th>Applications</th><th>Status</th><th>Posted</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job._id} style={styles.tableRow}>
                        <td><div style={{ fontWeight: 600 }}>{job.title}</div><div style={{ fontSize: '12px', color: '#6b7280' }}>{job.location}</div></td>
                        <td>{job.category}</td>
                        <td><span style={{ textTransform: 'capitalize', fontSize: '13px' }}>{job.type?.replace('-',' ')}</span></td>
                        <td>
                          <button onClick={() => loadApplications(job._id)} style={{ background: 'none', border: 'none', color: '#1a56db', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                            {job.applicationCount || 0} →
                          </button>
                        </td>
                        <td>
                         <select
                         value={job.status}
                         onChange={e => updateJobStatus(job._id, e.target.value)}
                         style={{
                         border: '1.5px solid #e5e7eb',
                         borderRadius: '8px',
                         padding: '4px 8px',
                         fontSize: '13px',
                         cursor: 'pointer',
                         background: job.status === 'active' ? '#dcfce7' : job.status === 'closed' ? '#fee2e2' : '#f3f4f6',
                        color: job.status === 'active' ? '#16a34a' : job.status === 'closed' ? '#dc2626' : '#6b7280',
                        fontWeight: 600,
                     }}
  >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                      </select>
                      </td>
                        <td style={{ fontSize: '13px', color: '#6b7280' }}>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to={`/employer/edit-job/${job._id}`} style={{ ...styles.actionBtn, color: '#1a56db' }}>Edit</Link>
                            <button onClick={() => deleteJob(job._id)} style={{ ...styles.actionBtn, color: '#ef4444' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'applications' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={styles.cardTitle}>Applications {applications.length > 0 && `(${applications.length})`}</h2>
              {selectedJob && <button onClick={() => setTab('jobs')} style={{ background: 'none', border: 'none', color: '#1a56db', cursor: 'pointer', fontSize: '14px' }}>← Back to Jobs</button>}
            </div>
            {!selectedJob ? (
              <div className="empty-state"><p>Select a job from "My Jobs" to view its applications.</p></div>
            ) : loadingApps ? (
              <div className="loading"><div className="spinner" /></div>
            ) : applications.length === 0 ? (
              <div className="empty-state"><div style={{ fontSize: '40px' }}>📭</div><h3>No applications yet</h3></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {applications.map(app => (
                  <div key={app._id} style={styles.appCard}>
                    <div style={styles.appHeader}>
                      <div style={styles.appAvatar}>{app.candidate?.name?.[0]?.toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>{app.candidate?.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '13px' }}>{app.candidate?.email} • {app.candidate?.location}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ ...styles.statusBadge, background: STATUS_COLORS[app.status]?.bg, color: STATUS_COLORS[app.status]?.color }}>{app.status}</span>
                        <select value={app.status} onChange={e => updateStatus(app._id, e.target.value)} style={styles.statusSelect}>
                          {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    {app.candidate?.skills?.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0' }}>
                        {app.candidate.skills.map(s => <span key={s} style={styles.skill}>{s}</span>)}
                      </div>
                    )}
                    {app.coverLetter && <p style={{ fontSize: '14px', color: '#374151', background: '#f9fafb', padding: '12px', borderRadius: '8px', marginTop: '8px', lineHeight: 1.6 }}>{app.coverLetter}</p>}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                      {app.resume && <a href={app.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">📄 View Resume</a>}
                      <span style={{ fontSize: '12px', color: '#9ca3af', alignSelf: 'center' }}>Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Company Profile</h2>
            <form onSubmit={saveProfile}>
              <h3 style={styles.subHead}>Personal Info</h3>
              <div className="grid-2">
                <div className="form-group"><label>Full Name</label><input className="form-control" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="form-group"><label>Phone</label><input className="form-control" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="form-group"><label>Location</label><input className="form-control" value={profileForm.location} onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label>Bio</label><textarea className="form-control" rows={3} value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} /></div>
              <hr className="divider" />
              <h3 style={styles.subHead}>Company Info</h3>
              <div className="grid-2">
                <div className="form-group"><label>Company Name</label><input className="form-control" value={profileForm.company.name} onChange={e => setProfileForm(f => ({ ...f, company: { ...f.company, name: e.target.value } }))} /></div>
                <div className="form-group"><label>Website</label><input className="form-control" placeholder="https://" value={profileForm.company.website} onChange={e => setProfileForm(f => ({ ...f, company: { ...f.company, website: e.target.value } }))} /></div>
                <div className="form-group"><label>Industry</label><input className="form-control" value={profileForm.company.industry} onChange={e => setProfileForm(f => ({ ...f, company: { ...f.company, industry: e.target.value } }))} /></div>
                <div className="form-group"><label>Company Size</label>
                  <select className="form-control" value={profileForm.company.size} onChange={e => setProfileForm(f => ({ ...f, company: { ...f.company, size: e.target.value } }))}>
                    <option value="">Select size</option>
                    {['1-10','11-50','51-200','201-500','501-1000','1000+'].map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Company Description</label><textarea className="form-control" rows={4} value={profileForm.company.description} onChange={e => setProfileForm(f => ({ ...f, company: { ...f.company, description: e.target.value } }))} /></div>
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Profile'}</button>
            </form>
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
  subHead: { fontFamily: 'Syne, sans-serif', fontSize: '16px', marginBottom: '16px', color: '#374151' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tableHead: { background: '#f9fafb' },
  tableRow: { borderBottom: '1px solid #f3f4f6' },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', textDecoration: 'none' },
  appCard: { border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '20px' },
  appHeader: { display: 'flex', alignItems: 'center', gap: '14px' },
  appAvatar: { width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', flexShrink: 0 },
  statusSelect: { border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '4px 8px', fontSize: '13px', cursor: 'pointer', background: 'white' },
  skill: { background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 },
};

export default EmployerDashboard;
