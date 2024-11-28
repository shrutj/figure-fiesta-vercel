const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from React
//app.use(cors({ origin: 'http://localhost:3001' })); // Allow requests from React

// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_rq92ZJiAt5qXIY', // Replace with your Razorpay Key ID
  key_secret: 'JCxsedlvNRfN9hdMjVWWBrAH', // Replace with your Razorpay Key Secret
});

app.use(bodyParser.json());

// Create Order
app.post('/api/create-order', (req, res) => {
  const { amount } = req.body; // Amount in paise

  const options = {
    amount: amount, // Convert to paise
    currency: 'INR',
    receipt: `receipt_${new Date().getTime()}`,
    payment_capture: 1,
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      console.error('Error creating Razorpay order:', err);
      return res.status(500).json({ error: 'Error creating Razorpay order' });
    }
    res.json(order);
  });
});

// Verify Payment Success
app.post('/api/payment-success', (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto.createHmac('sha256', 'JCxsedlvNRfN9hdMjVWWBrAH')
                                   .update(body.toString())
                                   .digest('hex');

  if (expectedSignature === signature) {
    // Payment verified successfully
    res.json({ success: true });
  } else {
    // Payment verification failed
    res.json({ success: false });
  }
});

// Refund Payment
app.post('/api/refund-payment', async (req, res) => {
  const { orderId, paymentId } = req.body;
  console.log(req.body);
  
  if (!paymentId) {
    return res.status(400).json({ error: 'Payment ID not found for this order' });
  }

  try {
    // Make API call to Razorpay to initiate refund
    const refund = await razorpay.payments.refund(paymentId);

    if (refund && refund.status === 'captured') {
      // Refund successfully processed
      // Update order status in your database (you may implement this logic based on your database)
      // await updateOrderStatusInDatabase(orderId, 'Refund_Successful'); 

      return res.json({ success: true, refundDetails: refund });
    } else {
      return res.status(400).json({ error: 'Refund failed', details: refund });
    }
  } catch (error) {
    console.error('Error refunding payment:', error);
    return res.status(500).json({ error: 'Error processing refund', details: error });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
