const { saveTempRegistration } = require('../tempData/tempRegistration');

const startRegistration = async (req, res) => {
  const sessionID = req.sessionID;
  const registrationData = req.body;

  if (!registrationData.participantCategory || !registrationData.leaderEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  saveTempRegistration(sessionID, registrationData);
  res.status(200).json({ message: 'Data saved temporarily' });
};

module.exports = { startRegistration };
