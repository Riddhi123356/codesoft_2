import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={styles.footer}>
    <div className="container">
      <div style={styles.grid}>
        <div>
          <div style={styles.logo}>⬡ Job<span style={{ color: '#22c55e' }}>Board</span></div>
          <p style={styles.tagline}>Find your dream job or hire the best talent. We connect employers and candidates worldwide.</p>
        </div>
        <div>
          <div style={styles.colTitle}>For Job Seekers</div>
          <Link to="/jobs" style={styles.footerLink}>Browse Jobs</Link>
          <Link to="/register?role=candidate" style={styles.footerLink}>Create Account</Link>
          <Link to="/candidate/dashboard" style={styles.footerLink}>My Applications</Link>
        </div>
        <div>
          <div style={styles.colTitle}>For Employers</div>
          <Link to="/employer/post-job" style={styles.footerLink}>Post a Job</Link>
          <Link to="/register?role=employer" style={styles.footerLink}>Employer Sign Up</Link>
          <Link to="/employer/dashboard" style={styles.footerLink}>Dashboard</Link>
        </div>
        <div>
          <div style={styles.colTitle}>Contact</div>
          <span style={styles.footerLink}>support@jobboard.com</span>
          <span style={styles.footerLink}>1-800-JOB-FIND</span>
        </div>
      </div>
      <div style={styles.bottom}>
        <span>© {new Date().getFullYear()} JobBoard. All rights reserved.</span>
      </div>
    </div>
  </footer>
);

const styles = {
  footer: { background: '#111827', color: '#d1d5db', padding: '60px 0 30px' },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' },
  logo: { fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '12px' },
  tagline: { fontSize: '14px', color: '#9ca3af', lineHeight: '1.6', maxWidth: '260px' },
  colTitle: { fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '15px' },
  footerLink: { display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' },
  bottom: { borderTop: '1px solid #1f2937', paddingTop: '24px', fontSize: '13px', color: '#6b7280', textAlign: 'center' },
};

export default Footer;
