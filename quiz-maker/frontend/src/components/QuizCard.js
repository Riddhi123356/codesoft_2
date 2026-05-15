import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiBarChart2, FiArrowRight } from 'react-icons/fi';

const diffColors = { Easy: 'green', Medium: 'gold', Hard: 'red' };

const DifficultyBar = ({ difficulty }) => {
  const levels = { Easy: 1, Medium: 2, Hard: 3 };
  const colors = { Easy: 'var(--green)', Medium: 'var(--gold)', Hard: 'var(--red)' };
  const level = levels[difficulty] || 2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{difficulty}</span>
      <div style={{ display: 'flex', gap: '3px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            width: 18, height: 6, borderRadius: 3,
            background: i <= level ? colors[difficulty] : 'var(--bg3)',
            transition: 'var(--transition)',
          }} />
        ))}
      </div>
    </div>
  );
};

const categoryEmojis = {
  General: '🌐', Science: '🔬', Math: '➗', History: '📜',
  Technology: '💻', Sports: '⚽', Entertainment: '🎬', Other: '✨',
};

const QuizCard = ({ quiz }) => {
  const diff = quiz.difficulty || 'Medium';
  const color = diffColors[diff];

  return (
    <div style={styles.card} className="quiz-card">
      <div style={styles.top}>
        <span style={styles.emoji}>{categoryEmojis[quiz.category] || '✨'}</span>
        <DifficultyBar difficulty={diff} />
      </div>
      <h3 style={styles.title}>{quiz.title}</h3>
      {quiz.description && (
        <p style={styles.desc}>{quiz.description.slice(0, 90)}{quiz.description.length > 90 ? '…' : ''}</p>
      )}
      <div style={styles.meta}>
        <span style={styles.metaItem}><FiBarChart2 size={12} /> {quiz.questions?.length || 0} Qs</span>
        <span style={styles.metaItem}><FiUsers size={12} /> {quiz.attempts || 0} played</span>
        {quiz.timeLimit > 0 && (
          <span style={styles.metaItem}><FiClock size={12} /> {Math.floor(quiz.timeLimit / 60)}m</span>
        )}
      </div>
      <div style={styles.footer}>
        <span style={styles.creator}>by {quiz.creator?.name || 'Anonymous'}</span>
        <Link to={`/quiz/${quiz._id}`} className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}>
          Take Quiz <FiArrowRight size={13} />
        </Link>
      </div>
      <style>{`
        .quiz-card:hover { transform: translateY(-4px); border-color: var(--border); box-shadow: var(--shadow-accent); }
      `}</style>
    </div>
  );
};

const styles = {
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)',
    padding: '1.4rem',
    display: 'flex', flexDirection: 'column', gap: '0.75rem',
    transition: 'var(--transition)',
    cursor: 'default',
  },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  emoji: { fontSize: '1.8rem', lineHeight: 1 },
  title: { fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 },
  desc: { fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 },
  meta: { display: 'flex', gap: '0.9rem', flexWrap: 'wrap' },
  metaItem: {
    display: 'flex', alignItems: 'center', gap: '0.3rem',
    fontSize: '0.78rem', color: 'var(--text3)',
  },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' },
  creator: { fontSize: '0.8rem', color: 'var(--text3)' },
};

export default QuizCard;
