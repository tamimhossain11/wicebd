let tempRegistrationData = {};

const saveTempRegistration = (sessionID, data) => {
  tempRegistrationData[sessionID] = data;
};

const getTempRegistration = (sessionID) => {
  return tempRegistrationData[sessionID];
};

const deleteTempRegistration = (sessionID) => {
  delete tempRegistrationData[sessionID];
};

module.exports = {
  saveTempRegistration,
  getTempRegistration,
  deleteTempRegistration,
};
