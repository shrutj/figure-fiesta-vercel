import React, { useEffect, useState } from 'react';
import './Styles/Home.css';
import { useNavigate } from 'react-router-dom';
import Modal from './Modals/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/CustomToast.css'

const Home = ({ homepageData, allProducts, setAllProducts, setCategoryFilter, showProductId, setShowProductId, database, Ref, update, userData, setUserData, loginCheck, sizeChartData }) => {
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [slideshowImages, setSlideshowImages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [buyNowProductId, setBuyNowProductId] = useState([]);
    const items = allProducts;
    const navigate = useNavigate();

    useEffect(() => {
        if (homepageData) {
            setCategories(homepageData[0] || []);
            setSections(homepageData[1] || []);
            setSlideshowImages(homepageData[3] || []);
        }
    }, [homepageData]);

    const getProductDetails = (itemId) => {
        return allProducts.find(product => product.id === itemId);
    };

    const handleCategoryClick = (e, categoryName) => {
        e.preventDefault();
        setCategoryFilter(categoryName);
        navigate('/shop');
    };

    const handleCardClick = (e, id) => {
        e.preventDefault();
        setShowProductId(id.toString());
        navigate('/product-details');
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setBuyNowProductId([]);
    };

    const handleBuyNow = (id, event) => {
        event.preventDefault();
        if (!loginCheck) {
            toast.info('Please Log In to your account first to get amazing deals.', {
                className: 'custom-toast-info'
            });
        } else {
            const item = items.find(item => item.id === id);
            if (item) {
                setBuyNowProductId([id]);
                setModalVisible(true);
            }
        }
    };

    return (
        <div className="home-container">
            {/* Slideshow Section */}
            <div className="slideshow-container">
                {slideshowImages.map((image, index) => (
                    <div key={index} className="slide">
                        <img src={image} alt={`Slide ${index + 1}`} />
                        {console.log("image",image)}
                    </div>
                ))}
            </div>

            {/* Categories Section */}
            <div className="categories-section">
                <h2>Categories</h2>
                <div className="category-cards">
                    {categories.map((category, index) => (
                        <div key={index} className="category-card" onClick={(e) => handleCategoryClick(e, category.name)}>
                            <img src={category.image} alt={category.name} />
                            <p>{category.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sections Management */}
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="items-section">
                    <h2>{section.sectionName}</h2>
                    <div className="item-cards">
                        {section.itemIds.map((itemId) => {
                            const product = getProductDetails(itemId);
                            if (!product) return null;

                            return (
                                <div key={itemId} className="item-card">
                                    <img className="item-image" onClick={(e) => handleCardClick(e, product.id)} src={product.imageUrls[0]} alt={product.name} />
                                    <div className="item-details">
                                        <h3 className="item-name" onClick={(e) => handleCardClick(e, product.id)}>{product.name}</h3>
                                        <p className="item-description" onClick={(e) => handleCardClick(e, product.id)}>{product.description}</p>
                                        <div className="price-container">
                                            {product.priceWithoutDiscount && <span className="original-price">₹{product.priceWithoutDiscount}</span>}
                                            <p className="item-price">₹{product.price}</p>
                                        </div>
                                        {product.availability === 'will_be_available_soon' || product.quantityAvailable === '0' ? (
                                            <p className="out-of-stock">Oops! 🛑 We are Out of stock</p>
                                        ) : (
                                            <>
                                                {product.availability === 'available_to_preorder' && (
                                                    <button className="btn" onClick={(e) => handleBuyNow(product.id, e)}>Preorder</button>
                                                )}
                                                {product.availability === 'yes' && (
                                                    <button className="btn" onClick={(e) => handleBuyNow(product.id, e)}>Buy Now</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

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
                setUserData={setUserData}
                sizeChartData={sizeChartData}
            />
        </div>
    );
};

export default Home;
