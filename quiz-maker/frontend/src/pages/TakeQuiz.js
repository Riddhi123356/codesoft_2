import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiArrowRight, FiArrowLeft, FiZap } from 'react-icons/fi';


const TimerRing = ({ timeLeft, totalTime }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 1;
  const strokeDashoffset = circumference * (1 - progress);
  const color = progress > 0.5 ? '#22d3ee' : progress > 0.25 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: 70, height: 70 }}>
      <svg width="70" height="70" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="35" cy="35" r={radius} fill="none"
          stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle cx="35" cy="35" r={radius} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne', fontWeight: 700, fontSize: '0.78rem', color,
      }}>
        {String(Math.floor(timeLeft / 60)).padStart(2,'0')}:{String(timeLeft % 60).padStart(2,'0')}
      </div>
    </div>
  );
};

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [streak, setStreak] = useState(0);
  const handleShare = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  toast.success('Quiz link copied! 🔗');
};


  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then(res => {
        setQuiz(res.data.quiz);
        if (res.data.quiz.timeLimit > 0) setTimeLeft(res.data.quiz.timeLimit);
      })
      .catch(() => toast.error('Quiz not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = useCallback(async (answersObj) => {
    setSubmitting(true);
    try {
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      const answersArray = quiz.questions.map((_, i) =>
        answersObj[i] !== undefined ? answersObj[i] : -1
      );
      const res = await api.post('/attempts', {
        quizId: id,
        answers: answersArray,
        timeTaken,
      });
      navigate(`/results/${id}`, { state: { result: res.data, quiz } });
    } catch (err) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  }, [id, quiz, startTime, navigate]);

  useEffect(() => {
    if (!started || timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          toast.error('Time is up!');
          handleSubmit(answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, answers, handleSubmit]);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const selectAnswer = (optIndex) => {
  const prev = answers[current];
  setAnswers(a => ({ ...a, [current]: optIndex }));
  if (prev === undefined) {
    setStreak(s => s + 1);
  }
};

  const handleNext = () => {
    if (current < quiz.questions.length - 1) setCurrent(c => c + 1);
  };

  const handlePrev = () => {
  if (current > 0) {
    setCurrent(c => c - 1);
    setStreak(0);
  }
};

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return (
    <div style={styles.center}>
      <div className="spinner" />
    </div>
  );

  if (!quiz) return (
    <div style={styles.center}>
      <p style={{ color: 'var(--text2)' }}>Quiz not found.</p>
    </div>
  );

  // Start screen
  if (!started) return (
  <div style={styles.center} className="page-enter">
    <div style={styles.startCard}>
      {/* Existing content stays same */}
      <div style={styles.startEmoji}>🧠</div>
      <h1 style={styles.startTitle}>{quiz.title}</h1>
      {quiz.description && (
        <p style={{ color:'var(--text2)', textAlign:'center' }}>{quiz.description}</p>
      )}

      {/* NEW: Info Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem', margin: '0.5rem 0'
      }}>
        {[
          { label: '📝 Questions', value: quiz.questions.length },
          { label: '⚡ Difficulty', value: quiz.difficulty },
          { label: '⏱ Time Limit', value: quiz.timeLimit > 0 ? `${Math.floor(quiz.timeLimit/60)}m ${quiz.timeLimit%60}s` : 'No limit' },
          { label: '🏷 Category', value: quiz.category },
          { label: '👤 Creator', value: quiz.creator?.name || 'Anonymous' },
          { label: '🎯 Attempts', value: `${quiz.attempts || 0} plays` },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--bg3)', borderRadius: 10,
            padding: '0.65rem', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '0.2rem' }}>
              {item.label}
            </p>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.value}</p>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleStart} style={{ width: '100%' }}>
        <FiZap size={18} /> Start Quiz
      </button>
      <button onClick={handleShare} className="btn btn-ghost" style={{ width: '100%' }}>
        🔗 Copy Quiz Link
      </button>
    </div>
  </div>
);

  const q = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;
  const answered = Object.keys(answers).length;
  const isTimeLow = timeLeft !== null && timeLeft <= 30;

  return (
    <div style={styles.takePage} className="page-enter">
      <div style={styles.topBar}>
        <div style={styles.progressInfo}>
          <span style={{ fontWeight: 600 }}>{quiz.title}</span>
          <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>
            {answered}/{quiz.questions.length} answered
          </span>
        </div>
        {timeLeft !== null && (
  <TimerRing timeLeft={timeLeft} totalTime={quiz.timeLimit} />
)}
      </div>

      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.quizBody}>
        {/* Question dots */}
        <div style={styles.dots}>
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                ...styles.dot,
                background: i === current ? 'var(--accent)' : answers[i] !== undefined ? 'rgba(16,185,129,0.5)' : 'var(--bg3)',
                border: i === current ? '2px solid var(--accent)' : '2px solid transparent',
                transform: i === current ? 'scale(1.25)' : 'scale(1)',
              }}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>

        {/* Question card */}
        <div style={styles.qCard} key={current}>
          <div style={{ ...styles.qTop, display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
  <span style={styles.qBadge}>Q {current + 1} / {quiz.questions.length}</span>
  {streak >= 3 && (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      background: 'rgba(245,158,11,0.15)',
      border: '1px solid rgba(245,158,11,0.4)',
      borderRadius: 100, padding: '0.25rem 0.75rem',
      fontSize: '0.8rem', color: 'var(--gold)',
      animation: 'pulse 1s infinite',
    }}>
      🔥 {streak} Streak!
    </span>
  )}
</div>
          <h2 style={styles.qText}>{q.text}</h2>

          <div style={styles.options}>
            {q.options.map((opt, oi) => {
              const selected = answers[current] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(oi)}
                  style={{
                    ...styles.option,
                    background: selected ? 'rgba(99,88,255,0.15)' : 'var(--bg3)',
                    border: selected ? '2px solid var(--accent)' : '2px solid var(--border2)',
                    color: selected ? 'var(--text)' : 'var(--text2)',
                  }}
                >
                  <span style={{
                    ...styles.optLetter,
                    background: selected ? 'var(--accent)' : 'var(--card2)',
                    color: selected ? '#fff' : 'var(--text3)',
                  }}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          <div style={styles.navRow}>
            <button className="btn btn-ghost" onClick={handlePrev} disabled={current === 0}>
              <FiArrowLeft size={16} /> Previous
            </button>

            {current < quiz.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next <FiArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit(answers)}
                disabled={submitting}
                style={{ background: 'linear-gradient(135deg, var(--green), #059669)' }}
              >
                {submitting ? 'Submitting…' : '✓ Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  center: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  startCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '2.5rem',
    maxWidth: 480, width: '100%', margin: '2rem 1rem',
    display: 'flex', flexDirection: 'column', gap: '1.25rem',
    boxShadow: 'var(--shadow)',
  },
  startEmoji: { fontSize: '3rem', textAlign: 'center' },
  startTitle: { fontFamily: 'Syne', fontWeight: 800, fontSize: '1.7rem', textAlign: 'center' },
  startMeta: { display: 'flex', justifyContent: 'center', gap: '1.5rem', alignItems: 'center' },
  startMetaItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' },
  metaVal: { fontFamily: 'Syne', fontWeight: 700, fontSize: '1.3rem' },
  metaLab: { fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: '0.05em' },
  divider: { width: 1, height: 40, background: 'var(--border2)' },
  takePage: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    background: 'var(--bg2)', borderBottom: '1px solid var(--border2)',
    position: 'sticky', top: 64, zIndex: 50,
  },
  progressInfo: { display: 'flex', flexDirection: 'column', gap: '0.1rem' },
  timer: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
    border: '1px solid', borderRadius: 8, padding: '0.35rem 0.75rem',
    transition: 'color 0.3s, border-color 0.3s',
  },
  progressBar: { height: 4, background: 'var(--bg3)' },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
    transition: 'width 0.4s ease',
    borderRadius: '0 2px 2px 0',
  },
  quizBody: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '2rem 1rem',
    gap: '1.5rem',
  },
  dots: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 640 },
  dot: {
    width: 12, height: 12, borderRadius: '50%',
    cursor: 'pointer', transition: 'var(--transition)',
  },
  qCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '2rem',
    maxWidth: 640, width: '100%',
    boxShadow: 'var(--shadow)',
    animation: 'fadeUp 0.3s ease',
  },
  qTop: { marginBottom: '1rem' },
  qBadge: {
    background: 'rgba(99,88,255,0.15)', color: 'var(--accent)',
    border: '1px solid rgba(99,88,255,0.3)',
    borderRadius: 100, padding: '0.25rem 0.75rem',
    fontSize: '0.8rem', fontWeight: 600,
  },
  qText: { fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.4 },
  options: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' },
  option: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-sm)',
    cursor: 'pointer', transition: 'var(--transition)',
    textAlign: 'left', fontSize: '0.95rem', lineHeight: 1.4,
    fontFamily: 'DM Sans',
  },
  optLetter: {
    width: 32, height: 32, flexShrink: 0,
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Syne',
    transition: 'var(--transition)',
  },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};

export default TakeQuiz;
