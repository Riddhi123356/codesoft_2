import React, { useEffect, useState, useCallback } from 'react';
import QuizCard from '../components/QuizCard';
import api from '../utils/api';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const CATEGORIES = ['All', 'General', 'Science', 'Math', 'History', 'Technology', 'Sports', 'Entertainment', 'Other'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];


const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);

  const handleRandom = async () => {
  try {
    const res = await api.get('/quizzes?limit=100&page=1');
    const all = res.data.quizzes;
    if (!all || all.length === 0) {
      toast.error('No quizzes available!');
      return;
    }
    const random = all[Math.floor(Math.random() * all.length)];
    navigate(`/quiz/${random._id}`);
  } catch (err) {
    console.log('Random quiz error:', err);
    toast.error('Could not fetch random quiz');
  }
};
  
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      if (difficulty !== 'All') params.set('difficulty', difficulty);
      const res = await api.get(`/quizzes?${params}`);
      setQuizzes(res.data.quizzes);
      setTotalPages(res.data.pages);
    } catch {}
    setLoading(false);
  }, [search, category, difficulty, page]);

  useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

  const handleSearchInput = async (e) => {
  const val = e.target.value;
  setSearch(val);
  setPage(1);
  if (val.length > 1) {
    try {
      const res = await api.get(`/quizzes?search=${val}&limit=5`);
      setSuggestions(res.data.quizzes);
      setShowSug(true);
    } catch {}
  } else {
    setShowSug(false);
    setSuggestions([]);
  }
};
  const handleCategory = (c) => { setCategory(c); setPage(1); };
  const handleDifficulty = (d) => { setDifficulty(d); setPage(1); };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }} className="page-enter">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
  <div>
    <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.4rem' }}>
      Browse Quizzes
    </h1>
    <p style={{ color: 'var(--text2)' }}>Find and take quizzes from the community</p>
  </div>
  <button className="btn btn-primary" onClick={handleRandom}>
    🎲 Surprise Me!
  </button>
</div>

        {/* Search + Filter */}
        <div style={styles.filterBar}>
          <div style={{ ...styles.searchWrap, position: 'relative' }}>
  <FiSearch size={16} style={styles.searchIcon} />
  <input
    className="form-input"
    style={{ paddingLeft: '2.5rem' }}
    placeholder="Search quizzes…"
    value={search}
    onChange={handleSearchInput}
    onBlur={() => setTimeout(() => setShowSug(false), 200)}
  />
  {showSug && suggestions.length > 0 && (
    <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
      background: 'var(--card2)', border: '1px solid var(--border)',
      borderRadius: 12, marginTop: 4, overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      {suggestions.map(q => (
        <div
          key={q._id}
          onMouseDown={() => { setSearch(q.title); setShowSug(false); }}
          style={{
            padding: '0.7rem 1rem', cursor: 'pointer',
            borderBottom: '1px solid var(--border2)',
            fontSize: '0.9rem', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <span>{q.title}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{q.category}</span>
        </div>
      ))}
    </div>
  )}
</div>
          <div style={styles.filterRight}>
            <div style={styles.filterGroup}>
              <FiFilter size={14} style={{ color: 'var(--text3)' }} />
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => handleDifficulty(d)}
                  className={difficulty === d ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={styles.categories}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => handleCategory(c)}
              style={{
                ...styles.catBtn,
                background: category === c ? 'var(--accent)' : 'var(--card)',
                color: category === c ? '#fff' : 'var(--text2)',
                border: `1px solid ${category === c ? 'var(--accent)' : 'var(--border2)'}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <div className="spinner" />
          </div>
        ) : quizzes.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
            <p style={{ color: 'var(--text2)' }}>No quizzes found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} found
            </p>
            <div className="quiz-grid">
              {quizzes.map(q => <QuizCard key={q._id} quiz={q} />)}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Page {page} of {totalPages}</span>
            <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' },
  searchWrap: { position: 'relative', flex: 1, minWidth: 200 },
  searchIcon: { position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' },
  filterRight: { display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' },
  filterGroup: { display: 'flex', gap: '0.4rem', alignItems: 'center' },
  categories: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' },
  catBtn: { padding: '0.35rem 0.9rem', borderRadius: 100, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)' },
  empty: { textAlign: 'center', padding: '5rem 2rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px dashed var(--border2)' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem' },
};

export default QuizList;
