import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiZap, FiMenu, FiX, FiUser, FiLogOut, FiPlusCircle, FiList } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => {
  setIsDark(!isDark);
  document.body.classList.toggle('light');
};
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--text)' : 'var(--text2)',
    fontWeight: isActive ? '600' : '400',
    transition: 'var(--transition)',
  });

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}><FiZap size={18} /></span>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem' }}>QuizForge</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ ...styles.links, display: 'flex' }}>
          <NavLink to="/quizzes" style={linkStyle}>Browse</NavLink>
          {user && <NavLink to="/create" style={linkStyle}>Create Quiz</NavLink>}
          {user && <NavLink to="/my-quizzes" style={linkStyle}>My Quizzes</NavLink>}
        </div>

        {/* Right */}
        <div style={styles.right}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button style={styles.avatar} onClick={() => setDropOpen(!dropOpen)}>
                <span style={styles.avatarText}>{user.name[0].toUpperCase()}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>{user.name}</span>
              </button>
              {dropOpen && (
                <div style={styles.dropdown}>
                  <Link to="/my-quizzes" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                    <FiList size={14} /> My Quizzes
                  </Link>
                  <Link to="/create" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                    <FiPlusCircle size={14} /> Create Quiz
                  </Link>
                  <Link to="/profile" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                    <FiUser size={14} /> Profile
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border2)', marginTop: '0.3rem', paddingTop: '0.3rem' }}>
                    <button style={{ ...styles.dropItem, background: 'none', border: 'none', width: '100%', cursor: 'pointer', color: 'var(--red)' }} onClick={handleLogout}>
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
          <button
            onClick={toggleTheme}
            style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border2)',
            borderRadius: 20,
            padding: '0.35rem 0.75rem',
            cursor: 'pointer',
            fontSize: '1rem',
            color: 'var(--text)',
             }}
>
            {isDark ? '☀️' : '🌙'}
            </button>

          {/* Hamburger */}
          <button style={styles.hamburger} onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={styles.mobileMenu}>
          <NavLink to="/quizzes" style={styles.mobileLink} onClick={() => setOpen(false)}>Browse Quizzes</NavLink>
          {user && <NavLink to="/create" style={styles.mobileLink} onClick={() => setOpen(false)}>Create Quiz</NavLink>}
          {user && <NavLink to="/my-quizzes" style={styles.mobileLink} onClick={() => setOpen(false)}>My Quizzes</NavLink>}
          {user && <NavLink to="/profile" style={styles.mobileLink} onClick={() => setOpen(false)}>Profile</NavLink>}
          {user
            ? <button style={{ ...styles.mobileLink, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', textAlign: 'left' }} onClick={handleLogout}>Logout</button>
            : <>
                <NavLink to="/login" style={styles.mobileLink} onClick={() => setOpen(false)}>Login</NavLink>
                <NavLink to="/register" style={styles.mobileLink} onClick={() => setOpen(false)}>Sign Up</NavLink>
              </>
          }
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,20,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border2)',
  },
  inner: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px', gap: '2rem',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    color: 'var(--text)',
  },
  logoIcon: {
    width: 32, height: 32,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff',
  },
  links: {
    flex: 1, gap: '1.8rem',
    display: 'flex', alignItems: 'center',
    '@media(max-width:768px)': { display: 'none' },
  },
  right: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'var(--card)', border: '1px solid var(--border2)',
    borderRadius: 100, padding: '0.35rem 0.75rem 0.35rem 0.35rem',
    cursor: 'pointer', transition: 'var(--transition)',
  },
  avatarText: {
    width: 28, height: 28,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 700, color: '#fff',
  },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: 'var(--card2)', border: '1px solid var(--border)',
    borderRadius: '12px',
    minWidth: 180, padding: '0.5rem',
    boxShadow: 'var(--shadow)',
    zIndex: 200,
    borderRadius: '12px',
  },
  dropItem: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.55rem 0.75rem',
    borderRadius: 8, fontSize: '0.9rem',
    color: 'var(--text2)',
    transition: 'var(--transition)',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: 'var(--text)', cursor: 'pointer',
    '@media(max-width:768px)': { display: 'flex' },
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column',
    padding: '1rem', gap: '0.25rem',
    borderTop: '1px solid var(--border2)',
    background: 'var(--bg2)',
  },
  mobileLink: {
    padding: '0.75rem 1rem',
    borderRadius: 8,
    color: 'var(--text2)',
    fontSize: '0.95rem',
  },
};

export default Navbar;
