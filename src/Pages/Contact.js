// src/pages/Contact.js
import React from 'react';
import './Styles/Contact.css'; // Ensure this CSS file is created

function Contact() {
    const whatsappPhoneNumber = '8269906755'; // Primary WhatsApp number
    const secondaryWhatsappPhoneNumber = '8602742829'; // Secondary WhatsApp number
    const message = 'Hi there, How can we help you?';
    const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(message)}`;
    const secondaryWhatsappLink = `https://wa.me/${secondaryWhatsappPhoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="contact-container">
            <h2 className="contact-header">Contact Us</h2>
            <p className="contact-intro">We're here to help! Reach out to us with any questions or feedback.</p>
            
            <h3 className="contact-subheader">Get in Touch</h3>
            <p className="contact-methods">You can contact us via the following methods:</p>
            <ul className="contact-list">
                <li>Email: <strong><a href="mailto:Figurefiesta@gmail.com" className="contact-link">Figurefiesta@gmail.com</a></strong></li>
                <li>Phone: <strong><a href="tel:+918629906755" className="contact-link">+91 82699 06755</a></strong></li>
            </ul>

            <h3 className="contact-subheader">Customer Support</h3>
            <p className="contact-methods">For assistance, feel free to:</p>
            <ul className="contact-list">
                <li>Email us at: <strong><a href="mailto:Figurefiesta@gmail.com" className="contact-link">Figurefiesta@gmail.com</a></strong></li>
                <li>Phone: <strong><a href="tel:+918629906755" className="contact-link">+91 82699 06755</a></strong></li>
                <li>
                    Message us on WhatsApp: 
                    <strong>
                        <a href={whatsappLink} className="contact-link"> Click here</a>
                    </strong>
                </li>
                <li>
                    Or, On WhatsApp: 
                    <strong>
                        <a href={secondaryWhatsappLink} className="contact-link"> Click here</a>
                    </strong>
                </li>
            </ul>

            <h3 className="contact-subheader">Visit Us</h3>
            <p className="contact-address">Our Physical Showroom is located at:</p>
            <p className="contact-address-detail"><strong>UG-17, One Center, Chappan Dukan, New Palasia, <br/>Indore, Madhya Pradesh 452001</strong></p>
        </div>
    );
}

export default Contact;
