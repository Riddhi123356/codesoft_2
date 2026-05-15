const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect, optionalAuth } = require('../middleware/auth');

// GET /api/quizzes - list all published quizzes
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const total = await Quiz.countDocuments(filter);
    const quizzes = await Quiz.find(filter)
      .populate('creator', 'name')
      .select('-questions.options.isCorrect')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ quizzes, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/quizzes/my - my quizzes (auth required)
router.get('/my', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user._id })
      .populate('creator', 'name')
      .sort({ createdAt: -1 });
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/quizzes/:id - get quiz for taking (hide correct answers)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('creator', 'name');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Strip correct answer info
    const safeQuiz = quiz.toObject();
    safeQuiz.questions = safeQuiz.questions.map((q) => ({
      ...q,
      options: q.options.map(({ text, _id }) => ({ text, _id })),
    }));
    res.json({ quiz: safeQuiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/quizzes/:id/full - full quiz with answers (creator only)
router.get('/:id/full', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/quizzes - create quiz
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions, tags } = req.body;
    if (!title || !questions || questions.length === 0)
      return res.status(400).json({ message: 'Title and at least one question are required' });

    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      questions,
      tags,
      creator: req.user._id,
    });
    res.status(201).json({ quiz });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/quizzes/:id - update quiz
router.put('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ quiz: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/quizzes/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
