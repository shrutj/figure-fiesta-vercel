const Razorpay = require('razorpay');

// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use the environment variable for Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Use the environment variable for Razorpay Key Secret
});

export default async function handler(req, res) {
  // CORS middleware
  res.setHeader('Access-Control-Allow-Origin', 'https://www.figurefiesta.com'); // Your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies/credentials if needed

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Respond with status 200 for OPTIONS request
  }

  // Handle POST request for order creation
  if (req.method === 'POST') {
    const { amount } = req.body;

    const options = {
      amount: amount, // Amount in paise
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
}
