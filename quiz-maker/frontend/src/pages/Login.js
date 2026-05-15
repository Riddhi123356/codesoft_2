import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiZap } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />
      <div style={styles.card} className="fade-up">
        <div style={styles.header}>
          <div style={styles.logoIcon}><FiZap size={20} color="#fff" /></div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.sub}>Sign in to your QuizForge account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Email</label>
            <div style={styles.inputWrap}>
              <FiMail size={16} style={styles.inputIcon} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={styles.inputWrap}>
              <FiLock size={16} style={styles.inputIcon} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.8rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.foot}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem 1rem',
    position: 'relative',
  },
  bg: {
    position: 'fixed', inset: 0,
    background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,88,255,0.2) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    width: '100%', maxWidth: 420,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '2.5rem',
    boxShadow: 'var(--shadow)',
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  logoIcon: {
    width: 50, height: 50,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  title: { fontSize: '1.6rem', fontFamily: 'Syne', fontWeight: 800, marginBottom: '0.3rem' },
  sub: { color: 'var(--text2)', fontSize: '0.9rem' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' },
  foot: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text2)' },
};

export default Login;
