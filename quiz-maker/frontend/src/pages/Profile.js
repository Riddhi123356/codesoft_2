import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiAward, FiBookOpen, FiBarChart2, FiUser } from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/attempts/my')
      .then(res => setAttempts(res.data.attempts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
    : 0;

  return (
    <div style={{ padding: '2.5rem 0 5rem' }} className="page-enter">
      <div className="container-sm">
        {/* Profile Header */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem' }}>{user.name}</h1>
            <p style={{ color: 'var(--text2)' }}>{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { icon: <FiBookOpen />, label: 'Quizzes Taken', value: attempts.length, color: 'var(--accent)' },
            { icon: <FiBarChart2 />, label: 'Avg. Score', value: `${avg}%`, color: 'var(--green)' },
            { icon: <FiAward />, label: 'Best Score', value: attempts.length ? `${Math.max(...attempts.map(a => a.percentage))}%` : '–', color: 'var(--gold)' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <span style={{ color: s.color, fontSize: '1.4rem' }}>{s.icon}</span>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem' }}>{s.value}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Attempt History */}
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>
          Quiz History
        </h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" />
          </div>
        ) : attempts.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</p>
            <p style={{ color: 'var(--text2)' }}>No quizzes taken yet. Start exploring!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {attempts.map(a => {
              const pct = a.percentage;
              const color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : 'var(--red)';
              return (
                <div key={a._id} style={styles.attemptRow}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{a.quiz?.title || 'Unknown Quiz'}</p>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{a.quiz?.category}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                        {new Date(a.completedAt || a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color }}>{pct}%</span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{a.score}/{a.totalQuestions}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border2)', paddingTop: '1.5rem' }}>
          <button
            className="btn btn-danger"
            onClick={() => { logout(); navigate('/'); }}
          >
            <FiUser size={15} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  profileCard: {
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '2rem',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: 70, height: 70, flexShrink: 0,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#fff',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem', marginBottom: '2rem',
  },
  statCard: {
    background: 'var(--card)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)', padding: '1.25rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center', padding: '4rem 2rem',
    background: 'var(--card)', borderRadius: 'var(--radius)',
    border: '1px dashed var(--border2)',
  },
  attemptRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'var(--card)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem',
    gap: '1rem',
  },
};

export default Profile;
