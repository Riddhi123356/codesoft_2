import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⬡ Job<span style={{ color: '#22c55e' }}>Board</span></div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your account to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.switchText}>
          Don't have an account? <Link to="/register" style={styles.switchLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = new URLSearchParams(location.search).get('role') || 'candidate';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: defaultRole });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⬡ Job<span style={{ color: '#22c55e' }}>Board</span></div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.sub}>Join thousands of professionals today</p>

        <div style={styles.roleToggle}>
          <button style={{ ...styles.roleBtn, ...(form.role === 'candidate' ? styles.roleBtnActive : {}) }} onClick={() => setForm(f => ({ ...f, role: 'candidate' }))}>
            👤 Job Seeker
          </button>
          <button style={{ ...styles.roleBtn, ...(form.role === 'employer' ? styles.roleBtnActive : {}) }} onClick={() => setForm(f => ({ ...f, role: 'employer' }))}>
            🏢 Employer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  logo: { fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '28px', textAlign: 'center' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '26px', marginBottom: '6px', textAlign: 'center' },
  sub: { color: '#6b7280', fontSize: '15px', marginBottom: '28px', textAlign: 'center' },
  roleToggle: { display: 'flex', gap: '8px', marginBottom: '24px', background: '#f3f4f6', borderRadius: '10px', padding: '4px' },
  roleBtn: { flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#6b7280', transition: 'all 0.2s' },
  roleBtnActive: { background: 'white', color: '#1a56db', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', fontWeight: 700 },
  switchText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' },
  switchLink: { color: '#1a56db', fontWeight: 600, textDecoration: 'none' },
};

export default LoginPage;
