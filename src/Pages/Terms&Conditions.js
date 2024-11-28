import React from 'react';
import './Styles/Terms&Conditions.css'; // Add your custom styles
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
    const navigate = useNavigate();
  return (
    <div className="terms-conditions-container">
      <h2 className="terms-title">📜 Terms & Conditions</h2>
      <p className="last-updated">Last updated: October 2024</p>

      <section className="terms-section">
        <h3 className="section-title">1. Acceptance of Terms</h3>
        <p className="section-content">
          By accessing and using our website, you agree to be bound by these <b style={{textDecoration: 'underline'}}>Terms & Conditions</b>. If you do not agree, please refrain from using our services.
        </p>
      </section>

      <section className="terms-section">
        <h3 className="section-title">2. Payment Options</h3>
        <p className="section-content">
          We offer two payment options for your convenience:
        </p>
        <ul className="payment-list">
          <li><strong>Online Payment:</strong> Processed securely by Razorpay at the time of placing your order.</li>
          <li><strong>Cash on Delivery:</strong> Pay in cash directly to our delivery personnel upon receiving your order.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h3 className="section-title">3. Sharing of Information</h3>
        <p className="section-content">
          In order to facilitate order delivery and payment processing, we may share your personal information with our trusted delivery partners and payment processors. We take your privacy seriously and ensure that your data is handled securely in accordance with our <strong onClick={()=>navigate('/privacy-policy')} style={{textDecoration: 'underline', cursor: 'pointer'}}>Privacy Policy</strong>.
        </p>
      </section>

      <section className="terms-section">
        <h3 className="section-title">4. Return and Replacement Policy</h3>
        <p className="section-content">
          The replacement or return of any product is valid only if the product is in its original condition, undamaged, and unchanged by the user. If a product has been damaged or altered, you may not be eligible for a refund. Please refer to our <strong onClick={()=>navigate('/refund-policy')} style={{textDecoration: 'underline', cursor: 'pointer'}}>Refund Policy</strong> for detailed information on replacements and returns.
        </p>
      </section>

      <section className="terms-section">
        <h3 className="section-title">5. Liability Disclaimer</h3>
        <p className="section-content">
          While we strive to provide accurate information on our website, we cannot guarantee that all details are free from errors. We are not liable for any inaccuracies or damages resulting from the use of our website or services.
        </p>
      </section>

      <section className="terms-section">
        <h3 className="section-title">6. Changes to Terms</h3>
        <p className="section-content">
          We may update these Terms & Conditions from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review these terms periodically to stay informed about your rights and obligations.
        </p>
      </section>

      <section className="terms-section">
        <h3 className="section-title">7. Contact Us</h3>
        <p className="section-content">
          If you have any questions or concerns about these Terms & Conditions, please feel free to <strong onClick={()=>navigate('/contact')} style={{textDecoration: 'underline', cursor: 'pointer'}}>reach out to us</strong>. We're here to help!
        </p>
      </section>
    </div>
  );
};

export default TermsConditions;
