import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';
import SuccessModal from './SuccessModal';
import { toast } from 'react-toastify'; // Import toast function
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import '../Styles/CustomToast.css';
import Select from 'react-select'; // Import react-select for the custom dropdown
import loadingAnimation from '../../Assets/loadingAnimation.gif';
import PaymentMethodModal from './PaymentMethodModal'; // Import the new PaymentModal

// Custom styles for react-select
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '90%',
        height: '40px', // Set height to match the input field
        borderRadius: '4px',
        borderColor: state.isFocused ? '#ff1744' : '#ff5722', // Border color on focus
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
        width: '90%'
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

const Modal = ({ isVisible, onClose, userData, selectedProductIds, database, Ref, update, allProducts, setAllProducts, setModalVisible, setUserData, sizeChartData }) => {
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editableData, setEditableData] = useState({
        name: userData?.username || '',
        phone: userData?.phone || '',
        address: userData?.address || ''
    });
    const [quantityMap, setQuantityMap] = useState({});
    const [sizeMap, setSizeMap] = useState({});
    const [paymentModalVisible, setPaymentModalVisible] = useState(false); // State for Payment Modal
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Track the selected payment method
    // const [onlineOrderId, setOnlineOrderId] = useState(null);
    // const [onlinePaymentId, setOnlinePaymentId] = useState(null);

    // const onlineOrderId = useRef(null);
    // const onlinePaymentId = useRef(null);
    useEffect(() => {
        if (userData) {
            setEditableData({
                name: userData.username || '',
                phone: userData.phone || '',
                address: userData.address || ''
            });
        }

        // Initialize quantityMap based on selectedProductIds
        const initialQuantityMap = selectedProductIds.reduce((acc, productId) => {
            acc[productId] = (acc[productId] || 0) + 1;
            return acc;
        }, {});
        setQuantityMap(initialQuantityMap);
    }, [userData, selectedProductIds]);




    if (!isVisible) return null;

    const items = allProducts;
    console.log(items);

    // Calculate total amount based on quantities and product prices
    const getTotalAmount = () => {
        return Object.keys(quantityMap).reduce((total, productId) => {
            const product = items.find(item => item.id.toString() === productId.toString());
            if (product) {
                total += product.price * quantityMap[productId];
            }
            return total;
        }, 0).toFixed(2);
    };

    const selectedProducts = Object.keys(quantityMap).map(productId => {
        const product = items.find(item => item.id.toString() === productId.toString());
        return { product, quantity: quantityMap[productId] };
    });

    
    //console.log("selectedProducts",selectedProducts);
    const onProceed = () => {
        let errorMessages = [];

        // Validate quantity for each product
        const validatedQuantityMap = { ...quantityMap };
        selectedProducts.forEach(({ product, quantity }) => {
            const availableQuantity = parseInt(product.quantityAvailable, 10);
            if (quantity > availableQuantity) {
                errorMessages.push(`Oops! We only have ${availableQuantity} ${product.name}s in stock. Please order fewer.`);
                validatedQuantityMap[product.id] = availableQuantity; // Adjust quantity to available stock
            }

            else if (quantity > 5) {
                // Add playful message for exceeding the limit
                errorMessages.push(`Whoa, that's a lot! You can only order up to 5 ${product.name}s. Please order again to grab more!`);
                validatedQuantityMap[product.id] = 5; // Limit the quantity to 5
            }

            // Check if a size is selected for products that require a size
            if (product.sizeChart === "yes" && !sizeMap[product.id]) {
                errorMessages.push(`Please select a size for ${product.name}.`);
            }
        });

        // If there are any error messages, show them using toast
        if (errorMessages.length > 0) {
            errorMessages.forEach((message) => toast.error(message));
            setLoading(false);
            return;
        }
        setPaymentModalVisible(true); // Show the payment modal when the user proceeds
    };

    const onPaymentSelect = (paymentMethod, onlinePaymentId, paymentOrderId) => {
        setSelectedPaymentMethod(paymentMethod); // Set the selected payment method
        setPaymentModalVisible(false); // Close the payment modal
        processOrder(paymentMethod, onlinePaymentId, paymentOrderId); // Proceed with the order based on payment method
    };

    

    const processOrder = (paymentMethod, onlinePaymentId, paymentOrderId) => {
        setLoading(true);
        // Reference to the database locations
        const database_ref = Ref.ref(database, 'orders/' + userData.userUid);
        const db_ref = Ref.ref(database, 'users/' + userData.userUid);

        // Initialize the error messages
        //let errorMessages = [];

        // Validate quantity for each product
        const validatedQuantityMap = { ...quantityMap };

        // selectedProducts.forEach(({ product, quantity }) => {
        //     const availableQuantity = parseInt(product.quantityAvailable, 10);
        //     if (quantity > availableQuantity) {
        //         errorMessages.push(`Oops! We only have ${availableQuantity} ${product.name}s in stock. Please order fewer.`);
        //         validatedQuantityMap[product.id] = availableQuantity; // Adjust quantity to available stock
        //     }

        //     else if (quantity > 5) {
        //         // Add playful message for exceeding the limit
        //         errorMessages.push(`Whoa, that's a lot! You can only order up to 5 ${product.name}s. Please order again to grab more!`);
        //         validatedQuantityMap[product.id] = 5; // Limit the quantity to 5
        //     }

        //     // Check if a size is selected for products that require a size
        //     if (product.sizeChart === "yes" && !sizeMap[product.id]) {
        //         errorMessages.push(`Please select a size for ${product.name}.`);
        //     }
        // });

        // // If there are any error messages, show them using toast
        // if (errorMessages.length > 0) {
        //     errorMessages.forEach((message) => toast.error(message));
        //     setLoading(false);
        //     return;
        // }

        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        const Data = {};
        Object.keys(validatedQuantityMap).forEach(productId => {
            const oId = productId + '_' + hours + '_' + minutes + '_' + seconds;
            console.log('sizeMap', sizeMap[productId]);
            Data[productId + '_' + hours + '_' + minutes + '_' + seconds] = {
                orderId: oId,
                paymentId: onlinePaymentId !== undefined ? onlinePaymentId : null, //only for online payments
                paymentOrderId: paymentOrderId,
                itemId: productId,
                userUid: userData.userUid,
                date: now,
                status: 'Pending',
                quantity: validatedQuantityMap[productId],
                name: editableData.name,
                phone: editableData.phone,
                address: editableData.address, // Store the updated address
                size: sizeMap[productId] ? sizeMap[productId] : null, // Store the selected size
                paymentMethod: paymentMethod // Store the selected payment method
            };
            console.log("Data[productId + '_' + hours + '_' + minutes + '_' + seconds]", Data[productId + '_' + hours + '_' + minutes + '_' + seconds]);
        });

        // Proceed to update the database with validated data
        update(database_ref, Data)
            .then(() => {
                console.log('Data updated successfully!');
                const updatedCartItemsId = Object.keys(userData.cartItemsId).reduce((acc, productId) => {
                    // Only include products that are NOT in selectedProductIds
                    if (!selectedProductIds.includes(productId)) {
                        acc[productId] = userData.cartItemsId[productId];
                    }
                    return acc;
                }, {});

                const updatedUserData = { ...userData, cartItemsId: updatedCartItemsId };
                setUserData(updatedUserData);
                //console.log(userData);

                update(db_ref, updatedUserData)
                    .then(() => {
                        console.log("Backend userdata updated");
                    }).catch((error) => {
                        console.error(error);
                    });

                sessionStorage.setItem('userData', JSON.stringify(updatedUserData));

                selectedProducts.forEach(({ product, quantity }) => {
                    const productRef = Ref.ref(database, 'items/' + product.id);
                    const newQuantityAvailable = parseInt(product.quantityAvailable, 10) - quantity;
                    console.log('quantity', quantity);

                    update(productRef, { quantityAvailable: newQuantityAvailable })
                        .then(() => {
                            console.log("Quantity updated");
                        })
                        .catch((error) => {
                            console.error("Quantity error: " + error);
                        });
                });

                setLoading(false);
                setSuccessModalVisible(true);
                toast.success("Order placed successfully!", {
                    className: 'custom-toast-success'
                });
            })
            .catch((error) => {
                console.error('Error updating data:', error);
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (productId, selectedSize) => {
        setSizeMap(prev => ({ ...prev, [productId]: selectedSize }));
    };

    // Functions to increase/decrease product quantities
    const increaseQuantity = (productId) => {
        setQuantityMap(prev => ({
            ...prev,
            [productId]: prev[productId] + 1
        }));
    };


    const decreaseQuantity = (productId) => {
        setQuantityMap(prev => ({
            ...prev,
            [productId]: Math.max(prev[productId] - 1, 1) // Prevent going below 1
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>User Information</h2>
                <div>
                    <label>
                        Name:
                        <input className="inputText" type="text" name="name" value={editableData.name} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Phone:
                        <input className="inputText" type="text" name="phone" value={editableData.phone} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Address:
                        <input className="inputText" type="text" name="address" value={editableData.address} onChange={handleChange} />
                    </label>
                </div>

                {selectedProducts.length > 0 ? (
                    <div className="product-list" >
                        <h3>Selected Products</h3>
                        {selectedProducts.map(({ product, quantity }, index) => (
                            product ? (
                                <div key={index} className="product-card">
                                    {(product.availability === "available_to_preorder") && (
                                        <div className="preorder-message">
                                            <FontAwesomeIcon icon={faInfoCircle} className="preorder-icon" />
                                            This product is on its way! 🎉 It’ll be delivered to you as soon as it is in stock. Hold tight, your item’s coming soon!
                                        </div>
                                    )}

                                    {(product.availability === "will_be_available_soon" || product.quantityAvailable === 0) && (
                                        <div className="preorder-message">
                                            <FontAwesomeIcon icon={faInfoCircle} className="preorder-icon" />
                                            Oops! 🛑 Out of stock, but don’t worry! It’s on its way and will be delivered ASAP! 🚚💨
                                        </div>
                                    )}

                                    <h4 style={{ textAlign: 'center' }}>{product.name}</h4>
                                    <div className='modal-card'>
                                        <img className='modal-card-image' src={product.imageUrls[0]} alt={product.name} />
                                        <div className='modal-card-details'>
                                            <p>{product.description}</p>
                                            <p> ₹{product.price * quantity}</p>
                                            {product.sizeChart === 'yes' &&
                                                (<>
                                                    {sizeChartData && sizeChartData.length > 0 ? (
                                                        <div className='product-size'>
                                                            <Select
                                                                options={sizeChartData.map(size => ({ value: size.size, label: size.size }))}
                                                                value={sizeMap[product.id] ? { value: sizeMap[product.id], label: sizeMap[product.id] } : null}
                                                                onChange={(selectedSize) => handleSizeChange(product.id, selectedSize.value)}
                                                                className="modal-size-dropdown"
                                                                styles={customStyles}
                                                                placeholder="Select Size"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p>No size chart available</p>  // Fallback message
                                                    )}
                                                </>)}


                                            <p style={{ display: 'flex' }}><strong>Quantity:</strong>&ensp;
                                                <button onClick={() => decreaseQuantity(product.id)} className='quantity-buttons'><FontAwesomeIcon icon={faMinus} /></button>&ensp;
                                                {quantity}&ensp;
                                                <button onClick={() => increaseQuantity(product.id)} className='quantity-buttons'><FontAwesomeIcon icon={faPlus} /></button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>
                ) : (
                    <p>No products selected.</p>
                )}

                <h3>Total: ₹{getTotalAmount()}</h3>
                <button className="proceed-button" onClick={onProceed}>Proceed</button>
            </div>

            {paymentModalVisible && <PaymentMethodModal
                isVisible={paymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                onPaymentSelect={onPaymentSelect}
                totalAmount={getTotalAmount()}
                userData={userData}
                // setOnlineOrderId={setOnlineOrderId}
                // setOnlinePaymentId = {setOnlinePaymentId}
                // onlineOrderId = {onlineOrderId}
                // onlinePaymentId = {onlinePaymentId}
            />}

            {successModalVisible && (<SuccessModal
                isVisible={successModalVisible}
                onClose={() => setSuccessModalVisible(false)}
                setModalVisible={setModalVisible}
            />)}

            {loading && <div className="loading-overlay">
                <img src={loadingAnimation} alt="Loading..." />
            </div>}
        </div>
    );
};

export default Modal;