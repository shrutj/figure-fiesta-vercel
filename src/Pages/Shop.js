import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modals/Modal';
import Select from 'react-select'; // Import react-select
import './Styles/Shop.css';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '90%',
        height: '40px', // Set height to match the input field
        borderRadius: '20px',
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

const Shop = ({ database, Ref, userData, setUserData, update, loginCheck, allProducts, setAllProducts, categoryFilter, homepageData, setShowProductId, showProductId, navSearchTerm, sizeChartData, setNavSearchTerm, setCategoryFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('All');
    const [modalVisible, setModalVisible] = useState(false);
    const [buyNowProductId, setBuyNowProductId] = useState([]);
    const items = allProducts;
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (homepageData) {
            const Categories = [];
            homepageData.forEach((category) => {
                Categories.push(category.name);
            });
            setCategories(Categories);
        }
    }, [homepageData]);

    useEffect(()=>{
        if(categoryFilter){
            setSelectedCategory(categoryFilter);
            setCategoryFilter('');
        }
    }, [categoryFilter])

    useEffect(() => {
        if (navSearchTerm) {
            setSearchTerm(navSearchTerm);
            setNavSearchTerm('');
        }
    }, [navSearchTerm]);

    const handleAddToCart = (id, event) => {
        event.preventDefault();
        if (!loginCheck) {
            toast.info('Please Log In to your account first to get amazing deals.', {
                className: 'custom-toast-info'
            });
        } else {
            const database_ref = Ref.ref(database, 'users/' + userData.userUid);
            const updatedData = { ...userData };
    
            // Ensure cartItemsId is initialized as an empty object if not present
            updatedData.cartItemsId = updatedData.cartItemsId || {};
    
            // Check if the item is already in the cart
            const currentQuantity = updatedData.cartItemsId[id] || 0;
    
            // Increment the quantity without limit
            updatedData.cartItemsId[id] = currentQuantity + 1;
    
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
            const item = items.find(item => item.id === id);
            if (item) {
                setBuyNowProductId([id]);
                setModalVisible(true);
            }
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setBuyNowProductId([]);
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sorting logic
    const sortedItems = filteredItems.slice().sort((a, b) => {
        if (sortOrder === 'Price: Low to High') {
            return parseFloat(a.price.replace('₹', '').replace(',', '')) - parseFloat(b.price.replace('₹', '').replace(',', ''));
        } 
        if (sortOrder === 'Price: High to Low') {
            return parseFloat(b.price.replace('₹', '').replace(',', '')) - parseFloat(a.price.replace('₹', '').replace(',', ''));
        }
        
        // If sorting by name (alphabetical)
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    const handleCardClick = (e, id) => {
        e.preventDefault();
        let itemId = id.toString();
        setShowProductId(itemId);
        navigate('/product-details');
    };

    return (
        <div className="shop-container">
            <div className="shop-filter">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='shop-search-filter'
                />
                <div className='shop-sort-filter-container'>
                    <Select
                        options={[{ value: 'All', label: 'All' }, ...categories.map(category => ({ value: category, label: category }))]}
                        value={selectedCategory === 'All' ? null : { value: selectedCategory, label: selectedCategory }}
                        onChange={(selectedOption) => setSelectedCategory(selectedOption ? selectedOption.value : 'All')}
                        className="shop-sort-filter"
                        isSearchable={false}
                        placeholder="Categories"
                        styles={customStyles}
                    />
                    <Select
                        options={[
                            { value: 'All', label: 'All' },
                            { value: 'Price: Low to High', label: 'Price: Low to High' },
                            { value: 'Price: High to Low', label: 'Price: High to Low' },
                        ]}
                        value={sortOrder === 'All' ? null : { value: sortOrder, label: sortOrder }}
                        onChange={(selectedOption) => setSortOrder(selectedOption ? selectedOption.value : 'All')}
                        className="shop-sort-filter"
                        isSearchable={false}
                        styles={customStyles}
                        placeholder="Sort By"
                    />
                </div>
            </div>
            <div className="shop-item-cards">
                {sortedItems.map(item => (
                    <div key={item.id} className="shop-item-card">
                        <img style={{ cursor: 'pointer' }} onClick={(e) => handleCardClick(e, item.id)} src={item.imageUrls[0]} alt={item.name} className="shop-item-image" />
                        <div className="shop-item-details">
                            <h3 className="shop-item-title" style={{ cursor: 'pointer' }} onClick={(e) => handleCardClick(e, item.id)}>{item.name}</h3>
                            <p className="shop-item-description" style={{ cursor: 'pointer' }} onClick={(e) => handleCardClick(e, item.id)}>{item.description}</p>

                            <div className="shop-price-container">
                                {item.priceWithoutDiscount && (
                                    <span className="shop-original-price">₹{item.priceWithoutDiscount}</span>
                                )}
                                <p className="shop-item-price">₹{item.price}</p>
                            </div>

                            {(item.availability === 'will_be_available_soon' || item.quantityAvailable === '0') ? 
                                <p>Oops! 🛑 We are Out of stock</p> :
                                <div className="shop-item-actions">
                                    <button className="shop-btn" onClick={(e) => handleAddToCart(item.id, e)}>
                                        <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
                                    </button>
                                    <button className="shop-btn" onClick={(e) => handleBuyNow(item.id, e)}>
                                        <FontAwesomeIcon icon={faShoppingCart} /> {item.availability === 'available_to_preorder' ? 'Preorder' : 'Buy Now'}
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                ))}
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

export default Shop;
