import React, { useState } from 'react';
import './Signup.css';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import default toast styles
import Select from 'react-select'; // Import react-select
import '../Styles/CustomToast.css';
import loadingAnimation from '../../Assets/loadingAnimation.gif';

// Custom styles for react-select
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '100%',
        height: '40px', // Set height to match the input field
        borderRadius: '4px',
        boxShadow: state.isFocused ? '0 0 5px rgba(255, 23, 68, 0.4)' : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s', // Smooth transition
    }),
    input: (provided) => ({
        ...provided,
        fontSize: '1rem', // Maintain consistent font size
        padding: '0.05rem 0', // Reduce padding to match input height
    }),
    placeholder: (provided) => ({
        ...provided,
        fontSize: '1rem',
        color: '#333',
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Option list shadow
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '1rem',
        backgroundColor: state.isSelected ? '#ff5722' : '#fff', // Highlight option on selection
        color: state.isSelected ? '#fff' : '#333', // Change text color on selection
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ff5722', // Hover effect
            color: '#fff',
        }
    }),
};

const Signup = ({ createUserWithEmailAndPassword, auth, sendEmailVerification, database, Ref, set }) => {
    // State variables for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false); // New loading state

    // Gender options for the dropdown
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation checks
        let errorMessage = '';

        // Check for at least 12 characters
        if (password.length < 8) {
            errorMessage += '- At least 8 characters\n';
        }

        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            errorMessage += '- One uppercase letter\n';
        }

        // Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            errorMessage += '- One lowercase letter\n';
        }

        // Check for at least one number
        if (!/\d/.test(password)) {
            errorMessage += '- One number\n';
        }

        // Check for at least one special character
        if (!/[@$!%*?&_]/.test(password)) {
            errorMessage += '- One special character (e.g., @, $, %, &, *)\n';
        }

        // If there are any password validation issues, show the error message
        if (errorMessage) {
            toast.error(
                `Password must meet the following:\n${errorMessage.trim()}`,
                { className: 'custom-toast-error' }
            );
            return;
        }

        setLoading(true); // Set loading to true
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);

            try {
                await sendEmailVerification(user);
                toast.success('Verification Email Sent!! Please verify your email address', { className: 'custom-toast-success' });
                try {
                    const database_ref = Ref.ref(database, 'users/' + user.uid);
                    
                    set(database_ref, {
                        username: name,
                        email: email,
                        phone: phone,
                        address: address,
                        gender: gender, // Added gender field
                        cartItemsId: {},
                    });

                } catch (error) {
                    console.log(error);
                    toast.error('Database Error!!', { className: 'custom-toast-error' });
                }
            } catch {
                toast.error('Error sending verification email!!', { className: 'custom-toast-error' });
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email address is already in use.', { className: 'custom-toast-error' });
            } else {
                toast.error(error.message, { className: 'custom-toast-error' });
            }
        } finally {
            setLoading(false); // Set loading to false
        }
    }

    return (
        <div className="auth-container" style={{ marginBottom: '50px' }}>
            <div className="auth-form">
                <h1>Signup</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Select
                        options={genderOptions}
                        value={gender ? { value: gender, label: gender.charAt(0).toUpperCase() + gender.slice(1) } : null}
                        onChange={(selectedOption) => setGender(selectedOption ? selectedOption.value : '')}
                        className="signup-gender-dropdown"
                        styles={customStyles}
                        placeholder="Select Gender"
                    />
                    <input
                        style={{marginTop: '15px'}}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Delivery Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <button className='Signup-button' type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Signup'}
                    </button>
                </form>
                {loading && <div className="loading-overlay">
                    <img src={loadingAnimation} alt="Loading..." />
                </div>}
            </div>
        </div>
    );
};

export default Signup;
