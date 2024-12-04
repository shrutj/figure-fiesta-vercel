// api/payment-success.js
const crypto = require('crypto');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { paymentId, orderId, signature } = req.body;

    const body = orderId + "|" + paymentId;

    // Use the Razorpay secret key from environment variables
    const expectedSignature = crypto.createHmac('sha256', 'mvCtH6tvbFTgONlkrz6UF6q7')
                                    .update(body.toString())
                                    .digest('hex');

    if (expectedSignature === signature) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
