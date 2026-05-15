const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sendEmail, applicationReceivedEmail, applicationStatusEmail, newApplicationEmail } = require('../utils/email');
const router = express.Router();

router.post('/', protect, authorize('candidate'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId).populate('employer');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const exists = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (exists) return res.status(400).json({ message: 'Already applied for this job' });
    const resumePath = req.file ? `/uploads/${req.file.filename}` : req.user.resume;
    const application = await Application.create({
      job: jobId, candidate: req.user._id, employer: job.employer._id, coverLetter, resume: resumePath
    });
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });
    sendEmail({ to: req.user.email, subject: 'Application Received', html: applicationReceivedEmail(req.user.name, job.title, job.company) });
    sendEmail({ to: job.employer.email, subject: 'New Job Application', html: newApplicationEmail(job.employer.name, req.user.name, job.title) });
    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already applied for this job' });
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-applications', protect, authorize('candidate'), async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location type salary status companyLogo')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/job/:jobId', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone location avatar skills resume')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('candidate').populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    application.status = req.body.status;
    application.notes = req.body.notes || application.notes;
    application.updatedAt = Date.now();
    await application.save();
    sendEmail({
      to: application.candidate.email,
      subject: `Application Status Update - ${application.job.title}`,
      html: applicationStatusEmail(application.candidate.name, application.job.title, application.job.company, req.body.status)
    });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await application.deleteOne();
    await Job.findByIdAndUpdate(application.job, { $inc: { applicationCount: -1 } });
    res.json({ message: 'Application withdrawn' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
