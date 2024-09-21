
import React, { useState, useEffect } from 'react';
import './ProfileContainer.css';
import axios from 'axios';

const ProfileContainer = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [viewMode, setViewMode] = useState('');
    const [profile, setProfile] = useState({
        name: '',
        contact: '',
        address: ''
    });

    // Simulating a stored JWT token for authenticated requests
    const token = localStorage.getItem('token'); // You would typically store the JWT after login

    useEffect(() => {
        if (viewMode === 'viewProfile') {
            // Fetch user profile from the backend with JWT token in headers
            axios.get('http://localhost:4000/api/profile', {
                headers: {
                    'Authorization': token
                }
            })
            .then(response => {
                setProfile({
                    name: response.data.first_name || '',
                    contact: response.data.contact || '',
                    address: response.data.address || ''
                });
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
        }
    }, [viewMode, token]);

    const handleEditClick = () => {
        setIsEditing(true);
        setIsDropdownOpen(false);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        setViewMode('viewProfile');

        // Send updated profile to the backend
        axios.put('http://localhost:4000/api/profile', {
            name: profile.name,
            contact: profile.contact,
            address: profile.address
        }, {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            console.log('Profile updated:', response.data);
        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });
    };

    const handleViewProfile = () => {
        setViewMode('viewProfile');
        setIsDropdownOpen(false);
    };

    const handleHelpSupport = () => {
        setViewMode('helpSupport');
        setIsDropdownOpen(false);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [id]: value
        }));
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profile Dashboard</h2>
                <div className="dropdown">
                    <button 
                        className="dropdown-toggle" 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        Profile Options
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleEditClick}>Edit Profile</button>
                            <button onClick={handleViewProfile}>View Profile</button>
                            <button onClick={handleHelpSupport}>Help and Support</button>
                        </div>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="profile-details">
                    <div className="detail-item">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={profile.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="detail-item">
                        <label htmlFor="contact">Contact No:</label>
                        <input
                            type="text"
                            id="contact"
                            value={profile.contact}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="detail-item">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            value={profile.address}
                            onChange={handleChange}
                        />
                    </div>
                    <button onClick={handleSaveClick}>Save Changes</button>
                </div>
            ) : viewMode === 'viewProfile' ? (
                <div className="view-profile">
                    <h3>View Profile</h3>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Contact No:</strong> {profile.contact}</p>
                    <p><strong>Address:</strong> {profile.address}</p>
                </div>
            ) : viewMode === 'helpSupport' ? (
                <div className="help-support">
                    <h3>Help and Support</h3>
                    <p>For assistance, please contact us at:</p>
                    <p><strong>Support Line:</strong> +123-456-7890</p>
                </div>
            ) : (
                <div>
                    <p>Select an option from the dropdown to proceed.</p>
                </div>
            )}
        </div>
    );
};

export default ProfileContainer;
