import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import api from '../utils/api';
import { FiZap, FiPlusCircle, FiSearch, FiAward, FiUsers, FiBookOpen, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes?limit=6').then(res => {
      setFeatured(res.data.quizzes);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <FiZap size={12} style={{ color: 'var(--accent)' }} />
            <span>The smartest quiz platform</span>
          </div>
          <h1 style={styles.heroTitle}>
            Create. Share.
            <br />
            <span className="gradient-text">Challenge Everyone.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Build beautiful quizzes in minutes, share them with the world,
            and watch your community test their knowledge.
          </p>
          <div style={styles.heroCtas}>
            <Link to="/quizzes" className="btn btn-primary btn-lg">
              <FiSearch size={18} /> Browse Quizzes
            </Link>
            {user
              ? <Link to="/create" className="btn btn-ghost btn-lg">
                  <FiPlusCircle size={18} /> Create a Quiz
                </Link>
              : <Link to="/register" className="btn btn-ghost btn-lg">
                  Get Started Free <FiArrowRight size={18} />
                </Link>
            }
          </div>

          {/* Stats */}
          <div style={styles.stats}>
            {[
              { icon: <FiBookOpen />, label: 'Quizzes Created', value: '10K+' },
              { icon: <FiUsers />,    label: 'Active Learners',  value: '50K+' },
              { icon: <FiAward />,    label: 'Quiz Attempts',    value: '200K+' },
            ].map(s => (
              <div key={s.label} style={styles.statItem}>
                <span style={styles.statIcon}>{s.icon}</span>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Everything you need to quiz</h2>
          <div style={styles.featureGrid}>
            {[
              { emoji: '⚡', title: 'Instant Creation', desc: 'Build quizzes with multiple-choice questions in seconds. No setup needed.' },
              { emoji: '🎯', title: 'Live Scoring',     desc: 'Get immediate feedback and see exactly which questions you got right.' },
              { emoji: '📊', title: 'Leaderboards',     desc: 'Compete with others and see how you rank against the community.' },
              { emoji: '📱', title: 'Mobile Ready',     desc: 'Take and create quizzes from any device, anywhere, anytime.' },
              { emoji: '🔒', title: 'Secure Auth',      desc: 'Safe account system so your quizzes are always yours to manage.' },
              { emoji: '🌐', title: 'Categories',       desc: 'Organize quizzes by Science, History, Tech, Sports and many more.' },
            ].map(f => (
              <div key={f.title} style={styles.featureCard}>
                <span style={styles.featureEmoji}>{f.emoji}</span>
                <h3 style={{ fontSize: '1rem', fontFamily: 'Syne', fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: '0.87rem', color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Quizzes */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={styles.sectionTitle}>Trending Quizzes</h2>
            <Link to="/quizzes" className="btn btn-ghost btn-sm">See all <FiArrowRight size={13} /></Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner" />
            </div>
          ) : featured.length > 0 ? (
            <div className="quiz-grid">
              {featured.map(q => <QuizCard key={q._id} quiz={q} />)}
            </div>
          ) : (
            <div style={styles.empty}>
              <p>No quizzes yet. <Link to="/create" style={{ color: 'var(--accent)' }}>Create the first one!</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      {!user && (
        <section style={styles.ctaBanner}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
              Ready to forge your quiz?
            </h2>
            <p style={{ color: 'var(--text2)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Join thousands of quiz creators. Free forever.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              <FiZap size={18} /> Start Creating Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  hero: {
    position: 'relative',
    padding: 'clamp(4rem, 10vw, 8rem) 0 4rem',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,88,255,0.25) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(99,88,255,0.12)', border: '1px solid rgba(99,88,255,0.25)',
    borderRadius: 100, padding: '0.35rem 0.9rem',
    fontSize: '0.8rem', color: 'var(--text2)',
  },
  heroTitle: {
    fontFamily: 'Syne', fontWeight: 800,
    fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
    lineHeight: 1.1, letterSpacing: '-0.02em',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
    color: 'var(--text2)', maxWidth: 520, lineHeight: 1.7,
  },
  heroCtas: { display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' },
  stats: {
    display: 'flex', gap: '3rem', marginTop: '1rem',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' },
  statIcon: { color: 'var(--accent)', fontSize: '1.2rem' },
  statValue: { fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem' },
  statLabel: { fontSize: '0.78rem', color: 'var(--text3)', letterSpacing: '0.05em' },
  features: {
    padding: '5rem 0',
    background: 'var(--bg2)',
    borderTop: '1px solid var(--border2)',
    borderBottom: '1px solid var(--border2)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  featureCard: {
    background: 'var(--card)',
    border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.6rem',
  },
  featureEmoji: { fontSize: '2rem', lineHeight: 1 },
  sectionTitle: {
    fontFamily: 'Syne', fontWeight: 700,
    fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
    marginBottom: '2rem',
  },
  empty: {
    textAlign: 'center', padding: '4rem',
    color: 'var(--text2)', background: 'var(--card)',
    borderRadius: 'var(--radius)', border: '1px dashed var(--border2)',
  },
  ctaBanner: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, rgba(99,88,255,0.1), rgba(168,85,247,0.1))',
    borderTop: '1px solid var(--border)',
  },
};

export default Home;
