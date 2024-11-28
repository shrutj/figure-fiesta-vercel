import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/PrivacyPolicy.css'; // Add your custom styles

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    return (
        <div className="privacy-policy-container">
            <h2 className="policy-title">Privacy Policy</h2>
            <p className="last-updated">Last updated: October 2024</p>

            <section className="policy-section">
                <h3 className="section-title">1. Introduction</h3>
                <p className="section-content">
                    Welcome to Figure Fiesta! Your privacy is important to us, and we are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and share your information when you use our services.
                </p>
            </section>

            <section className="policy-section">
                <h3 className="section-title">2. Information We Collect</h3>
                <p className="section-content">
                    We collect the following types of personal information when you use our platform:
                </p>
                <ul className="info-list">
                    <li><strong>Name:</strong> Your full name for personalized services.</li>
                    <li><strong>Phone Number:</strong> To contact you regarding orders or services.</li>
                    <li><strong>Gender:</strong> Optional, used for personalized service.</li>
                    <li><strong>Email ID:</strong> For communication regarding orders, promotions, and account management.</li>
                    <li><strong>Delivery Address:</strong> To ensure accurate delivery of your orders.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h3 className="section-title">3. How We Use Your Information</h3>
                <p className="section-content">
                    We use the information you provide to offer a better shopping experience. Specifically, we use your data for the following purposes:
                </p>
                <ul className="info-list">
                    <li><strong>Provide Services:</strong> To facilitate your orders, manage your account, and provide customer support.</li>
                    <li><strong>Delivery Services:</strong> We share your name, phone number, and delivery address with our trusted delivery partners to ensure timely and accurate delivery.</li>
                    <li><strong>Payment Processing:</strong> Your payment details are securely handled by our payment facilitation partner, Razorpay, for online payments. For cash on delivery, our delivery partners will manage the payment collection upon delivery.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h3 className="section-title">4. Sharing Your Information</h3>
                <p className="section-content">
                    We take your privacy seriously and do not sell or rent your personal information to third parties. However, we may share your data in the following ways:
                </p>
                <ul className="info-list">
                    <li><strong>Delivery Partners:</strong> To ensure successful order delivery, we may share your delivery details (name, phone number, address) with our trusted delivery partners.</li>
                    <li><strong>Payment Processors:</strong> We use Razorpay to securely process your payment details for online transactions. Your payment information is handled by Razorpay, in accordance with their privacy policy.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h3 className="section-title">5. Data Security</h3>
                <p className="section-content">
                    We implement security measures to protect your personal information from unauthorized access or disclosure. Your payment information is processed securely through Razorpay, which uses industry-standard encryption protocols to protect your financial data.
                </p>
            </section>

            <section className="policy-section">
                <h3 className="section-title">6. Your Rights</h3>
                <p className="section-content">
                    You have the right to access, update, or delete your personal information. You can also choose to opt out of receiving marketing communications from us. If you wish to make any changes to your data or preferences, please contact us.
                </p>
            </section>

            <section className="policy-section">
                <h3 className="section-title">7. Changes to This Privacy Policy</h3>
                <p className="section-content">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>
            </section>

            <section className="policy-section">
                <h3 className="section-title">8. Account Deletion</h3>
                <p className="section-content">
                    If you wish to delete your account, you can do so by navigating to your User Profile section and clicking the "Delete Account" button. Please note that deleting your account will permanently remove your personal data from our system, including your name, email, phone number, and delivery address.
                </p>
                <p className="section-content">
                    However, your purchase history will not be deleted. We retain this information for record-keeping purposes and for providing you with any necessary post-purchase support. If you choose to delete your account, you will no longer be able to log in to your profile or use our services.
                </p>
            </section>

            <section className="policy-section">
                <h3 className="section-title">9. Contact Us</h3>
                <p className="section-content">
                    If you have any questions or concerns about this Privacy Policy or how we handle your data, feel free to contact us at: <span onClick={() => { navigate('/contact') }} className='contact-us-link'>Contact Us</span>
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
