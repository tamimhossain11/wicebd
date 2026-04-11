const path = require('path');
const { uploadBuffer, deleteFile } = require('../utils/gcsStorage');

// POST /api/upload/image  (admin only — multer puts file in req.file)
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const ext  = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const dest = `announcements/${name}`;

    const url = await uploadBuffer(req.file.buffer, dest, req.file.mimetype);
    res.json({ success: true, url });
  } catch (err) {
    console.error('uploadImage error:', err);
    res.status(500).json({ success: false, message: 'Upload failed: ' + err.message });
  }
};

// DELETE /api/upload/image  (admin only)
// body: { url: 'https://storage.googleapis.com/...' }
const deleteImage = async (req, res) => {
  try {
    const { url } = req.body;
    if (url) await deleteFile(url);
    res.json({ success: true });
  } catch (err) {
    console.error('deleteImage error:', err);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

module.exports = { uploadImage, deleteImage };
