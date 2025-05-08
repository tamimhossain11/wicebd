const axios = require('axios');
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
      { app_key: appKey, app_secret: appSecret },
      {
        headers: {
          username,
          password,
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

const initiatePayment = async (req, res) => {
  try {
    const sessionID = req.sessionID;
    console.log('🚀 INITIATE hit | Session ID:', sessionID);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute(
      'SELECT * FROM temp_registrations WHERE session_id = ?',
      [sessionID]
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No temp registration found for this session' });
    }

    const data = rows[0];

    const token = await getBkashToken();
    const amount = '5'; // BDT

    const paymentRes = await axios.post(
      `${process.env.BKASH_BASE_URL}/tokenized/checkout/create`,
      {
        mode: '0011',
        amount,
        currency: 'BDT',
        intent: 'sale',
        payerReference: sessionID,
        merchantInvoiceNumber: 'INV-' + Date.now(),
        callbackURL: `${process.env.FRONTEND_BASE_URL}/success`,
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
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });

      const [rows] = await connection.execute(
        'SELECT * FROM temp_registrations WHERE session_id = ?',
        [sessionID]
      );

      if (rows.length === 0) {
        await connection.end();
        return res.status(404).json({ error: 'Registration data not found' });
      }

      const data = rows[0];

      const insertSQL = `
        INSERT INTO registrations (
          participantCategory, country, competitionCategory, projectSubcategory, categories, crRefrence,
          leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
          member2, institution2, tshirtSize2,
          member3, institution3, tshirtSize3,
          projectTitle, projectCategory, participatedBefore, previousCompetition,
          socialMedia, infoSource,
          transactionId, paymentStatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.participantCategory,
        data.country,
        data.competitionCategory,
        data.projectSubcategory,
        data.categories,
        data.crRefrence,

        data.leader,
        data.institution,
        data.leaderPhone,
        data.leaderWhatsApp,
        data.leaderEmail,
        data.tshirtSizeLeader,

        data.member2,
        data.institution2,
        data.tshirtSize2,

        data.member3,
        data.institution3,
        data.tshirtSize3,

        data.projectTitle,
        data.projectCategory,
        data.participatedBefore,
        data.previousCompetition,

        data.socialMedia,
        data.infoSource,

        executeRes.data.paymentID,
        executeRes.data.transactionStatus
      ];

      await connection.execute(insertSQL, values);
      await connection.execute('DELETE FROM temp_registrations WHERE session_id = ?', [sessionID]);
      await connection.end();

      res.status(200).json({
        success: true,
        message: 'Payment executed and registration saved.',
        transactionId: executeRes.data.paymentID,
        paymentStatus: executeRes.data.transactionStatus
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Payment was not completed',
        transactionStatus: executeRes.data?.transactionStatus,
        rawResponse: executeRes.data
      });
    }
  } catch (err) {
    console.error('Error executing payment:', err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: 'Payment execution failed',
      error: err.response?.data || err.message
    });
  }
};

module.exports = { initiatePayment, executePayment };
