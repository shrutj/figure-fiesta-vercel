import React, { useState } from 'react';
import './Styles/Cart.css'; // Ensure you have Cart.css for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'; // Import toast function
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import './Styles/CustomToast.css';
import Modal from './Modals/Modal'; // Import the new Modal component
import { useNavigate } from 'react-router-dom';

const Cart = ({ userData, setUserData, database, Ref, update, loginCheck, allProducts, setAllProducts, showProductId, setShowProductId, sizeChartData }) => {
    // State to handle cart items (with object structure)
    const [cartItemIds, setCartItemIds] = useState(loginCheck ? userData.cartItemsId : {});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const navigate = useNavigate();

    const items = allProducts;
    const database_ref = loginCheck ? Ref.ref(database, 'users/' + userData.userUid) : {};

    // Reversing the order of cartItemIds keys and filtering cartItems
    const reversedItemIds = Object.keys(cartItemIds).reverse(); // Get keys in reverse order
    const cartItems = items.filter(item => reversedItemIds.includes(item.id.toString())).reverse();

    const itemCountMap = cartItemIds;

    const { totalAmount, totalDiscount } = cartItems.reduce((totals, item) => {
        const itemPrice = parseFloat(item.price.replace('₹', ''));
        const itemOriginalPrice = parseFloat(item.priceWithoutDiscount) || itemPrice;
        const itemDiscount = itemOriginalPrice - itemPrice;

        totals.totalAmount += itemPrice * itemCountMap[item.id];
        totals.totalDiscount += itemDiscount * itemCountMap[item.id];

        return totals;
    }, { totalAmount: 0, totalDiscount: 0 });

    const formattedTotalAmount = totalAmount.toFixed(2);
    const formattedTotalDiscount = totalDiscount.toFixed(2);

    // Handle change in quantity (limit to 5)
    const handleQuantityChange = (id, delta) => {

        setCartItemIds(prevIds => {
            const newCount = (itemCountMap[id] || 0) + delta;
            if (newCount <= 0) return prevIds; // Prevent removing the last item by accident
            
            const updatedData = { ...userData, cartItemsId: { ...prevIds, [id]: newCount } };
            
            update(database_ref, updatedData)
                .then(() => {
                    console.log('Data updated successfully');
                    sessionStorage.setItem('userData', JSON.stringify(updatedData));
                    setUserData(updatedData);
                })
                .catch(error => console.error('Error updating data:', error));

            return { ...prevIds, [id]: newCount };
        });
    };

    // Remove item from cart
    const removeItem = (id) => {
        setCartItemIds(prevIds => {
            const { [id]: removed, ...updatedIds } = prevIds; // Remove item by id
            const updatedData = { ...userData, cartItemsId: updatedIds };

            update(database_ref, updatedData)
                .then(() => {
                    toast.success('Item removed from the cart', { className: 'custom-toast-success' });
                    console.log('Data updated successfully');
                    sessionStorage.setItem('userData', JSON.stringify(updatedData));
                    setUserData(updatedData);
                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                });

            return updatedIds;
        });
    };

    // Handle checkout
    const handleCheckout = () => {
        const allProductIds = reversedItemIds.flatMap(id => {
            const item = items.find(item => item.id.toString() === id);
            if (item && (item.quantityAvailable !== '0' && item.availability !== 'will_be_available_soon')) {
                return Array(itemCountMap[id]).fill(id);
            }
            return [];
        });

        setSelectedProductIds(allProductIds); // Set all valid product IDs for the modal
        setModalVisible(true); // Show the modal
    };

    // Handle Buy Now
    const handleBuyNow = (id) => {
        const quantity = itemCountMap[id]; // Get the quantity of the selected item
        setSelectedProductIds(prevIds => {
            const newIds = Array(quantity).fill(id);
            return [...prevIds, ...newIds];
        });
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedProductIds([]); // Clear selected IDs when closing modal
    };

    const handleCardClick = (e, id) => {
        e.preventDefault();
        let itemId = id.toString();
        setShowProductId(itemId);
        navigate('/product-details');
    };

    return (
        <>
            <div className="cart-container">
                <h1>Your Cart</h1>
                {cartItems.length > 0 ? (
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item-card">
                                <img style={{ cursor: 'pointer' }} onClick={(e) => handleCardClick(e, item.id)} src={item.imageUrls[0]} alt={item.name} />
                                <div className="cart-item-details">
                                    <h3 style={{ cursor: 'pointer' }} onClick={(e) => handleCardClick(e, item.id)}>{item.name}</h3>
                                    <p style={{ cursor: 'pointer' }} onClick={(e) => handleCardClick(e, item.id)}>{item.description}</p>

                                    {/* Price with discount */}
                                    <div className="cart-item-price">
                                        {item.priceWithoutDiscount && item.priceWithoutDiscount !== item.price ? (
                                            <>
                                                <span className="original-price" style={{ textDecoration: 'line-through', marginRight: '10px' }} >
                                                    ₹{item.priceWithoutDiscount}
                                                </span>
                                                <span className="discounted-price">₹{item.price}</span>
                                            </>
                                        ) : (
                                            <span>₹{item.price}</span>
                                        )}
                                    </div>

                                    {(item.availability === 'will_be_available_soon' || item.quantityAvailable === '0') ? 
                                        <p>Oops! 🛑 We are Out of stock </p> : 
                                        <div className="cart-item-actions">
                                            <button
                                                type="button"
                                                className="cart-quantity-button"
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <span className="cart-item-count">
                                                {itemCountMap[item.id]}
                                            </span>
                                            <button
                                                type="button"
                                                className="cart-quantity-button"
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                            <button
                                                className="remove-button"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            {item.availability !== 'will_be_available_soon' && item.quantityAvailable !== '0' && (
                                                <button
                                                    type="button"
                                                    className="buy-now-button"
                                                    onClick={() => handleBuyNow(item.id)}
                                                >
                                                    <FontAwesomeIcon icon={faShoppingCart} /> {item.availability === 'available_to_preorder' ? 'Preorder' : 'Buy Now'}
                                                </button>
                                            )}
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <p>Your cart is empty.</p>
                        <button className='Shop-Now-Button' onClick={() => { navigate('/shop') }}>Shop Now</button>
                    </>
                )}

                {cartItems.length > 0 && (
                    <div className="checkout-container">
                        <br></br>
                        <span className="total-amount" style={{ paddingRight: '15px' }}>Amount Total: ₹{formattedTotalAmount}</span>
                        {formattedTotalDiscount > 0 && (
                            <span style={{ paddingRight: '15px', fontSize:'20px', display:'inline-block' }} >
                                Discount: <FontAwesomeIcon icon={faMinus} fontSize={12} /> <span style={{fontSize:'18px'}}>₹{formattedTotalDiscount}</span>
                            </span>
                        )}
                        <br></br>
                        <button className="checkout-button" type='button' onClick={handleCheckout}>
                            Place Order
                        </button>
                    </div>
                )}
                <Modal 
                    isVisible={modalVisible} 
                    onClose={handleModalClose} 
                    userData={userData} 
                    selectedProductIds={selectedProductIds}
                    database={database}
                    Ref={Ref}
                    update={update}
                    allProducts={allProducts}
                    setAllProducts={setAllProducts} 
                    setModalVisible={setModalVisible}
                    setUserData={setUserData}
                    sizeChartData={sizeChartData}
                />
            </div>
        </>
    );
};


export default Cart;
