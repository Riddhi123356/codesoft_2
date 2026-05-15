import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const CATEGORIES = [
  { name: 'Technology', icon: '💻' }, { name: 'Design', icon: '🎨' },
  { name: 'Marketing', icon: '📣' }, { name: 'Finance', icon: '💰' },
  { name: 'Healthcare', icon: '🏥' }, { name: 'Education', icon: '📚' },
  { name: 'Engineering', icon: '⚙️' }, { name: 'Sales', icon: '📈' },
];

const STATS = [
  { value: '4,536+', label: 'Jobs Listed' },
  { value: '1,200+', label: 'Companies' },
  { value: '98K+', label: 'Job Seekers' },
  { value: '87%', label: 'Placement Rate' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestJob, setLatestJob] = useState(null);

  useEffect(() => {
    axios.get('/api/jobs/featured')
      .then(r => {
        setFeaturedJobs(r.data);
        if (r.data && r.data.length > 0) {
          setLatestJob(r.data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div className="container" style={styles.heroContainer}>

          <div style={styles.heroContent}>
            <div style={styles.heroBadge}>✨ {STATS[0].value} Jobs listed</div>
            <h1 style={styles.heroTitle}>
              Find your <span style={{ color: '#22c55e' }}>Dream Job</span>
            </h1>
            <p style={styles.heroSub}>
              We connect top talent with the world's best companies. Your next career move starts here.
            </p>
            <div style={styles.btns}>
              <Link to="/jobs" className="btn btn-secondary btn-lg">Browse All Jobs</Link>
              <Link to="/register?role=employer" className="btn btn-ghost btn-lg">Post a Job →</Link>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.illustrationBox}>
              <div style={styles.mockBar}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <div style={{ height: 10, borderRadius: 6, background: '#ffffff30', width: '60%', marginBottom: 10 }} />
              <div style={{ height: 10, borderRadius: 6, background: '#ffffff20', width: '80%', marginBottom: 10 }} />
              <div style={{ height: 10, borderRadius: 6, background: '#ffffff20', width: '50%', marginBottom: 10 }} />
              <div style={styles.barsRow}>
                {[50, 70, 90, 60, 80, 100].map((h, i) => (
                  <div key={i} style={{ ...styles.bar, height: h, opacity: 0.4 + i * 0.1 }} />
                ))}
              </div>

              {latestJob ? (
                <div style={styles.floatingCard}>
                  <div style={{ fontSize: '24px' }}>💼</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'white', marginBottom: 2 }}>
                      New Job Match!
                    </div>
                    <div style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {latestJob.title} — {typeof latestJob.company === 'object' ? latestJob.company?.name : latestJob.company}
                    </div>
                  </div>
                  <div style={styles.cardBadge}>New</div>
                </div>
              ) : (
                <div style={styles.floatingCardEmpty}>
                  <div style={{ fontSize: '20px' }}>🔍</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
                    No jobs posted yet
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      <section style={styles.searchSection}>
        <div className="container">
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchField}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Job title, keywords..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>
            <div style={styles.searchDivider} />
            <div style={styles.searchField}>
              <span style={styles.searchIcon}>📍</span>
              <input
                style={styles.searchInput}
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div style={styles.searchDivider} />
            <div style={styles.searchField}>
              <span style={styles.searchIcon}>📂</span>
              <select
                style={{ ...styles.searchInput, cursor: 'pointer' }}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px 28px', borderRadius: '8px', fontSize: '15px', flexShrink: 0 }}
            >
              Find Job
            </button>
          </form>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div className="container">
          <div style={styles.statsGrid}>
            {STATS.map(s => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f9fafb' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="section-title">Browse by <span style={{ color: '#1a56db' }}>Category</span></h2>
            <p className="section-subtitle">Find jobs in the field you're passionate about</p>
          </div>
          <div style={styles.catGrid}>
            {CATEGORIES.map(c => (
              <button
                key={c.name}
                style={styles.catCard}
                onClick={() => navigate(`/jobs?category=${c.name}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#1a56db';
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = 'white';
                }}
              >
                <span style={styles.catIcon}>{c.icon}</span>
                <span style={styles.catName}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 className="section-title">Featured <span style={{ color: '#1a56db' }}>Jobs</span></h2>
              <p className="section-subtitle">Handpicked opportunities from top companies</p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm">View All →</Link>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : featuredJobs.length > 0 ? (
            <div style={styles.jobsGrid}>
              {featuredJobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
          ) : (
            <div className="empty-state"><p>No featured jobs yet. Check back soon!</p></div>
          )}
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', color: 'white', marginBottom: '12px' }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', fontSize: '18px' }}>
            Join thousands of professionals finding their dream jobs today.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=candidate" className="btn btn-secondary btn-lg">Find a Job</Link>
            <Link to="/register?role=employer" className="btn btn-ghost btn-lg">Post a Job</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a56db 0%, #1e3a8a 60%, #1a56db 100%)',
    padding: '80px 0 60px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '420px',
    display: 'flex',
    alignItems: 'center',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.1) 0%, transparent 50%)',
  },
  heroContainer: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    gap: '48px',
  },
  heroContent: {
    color: 'white',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '9999px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '20px',
    color: 'white',
  },
  heroTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '52px',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '16px',
    color: 'white',
  },
  heroSub: {
    fontSize: '17px',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '32px',
    lineHeight: 1.7,
  },
  btns: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  heroRight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationBox: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '28px',
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
  },
  mockBar: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
  },
  barsRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    height: '80px',
    marginTop: '16px',
    marginBottom: '20px',
  },
  bar: {
    flex: 1,
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '4px 4px 0 0',
  },
  floatingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  floatingCardEmpty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px dashed rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  cardBadge: {
    marginLeft: 'auto',
    background: '#22c55e',
    color: 'white',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '9999px',
    flexShrink: 0,
  },
  searchSection: {
    background: 'white',
    padding: '0',
    marginTop: '-1px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    padding: '8px 8px 8px 0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    margin: '-28px 0 0 0',
    position: 'relative',
    zIndex: 10,
  },
  searchField: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  },
  searchIcon: {
    fontSize: '18px',
    flexShrink: 0,
    marginRight: '8px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    background: 'transparent',
    color: '#111827',
    minWidth: 0,
  },
  searchDivider: {
    width: '1px',
    height: '36px',
    background: '#e5e7eb',
    flexShrink: 0,
  },
  statsSection: {
    padding: '50px 0',
    background: 'white',
    borderBottom: '1px solid #f3f4f6',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    textAlign: 'center',
  },
  statItem: {
    padding: '20px',
  },
  statValue: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '36px',
    fontWeight: 800,
    color: '#1a56db',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: 500,
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  catCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '28px 20px',
    background: 'white',
    border: '1.5px solid #e5e7eb',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  },
  catIcon: {
    fontSize: '32px',
  },
  catName: {},
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  ctaSection: {
    background: 'linear-gradient(135deg, #1a56db, #1e3a8a)',
    padding: '80px 0',
  },
};

export default HomePage;