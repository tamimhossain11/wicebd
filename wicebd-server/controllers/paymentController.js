const axios = require('axios');
const {
  getTempRegistration,
  deleteTempRegistration
} = require('../tempData/tempRegistration');
const mysql = require('mysql2/promise');

// Get bKash Token
const getBkashToken = async () => {
  const username = process.env.BKASH_USERNAME;
  const password = process.env.BKASH_PASSWORD;
  const appKey = process.env.BKASH_APP_KEY;
  const appSecret = process.env.BKASH_APP_SECRET;
  const baseURL = process.env.BKASH_BASE_URL;

  try {
    const res = await axios.post(
      `${baseURL}/tokenized/checkout/token/grant`,
      {
        app_key: appKey,
        app_secret: appSecret
      },
      {
        headers: {
          username: username,
          password: password,
          'Content-Type': 'application/json'
        }
      }
    );

    const idToken = res.data?.id_token;
    if (!idToken) throw new Error('No id_token received');

    return `Bearer ${idToken}`;
  } catch (err) {
    console.error('❌ Error fetching bKash token:', err.response?.data || err.message);
    throw new Error('Failed to get bKash token');
  }
};

module.exports = { getBkashToken };

const initiatePayment = async (req, res) => {
  try {
    const sessionID = req.sessionID;
    console.log('🚀 INITIATE hit');
    console.log('Session ID:', sessionID);

    const data = getTempRegistration(sessionID);
    console.log('Temp registration data:', data);

    if (!data) {
      return res.status(404).json({ error: 'No registration data found' });
    }

    const token = await getBkashToken();
    const amount = '5';

    const paymentRes = await axios.post(
  `${process.env.BKASH_BASE_URL}/tokenized/checkout/create`,
  {
    mode: '0011',
    amount,
    currency: 'BDT',
    intent: 'sale',
    payerReference: sessionID,
    merchantInvoiceNumber: 'INV-' + Date.now(),
    callbackURL: 'http://localhost:5173/success',
    merchantAssociationInfo: 'MI05MID54RF09123456One'
  },
  {
    headers: {
      authorization: token,
      'x-app-key': process.env.BKASH_APP_KEY,
      'Content-Type': 'application/json'
    }
  }
);

    if (paymentRes.data?.bkashURL) {
      res.status(200).json({ bkashURL: paymentRes.data.bkashURL });
    } else {
      res.status(400).json({ error: 'Failed to create bKash payment' });
    }
  } catch (err) {
    console.error('Error initiating payment:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

// Execute Payment
const executePayment = async (req, res) => {
  try {
    const { paymentID } = req.query;
    const sessionID = req.sessionID;

    if (!paymentID) return res.status(400).json({ error: 'Missing paymentID' });

    const token = await getBkashToken();

    const executeRes = await axios.post(
      `${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`,
      { paymentID },
      {
        headers: {
          authorization: token,
          'x-app-key': process.env.BKASH_APP_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (executeRes.data?.transactionStatus === 'Completed') {
      const registrationData = getTempRegistration(sessionID);

      if (!registrationData) {
        return res.status(404).json({ error: 'Registration data not found' });
      }

      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });

      const sql = `
        INSERT INTO registrations 
        (participantCategory, competitionCategory, teamMembers, leaderWhatsApp, phoneCode, leaderEmail, schoolName, grade, country, supervisorName, supervisorWhatsApp, supervisorEmail, projectTitle, projectCategory, participatedBefore, previousCompetition, socialMedia, infoSource) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        registrationData.participantCategory,
        registrationData.competitionCategory,
        registrationData.teamMembers,
        registrationData.leaderWhatsApp,
        registrationData.phoneCode,
        registrationData.leaderEmail,
        registrationData.schoolName,
        registrationData.grade,
        registrationData.country,
        registrationData.supervisorName,
        registrationData.supervisorWhatsApp,
        registrationData.supervisorEmail,
        registrationData.projectTitle,
        registrationData.projectCategory,
        registrationData.participatedBefore,
        registrationData.previousCompetition,
        registrationData.socialMedia,
        registrationData.infoSource,
      ];

      await connection.execute(sql, values);
      await connection.end();

      deleteTempRegistration(sessionID);

      res.status(200).json({
        success: true,
        message: 'Payment executed and registration saved.'
      });      
    } else {
      console.error('Payment not completed:', executeRes.data);
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Error executing payment:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment execution failed' });
  }
};

module.exports = { initiatePayment, executePayment };
