import React, { useState } from "react";
import Slider from "react-slick";
import "./Styles/ProductDetails.css"; // Ensure this is styled appropriately
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/CustomToast.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Modal from "./Modals/Modal";
import { useNavigate } from "react-router-dom";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const ProductDetail = ({ showProductId, allProducts, setAllProducts, database, Ref, update, userData, setUserData, loginCheck, refundPolicy, sizeChartData }) => {
  const product = allProducts.find(item => item.id === showProductId);
  console.log('product', product, showProductId, allProducts);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [buyNowProductId, setBuyNowProductId] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);  // State for toggling visibility of other details
  const [showSizeChart, setShowSizeChart] = useState(false); // State for toggling size chart visibility
  const navigate = useNavigate();
  console.log("Size chart data", sizeChartData);

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handleAddToCart = (id, event) => {
    event.preventDefault();
    if (!loginCheck) {
        toast.info('Please Log In to your account first to get amazing deals.', {
            className: 'custom-toast-info'
        });
    } else {
        const database_ref = Ref.ref(database, 'users/' + userData.userUid);
        const updatedData = { ...userData };

        // Check if the item is already in the cart
        const currentQuantity = updatedData.cartItemsId[id] || 0;

        if (currentQuantity < 5) {
            // If the item is already in the cart, increment the quantity
            updatedData.cartItemsId[id] = currentQuantity + 1;
        } else {
            toast.info('You\'ve hit the 5-item per order limit! No problem – just place another order and keep shopping!', {
                className: 'custom-toast-info'
            });
            return; // Don't add more than 5
        }

        // Update the database with the modified cart data
        update(database_ref, updatedData)
            .then(() => {
                toast.success('Item added to cart', {
                    className: 'custom-toast-success'
                });
                sessionStorage.setItem('userData', JSON.stringify(updatedData));
                setUserData(updatedData);
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
    }
};


  const handleBuyNow = (id, event) => {
    event.preventDefault();
    if (!loginCheck) {
        toast.info('Please Log In to your account first to get amazing deals.', {
            className: 'custom-toast-info'
        });
    } else {
        const item = allProducts.find(item => item.id === id);
        if (item) {
            setBuyNowProductId([id]);
            setModalVisible(true);
        }
    }
  };

  let textToShow = "";
  if(product.returnPolicy === 'no_return'){
    textToShow = "No Return Policy";
    refundPolicy.current = "no_return";
  }
  else if(product.returnPolicy === '7_days_replacement'){
    textToShow = "Seven Days Replacement Policy";
    refundPolicy.current = "7_days_replacement";
  }
  else if(product.returnPolicy === '7_days_return'){
    textToShow = "Seven Days Return Policy";
    refundPolicy.current = "7_days_return";
  }

  const handleModalClose = () => {
    setModalVisible(false);
    setBuyNowProductId([]);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedImageIndex,
  };

  const isMobile = window.innerWidth < 600;

  // Updated renderSizeChart function to dynamically render the size chart from `sizeChartData`
  const renderSizeChart = () => {
    if (product.sizeChart === 'yes' && sizeChartData && sizeChartData.length > 0) {
      return (
        <div className="size-chart">
          <h4>Size Chart</h4>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Length (cm)</th>
                <th>Chest (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizeChartData.map((sizeData, index) => (
                <tr key={index}>
                  <td>{sizeData.size}</td>
                  <td>{sizeData.length}</td>
                  <td>{sizeData.chest}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <b>Note: Please select the size of the item at the time of ordering.</b>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`product-detail-container ${isMobile ? "mobile" : "desktop"}`}>
      <div className="image-slider">
        {product.imageUrls.length <= 1 ? <img src={product.imageUrls[0]} alt={product.name} /> :
        <Slider {...settings}>
          {product.imageUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`${product.name} - Image ${index + 1}`} />
            </div>
          ))}
        </Slider>
        }
      </div>

      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <div className="price-quantity">
          {product.priceWithoutDiscount && product.priceWithoutDiscount !== product.price ? (
            <>
              <h3>Price: &ensp;
              <span className="original-price" style={{ textDecoration: 'line-through', marginRight: '10px' }} >
              ₹{product.priceWithoutDiscount}
              </span>
              <span className="discounted-price">₹{product.price}</span>
              </h3>
            </>
          ) : (
            <h3>Price: ₹{product.price}</h3>
          )}
        </div>

        {(product.availability === 'will_be_available_soon' || product.quantityAvailable === '0') ? 
          <p>Oops! 🛑 We are Out of stock' </p> : 
          <div className="buttons">
            <button className="add-to-cart" onClick={(e) => handleAddToCart(product.id, e)}>
              <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
            </button>
            <button className="buy-now" onClick={(e) => handleBuyNow(product.id, e)}>
              <FontAwesomeIcon icon={faShoppingCart} /> {product.availability === 'available_to_preorder' ? ' Preorder' : ' Buy Now'}
            </button> 
          </div>
        }

        <div className="return-policy">
          <p>
            <strong>Return/Replacement Policy:</strong> {textToShow}
          </p>
          <p onClick={()=>{navigate('/refund-policy')}} className="learn-more-link">Learn More</p>
        </div>

        {showSizeChart && renderSizeChart()}
        {product.sizeChart === 'yes' &&
        <div style={{display: 'block', width:'100%', alignItems:'center'}}>
        <button onClick={() => setShowSizeChart(!showSizeChart)} className="toggle-size-chart-btn">
          {showSizeChart ? (<>Hide Size Chart<FontAwesomeIcon icon={faAngleUp} /></>) : (<>Show Size Chart<FontAwesomeIcon icon={faAngleDown} /></>)}
        </button>
        </div>}

        {showDetails ? (
          <div className="other-details">
            <h4>Other Details:</h4>
            <ul>
              <li><strong>Material:</strong> {product.material}</li>
              <li><strong>Dimensions:</strong> {product.dimensions}</li>
              <li><strong>Color:</strong> {product.color}</li>
              <li><strong>Size:</strong> {product.size} cm</li>
              <li><strong>Weight:</strong> {product.weight} grams</li>
            </ul>
          </div>
        ) : null}

        <button onClick={() => setShowDetails(!showDetails)} className="toggle-details-btn">
          {showDetails ? (<>Less Details<FontAwesomeIcon icon={faAngleUp} /></>) : (<>More Details<FontAwesomeIcon icon={faAngleDown} /></>)}
        </button>
      </div>

      <Modal 
        isVisible={modalVisible} 
        onClose={handleModalClose} 
        userData={userData} 
        selectedProductIds={buyNowProductId}
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
  );
};

export default ProductDetail;
