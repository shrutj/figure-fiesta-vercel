const crypto = require('crypto');

export default async function handler(req, res) {
  // CORS middleware
  res.setHeader('Access-Control-Allow-Origin', 'https://www.figurefiesta.com'); // Allow only your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // If needed for cookies/authentication

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Respond with status 200 for OPTIONS
  }

  // Handle POST request for payment verification
  if (req.method === 'POST') {
    const { paymentId, orderId, signature } = req.body;

    // Concatenate orderId and paymentId to create the body string
    const body = orderId + "|" + paymentId;

    // Generate the expected signature using Razorpay's secret key
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Compare the expected signature with the received signature
    if (expectedSignature === signature) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: 'Signature mismatch' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
