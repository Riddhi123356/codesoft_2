const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false },
});

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [optionSchema], required: true, validate: v => v.length >= 2 },
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Science', 'Math', 'History', 'Technology', 'Sports', 'Entertainment', 'Other'],
    },
    difficulty: { type: String, default: 'Medium', enum: ['Easy', 'Medium', 'Hard'] },
    timeLimit: { type: Number, default: 0 }, // 0 = no limit, else seconds
    questions: { type: [questionSchema], required: true, validate: v => v.length >= 1 },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true },
    attempts: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
