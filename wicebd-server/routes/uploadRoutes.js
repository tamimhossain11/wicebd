const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticateAdmin = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../controllers/uploadController');

// Memory storage — file lives in req.file.buffer, no local disk writes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/.test(file.mimetype);
    cb(ok ? null : new Error('Only image files are allowed'), ok);
  },
});

router.post('/image',  authenticateAdmin, upload.single('image'), uploadImage);
router.delete('/image', authenticateAdmin, deleteImage);

module.exports = router;
