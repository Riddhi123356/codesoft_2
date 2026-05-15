const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  companyLogo: { type: String, default: '' },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  location: { type: String, required: true },
  locationType: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'onsite' },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], default: 'full-time' },
  category: { type: String, required: true },
  experience: { type: String, enum: ['entry', 'mid', 'senior', 'lead', 'manager'], default: 'mid' },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
    isNegotiable: { type: Boolean, default: false }
  },
  skills: [{ type: String }],
  benefits: [{ type: String }],
  applicationDeadline: { type: Date },
  applicationCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

jobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });
jobSchema.index({ category: 1, location: 1, type: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
