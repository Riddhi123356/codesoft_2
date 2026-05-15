import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';

const Footer = () => (
  <footer style={styles.footer}>
    <div className="container" style={styles.inner}>
      <div style={styles.brand}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}><FiZap size={14} /></span>
          <span style={{ fontFamily: 'Syne', fontWeight: 800 }}>QuizForge</span>
        </Link>
        <p style={styles.tagline}>Create, share, and challenge everyone.</p>
      </div>
      <div style={styles.links}>
        <Link to="/quizzes" style={styles.link}>Browse</Link>
        <Link to="/create"  style={styles.link}>Create</Link>
        <Link to="/login"   style={styles.link}>Login</Link>
        <Link to="/register" style={styles.link}>Sign Up</Link>
      </div>
    </div>
    <div style={styles.bottom}>
      <p style={{ color: 'var(--text3)', fontSize: '0.78rem' }}>
        © {new Date().getFullYear()} QuizForge. Built with ⚡ React, Node.js & MongoDB.
      </p>
    </div>
  </footer>
);

const styles = {
  footer: {
    borderTop: '1px solid var(--border2)',
    background: 'var(--bg2)',
    padding: '2.5rem 0 1.5rem',
    marginTop: 'auto',
  },
  inner: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', flexWrap: 'wrap',
    gap: '2rem', marginBottom: '2rem',
  },
  brand: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  logo: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    color: 'var(--text)', textDecoration: 'none',
  },
  logoIcon: {
    width: 26, height: 26,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff',
  },
  tagline: { fontSize: '0.85rem', color: 'var(--text3)' },
  links: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  link: { color: 'var(--text2)', fontSize: '0.9rem', transition: 'var(--transition)' },
  bottom: { textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border2)' },
};

export default Footer;
