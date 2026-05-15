import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const CATEGORIES = ['Technology','Design','Marketing','Finance','Healthcare','Education','Engineering','Sales','Legal','HR','Operations','Media'];
const JOB_TYPES = ['full-time','part-time','contract','internship','freelance'];
const EXPERIENCE = ['entry','mid','senior','lead','manager'];
const LOCATION_TYPES = ['onsite','remote','hybrid'];

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    experience: searchParams.get('experience') || '',
    locationType: searchParams.get('locationType') || '',
    page: 1,
  });
  const [inputKeyword, setInputKeyword] = useState(filters.keyword);
  const [inputLocation, setInputLocation] = useState(filters.location);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await axios.get('/api/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, keyword: inputKeyword, location: inputLocation, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', location: '', category: '', type: '', experience: '', locationType: '', page: 1 });
    setInputKeyword(''); setInputLocation('');
  };

  const hasFilters = filters.category || filters.type || filters.experience || filters.locationType;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={styles.hero}>
        <div className="container">
          <h1 style={styles.heroTitle}>Browse Jobs</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
            {total > 0 ? `${total} jobs found` : 'Find your perfect role'}
          </p>
          <form onSubmit={handleSearch} style={styles.searchBar}>
            <input style={styles.searchInput} placeholder="Job title, keywords..." value={inputKeyword} onChange={e => setInputKeyword(e.target.value)} />
            <div style={styles.divider} />
            <input style={styles.searchInput} placeholder="Location" value={inputLocation} onChange={e => setInputLocation(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px' }}>Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <div style={styles.filterCard}>
              <div style={styles.filterHeader}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Filters</span>
                {hasFilters && <button onClick={clearFilters} style={styles.clearBtn}>Clear all</button>}
              </div>

              <div style={styles.filterSection}>
                <div style={styles.filterTitle}>Category</div>
                {CATEGORIES.map(c => (
                  <label key={c} style={styles.checkLabel}>
                    <input type="radio" name="category" checked={filters.category === c} onChange={() => setFilter('category', filters.category === c ? '' : c)} style={{ accentColor: '#1a56db' }} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>

              <div style={styles.filterSection}>
                <div style={styles.filterTitle}>Job Type</div>
                {JOB_TYPES.map(t => (
                  <label key={t} style={styles.checkLabel}>
                    <input type="radio" name="type" checked={filters.type === t} onChange={() => setFilter('type', filters.type === t ? '' : t)} style={{ accentColor: '#1a56db' }} />
                    <span style={{ textTransform: 'capitalize' }}>{t.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>

              <div style={styles.filterSection}>
                <div style={styles.filterTitle}>Experience</div>
                {EXPERIENCE.map(e => (
                  <label key={e} style={styles.checkLabel}>
                    <input type="radio" name="experience" checked={filters.experience === e} onChange={() => setFilter('experience', filters.experience === e ? '' : e)} style={{ accentColor: '#1a56db' }} />
                    <span style={{ textTransform: 'capitalize' }}>{e} Level</span>
                  </label>
                ))}
              </div>

              <div style={styles.filterSection}>
                <div style={styles.filterTitle}>Work Mode</div>
                {LOCATION_TYPES.map(t => (
                  <label key={t} style={styles.checkLabel}>
                    <input type="radio" name="locationType" checked={filters.locationType === t} onChange={() => setFilter('locationType', filters.locationType === t ? '' : t)} style={{ accentColor: '#1a56db' }} />
                    <span style={{ textTransform: 'capitalize' }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <main style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.resultsHeader}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                {loading ? 'Loading...' : `Showing ${jobs.length} of ${total} jobs`}
              </span>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : jobs.length > 0 ? (
              <>
                <div style={styles.jobsList}>
                  {jobs.map(job => <JobCard key={job._id} job={job} />)}
                </div>
                {pages > 1 && (
                  <div style={styles.pagination}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                        style={{ ...styles.pageBtn, ...(filters.page === p ? styles.pageBtnActive : {}) }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: '16px' }}>Clear Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: { background: 'linear-gradient(135deg, #1a56db, #1e3a8a)', padding: '50px 0 40px' },
  heroTitle: { fontFamily: 'Syne, sans-serif', fontSize: '36px', color: 'white', marginBottom: '8px' },
  searchBar: { display: 'flex', background: 'white', borderRadius: '10px', overflow: 'hidden', padding: '8px', gap: '8px', maxWidth: '700px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontSize: '14px', background: 'transparent' },
  divider: { width: '1px', background: '#e5e7eb', alignSelf: 'stretch' },
  layout: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', alignItems: 'start' },
  sidebar: { position: 'sticky', top: '80px' },
  filterCard: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden' },
  filterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' },
  clearBtn: { background: 'none', border: 'none', color: '#1a56db', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  filterSection: { padding: '16px 20px', borderBottom: '1px solid #f3f4f6' },
  filterTitle: { fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' },
  resultsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  jobsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  pagination: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '32px' },
  pageBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500 },
  pageBtnActive: { background: '#1a56db', color: 'white', border: '1.5px solid #1a56db' },
};

export default JobsPage;
