// api/create-order.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use the environment variable for Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Use the environment variable for Razorpay Key Secret
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { amount } = req.body;

    const options = {
      amount: amount, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: 1,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (err) {
      console.error('Error creating Razorpay order:', err);
      res.status(500).json({ error: 'Error creating Razorpay order' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
