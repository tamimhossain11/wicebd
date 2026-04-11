const axios = require('axios');
require('dotenv').config();

const PAYSTATION_BASE_URL = 'https://api.paystation.com.bd';

const initiatePayment = async ({ invoiceNumber, amount, custName, custPhone, custEmail, callbackUrl, reference, checkoutItems }) => {
  try {
    const res = await axios.post(`${PAYSTATION_BASE_URL}/initiate-payment`, {
      merchantId: process.env.PAYSTATION_MERCHANT_ID,
      password: process.env.PAYSTATION_PASSWORD,
      invoice_number: invoiceNumber,
      currency: 'BDT',
      payment_amount: amount,
      pay_with_charge: 1,
      reference: reference || '',
      cust_name: custName,
      cust_phone: custPhone,
      cust_email: custEmail,
      callback_url: callbackUrl,
      checkout_items: checkoutItems || '',
    });
    console.log('📦 PayStation initiatePayment response:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ PayStation initiatePayment error:', err.response?.data || err.message);
    throw new Error('Failed to initiate PayStation payment');
  }
};

const getTransactionStatus = async (invoiceNumber) => {
  try {
    const res = await axios.post(
      `${PAYSTATION_BASE_URL}/transaction-status`,
      { invoice_number: invoiceNumber },
      { headers: { merchantId: process.env.PAYSTATION_MERCHANT_ID } }
    );
    console.log('📊 PayStation transactionStatus response:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ PayStation transactionStatus error:', err.response?.data || err.message);
    throw new Error('Failed to get PayStation transaction status');
  }
};

module.exports = { initiatePayment, getTransactionStatus };
