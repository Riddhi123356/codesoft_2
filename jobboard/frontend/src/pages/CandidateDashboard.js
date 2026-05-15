import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const CandidateDashboard = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', phone: user?.phone || '', location: user?.location || '', bio: user?.bio || '',
    skills: (user?.skills || []).join(', '),
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);


  useEffect(() => {
    Promise.all([
      axios.get('/api/applications/my-applications'),
      axios.get('/api/users/saved-jobs'),
    ]).then(([appsRes, savedRes]) => {
      setApplications(appsRes.data);
      setSavedJobs(savedRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const withdrawApplication = async (appId) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await axios.delete(`/api/applications/${appId}`);
      setApplications(a => a.filter(x => x._id !== appId));
      toast.success('Application withdrawn');
    } catch { toast.error('Failed to withdraw'); }
  };

  const unsaveJob = async (jobId) => {
    try {
      await axios.post(`/api/users/save-job/${jobId}`);
      setSavedJobs(j => j.filter(x => x._id !== jobId));
      toast.success('Job removed from saved');
    } catch {}
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const form = new FormData();
      form.append('name', profileForm.name);
      form.append('phone', profileForm.phone);
      form.append('location', profileForm.location);
      form.append('bio', profileForm.bio);
      form.append('skills', profileForm.skills);
      if (resumeFile) form.append('resume', resumeFile);
      if (avatarFile) form.append('avatar', avatarFile);
      const { data } = await axios.put('/api/users/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save'); }
    finally { setSavingProfile(false); }
  };

  const pending = applications.filter(a => a.status === 'pending').length;
  const shortlisted = applications.filter(a => ['shortlisted', 'interview', 'offered'].includes(a.status)).length;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={styles.header}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ ...styles.avatar, overflow: 'hidden' }}>
              {avatarPreview || user?.avatar
                   ? <img src={avatarPreview || user?.avatar} alt="preview"
                   style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  : user?.name?.[0]?.toUpperCase()
                  }
               </div>
            <div>
              <h1 style={styles.headerTitle}>{user?.name}</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>{user?.location || 'Location not set'} • {user?.email}</p>
            </div>
          </div>
          <div style={styles.statsRow}>
            {[
              { label: 'Applied', value: applications.length, icon: '📋' },
              { label: 'Pending', value: pending, icon: '⏳' },
              { label: 'Shortlisted', value: shortlisted, icon: '⭐' },
              { label: 'Saved Jobs', value: savedJobs.length, icon: '🔖' },
            ].map(s => (
              <div key={s.label} style={styles.statCard}>
                <span style={{ fontSize: '22px' }}>{s.icon}</span>
                <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Syne' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        <div style={styles.tabs}>
          {['applications', 'saved', 'profile'].map(t => (
            <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }} onClick={() => setTab(t)}>
              {t === 'applications' ? '📋 My Applications' : t === 'saved' ? '🔖 Saved Jobs' : '👤 My Profile'}
            </button>
          ))}
        </div>

        {tab === 'applications' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>My Applications ({applications.length})</h2>
            {loading ? <div className="loading"><div className="spinner" /></div> : applications.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '48px' }}>📋</div>
                <h3>No applications yet</h3>
                <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Jobs</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {applications.map(app => (
                  <div key={app._id} style={styles.appCard}>
                    <div style={styles.appRow}>
                      <div style={styles.companyLogo}>{app.job?.company?.[0]?.toUpperCase()}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/jobs/${app.job?._id}`} style={{ fontWeight: 700, fontSize: '16px', color: '#111827', textDecoration: 'none' }}>{app.job?.title}</Link>
                        <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '3px' }}>
                          {app.job?.company} • {app.job?.location}
                          {app.job?.salary?.min && ` • $${app.job.salary.min.toLocaleString()}–$${app.job.salary.max?.toLocaleString()}`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span style={{ ...styles.statusBadge, background: STATUS_COLORS[app.status]?.bg, color: STATUS_COLORS[app.status]?.color }}>{app.status}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    {!['rejected','withdrawn'].includes(app.status) && (
                      <button onClick={() => withdrawApplication(app._id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', marginTop: '8px', fontWeight: 500 }}>
                        Withdraw Application
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Saved Jobs ({savedJobs.length})</h2>
            {savedJobs.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '48px' }}>🔖</div>
                <h3>No saved jobs</h3>
                <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Jobs</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {savedJobs.map(job => (
                  <div key={job._id} style={styles.appCard}>
                    <div style={styles.appRow}>
                      <div style={styles.companyLogo}>{job.company?.[0]?.toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <Link to={`/jobs/${job._id}`} style={{ fontWeight: 700, fontSize: '16px', color: '#111827', textDecoration: 'none' }}>{job.title}</Link>
                        <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '3px' }}>{job.company} • {job.location}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">Apply</Link>
                        <button onClick={() => unsaveJob(job._id)} className="btn btn-outline btn-sm">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>My Profile</h2>
            <form onSubmit={saveProfile}>
              <div className="grid-2">
                {/* Avatar Upload */}
<div style={{ textAlign: 'center', marginBottom: '28px' }}>
  <div style={{ position: 'relative', width: '100px', margin: '0 auto 10px' }}>
    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 700, color: 'white', overflow: 'hidden', border: '3px solid #e5e7eb' }}>
      {avatarPreview || user?.avatar
        ? <img src={avatarPreview || user?.avatar} alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : user?.name?.[0]?.toUpperCase()
      }
    </div>
    <label style={{ position: 'absolute', bottom: 0, right: 0, background: '#1a56db', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', border: '2px solid white' }}>
      📷
      <input type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files[0];
          if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
              }
                }}
                />
               </label>
               </div>
               <p style={{ fontSize: '12px', color: '#9ca3af' }}>📷 click karo photo change karva</p>
              </div>
                <div className="form-group"><label>Full Name</label><input className="form-control" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="form-group"><label>Phone</label><input className="form-control" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="form-group"><label>Location</label><input className="form-control" placeholder="City, Country" value={profileForm.location} onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label>Bio</label><textarea className="form-control" rows={3} placeholder="Tell employers about yourself..." value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} /></div>
              <div className="form-group"><label>Skills (comma separated)</label><input className="form-control" placeholder="React, Node.js, Python..." value={profileForm.skills} onChange={e => setProfileForm(f => ({ ...f, skills: e.target.value }))} /></div>
              <div className="form-group">
                <label>Resume (PDF, DOC, DOCX)</label>
                <input type="file" accept=".pdf,.doc,.docx" className="form-control" onChange={e => setResumeFile(e.target.files[0])} />
                {user?.resume && <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Current: <a href={user.resume} target="_blank" rel="noreferrer" style={{ color: '#1a56db' }}>View Resume</a></p>}
              </div>
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
  headerTitle: { fontFamily: 'Syne, sans-serif', fontSize: '28px', color: 'white', marginBottom: '4px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 700, color: 'white' },
  statsRow: { display: 'flex', gap: '12px', marginTop: '24px', overflowX: 'auto' },
  statCard: { background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '16px 24px', color: 'white', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '130px', border: '1px solid rgba(255,255,255,0.15)' },
  tabs: { display: 'flex', gap: '4px', background: 'white', borderRadius: '12px', padding: '4px', border: '1.5px solid #e5e7eb', marginBottom: '20px', width: 'fit-content' },
  tab: { padding: '8px 18px', border: 'none', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '14px', color: '#6b7280', transition: 'all 0.2s' },
  tabActive: { background: '#1a56db', color: 'white', fontWeight: 600 },
  card: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '16px', padding: '28px' },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px', marginBottom: '24px' },
  appCard: { border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '18px' },
  appRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  companyLogo: { width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, flexShrink: 0 },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' },
};

export default CandidateDashboard;
