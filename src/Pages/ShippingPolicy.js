import React from "react";
import './Styles/ShippingPolicy.css'
import { useNavigate } from "react-router-dom";

const ShippingPolicy = () => {
    const navigate = useNavigate();
  return (
    <div className="shipping-policy-container">
      <h2 className="shipping-policy-header">Shipping Policy</h2>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Processing Time</h3>
        <p className="shipping-policy-text">
          All orders are processed and shipped within 2-3 working days by the seller. Kindly note that orders placed on weekends or public holidays may experience a slight delay. 
        </p>
      </section>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Shipping Rates and Delivery Times</h3>
        <p className="shipping-policy-text">
          Shipping within India for orders above 499 is complimentary, rest a delivery charge of 59 will be applied on each cart. Most orders will be delivered within 7-10 working days from the shipping date.
        </p>
        <p className="shipping-policy-text">
        For international shipments, please contact us directly for further information regarding rates and delivery options. 
        </p>
      </section>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Order Tracking</h3>
        <p className="shipping-policy-text">
          You may view the status of your order by visiting the "Your Orders" tab in your user profile page. 
          Once your order has been shipped, you will receive a tracking number via email or SMS. 
          This tracking number can be used to monitor your order’s shipping status in real time on the shipping partner's website.
        </p>
      </section>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Delayed or Missing Packages</h3>
        <p className="shipping-policy-text">
          If your order has not arrived within the expected delivery timeframe, kindly <strong onClick={() => navigate('/contact')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>contact us</strong>. Our team will assist you in resolving the matter as promptly as possible. We kindly request that you wait up to 5 working days beyond the estimated delivery date before reaching out to us.
        </p>
      </section>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Incorrect Address</h3>
        <p className="shipping-policy-text">
          Please ensure that the shipping address provided during checkout is accurate. Figure Fiesta will not be held responsible for deliveries made to incorrect or incomplete addresses. If you notice any errors in your address, kindly contact us immediately, and we will make every effort to assist you before the order is dispatched.
        </p>
      </section>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Refund and Cancellation Policy</h3>
        <p className="shipping-policy-text">
          We are committed to ensuring your satisfaction with every purchase. If you wish to cancel your order or request a refund, please refer to our <strong onClick={() => navigate('/refund-policy')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Refund and Cancellation Policy</strong> for further details.
        </p>
      </section>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Order Status Explained</h3>
        <p className="shipping-policy-text">
          Below are the various order statuses you may encounter in your "Your Orders" tab, along with their respective meanings:
        </p>
        <ul className="shipping-policy-text">
          <li><strong>Order placed. Awaiting processing:</strong> Your order has been placed and is awaiting processing.</li>
          <li><strong>Order processed. Ready for shipment:</strong> Your order has been processed and is now ready for shipment.</li>
          <li><strong>Order delivered. Thank you for shopping:</strong> Your order has been successfully delivered. Thank you for your purchase!</li>
          <li><strong>Order canceled. Apologies for the inconvenience:</strong> Your order has been canceled. We apologize for any inconvenience this may have caused.</li>
          <li><strong>Return requested. Awaiting confirmation:</strong> A return has been requested and is awaiting confirmation.</li>
          <li><strong>Replacement requested. Awaiting review:</strong> A replacement has been requested and is awaiting review.</li>
          <li><strong>Return in process. Pickup scheduled:</strong> Your return is currently in process. A pickup has been scheduled.</li>
          <li><strong>Replacement in process. Shipping soon:</strong> A replacement is being processed and will be shipped soon.</li>
          <li><strong>Replacement rejected. Contact us for help:</strong> Your replacement request has been rejected. Please contact us for further assistance.</li>
          <li><strong>Replacement successful. New item shipped:</strong> Your replacement request has been successfully processed. A new item has been shipped to you.</li>
          <li><strong>Refund in process. Expect it in 5-7 days:</strong> Your refund is being processed and is expected to be completed within 5-7 working days.</li>
          <li><strong>Refund successful. Amount has been credited:</strong> Your refund has been successfully processed. The amount has been credited to your account.</li>
          <li><strong>Status unknown. Contact support for details:</strong> The order status is currently unknown. Please contact our support team for further assistance.</li>
        </ul>
      </section>

      <section className="shipping-policy-section">
        <h3 className="shipping-policy-subheader">Contact Us</h3>
        <p className="shipping-policy-text">
          Should you have any questions or concerns regarding your shipment, please do not hesitate to <strong onClick={() => navigate('/contact')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>contact us</strong>. Our customer service team is here to assist you.
        </p>
      </section>
    </div>
  );
};

// Get status message for the order status
const getStatusMessage = (status) => {
    switch (status) {
      case 'Pending':
        return 'Order placed. Awaiting processing: Your order has been placed and is awaiting processing.';
      case 'Processed':
        return 'Order processed. Ready for shipment: Your order has been processed and is now ready for shipment.';
      case 'Delivered':
        return 'Order delivered. Thank you for shopping: Your order has been successfully delivered. Thank you for your purchase!';
      case 'Canceled':
        return 'Order canceled. Apologies for the inconvenience: Your order has been canceled. We apologize for any inconvenience this may have caused.';
      case 'Return_Requested':
        return 'Return requested. Awaiting confirmation: A return has been requested and is awaiting confirmation.';
      case 'Replacement_Requested':
        return 'Replacement requested. Awaiting review: A replacement has been requested and is awaiting review.';
      case 'Return_in_Process':
        return 'Return in process. Pickup scheduled: Your return is currently in process. A pickup has been scheduled.';
      case 'Replacement_in_Process':
        return 'Replacement in process. Shipping soon: A replacement is being processed and will be shipped soon.';
      case 'Replacement_Rejected':
        return 'Replacement rejected. Contact us for help: Your replacement request has been rejected. Please contact us for further assistance.';
      case 'Replacement_Successful':
        return 'Replacement successful. New item shipped: Your replacement request has been successfully processed. A new item has been shipped to you.';
      case 'Refund_in_Process':
        return 'Refund in process. Expect it in 5-7 days: Your refund is being processed and is expected to be completed within 5-7 working days.';
      case 'Refund_Successful':
        return 'Refund successful. Amount has been credited: Your refund has been successfully processed. The amount has been credited to your account.';
      default:
        return 'Status unknown. Contact support for details: The order status is currently unknown. Please contact our support team for further assistance.';
    }
};

export default ShippingPolicy;
