import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
    <div>
      <p style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</p>
      <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.5rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '2rem', fontSize: '1.1rem' }}>Oops! This page doesn't exist.</p>
      <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
    </div>
  </div>
);

export default NotFound;
