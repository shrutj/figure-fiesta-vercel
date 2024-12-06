import React, { useState } from 'react';
import './Styles/UserProfile.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/CustomToast.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faGenderless, faPhoneAlt, faEnvelope, faMapMarkerAlt, faPen, faSave, faUndo, faBox, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'; // Import react-select

// Custom styles for react-select
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        boxShadow: state.isFocused ? '0 0 5px rgba(255, 23, 68, 0.4)' : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        textAlign: 'left'
    }),
    input: (provided) => ({
        ...provided,
        fontSize: '1rem',
        padding: '0.05rem 0',
        textAlign: 'left'
    }),
    placeholder: (provided) => ({
        ...provided,
        fontSize: '1rem',
        color: '#333',
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign:'left'
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '1rem',
        backgroundColor: state.isSelected ? '#ff5722' : '#fff',
        color: state.isSelected ? '#fff' : '#333',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ff5722',
            color: '#fff',
        }
    }),
};

const UserProfile = ({ userData, setUserData, update, database, Ref, deleteUser, remove, auth, setLoginCheck }) => {
    const [newData, setNewData] = useState(userData);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(newData);
    const [error, setError] = useState({});
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const navigate = useNavigate();

    const database_ref = Ref.ref(database, 'users/' + userData.userUid);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Form Validation
        const validationErrors = {};
        if (!formData.username) validationErrors.username = "Username is required.";
        if (!formData.phone) validationErrors.phone = "Phone number is required.";
        if (!formData.email) validationErrors.email = "Email is required.";
        if (!formData.gender) validationErrors.gender = "Gender is required.";
        if (!formData.address) validationErrors.address = "Delivery address is required.";

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return; // Stop the save if there are errors
        }

        update(database_ref, formData)
            .then(() => {
                toast.success('Profile Updated Successfully!!', {
                    className: 'custom-toast-success'
                });
                setNewData(formData);
                sessionStorage.setItem('userData', JSON.stringify(formData));
                setUserData(formData);
            })
            .catch(error => console.error('Error updating data:', error));

        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(newData);
        setIsEditing(false);
        setError({});
    };

    const handleYourOrders = (e) => {
        e.preventDefault();
        navigate('/your-orders');
    };

    const handleDeleteAccount = () => {
        setShowModal(true); // Show the confirmation modal
    };

    const deleteAccount = async () => {
        try {
            const User = auth.currentUser;
    
            // Delete the user first
            await deleteUser(User); // Assuming deleteUser is an async operation
            
            // Proceed with the rest of the operations if user is successfully deleted
            await remove(Ref.ref(database, 'users/' + userData.userUid));
            sessionStorage.removeItem('userData');
            setLoginCheck(false);
            setUserData({});
            
            toast.success('Account Deleted Successfully!!', {
                className: 'custom-toast-success'
            });
            navigate('/'); // Optionally redirect after account deletion
        } catch (error) {
            // If deleteUser fails or any other operation fails
            toast.info('If you are sure you want to delete account. Please Logout and Login again, then delete this account.', {
                className: 'custom-toast-info'
            });
        }
    }
    

    const confirmDelete = () => {
        // Call your delete function here (which you will implement)
        deleteAccount();
        setShowModal(false); // Close the modal after deletion
        
    };

    const cancelDelete = () => {
        setShowModal(false); // Close the modal without doing anything
    };

    // Gender options for the react-select dropdown
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="user-profile-container">
            <div className="user-profile">
                <div className="header">
                    <h1 className='UP-header-h1'>Your Profile</h1>
                    <button onClick={handleYourOrders} className="orders-btn">
                        <FontAwesomeIcon icon={faBox} /> Your Orders
                    </button>
                </div>
                <form>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faUserAlt} /> Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        {error.username && <p className="error">{error.username}</p>}
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faGenderless} /> Gender:</label>
                        <Select
                            options={genderOptions}
                            value={formData.gender ? { value: formData.gender, label: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) } : null}
                            onChange={(selectedOption) => setFormData(prevData => ({ ...prevData, gender: selectedOption ? selectedOption.value : '' })) }
                            isDisabled={!isEditing}
                            styles={customStyles}
                            placeholder="Select Gender"
                        />
                        {error.gender && <p className="error">{error.gender}</p>}
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faPhoneAlt} /> Phone Number:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        {error.phone && <p className="error">{error.phone}</p>}
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faEnvelope} /> Email ID:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        {error.email && <p className="error">{error.email}</p>}
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Delivery Address:</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        {error.address && <p className="error">{error.address}</p>}
                    </div>

                    <div className="buttons">
                        {!isEditing ? (
                            <button type="button" onClick={handleEdit} className="edit-btn">
                                <FontAwesomeIcon icon={faPen} /> Edit
                            </button>
                        ) : (
                            <>
                                <button type="button" onClick={handleSave} className="save-btn">
                                    <FontAwesomeIcon icon={faSave} /> Save
                                </button>
                                <button type="button" onClick={handleCancel} className="cancel-btn">
                                    <FontAwesomeIcon icon={faUndo} /> Cancel
                                </button>
                            </>
                        )}
                        <button type="button" onClick={handleDeleteAccount} className="delete-btn">
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete Account
                        </button>
                    </div>
                </form>

                {/* Confirmation Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Are you sure you want to delete your account?</h2>
                            <div className="modal-buttons">
                                <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                                <button onClick={confirmDelete} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
