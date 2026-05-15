import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const typeColors = {
  'full-time': { bg: '#dbeafe', color: '#1d4ed8' },
  'part-time': { bg: '#fef3c7', color: '#d97706' },
  'contract': { bg: '#f3e8ff', color: '#7c3aed' },
  'internship': { bg: '#dcfce7', color: '#16a34a' },
  'freelance': { bg: '#fee2e2', color: '#dc2626' },
};

const expLabels = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior', lead: 'Lead', manager: 'Manager' };

const JobCard = ({ job }) => {
  const typeStyle = typeColors[job.type] || typeColors['full-time'];

  return (
    <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
      <div style={styles.card}>
        {job.featured && <div style={styles.featuredBadge}>⭐ Featured</div>}
        {job.urgent && <div style={styles.urgentBadge}>🔥 Urgent</div>}

        <div style={styles.header}>
          <div style={styles.logoWrap}>
            {job.companyLogo
              ? <img src={job.companyLogo} alt={job.company} style={styles.logo} />
              : <div style={styles.logoPlaceholder}>{(job.company || 'C')[0].toUpperCase()}</div>
            }
          </div>
          <div style={styles.headerInfo}>
            <div style={styles.company}>{job.company}</div>
            <div style={styles.title}>{job.title}</div>
          </div>
        </div>

        <div style={styles.tags}>
          <span style={{ ...styles.badge, background: typeStyle.bg, color: typeStyle.color }}>
            {job.type?.replace('-', ' ')}
          </span>
          <span style={styles.tag}>📍 {job.location}</span>
          {job.locationType === 'remote' && <span style={{ ...styles.badge, background: '#dcfce7', color: '#16a34a' }}>Remote</span>}
          {job.experience && <span style={styles.tag}>{expLabels[job.experience]}</span>}
        </div>

        {job.skills?.length > 0 && (
          <div style={styles.skills}>
            {job.skills.slice(0, 3).map(s => (
              <span key={s} style={styles.skill}>{s}</span>
            ))}
            {job.skills.length > 3 && <span style={styles.skillMore}>+{job.skills.length - 3}</span>}
          </div>
        )}

        <div style={styles.footer}>
          <div style={styles.salary}>
            {job.salary?.min && job.salary?.max
              ? `$${job.salary.min.toLocaleString()} – $${job.salary.max.toLocaleString()}`
              : job.salary?.isNegotiable ? 'Negotiable' : 'Not specified'
            }
          </div>
          <div style={styles.time}>
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '20px', position: 'relative', transition: 'all 0.2s', cursor: 'pointer' },
  featuredBadge: { position: 'absolute', top: '12px', right: '12px', background: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px' },
  urgentBadge: { position: 'absolute', top: '12px', right: '12px', background: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px' },
  header: { display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' },
  logoWrap: { flexShrink: 0 },
  logo: { width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e5e7eb' },
  logoPlaceholder: { width: '48px', height: '48px', borderRadius: '10px', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700 },
  headerInfo: { flex: 1, minWidth: 0 , overflow: 'hidden'},
  company: { fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: '#111827', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  badge: { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' },
  tag: { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, background: '#f3f4f6', color: '#6b7280' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' },
  skill: { background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 },
  skillMore: { background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f3f4f6' },
  salary: { fontSize: '14px', fontWeight: 700, color: '#111827' },
  time: { fontSize: '12px', color: '#9ca3af' },
};

export default JobCard;
