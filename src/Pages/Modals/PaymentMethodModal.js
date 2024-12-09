import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './PaymentMethodModal.css';
import axios from 'axios'; // We will use axios to make requests to the backend
import { toast } from 'react-toastify'; // Import toast function
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import '../Styles/CustomToast.css';
import logo from '../../Assets/logo-razorpay.jpeg';

const PaymentMethodModal = ({ isVisible, onClose, onPaymentSelect, totalAmount, userData }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load the Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setRazorpayLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Failed to load payment gateway. Please refresh the page.');
    };

    document.body.appendChild(script);

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isVisible) return null;

  const handlePaymentSelect = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleProceed = () => {
    if (selectedPayment === 'online') {
      initiateRazorpayPayment();
    } else if (selectedPayment === 'cod') {
      onPaymentSelect('cod');
    } else {
      toast.error('Please select a payment method.');
    }
  };

  const initiateRazorpayPayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Payment gateway is not ready. Please refresh and try again.');
      return;
    }

    try {
      // Step 1: Request a Razorpay order from the backend
      const response = await axios.post('https://figure-fiesta-vercel.vercel.app/api/create-order', { amount: totalAmount * 100 }); // Amount in paise
      const orderData = response.data;

      // Step 2: Initialize Razorpay with the order data
      const options = {
        key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Figure Fiesta',
        description: 'Order Payment',
        image: logo, // Optional
        order_id: orderData.id,
        handler: function (response) {
          console.log("response", response);
          handlePaymentSuccess(response, orderData.id);
        },
        prefill: {
          name: userData.username, // Prefill user details (can be dynamic)
          email: userData.email,
          contact: userData.phone,
        },
        theme: {
          color: '#ff5722',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      toast.error('There was an issue with the payment process. Please try again.');
    }
  };

  const handlePaymentSuccess = (paymentResponse, paymentOrderId) => {
    console.log("payment response", paymentResponse);
    console.log("payment id",paymentResponse.razorpay_payment_id, "payment order id",paymentResponse.razorpay_order_id,"signature",paymentResponse.razorpay_signature);
    // Send payment details to the backend for verification and order processing
    axios.post('https://figure-fiesta-vercel.vercel.app/api/payment-success', {
      paymentId: paymentResponse.razorpay_payment_id,
      orderId: paymentResponse.razorpay_order_id,
      signature: paymentResponse.razorpay_signature,
    })
      .then(response => {
        if (response.data.success) {
          toast.success('Payment successful', { className: 'custom-toast-success' });
          onPaymentSelect('online', paymentResponse.razorpay_payment_id, paymentOrderId);
        } else {
          toast.error('Payment verification failed');
        }
      })
      .catch(error => {
        console.error('Error verifying payment:', error);
        toast.error('There was an issue verifying your payment. Please try again.');
      });
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-content">
        <button className="payment-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="payment-modal-header">Select Payment Method</h2>
        <div className="payment-methods">
          <label className="payment-method">
            <input
              type="radio"
              name="payment-method"
              value="online"
              checked={selectedPayment === 'online'}
              onChange={handlePaymentSelect}
            />
            Pay Online
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="payment-method"
              value="cod"
              checked={selectedPayment === 'cod'}
              onChange={handlePaymentSelect}
            />
            Cash on Delivery
          </label>
        </div>
        <button className="payment-proceed-button" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
