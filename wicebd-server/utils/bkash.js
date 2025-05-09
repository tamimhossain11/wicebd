const axios = require('axios');
require('dotenv').config();

let token = null;

const getToken = async () => {
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


  const createPayment = async (amount, paymentID) => {
    const token = await getToken();
  
    const response = await axios.post(
      `${process.env.BKASH_BASE_URL}/tokenized/checkout/create`,
      {
        mode: '0011',
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        payerReference: paymentID,
        merchantInvoiceNumber: 'INV-' + Date.now(),
        callbackURL: `${process.env.FRONTEND_BASE_URL}/callback`,
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
  
    console.log("📦 bKash createPayment response:", response.data);
return response.data;

  };
  
    

  const executePayment = async (paymentID) => {
    const token = await getToken();
  
    try {
      const response = await axios.post(
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
  
      console.log("✅ Payment executed:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ bKash execute error:", error?.response?.data || error.message);
      throw error;
    }
  };
  
  
module.exports = { getToken, createPayment, executePayment };

