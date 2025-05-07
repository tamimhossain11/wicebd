const express = require('express');
const router = express.Router();
const { saveTempRegistration } = require('../tempData/tempRegistration');

router.post('/temp-save', (req, res) => {
  const sessionID = req.sessionID;

  console.log('📥 TEMP-SAVE hit');
  console.log('Session ID:', sessionID);
  console.log('Saving data:', req.body);

  saveTempRegistration(sessionID, req.body);

  res.status(200).json({ message: 'Temp registration saved' });
});

module.exports = router;
