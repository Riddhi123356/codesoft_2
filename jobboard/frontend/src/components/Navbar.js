import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>Job<span style={{ color: '#22c55e' }}>Board</span></span>
        </Link>

        <div style={{ ...styles.links, ...(menuOpen ? styles.linksOpen : {}) }}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>Home</Link>
          <Link to="/jobs" style={{ ...styles.link, ...(isActive('/jobs') ? styles.linkActive : {}) }}>Browse Jobs</Link>
        </div>

        <div style={styles.actions}>
          {user ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button style={styles.avatarBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} style={styles.avatar} />
                  : <span style={styles.avatarInitial}>{user.name[0].toUpperCase()}</span>
                }
                <span style={styles.userName}>{user.name.split(' ')[0]}</span>
                <span>▾</span>
              </button>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.dropdownName}>{user.name}</div>
                    <div style={styles.dropdownRole}>{user.role}</div>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0' }} />
                  {user.role === 'employer' ? (
  <>
                  <Link to="/employer/dashboard" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>📊 Dashboard</Link>
                  <Link to="/employer/post-job" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>➕ Post a Job</Link>
                  </>
                  ) : user.role === 'admin' ? (
                  <Link to="/admin/dashboard" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>👑 Admin Dashboard</Link>
                  ) : (
                  <Link to="/candidate/dashboard" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>👤 My Dashboard</Link>
                  )}
                  <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0' }} />
                  <button style={{ ...styles.dropdownItem, width: '100%', textAlign: 'left', color: '#ef4444' }} onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>Log In</Link>
              <Link to="/register?role=employer" className="btn btn-secondary btn-sm">Post A Job</Link>
            </>
          )}
        </div>

        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '24px' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  logoIcon: { fontSize: '24px', color: '#1a56db' },
  logoText: { fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#111827' },
  links: { display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center' },
  linksOpen: {},
  link: { padding: '6px 14px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, color: '#374151', transition: 'all 0.2s', textDecoration: 'none' },
  linkActive: { color: '#1a56db', background: '#eff6ff', fontWeight: 600 },
  actions: { display: 'flex', alignItems: 'center', gap: '12px' },
  loginBtn: { fontSize: '14px', fontWeight: 500, color: '#374151', padding: '6px 14px' },
  avatarBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' },
  avatarInitial: { width: '28px', height: '28px', borderRadius: '50%', background: '#1a56db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 },
  userName: { maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  dropdown: { position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', minWidth: '200px', overflow: 'hidden' },
  dropdownHeader: { padding: '12px 16px', background: '#f9fafb' },
  dropdownName: { fontWeight: 600, fontSize: '14px' },
  dropdownRole: { fontSize: '12px', color: '#6b7280', textTransform: 'capitalize', marginTop: '2px' },
  dropdownItem: { display: 'block', padding: '10px 16px', fontSize: '14px', color: '#374151', textDecoration: 'none', transition: 'background 0.15s', background: 'none', border: 'none', cursor: 'pointer', width: '100%' },
  hamburger: { display: 'none', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
};

export default Navbar;
