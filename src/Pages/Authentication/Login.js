import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import the default toast styles
import '../Styles/CustomToast.css';
import loadingAnimation from '../../Assets/loadingAnimation.gif';

const Login = ({ auth, signInWithEmailAndPassword, deleteUser, child, get, onValue, setUserData, setLoginCheck, Ref, database, sendPasswordResetEmail, remove, setUserOrders }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false); // Track if we are in reset password mode
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user.user.emailVerified === false) {
                const User = auth.currentUser;
                await remove(Ref.ref(database, 'users/' + user.user.uid));
                await deleteUser(User);
                toast.error('Please create your account first', { className: 'custom-toast-error' });
            } else {
                console.log('User signed in:', user.user.emailVerified);

                const dbRef = Ref.ref(database);
                const ordersRef = Ref.ref(database, 'orders/' + user.user.uid);
                get(child(dbRef, `users/${user.user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const userUid = { userUid: user.user.uid };
                        const Data = { ...userUid, ...data };
                        console.log(Data);

                        setUserData(Data);

                        // Store the user data in sessionStorage
                        sessionStorage.setItem('userData', JSON.stringify(Data));
                        onValue(ordersRef, (snapshot) => {
                            const data = snapshot.val();
                            const ordersData = data ? data : {};
                            setUserOrders(ordersData);
                        });
                        setLoginCheck(true);
                        navigate('/');
                    } else {
                        console.log(user.user.uid, "No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                    toast.error('An error occurred while fetching user data.', { className: 'custom-toast-error' });
                });
            }
        } catch (err) {
            console.error('Login failed:', err);
            toast.error('Login failed. Please check your email and password.', { className: 'custom-toast-error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAnchorClick = () => {
        navigate('/signup');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!email) {
                setError('Please enter your email address.');
                return;
            }
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent.", { className: 'custom-toast-success' });
            setIsResetMode(false); // Go back to the login form
            setEmail(''); // Clear the email state
        } catch (error) {
            setError('Failed to send reset email. Please try again.' + error.message);
            toast.error('Failed to send reset email. Please try again.', { className: 'custom-toast-error' });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordClick = () => {
        setIsResetMode(true); // Switch to reset password form
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1>{isResetMode ? 'Reset Password' : 'Login'}</h1>
                {error && <p className="error">{error}</p>}

                {/* Conditional rendering for login or reset mode */}
                {isResetMode ? (
                    <form onSubmit={handleResetPassword}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Request Password Reset'}
                        </button>
                        <h4 style={{ marginTop: '10px' }}>Remembered your password? <a onClick={() => setIsResetMode(false)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Back to Login</a></h4>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div style={{ display: 'flex', width: '100%' }}>
                            <h5 style={{ marginBottom: '10px', width: '45%' }}>
                                <p onClick={handleForgotPasswordClick} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Forgot Password?</p>
                            </h5>&ensp;&ensp;&ensp;
                            <span style={{ textAlign: 'center' }}>
                                <h5 style={{ marginBottom: '10px' }}>
                                    <p onClick={handleAnchorClick} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Don't have an Account?</p>
                                </h5>
                            </span>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Login'}
                        </button>
                    </form>
                )}

                {loading && <div className="loading-overlay">
                    <img src={loadingAnimation} alt="Loading..." />
                </div>}
            </div>
        </div>
    );
}

export default Login;
