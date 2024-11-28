// SuccessModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './SuccessModal.css';

const SuccessModal = ({ isVisible, onClose, setModalVisible}) => {
    if (!isVisible) return null;

    const close = ()=>{
        setModalVisible(false);
        onClose();
    }

    return (
        <div className="success-modal-overlay">
            <div className="success-modal-content">
                <button className="success-modal-close" onClick={close}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>🎉 Congratulations! 🎉</h2>
                <p>Your order has been placed successfully! 🛒</p>
                <p>Thank you for shopping with us! 😊</p>
            </div>
        </div>
    );
};

export default SuccessModal;
