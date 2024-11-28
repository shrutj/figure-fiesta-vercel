import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHome, faStore, faUser, faSignOutAlt, faSignInAlt, faUserPlus, faX } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import logo from './Assets/logo.png';

const Navbar = ({ loginCheck, setLoginCheck, setUserData, userData, allProducts, setNavSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State to control the modal visibility
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (path) => () => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    // Filter products by name based on the search term
    if (query.length > 0) {
      const filteredSuggestions = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (productName) => {
    // Navigate to the product page based on the selected suggestion
    const selectedProduct = allProducts.find((product) => product.name === productName);
    setNavSearchTerm(productName);
    if (selectedProduct) {
      navigate("/shop"); // Assuming a route like `/product/:id`
    }
    setSuggestions([]); // Close suggestions after selection
    setSearchTerm(''); // Optionally clear the search bar
  };

  const commonItems = [
    { path: '/', label: 'Home', icon: faHome, onClick: handleNavigation('/') },
    { path: '/shop', label: 'Shop', icon: faStore, onClick: handleNavigation('/shop') },
  ];

  const getCartItemCount = () => {
    // Return the number of items in the cart (sum of quantities in cartItemsId)
    if (loginCheck && userData.cartItemsId) {
      return Object.values(userData.cartItemsId).reduce((total, quantity) => total + quantity, 0);
    }
    return 0;
  };

  const cartItems = [
    { path: '/cart', icon: faCartShopping, label: 'Cart', onClick: handleNavigation('/cart'), count: getCartItemCount() },
  ];

  const authItems = [
    { path: '/login', icon: faSignInAlt, label: 'Log In', onClick: handleNavigation('/login') },
    { path: '/signup', icon: faUserPlus, label: 'Sign Up', onClick: handleNavigation('/signup') },
  ];

  const userItems = [
    { path: '/user-profile', icon: faUser, label: 'User Profile', onClick: handleNavigation('/user-profile') },
    { path: '/logout', icon: faSignOutAlt, label: 'Logout', onClick: () => setIsLogoutModalOpen(true) }, // Open the modal instead of logging out directly
  ];

  const footerItems = [
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/terms-&-conditions', label: 'Terms & Conditions' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/refund-policy', label: 'Refund & Cancellation Policy' },
    { path: '/shipping-policy', label: 'Shipping Policy' }
  ];

  const menuItems = loginCheck ? [...commonItems, ...cartItems, ...userItems] : [...commonItems, ...authItems, ...cartItems];

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    setLoginCheck(false);
    setUserData({});
    setIsLogoutModalOpen(false);
    navigate('/login'); // Redirect to login page after logout
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false); // Close the modal if the user cancels
  };

  return (
    <header className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
      {/* Mobile Navbar (below 600px) */}
      <nav className="mobile-nav">
        <div className="logo">
          <img src={logo} alt="Site Logo" />
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar-mobile"
          placeholder="Search..."
        />
        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((product) => (
              <div
                key={product.id}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(product.name)}
              >
                {product.name}
              </div>
            ))}
          </div>
        )}
        <button className="hamburger" onClick={toggleMenu}>☰</button>
        <div className={`side-bar ${isMenuOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={toggleMenu}><FontAwesomeIcon icon={faX}></FontAwesomeIcon></button>
          <br></br>
          {menuItems.map(({ path, label, icon, onClick, count }) => (
            <div className="nav-item" key={path} onClick={onClick}>
              {icon && <FontAwesomeIcon icon={icon} />}
              <span>{label}</span>
              {count > 0 && path === '/cart' && <span className="cart-badge-mob">{count}</span>}
            </div>
          ))}
          <div style={{ height: '100%' }}></div>
          {footerItems.map(({ path, label }) => (
            <div style={{}} className='sidebar-footer'>
              <span><span onClick={() => navigate(path)}>{label}</span> <span style={{ color: 'black' }}>|</span></span>
            </div>
          ))}
        </div>
      </nav>

      {/* Desktop Navbar (above 600px) */}
      <nav className="desktop-nav">
        <div className="desktop-logo">
          <img src={logo} alt="Site Logo" />
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar-desktop"
          placeholder="Search..."
        />
        &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((product) => (
              <div
                key={product.id}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(product.name)}
              >
                {product.name}
              </div>
            ))}
          </div>
        )}
        <div className="desktop-menu">
          {menuItems.map(({ path, label, icon, onClick, count }) => (
            <div className="nav-icon" key={path} onClick={onClick}>
              <FontAwesomeIcon icon={icon} />
              {count > 0 && path === '/cart' && <span className="cart-badge-desktop">{count}</span>}
              <span className="nav-tooltip">{label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Confirmation Modal for Logout */}
      {isLogoutModalOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            <h2>Are you sure you want to log out?</h2>
            <div className="logout-modal-buttons">
              <button onClick={cancelLogout} className="logout-cancel-btn">Cancel</button>
              <button onClick={handleLogout} className="logout-confirm-btn">Log Out</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
