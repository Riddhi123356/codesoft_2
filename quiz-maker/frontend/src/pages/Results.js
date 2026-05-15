import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FiCheck, FiX, FiRefreshCw, FiList, FiAward, FiClock } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const Results = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  const result = location.state?.result;
  const quiz = location.state?.quiz;

  useEffect(() => {
    if (!result) { navigate(`/quiz/${id}`); return; }
    api.get(`/attempts/quiz/${id}`).then(res => setLeaderboard(res.data.attempts)).catch(() => {});
  }, [id, result, navigate]);

  useEffect(() => {
  if (!result) return;
  if (result.percentage >= 80) {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6358ff', '#a855f7', '#22d3ee', '#f59e0b', '#10b981'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 500);
  }
}, [result]);

  if (!result) return null;

  const { score, percentage, results } = result;
  const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F';
  const gradeColor = percentage >= 70 ? 'var(--green)' : percentage >= 50 ? 'var(--gold)' : 'var(--red)';
  const emoji = percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪';

  const formatTime = (s) => {
    if (!s) return '–';
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }} className="page-enter">
      <div className="container-sm">
        {/* Score Card */}
        <div style={styles.scoreCard}>
          <div style={styles.scoreBg} />
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={styles.emoji}>{emoji}</div>
            <h1 style={styles.scoreTitle}>
              {percentage >= 70 ? 'Great Job!' : percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
            </h1>
            <div style={{ ...styles.grade, color: gradeColor, borderColor: gradeColor }}>{grade}</div>
            <div style={styles.scoreDisplay}>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '3.5rem', color: gradeColor }}>
                {percentage}%
              </span>
              <span style={{ color: 'var(--text2)', fontSize: '1rem' }}>
                {score} / {results.length} correct
              </span>
            </div>

            <div style={styles.metaRow}>
              <div style={styles.metaItem}>
                <FiAward size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{quiz?.title}</span>
              </div>
              {result.attempt?.timeTaken > 0 && (
                <div style={styles.metaItem}>
                  <FiClock size={16} style={{ color: 'var(--accent3)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
                    {formatTime(result.attempt.timeTaken)}
                  </span>
                </div>
              )}
            </div>

            <div style={styles.actions}>
              <Link to={`/quiz/${id}`} className="btn btn-ghost">
                <FiRefreshCw size={15} /> Retry
              </Link>
              <Link to="/quizzes" className="btn btn-secondary">
                <FiList size={15} /> Browse More
              </Link>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <h2 style={styles.sectionHead}>Answer Review</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {results.map((r, i) => (
            <div key={i} style={{
              ...styles.reviewCard,
              borderColor: r.isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)',
            }}>
              <div style={styles.reviewHeader}>
                <span style={{
                  ...styles.reviewIcon,
                  background: r.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                  color: r.isCorrect ? 'var(--green)' : 'var(--red)',
                }}>
                  {r.isCorrect ? <FiCheck size={14} /> : <FiX size={14} />}
                </span>
                <p style={styles.reviewQ}><strong>Q{i + 1}.</strong> {r.questionText}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' }}>
                {r.options.map((opt, oi) => {
                  const isCorrect = oi === r.correctIndex;
                  const isSelected = oi === r.selectedIndex;
                  let bg = 'transparent', border = 'var(--border2)', color = 'var(--text2)';
                  if (isCorrect) { bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.4)'; color = 'var(--green)'; }
                  else if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.35)'; color = 'var(--red)'; }

                  return (
                    <div key={oi} style={{ ...styles.reviewOpt, background: bg, borderColor: border, color }}>
                      <span style={styles.reviewOptLetter}>{String.fromCharCode(65 + oi)}</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {isCorrect && <FiCheck size={13} />}
                      {isSelected && !isCorrect && <FiX size={13} />}
                    </div>
                  );
                })}
              </div>

              {r.explanation && (
                <div style={styles.explanation}>
                  <strong>💡 Explanation:</strong> {r.explanation}
                </div>
              )}

              {r.selectedIndex === -1 && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: '0.5rem' }}>⚠ Skipped</p>
              )}
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <>
            <h2 style={styles.sectionHead}>🏅 Leaderboard</h2>
            <div style={styles.leaderboard}>
              {leaderboard.map((a, i) => (
                <div key={a._id} style={styles.leaderRow}>
                  <span style={styles.rank}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <span style={{ flex: 1, fontWeight: i < 3 ? 600 : 400 }}>
                    {a.user?.name || 'Anonymous'}
                  </span>
                  <span style={{ ...styles.leaderScore, color: a.percentage >= 70 ? 'var(--green)' : 'var(--text2)' }}>
                    {a.percentage}%
                  </span>
                  {a.timeTaken > 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{formatTime(a.timeTaken)}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  scoreCard: {
    position: 'relative',
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '2.5rem',
    marginBottom: '2rem', overflow: 'hidden',
  },
  scoreBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,88,255,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  emoji: { fontSize: '3.5rem', marginBottom: '0.5rem' },
  scoreTitle: { fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', marginBottom: '1rem' },
  grade: {
    display: 'inline-block',
    border: '3px solid',
    borderRadius: 12,
    padding: '0.2rem 1rem',
    fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  scoreDisplay: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', marginBottom: '1.25rem' },
  metaRow: { display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  actions: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' },
  sectionHead: { fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' },
  reviewCard: {
    background: 'var(--card)', border: '1px solid',
    borderRadius: 'var(--radius)', padding: '1.25rem',
  },
  reviewHeader: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
  reviewIcon: {
    width: 28, height: 28, flexShrink: 0,
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: '0.1rem',
  },
  reviewQ: { fontSize: '0.95rem', lineHeight: 1.5 },
  reviewOpt: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '0.5rem 0.75rem',
    borderRadius: 8, border: '1px solid',
    fontSize: '0.88rem', lineHeight: 1.4,
    transition: 'var(--transition)',
  },
  reviewOptLetter: {
    width: 22, height: 22, flexShrink: 0,
    background: 'rgba(255,255,255,0.06)', borderRadius: 5,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 700,
  },
  explanation: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    background: 'rgba(34,211,238,0.07)',
    borderRadius: 8, border: '1px solid rgba(34,211,238,0.2)',
    fontSize: '0.87rem', color: 'var(--text2)', lineHeight: 1.5,
  },
  leaderboard: {
    background: 'var(--card)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)', overflow: 'hidden',
  },
  leaderRow: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '0.85rem 1.25rem',
    borderBottom: '1px solid var(--border2)',
    fontSize: '0.9rem',
  },
  rank: { fontSize: '1rem', minWidth: 28 },
  leaderScore: { fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' },
};

export default Results;
