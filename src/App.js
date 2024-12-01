import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/Authentication/Login';
import SignUp from './Pages/Authentication/SignUp';
import Cart from './Pages/Cart';
import Navbar from './Navbar';
import Footer from './Footer';
import UserProfile from './Pages/UserProfile';
import './App.css';
import ProductDetail from './Pages/ProductDetails';
import YourOrders from './Pages/Order Data/YourOrders';
import RefundPolicy from './Pages/RefundPolicy';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsConditions from './Pages/Terms&Conditions';
import loadingAnimation from './Assets/loadingAnimation.gif'
import ShippingPolicy from './Pages/ShippingPolicy'

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, deleteUser, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { getDatabase, ref, set, child, get, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const App = () => {
    const [loginCheck, setLoginCheck] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [homepageData, setHomepageData] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showProductId, setShowProductId] = useState();
    const [navSearchTerm, setNavSearchTerm] = useState();
    const [sizeChartData, setSizeChartData] = useState([]);
    const refundPolicy = useRef(null);
    const [userData, setUserData] = useState(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            try {
                setLoginCheck(true);
                return JSON.parse(storedUserData);
            } catch (error) {
                console.error('Error parsing userData:', error);
                return {};
            }
        }
        return {};
    });

    const [userOrders, setUserOrders] = useState({});

    // Add loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const database_ref = ref(database, 'items/');
        onValue(database_ref, (snapshot) => {
            const data = snapshot.val();
            const productsArray = data ? Object.values(data) : [];
            setAllProducts(productsArray);
            
            setLoading(false); // Set loading to false once data is fetched
        });
    }, []); 
    console.log(allProducts);
    useEffect(() => {
        const database_ref = ref(database, 'homepageData/');
        onValue(database_ref, (snapshot) => {
            const data = snapshot.val();
            const productsArray = data ? Object.values(data) : [];
            setHomepageData(productsArray);
            console.log("productsArray", productsArray)
            setSizeChartData(productsArray[2]);
            //console.log(productsArray);
            setLoading(false); // Set loading to false once data is fetched
        });
    }, []);

    useEffect(() => {
        const database_ref = ref(database, 'orders/' + userData.userUid);
        onValue(database_ref, (snapshot) => {
            const data = snapshot.val();
            const ordersData = data ? data : {};
            setUserOrders(ordersData);
            //console.log(data);
            setLoading(false); // Set loading to false once data is fetched
        });
    }, []);
    
    const firebaseConfig = {
        apiKey: "AIzaSyAwWznhhP09HYpOZAdu55_6KiRhWaTkHog",
        authDomain: "figure-fiesta.firebaseapp.com",
        projectId: "figure-fiesta",
        storageBucket: "figure-fiesta.appspot.com",
        messagingSenderId: "301445630990",
        appId: "1:301445630990:web:d4d95308f81cf31ee5805f",
        databaseURL: "https://figure-fiesta-default-rtdb.firebaseio.com/",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);

    const Ref = { ref };

    return (
        <Router>
            {loading ? (
                        // Show loading gif/spinner while data is being fetched
                        <div className="loading-container">
                            <img src={loadingAnimation} alt="Loading..." />
                        </div>
                    ) : (
            <div className="App">
                <Navbar loginCheck={loginCheck} setLoginCheck={setLoginCheck} setUserData={setUserData} userData={userData} allProducts={allProducts} setNavSearchTerm={setNavSearchTerm} />
                <main style={{ marginBottom: '3rem' }}>
                    
                        <Routes>
                            <Route path="/" element={<Home homepageData={homepageData} allProducts={allProducts} setAllProducts={setAllProducts} setCategoryFilter={setCategoryFilter} showProductId={showProductId} setShowProductId={setShowProductId} database={database} Ref={Ref} update={update} userData={userData} setUserData={setUserData} loginCheck={loginCheck} sizeChartData={sizeChartData} />} />
                            <Route path="/shop" element={<Shop sizeChartData={sizeChartData} database={database} Ref={Ref} userData={userData} setUserData={setUserData} update={update} loginCheck={loginCheck} allProducts={allProducts} setAllProducts={setAllProducts} categoryFilter={categoryFilter} homepageData={homepageData[0]} setShowProductId={setShowProductId} showProductId={showProductId} navSearchTerm={navSearchTerm} setNavSearchTerm={setNavSearchTerm} />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<Login signInWithEmailAndPassword={signInWithEmailAndPassword} auth={auth} deleteUser={deleteUser} child={child} get={get} onValue={onValue} setUserData={setUserData} setLoginCheck={setLoginCheck} Ref={Ref} database={database} sendPasswordResetEmail={sendPasswordResetEmail} remove = {remove} setUserOrders={setUserOrders} />} />
                            <Route path="/signup" element={<SignUp createUserWithEmailAndPassword={createUserWithEmailAndPassword} auth={auth} sendEmailVerification={sendEmailVerification} GoogleAuthProvider={GoogleAuthProvider} signInWithPopup={signInWithPopup} database={database} Ref={Ref} set={set} />} />
                            <Route path="/cart" element={<Cart sizeChartData={sizeChartData} userData={userData} setUserData={setUserData} database={database} Ref={Ref} update={update} loginCheck={loginCheck} allProducts={allProducts} setAllProducts={setAllProducts} showProductId={showProductId} setShowProductId={setShowProductId} />} />
                            <Route path="/user-profile" element={<UserProfile userData={userData} setUserData={setUserData} update={update} database={database} Ref={Ref} />} />
                            <Route path="/product-details" element={<ProductDetail showProductId={showProductId} allProducts={allProducts} setAllProducts={setAllProducts} database={database} Ref={Ref} update={update} userData={userData} setUserData={setUserData} loginCheck={loginCheck} refundPolicy={refundPolicy} sizeChartData={sizeChartData}  />} />
                            <Route path="/your-orders" element={<YourOrders sizeChartData={sizeChartData} allProducts={allProducts} setAllProducts={setAllProducts} userOrders={userOrders} setUserOrders={setUserOrders} showProductId={showProductId} setShowProductId={setShowProductId} database={database} Ref={Ref} update={update} userData={userData} setUserData={setUserData} onValue={onValue}  />}  />
                            <Route path="/refund-policy" element={<RefundPolicy productPolicy={refundPolicy}   />}  />
                            <Route path="/privacy-policy" element={<PrivacyPolicy  />}  />
                            <Route path="/terms-&-conditions" element={<TermsConditions  />}  />
                            <Route path="/shipping-policy" element={<ShippingPolicy />} />
                        </Routes>
                    
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover stacked />
                </main>
                <Footer />
            </div>
            )}
        </Router>
    );
}

export default App;
