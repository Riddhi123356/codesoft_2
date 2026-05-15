import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiZap } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to QuizForge 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div style={styles.page}>
      <div style={styles.bg} />
      <div style={styles.card} className="fade-up">
        <div style={styles.header}>
          <div style={styles.logoIcon}><FiZap size={20} color="#fff" /></div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.sub}>Join QuizForge and start creating quizzes</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'name',     icon: FiUser,  type: 'text',     placeholder: 'Your name' },
            { key: 'email',    icon: FiMail,  type: 'email',    placeholder: 'you@example.com' },
            { key: 'password', icon: FiLock,  type: 'password', placeholder: '••••••••' },
          ].map(({ key, icon: Icon, type, placeholder }) => (
            <div key={key} className="form-group">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <div style={styles.inputWrap}>
                <Icon size={16} style={styles.inputIcon} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={set(key)}
                  required
                />
              </div>
            </div>
          ))}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.8rem' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.foot}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(168,85,247,0.2) 0%, transparent 60%)', pointerEvents: 'none' },
  card: { position: 'relative', width: '100%', maxWidth: 420, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem', boxShadow: 'var(--shadow)' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  logoIcon: { width: 50, height: 50, background: 'linear-gradient(135deg, var(--accent2), var(--accent))', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  title: { fontSize: '1.6rem', fontFamily: 'Syne', fontWeight: 800, marginBottom: '0.3rem' },
  sub: { color: 'var(--text2)', fontSize: '0.9rem' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' },
  foot: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text2)' },
};

export default Register;
