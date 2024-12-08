
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Concatenate orderId and paymentId to create the body string
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    try {
      // Verify signature using Razorpay's SDK method
      const isValidSignature = razorpay.utils.verifyPaymentSignature({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature
      });

      // Check if the signature is valid
      if (isValidSignature) {
        // Payment verified successfully, process the order here (e.g., update order status)
        // Assuming you have a function to handle order updates in your system
        // const orders = readData();  // Replace this with your order fetching logic
        // const order = orders.find(o => o.order_id === razorpay_order_id);

        // if (order) {
        //   order.status = 'paid'; // Update status to 'paid'
        //   order.payment_id = razorpay_payment_id; // Store Razorpay payment ID
        //   writeData(orders); // Write the updated order back to your database
        // }

        
        console.log('Payment verification successful');
        return res.status(200).json({ success: true });
      } else {
        
        console.log('Payment verification failed');
        return res.status(400).json({ success: false, message: 'Signature mismatch' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
