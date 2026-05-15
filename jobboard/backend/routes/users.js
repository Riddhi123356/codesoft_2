const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Admin — badha users joi shake
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);
    
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', protect, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.avatar) updates.avatar = `/uploads/${req.files.avatar[0].filename}`;
    if (req.files?.resume) updates.resume = `/uploads/${req.files.resume[0].filename}`;
    if (typeof updates.skills === 'string') updates.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof updates.experience === 'string') updates.experience = JSON.parse(updates.experience);
    if (typeof updates.education === 'string') updates.education = JSON.parse(updates.education);
    if (typeof updates.company === 'string') updates.company = JSON.parse(updates.company);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/save-job/:jobId', protect, authorize('candidate'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;
    const idx = user.savedJobs.indexOf(jobId);
    if (idx === -1) user.savedJobs.push(jobId);
    else user.savedJobs.splice(idx, 1);
    await user.save();
    res.json({ savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/saved-jobs', protect, authorize('candidate'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Admin — user deactivate/activate
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin — user role change
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
