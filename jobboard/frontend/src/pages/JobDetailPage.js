import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then(r => setJob(r.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
    if (user?.role === 'candidate') {
      axios.get('/api/applications/my-applications')
        .then(r => setAlreadyApplied(r.data.some(a => a.job?._id === id)))
        .catch(() => {});
        axios.get('/api/users/saved-jobs')
        .then(r => setSaved(r.data.some(j => j._id === id)))
    .   catch(() => {});
  }
  }, [id, user]);

  const handleSave = async () => {
  if (!user) { navigate('/login'); return; }
  try {
    await axios.post(`/api/users/save-job/${id}`);
    setSaved(s => !s);
    toast.success(saved ? 'Job removed from saved' : 'Job saved!');
  } catch { toast.error('Failed to save job'); }
};

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      const form = new FormData();
      form.append('jobId', id);
      form.append('coverLetter', coverLetter);
      if (resumeFile) form.append('resume', resumeFile);
      await axios.post('/api/applications', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted successfully!');
      setAlreadyApplied(true);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!job) return <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}><h2>Job not found</h2><Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Jobs</Link></div>;

  const salaryStr = job.salary?.min && job.salary?.max
    ? `$${job.salary.min.toLocaleString()} – $${job.salary.max.toLocaleString()} / ${job.salary.period}`
    : job.salary?.isNegotiable ? 'Negotiable' : null;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={styles.header}>
        <div className="container">
          <Link to="/jobs" style={styles.back}>← Back to Jobs</Link>
          <div style={styles.headerContent}>
            <div style={styles.companyLogoWrap}>
              {job.companyLogo
                ? <img src={job.companyLogo} alt={job.company} style={styles.companyLogo} />
                : <div style={styles.companyLogoPlaceholder}>{job.company?.[0]?.toUpperCase()}</div>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {job.featured && <span className="badge badge-yellow">⭐ Featured</span>}
                {job.urgent && <span className="badge badge-red">🔥 Urgent</span>}
                <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{job.type?.replace('-', ' ')}</span>
                {job.locationType === 'remote' && <span className="badge badge-green">Remote</span>}
              </div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '30px', color: 'white', marginBottom: '6px' }}>{job.title}</h1>
              <div style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '15px' }}>
                <span>🏢 {job.company}</span>
                <span>📍 {job.location}</span>
                {salaryStr && <span>💰 {salaryStr}</span>}
                <span>⏰ Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
             <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
              {user?.role === 'candidate' ? (
                alreadyApplied ? (
                  <button className="btn" style={{ background: '#16a34a', color: 'white', cursor: 'default' }}>✓ Applied</button>
                ) : (
                  <button className="btn btn-secondary btn-lg" onClick={() => setShowForm(true)}>Apply Now</button>
                )
              ) : !user ? (
                <Link to="/login" className="btn btn-secondary btn-lg">Apply Now</Link>
              ) : null}
               {/* Save button */}
              {user?.role === 'candidate' && (
              <button onClick={handleSave}
              style={{ background: saved ? '#fef3c7' : 'rgba(255,255,255,0.15)', color: saved ? '#d97706' : 'white', border: '1.5px solid', borderColor: saved ? '#d97706' : 'rgba(255,255,255,0.4)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              {saved ? '🔖 Saved' : '🔖 Save Job'}
              </button>
             )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px' }}>
        <div style={styles.layout}>
          <main style={{ flex: 1, minWidth: 0 }}>
            {showForm && (
              <div style={styles.applyCard}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', marginBottom: '20px' }}>Submit Application</h3>
                <form onSubmit={handleApply}>
                  <div className="form-group">
                    <label>Cover Letter</label>
                    <textarea className="form-control" rows={5} placeholder="Tell the employer why you're a great fit..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Resume (PDF, DOC, DOCX – max 5MB)</label>
                    <input type="file" accept=".pdf,.doc,.docx" className="form-control" onChange={e => setResumeFile(e.target.files[0])} />
                    {user?.resume && !resumeFile && <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Using your profile resume. Upload new to override.</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={applying}>{applying ? 'Submitting...' : 'Submit Application'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div style={styles.contentCard}>
              <h2 style={styles.sectionHead}>Job Description</h2>
              <p style={styles.desc}>{job.description}</p>

              {job.responsibilities?.length > 0 && (
                <>
                  <h3 style={styles.subHead}>Responsibilities</h3>
                  <ul style={styles.list}>{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </>
              )}

              {job.requirements?.length > 0 && (
                <>
                  <h3 style={styles.subHead}>Requirements</h3>
                  <ul style={styles.list}>{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </>
              )}

              {job.benefits?.length > 0 && (
                <>
                  <h3 style={styles.subHead}>Benefits</h3>
                  <div style={styles.benefitsGrid}>
                    {job.benefits.map((b, i) => <div key={i} style={styles.benefit}>✅ {b}</div>)}
                  </div>
                </>
              )}

              {job.skills?.length > 0 && (
                <>
                  <h3 style={styles.subHead}>Required Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {job.skills.map(s => <span key={s} style={styles.skillTag}>{s}</span>)}
                  </div>
                </>
              )}
            </div>
          </main>

          <aside style={styles.sidebar}>
            <div style={styles.infoCard}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', marginBottom: '20px' }}>Job Overview</h3>
              <div style={styles.infoRow}><span style={styles.infoLabel}>📅 Posted</span><span>{format(new Date(job.createdAt), 'MMM dd, yyyy')}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>💼 Job Type</span><span style={{ textTransform: 'capitalize' }}>{job.type?.replace('-', ' ')}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>📍 Location</span><span>{job.location}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>🏠 Work Mode</span><span style={{ textTransform: 'capitalize' }}>{job.locationType}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>⭐ Experience</span><span style={{ textTransform: 'capitalize' }}>{job.experience} Level</span></div>
              {salaryStr && <div style={styles.infoRow}><span style={styles.infoLabel}>💰 Salary</span><span>{salaryStr}</span></div>}
              <div style={styles.infoRow}><span style={styles.infoLabel}>📊 Category</span><span>{job.category}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>👥 Applications</span><span>{job.applicationCount}</span></div>
              {job.applicationDeadline && <div style={styles.infoRow}><span style={styles.infoLabel}>⏰ Deadline</span><span>{format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}</span></div>}
            </div>

            <div style={styles.infoCard}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', marginBottom: '16px' }}>About the Company</h3>
              <div style={styles.companyMini}>
                <div style={styles.companyLogoPlaceholderSm}>{job.company?.[0]?.toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{job.company}</div>
                  {job.employer?.company?.industry && <div style={{ fontSize: '13px', color: '#6b7280' }}>{job.employer.company.industry}</div>}
                </div>
              </div>
              {job.employer?.company?.description && <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px', lineHeight: 1.6 }}>{job.employer.company.description}</p>}
              {job.employer?.company?.website && <a href={job.employer.company.website} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px', color: '#1a56db', fontSize: '14px', fontWeight: 500 }}>Visit Website →</a>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: { background: 'linear-gradient(135deg, #1a56db, #1e3a8a)', padding: '24px 0 32px' },
  back: { display: 'inline-block', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '20px', textDecoration: 'none' },
  headerContent: { display: 'flex', alignItems: 'flex-start', gap: '20px' },
  companyLogoWrap: { flexShrink: 0 },
  companyLogo: { width: '72px', height: '72px', borderRadius: '14px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' },
  companyLogoPlaceholder: { width: '72px', height: '72px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, border: '2px solid rgba(255,255,255,0.2)' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' },
  applyCard: { background: 'white', border: '1.5px solid #1a56db', borderRadius: '14px', padding: '28px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(26,86,219,0.1)' },
  contentCard: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '28px' },
  sectionHead: { fontFamily: 'Syne, sans-serif', fontSize: '22px', marginBottom: '16px', color: '#111827' },
  subHead: { fontFamily: 'Syne, sans-serif', fontSize: '18px', margin: '24px 0 12px', color: '#111827' },
  desc: { color: '#374151', lineHeight: 1.8, fontSize: '15px', whiteSpace: 'pre-line' },
  list: { paddingLeft: '20px', color: '#374151', lineHeight: 2, fontSize: '15px' },
  benefitsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  benefit: { padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px', fontSize: '14px', color: '#374151' },
  skillTag: { background: '#eff6ff', color: '#1d4ed8', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500 },
  sidebar: { position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' },
  infoCard: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '24px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f3f4f6', fontSize: '14px' },
  infoLabel: { color: '#6b7280', fontWeight: 500 },
  companyMini: { display: 'flex', alignItems: 'center', gap: '12px' },
  companyLogoPlaceholderSm: { width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 },
};

export default JobDetailPage;
