import React, { useState } from 'react';
import './YourOrders.css';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTimesCircle, FaRedoAlt, FaTimes } from 'react-icons/fa'; // Importing icons
import Modal from '../Modals/Modal';

const YourOrders = (props) => {
  const {
    allProducts,
    setAllProducts,
    userOrders,
    setUserOrders,
    showProductId,
    setShowProductId,
    database,
    Ref,
    update,
    userData,
    setUserData,
    onValue,
    sizeChartData
  } = props;

  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false); // Return modal state
  const [showReplaceModal, setShowReplaceModal] = useState(false); // Replace modal state
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToReturn, setOrderToReturn] = useState(null); // Store order to return
  const [orderToReplace, setOrderToReplace] = useState(null); // Store order to replace
  const [modalVisible, setModalVisible] = useState(false);
  const [orderAgainProductId, setOrderAgainProductId] = useState([]);

  // For reasons in modals
  const [returnReason, setReturnReason] = useState(null);
  const [replacementReason, setReplacementReason] = useState('');
  const [otherReturnReason, setOtherReturnReason] = useState('');

  // Sort orders by date, newest first
  const orders = Object.values(userOrders).sort((a, b) => new Date(b.date) - new Date(a.date));

  const getProductDetailsById = (id) => {
    return allProducts.find((product) => product.id === id);
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'Pending':
        return 'Order placed. Awaiting processing.';
      case 'Processed':
        return 'Order processed. Ready for shipment.';
      case 'Delivered':
        return 'Order delivered. Thank you for shopping!';
      case 'Canceled':
        return 'Order canceled. Apologies for the inconvenience.';
      case 'Return_Requested':
        return 'Return requested. Awaiting confirmation.';
      case 'Replacement_Requested':
        return 'Replacement requested. Awaiting review.';
      case 'Replacement_in_Process':
        return 'Replacement in process. Shipping soon.';
      case 'Replacement_Rejected':
        return 'Replacement rejected. Contact us for help.';
      case 'Return_in_Process':
        return 'Return in process. Pickup scheduled.';
      case 'Refund_in_Process':
        return 'Refund in process. Expect it in 5-7 days.';
      case 'Refund_Successful':
        return 'Refund successful. Amount has been credited.';
      case 'Replacement_Successful':
        return 'Replacement successful. New item shipped.';
      default:
        return 'Status unknown. Contact support for details.';
    }
  };
  
  

  const handleOrderAgain = (e, itemId, quantity) => {
    const idArray = [];
    for (let i = 0; i < quantity; i++) {
      idArray.push(itemId);
    }
    setOrderAgainProductId(idArray);
    setModalVisible(true);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    //alert(`Order ${orderToCancel.orderId} is canceled.`);
    const items_ref = Ref.ref(database, 'items/' + orderToCancel.itemId);
    let productQuantity;
    onValue(items_ref, (snapshot) => {
      const data = snapshot.val();
      productQuantity = data.quantityAvailable;
    });
    const newQuantityAvailable = parseInt(productQuantity, 10) + orderToCancel.quantity;
    update(items_ref, { quantityAvailable: newQuantityAvailable })
      .then(() => {
        console.log('Quantity updated');
      })
      .catch((error) => {
        console.log('Quantity updation error', error);
      });

    const order_ref = Ref.ref(database, 'orders/' + userData.userUid + '/' + orderToCancel.orderId);

    update(order_ref, { status: 'Canceled' })
      .then(() => {
        console.log('Order status updated');
      })
      .catch((error) => {
        console.log('Order status', error);
      });

    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const handleCardClick = (e, id) => {
    e.preventDefault();
    let itemId = id.toString();
    setShowProductId(itemId);
    navigate('/product-details');
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setOrderAgainProductId([]);
  };

  // Handle "Return Order" button click
  const handleReturnOrder = (order) => {
    setOrderToReturn(order);
    setShowReturnModal(true); // Show the return confirmation modal
  };

  // Confirm the return request
  const handleConfirmReturn = () => {
    const order_ref = Ref.ref(database, 'orders/' + userData.userUid + '/' + orderToReturn.orderId);
    const returnReasonText = returnReason === 'Other' ? otherReturnReason : returnReason;
    update(order_ref, { status: 'Return_Requested', reason: returnReasonText })
      .then(() => {
        console.log('Order status updated to Return Requested');
        setShowReturnModal(false); // Close the return modal
        setOrderToReturn(null); // Clear the selected order to return
        setReturnReason(''); // Clear reason
        setOtherReturnReason(''); // Clear other reason field
      })
      .catch((error) => {
        console.log('Error updating order status:', error);
      });
  };

  const handleReturnModalClose = () => {
    setShowReturnModal(false); // Close the modal without making any changes
    setOrderToReturn(null);
    setReturnReason('');
    setOtherReturnReason('');
  };

  // Handle "Replace Order" button click
  const handleReplaceOrder = (order) => {
    setOrderToReplace(order);
    setShowReplaceModal(true); // Show the replace confirmation modal
  };

  // Confirm the replacement request
  const handleConfirmReplace = () => {
    const order_ref = Ref.ref(database, 'orders/' + userData.userUid + '/' + orderToReplace.orderId);
    update(order_ref, { status: 'Replacement_Requested', reason: replacementReason })
      .then(() => {
        console.log('Order status updated to Replacement Requested');
        setShowReplaceModal(false); // Close the replace modal
        setOrderToReplace(null); // Clear the selected order to replace
        setReplacementReason(''); // Clear replacement reason
      })
      .catch((error) => {
        console.log('Error updating order status:', error);
      });
  };

  const handleReplaceModalClose = () => {
    setShowReplaceModal(false); // Close the modal without making any changes
    setOrderToReplace(null);
    setReplacementReason('');
  };

  return (
    <div className="your-orders-container">
      <h1>Your Orders</h1>

      {/* Display All Orders */}
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => {
            const product = getProductDetailsById(order.itemId);
            const totalPrice = parseFloat(product.price) * order.quantity;
            const isDelivered = order.status === 'Delivered';

            return (
              <div key={order.orderId} className="order-card">
                {/* Left side: Product Image */}
                <div
                  className="order-image"
                  onClick={(e) => handleCardClick(e, product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={product.imageUrls[0]} alt={product.name} />
                </div>

                {/* Right side: Product Details */}
                <div className="order-item-details">
                  <h3 onClick={(e) => handleCardClick(e, product.id)} style={{ cursor: 'pointer' }}>
                    {product.name}
                  </h3>
                  <p
                    className="product-description"
                    onClick={(e) => handleCardClick(e, product.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.description}
                  </p>
                  <div className="order-info">
                    <span>Quantity: {order.quantity}</span>
                    <span>Order Date: {new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <div className="order-info">
                    <span className="order-price">Price: ₹{totalPrice.toFixed(2)}</span>
                    {order.paymentId && <span>Payment Id: {order.paymentId}</span>}
                  </div>

                  {isDelivered && (
                    <div className="order-info">
                      <span>Delivered on: {new Date(order.deliveredOn).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="order-status">{getStatusMessage(order.status)}</div>

                  <div className="order-actions">
                    <button
                      className="order-again-btn"
                      onClick={(e) => handleOrderAgain(e, product.id, order.quantity)}
                    >
                      <FaRedoAlt /> Order Again
                    </button>

                    {order.status === 'Pending' && order.status !== 'Processed' && order.status !== 'Canceled' && (
                      <button className="cancel-order-btn" onClick={() => handleCancelOrder(order)}>
                        <FaTimesCircle /> Cancel Order
                      </button>
                    )}

                    {/* "Return Order" Button */}
                    {order.status === 'Delivered' && product.returnPolicy === '7_days_return' && (() => {
                      const deliveredDate = new Date(order.deliveredOn); // Delivery date
                      const currentDate = new Date(); // Current date
                      const timeDiff = currentDate - deliveredDate; // Time difference in milliseconds
                      const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert to days

                      if (daysDiff <= 7) {
                        return (
                            <>
                            <button
                            className="cancel-order-btn"
                            onClick={() => handleReplaceOrder(order)} // Trigger replace modal
                          >
                            <FaRedoAlt /> Replace Order
                          </button>
                          <button
                            className="cancel-order-btn"
                            onClick={() => handleReturnOrder(order)} // Trigger return modal
                          >
                            <FaTimesCircle /> Return Order
                          </button>
                          </>
                        );
                      }
                    })()}

                    {/* "Replace Order" Button */}
                    {order.status === 'Delivered' && product.returnPolicy === '7_days_replacement' && (() => {
                      const deliveredDate = new Date(order.deliveredOn); // Delivery date
                      const currentDate = new Date(); // Current date
                      const timeDiff = currentDate - deliveredDate; // Time difference in milliseconds
                      const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert to days

                      if (daysDiff <= 7) {
                        return (
                          <button
                            className="cancel-order-btn"
                            onClick={() => handleReplaceOrder(order)} // Trigger replace modal
                          >
                            <FaRedoAlt /> Replace Order
                          </button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <p>No orders placed yet.</p>
          <button className="Shop-Now-Button" onClick={() => navigate('/shop')}>
            Shop Now
          </button>
        </div>
      )}

      {/* Modal for Cancel Order Confirmation */}
      {showCancelModal && orderToCancel && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal-content">
            {/* Close Icon */}
            <FaTimes 
              className="close-modal-icon" 
              onClick={handleCancelModalClose} 
            />
            <h2>Confirm Cancellation</h2>
            <p>
              Are you sure you want to cancel order <strong>{orderToCancel.orderId}</strong>?
            </p>
            <div className="cancel-modal-actions">
              <button className="cancel-confirm-btn" onClick={handleConfirmCancel}>
                Yes, Cancel
              </button>
              <button className="cancel-cancel-btn" onClick={handleCancelModalClose}>
                No, Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Return Order Confirmation */}
      {showReturnModal && orderToReturn && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal-content">
            {/* Close Icon */}
            <FaTimes 
              className="close-modal-icon" 
              onClick={handleReturnModalClose} 
            />
            <h2>Confirm Return</h2>
            <p>Are you sure you want to return order <strong>{orderToReturn.orderId}</strong>?</p>
            <div className="cancel-modal-actions" style={{display:'flex', flexDirection:'column'}}>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="reason-select"
              >
                <option value="">Select a reason</option>
                <option value="Damaged">Product is Damaged</option>
                <option value="Broken">Product is Broken</option>
                <option value="Defective">Product is Defective</option>
                <option value="Did Not Like">Did not like the product</option>
                <option value="Other">Other</option>
              </select>

              {returnReason === 'Other' && (
                <textarea
                  value={otherReturnReason}
                  onChange={(e) => {setOtherReturnReason(e.target.value)
                  }}
                  placeholder="Please specify your reason"
                  className="other-reason-input"
                />
              )}
            {(returnReason === 'Did Not Like' || returnReason === 'Defective' || returnReason === 'Broken' || returnReason === 'Damaged'|| otherReturnReason.length > 0) &&
              <div className="modal-actions" style={{display:'flex', flexDirection:'row'}}>
                <button className="cancel-confirm-btn" onClick={handleConfirmReturn}>
                  Yes, Return
                </button>
                <button className="cancel-cancel-btn" onClick={handleReturnModalClose}>
                  No, Keep Order
                </button>
              </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* Modal for Replace Order Confirmation */}
      {showReplaceModal && orderToReplace && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal-content">
            {/* Close Icon */}
            <FaTimes 
              className="close-modal-icon" 
              onClick={handleReplaceModalClose} 
            />
            <h2>Confirm Replace</h2>
            <p>Are you sure you want to replace order <strong>{orderToReplace.orderId}</strong>?</p>
            <div className="cancel-modal-actions"  style={{display:'flex', flexDirection:'column'}}>
              <select
                value={replacementReason}
                onChange={(e) => setReplacementReason(e.target.value)}
                className="reason-select"
              >
                <option value="">Select a reason</option>
                <option value="Damaged">Product is Damaged</option>
                <option value="Broken">Product is Broken</option>
                <option value="Defective">Product is Defective</option>
              </select>
                {replacementReason !== '' && 
                <div className="modal-actions" style={{display:'flex', flexDirection:'row'}}>
                <button className="cancel-confirm-btn" onClick={handleConfirmReplace}>
                  Yes, Replace
                </button>
                <button className="cancel-cancel-btn" onClick={handleReplaceModalClose}>
                  No, Keep Order
                </button>
              </div>}
              
            </div>
          </div>
        </div>
      )}

      <Modal
        isVisible={modalVisible}
        onClose={handleModalClose}
        userData={userData}
        selectedProductIds={orderAgainProductId}
        database={database}
        Ref={Ref}
        update={update}
        allProducts={allProducts}
        setAllProducts={setAllProducts}
        setModalVisible={setModalVisible}
        setUserData={setUserData}
        sizeChartData = {sizeChartData}
      />
    </div>
  );
};

export default YourOrders;
