import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CATEGORIES = ['Technology','Design','Marketing','Finance','Healthcare','Education','Engineering','Sales','Legal','HR','Operations','Media'];

const JobForm = ({ initial, onSubmit, loading, title }) => {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSalary = (k, v) => setForm(f => ({ ...f, salary: { ...f.salary, [k]: v } }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  const skillsStr = (form.skills || []).join(', ');
  const reqStr = (form.requirements || []).join('\n');
  const resStr = (form.responsibilities || []).join('\n');
  const benStr = (form.benefits || []).join('\n');

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Basic Information</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Job Title *</label>
            <input className="form-control" placeholder="e.g. Senior React Developer" value={form.title || ''} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Company Name *</label>
            <input className="form-control" placeholder="Your company name" value={form.company || ''} onChange={e => set('company', e.target.value)} required />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Category *</label>
            <select className="form-control" value={form.category || ''} onChange={e => set('category', e.target.value)} required>
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Job Type *</label>
            <select className="form-control" value={form.type || 'full-time'} onChange={e => set('type', e.target.value)}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Location *</label>
            <input className="form-control" placeholder="e.g. New York, NY or Remote" value={form.location || ''} onChange={e => set('location', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Work Mode</label>
            <select className="form-control" value={form.locationType || 'onsite'} onChange={e => set('locationType', e.target.value)}>
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Experience Level</label>
            <select className="form-control" value={form.experience || 'mid'} onChange={e => set('experience', e.target.value)}>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="form-group">
            <label>Application Deadline</label>
            <input type="date" className="form-control" value={form.applicationDeadline ? form.applicationDeadline.slice(0,10) : ''} onChange={e => set('applicationDeadline', e.target.value)} />
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Salary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Min Salary</label>
            <input type="number" className="form-control" placeholder="50000" value={form.salary?.min || ''} onChange={e => setSalary('min', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max Salary</label>
            <input type="number" className="form-control" placeholder="80000" value={form.salary?.max || ''} onChange={e => setSalary('max', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Period</label>
            <select className="form-control" value={form.salary?.period || 'yearly'} onChange={e => setSalary('period', e.target.value)}>
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingBottom: '10px' }}>
              <input type="checkbox" checked={form.salary?.isNegotiable || false} onChange={e => setSalary('isNegotiable', e.target.checked)} />
              Negotiable
            </label>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Job Details</h3>
        <div className="form-group">
          <label>Job Description *</label>
          <textarea className="form-control" rows={6} placeholder="Describe the role, team, and company..." value={form.description || ''} onChange={e => set('description', e.target.value)} required />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Responsibilities (one per line)</label>
            <textarea className="form-control" rows={5} placeholder="• Lead development...&#10;• Collaborate with..." value={resStr} onChange={e => set('responsibilities', e.target.value.split('\n').filter(Boolean))} />
          </div>
          <div className="form-group">
            <label>Requirements (one per line)</label>
            <textarea className="form-control" rows={5} placeholder="5+ years experience...&#10;Proficient in..." value={reqStr} onChange={e => set('requirements', e.target.value.split('\n').filter(Boolean))} />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Benefits (one per line)</label>
            <textarea className="form-control" rows={4} placeholder="Health insurance&#10;401k&#10;Remote work" value={benStr} onChange={e => set('benefits', e.target.value.split('\n').filter(Boolean))} />
          </div>
          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <textarea className="form-control" rows={4} placeholder="React, Node.js, MongoDB..." value={skillsStr} onChange={e => set('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Visibility</h3>
        <div style={{ display: 'flex', gap: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured || false} onChange={e => set('featured', e.target.checked)} />
            ⭐ Featured Job
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.urgent || false} onChange={e => set('urgent', e.target.checked)} />
            🔥 Urgent Hiring
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Saving...' : title}</button>
        <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>Cancel</button>
      </div>
    </form>
  );
};

const BLANK = { title: '', company: '', category: '', type: 'full-time', location: '', locationType: 'onsite', experience: 'mid', description: '', requirements: [], responsibilities: [], benefits: [], skills: [], salary: { min: '', max: '', currency: 'USD', period: 'yearly', isNegotiable: false }, featured: false, urgent: false };

export const PostJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await axios.post('/api/jobs', form);
      toast.success('Job posted successfully!');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.headerTitle}>Post a New Job</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Fill in the details to attract the best candidates</p>
        </div>
      </div>
      <div className="container" style={{ paddingTop: '32px', maxWidth: '900px' }}>
        <div style={styles.formCard}>
          <JobForm initial={BLANK} onSubmit={handleSubmit} loading={loading} title="Post Job" />
        </div>
      </div>
    </div>
  );
};

export const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/jobs/${id}`).then(r => setJob(r.data)).catch(() => toast.error('Job not found'));
  }, [id]);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await axios.put(`/api/jobs/${id}`, form);
      toast.success('Job updated!');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.headerTitle}>Edit Job</h1>
        </div>
      </div>
      <div className="container" style={{ paddingTop: '32px', maxWidth: '900px' }}>
        <div style={styles.formCard}>
          <JobForm initial={job} onSubmit={handleSubmit} loading={loading} title="Update Job" />
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: { background: 'linear-gradient(135deg, #1a56db, #1e3a8a)', padding: '40px 0' },
  headerTitle: { fontFamily: 'Syne, sans-serif', fontSize: '32px', color: 'white', marginBottom: '6px' },
  formCard: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '16px', padding: '36px' },
  section: { marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #f3f4f6' },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: '18px', marginBottom: '20px', color: '#111827' },
};

export default PostJobPage;
