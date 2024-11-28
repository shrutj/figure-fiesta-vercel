import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css'; // You can add specific styles for Footer here

const Footer = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => () => {
        navigate(path);
    };

    return (
        <footer className='Footer'>
            <p style={{color: 'white', fontSize: '15px', fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}}>&copy; 2024 Figure Fiesta | All rights reserved.</p>
            <div className="footer-links">
                <button className='footer-links-btn' onClick={handleNavigation('/about')}>About</button> |
                <button className='footer-links-btn' onClick={handleNavigation('/contact')}>Contact</button> |
                <button className='footer-links-btn' onClick={handleNavigation('/terms-&-conditions')}>Terms & Conditions</button> |
                <button className='footer-links-btn' onClick={handleNavigation('/privacy-policy')}>Privacy policy</button> |
                <button className='footer-links-btn' onClick={handleNavigation('/refund-policy')}>Refund & Cancellation Policy</button> |
                <button className='footer-links-btn' onClick={handleNavigation('/shipping-policy')}>Shipping Policy</button> 
            </div>
        </footer>
    );
}

export default Footer;
