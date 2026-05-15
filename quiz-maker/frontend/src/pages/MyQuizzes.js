import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiUsers, FiBarChart2, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

const diffColors = { Easy: 'green', Medium: 'gold', Hard: 'red' };

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/quizzes/my')
      .then(res => setQuizzes(res.data.quizzes))
      .catch(() => toast.error('Failed to load quizzes'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes(q => q.filter(x => x._id !== id));
      toast.success('Quiz deleted');
    } catch {
      toast.error('Failed to delete quiz');
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = async (quiz) => {
  try {
    const res = await api.get(`/quizzes/${quiz._id}/full`);
    const original = res.data.quiz;
    const payload = {
      title: `${original.title} (Copy)`,
      description: original.description,
      category: original.category,
      difficulty: original.difficulty,
      timeLimit: original.timeLimit,
      tags: original.tags,
      questions: original.questions.map(q => ({
        text: q.text,
        explanation: q.explanation,
        options: q.options.map(o => ({
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    };
    const created = await api.post('/quizzes', payload);
    setQuizzes(prev => [created.data.quiz, ...prev]);
    toast.success('Quiz duplicated! ✅');
  } catch {
    toast.error('Failed to duplicate quiz');
  }
};

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ padding: '2.5rem 0 5rem' }} className="page-enter">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', marginBottom: '0.3rem' }}>My Quizzes</h1>
            <p style={{ color: 'var(--text2)' }}>{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} created</p>
          </div>
          <Link to="/create" className="btn btn-primary">
            <FiPlus size={16} /> Create New Quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</p>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.5rem' }}>No quizzes yet</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>Create your first quiz and share it with the world!</p>
            <Link to="/create" className="btn btn-primary">
              <FiPlus size={16} /> Create First Quiz
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quizzes.map(quiz => (
              <div key={quiz._id} style={styles.row}>
                <div style={styles.rowLeft}>
                  <div style={styles.rowIcon}>
                    {quiz.category === 'Science' ? '🔬' : quiz.category === 'Math' ? '➗' : quiz.category === 'History' ? '📜' : quiz.category === 'Technology' ? '💻' : quiz.category === 'Sports' ? '⚽' : quiz.category === 'Entertainment' ? '🎬' : '🌐'}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{quiz.title}</h3>
                    <div style={styles.rowMeta}>
                      <span className={`badge badge-${diffColors[quiz.difficulty]}`}>{quiz.difficulty}</span>
                      <span style={styles.metaChip}><FiBarChart2 size={11} /> {quiz.questions?.length || 0} Qs</span>
                      <span style={styles.metaChip}><FiUsers size={11} /> {quiz.attempts || 0} plays</span>
                      <span style={styles.metaChip}>{quiz.category}</span>
                    </div>
                  </div>
                </div>
                <div style={styles.rowActions}>
                  <Link to={`/quiz/${quiz._id}`} className="btn btn-ghost btn-sm" title="Preview">
                    <FiEye size={14} /> Preview
                  </Link>
                  <Link to={`/edit/${quiz._id}`} className="btn btn-secondary btn-sm" title="Edit">
                    <FiEdit2 size={14} /> Edit
                  </Link>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDuplicate(quiz)} title="Duplicate Quiz"
                  ><FiCopy size={14} /> Copy </button>
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={deleting === quiz._id}
                    onClick={() => handleDelete(quiz._id, quiz.title)}
                    title="Delete"
                  >
                    <FiTrash2 size={14} /> {deleting === quiz._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  empty: {
    textAlign: 'center', padding: '5rem 2rem',
    background: 'var(--card)', borderRadius: 'var(--radius)',
    border: '1px dashed var(--border2)',
  },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '1rem', flexWrap: 'wrap',
    background: 'var(--card)', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)', padding: '1.1rem 1.4rem',
    transition: 'var(--transition)',
  },
  rowLeft: { display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 200 },
  rowIcon: {
    fontSize: '1.6rem', width: 44, height: 44,
    background: 'var(--bg3)', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  rowMeta: { display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.25rem' },
  metaChip: {
    display: 'flex', alignItems: 'center', gap: '0.25rem',
    fontSize: '0.75rem', color: 'var(--text3)',
    background: 'var(--bg3)', padding: '0.2rem 0.5rem',
    borderRadius: 6,
  },
  rowActions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' },
};

export default MyQuizzes;
