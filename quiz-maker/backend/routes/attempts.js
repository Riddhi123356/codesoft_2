const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const { protect, optionalAuth } = require('../middleware/auth');

// POST /api/attempts - submit quiz attempt
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    const gradedAnswers = quiz.questions.map((question, index) => {
      const selectedOption = answers[index] !== undefined ? answers[index] : -1;
      const isCorrect =
        selectedOption !== -1 && question.options[selectedOption]?.isCorrect === true;
      if (isCorrect) score++;
      return { questionIndex: index, selectedOption, isCorrect };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    const attempt = await Attempt.create({
      quiz: quizId,
      user: req.user?._id,
      answers: gradedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      timeTaken,
    });

    // Increment quiz attempt count
    await Quiz.findByIdAndUpdate(quizId, { $inc: { attempts: 1 } });

    // Return results with correct answers revealed
    const results = quiz.questions.map((question, index) => ({
      questionText: question.text,
      options: question.options.map((o) => o.text),
      correctIndex: question.options.findIndex((o) => o.isCorrect),
      selectedIndex: answers[index] !== undefined ? answers[index] : -1,
      isCorrect: gradedAnswers[index].isCorrect,
      explanation: question.explanation,
    }));

    res.status(201).json({ attempt, score, percentage, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attempts/quiz/:quizId - leaderboard for a quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const attempts = await Attempt.find({ quiz: req.params.quizId })
      .populate('user', 'name')
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(10);
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attempts/my - user's attempt history
router.get('/my', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate('quiz', 'title category difficulty')
      .sort({ createdAt: -1 });
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
