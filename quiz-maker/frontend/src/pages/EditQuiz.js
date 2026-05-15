import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CATEGORIES = ['General', 'Science', 'Math', 'History', 'Technology', 'Sports', 'Entertainment', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const emptyOption = () => ({ text: '', isCorrect: false });
const emptyQuestion = () => ({ text: '', explanation: '', options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()] });

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState({ title: '', description: '', category: 'General', difficulty: 'Medium', timeLimit: 0, tags: '' });
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [collapsed, setCollapsed] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/quizzes/${id}/full`)
      .then(res => {
        const q = res.data.quiz;
        setMeta({
          title: q.title,
          description: q.description || '',
          category: q.category,
          difficulty: q.difficulty,
          timeLimit: q.timeLimit || 0,
          tags: (q.tags || []).join(', '),
        });
        setQuestions(q.questions.map(qu => ({
          text: qu.text,
          explanation: qu.explanation || '',
          options: qu.options.map(o => ({ text: o.text, isCorrect: o.isCorrect })),
        })));
      })
      .catch(() => { toast.error('Could not load quiz'); navigate('/my-quizzes'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const setMF = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });
  const updateQ = (i, field, val) => setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [field]: val } : q));
  const updateOpt = (qi, oi, field, val) => setQuestions(qs => qs.map((q, idx) => {
    if (idx !== qi) return q;
    return { ...q, options: q.options.map((o, oidx) => oidx === oi ? { ...o, [field]: val } : o) };
  }));
  const setCorrect = (qi, oi) => setQuestions(qs => qs.map((q, idx) => {
    if (idx !== qi) return q;
    return { ...q, options: q.options.map((o, oidx) => ({ ...o, isCorrect: oidx === oi })) };
  }));
  const addOption = (qi) => setQuestions(qs => qs.map((q, idx) => idx === qi && q.options.length < 6 ? { ...q, options: [...q.options, emptyOption()] } : q));
  const removeOption = (qi, oi) => setQuestions(qs => qs.map((q, idx) => idx === qi && q.options.length > 2 ? { ...q, options: q.options.filter((_, i) => i !== oi) } : q));
  const addQuestion = () => setQuestions(qs => [...qs, emptyQuestion()]);
  const removeQuestion = (i) => setQuestions(qs => qs.filter((_, idx) => idx !== i));
  const toggleCollapse = (i) => setCollapsed(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return toast.error(`Question ${i + 1} text is required`);
      if (!q.options.some(o => o.isCorrect)) return toast.error(`Question ${i + 1} needs a correct answer`);
      if (q.options.some(o => !o.text.trim())) return toast.error(`All options in Q${i + 1} must be filled`);
    }
    setSaving(true);
    try {
      const payload = {
        ...meta,
        timeLimit: Number(meta.timeLimit),
        tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean),
        questions,
      };
      await api.put(`/quizzes/${id}`, payload);
      toast.success('Quiz updated!');
      navigate('/my-quizzes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ padding: '2.5rem 0 5rem' }} className="page-enter">
      <div className="container-md">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', marginBottom: '0.4rem' }}>Edit Quiz</h1>
          <p style={{ color: 'var(--text2)' }}>Update your quiz details and questions</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Quiz Details</h2>
            <div className="form-group">
              <label>Quiz Title *</label>
              <input className="form-input" value={meta.title} onChange={setMF('title')} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" rows={3} value={meta.description} onChange={setMF('description')} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select className="form-input" value={meta.category} onChange={setMF('category')}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select className="form-input" value={meta.difficulty} onChange={setMF('difficulty')}>
                  {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Time Limit (seconds)</label>
                <input className="form-input" type="number" min={0} value={meta.timeLimit} onChange={setMF('timeLimit')} />
              </div>
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input className="form-input" value={meta.tags} onChange={setMF('tags')} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {questions.map((q, qi) => {
              const isCollapsed = collapsed.includes(qi);
              return (
                <div key={qi} style={styles.questionCard}>
                  <div style={styles.qHeader} onClick={() => toggleCollapse(qi)}>
                    <span style={styles.qNum}>Q{qi + 1}</span>
                    <span style={{ flex: 1, color: q.text ? 'var(--text)' : 'var(--text3)', fontSize: '0.95rem' }}>
                      {q.text || 'Untitled question'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {questions.length > 1 && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); removeQuestion(qi); }}>
                          <FiTrash2 size={13} />
                        </button>
                      )}
                      {isCollapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border2)' }}>
                      <div className="form-group">
                        <label>Question Text *</label>
                        <textarea className="form-input" rows={2} value={q.text} onChange={e => updateQ(qi, 'text', e.target.value)} style={{ resize: 'vertical' }} />
                      </div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text2)', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
                        Answer Options — click ✓ to mark correct
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button type="button" onClick={() => setCorrect(qi, oi)} style={{ ...styles.correctBtn, background: opt.isCorrect ? 'var(--green)' : 'var(--bg3)', borderColor: opt.isCorrect ? 'var(--green)' : 'var(--border2)', color: opt.isCorrect ? '#fff' : 'var(--text3)' }}>
                              <FiCheck size={14} />
                            </button>
                            <input className="form-input" style={{ flex: 1 }} placeholder={`Option ${oi + 1}`} value={opt.text} onChange={e => updateOpt(qi, oi, 'text', e.target.value)} />
                            {q.options.length > 2 && (
                              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeOption(qi, oi)}>
                                <FiTrash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {q.options.length < 6 && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => addOption(qi)} style={{ marginBottom: '1rem' }}>
                          <FiPlus size={13} /> Add Option
                        </button>
                      )}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Explanation (optional)</label>
                        <input className="form-input" value={q.explanation} onChange={e => updateQ(qi, 'explanation', e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-ghost" onClick={addQuestion}>
              <FiPlus size={16} /> Add Question
            </button>
            <span style={{ color: 'var(--text3)', fontSize: '0.85rem', alignSelf: 'center' }}>
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ flex: 1 }}>
              {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/my-quizzes')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  section: { background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.75rem', marginBottom: '1.5rem' },
  sectionTitle: { fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' },
  questionCard: { background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  qHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'var(--transition)' },
  qNum: { width: 28, height: 28, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 },
  correctBtn: { width: 32, height: 32, flexShrink: 0, border: '2px solid', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)', cursor: 'pointer' },
};

export default EditQuiz;
