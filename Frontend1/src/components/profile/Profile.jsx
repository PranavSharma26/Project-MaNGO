
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit, FaEye, FaQuestionCircle } from 'react-icons/fa';

const ProfileContainer = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [viewMode, setViewMode] = useState('');
    const [profile, setProfile] = useState({
        name: '',
        mname: '',
        lname: '',
        contact: '',
        address: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (viewMode === 'viewProfile') {
            axios.get('http://localhost:4000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then(response => {
                setProfile({
                    name: response.data.first_name || '',
                    mname: response.data.middle_name || '',
                    lname: response.data.last_name || '',
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
        setViewMode('editProfile'); // Toggle to edit mode
        setIsDropdownOpen(false); // Close the dropdown after click
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        setViewMode('viewProfile'); // Switch back to view mode

        axios.put('http://localhost:4000/api/profile', {
            name: profile.name,
            mname: profile.mname || null,
            lname: profile.lname,
            contact: profile.contact,
            address: profile.address
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
        setIsDropdownOpen(false); // Close the dropdown after click
    };

    const handleHelpSupport = () => {
        setViewMode('helpSupport');
        setIsDropdownOpen(false); // Close the dropdown after click
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [id]: value
        }));
    };

    return (
        <div>
            {/* Navbar Section */}
            <nav className="w-full bg-gray-800 p-4 flex justify-between items-center">
                <div className="text-white text-lg  flex justify-between items-center">MaNGO</div>
                <div className="relative">
                    {/* Profile Button */}
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-full"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
                    >
                        Profile
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleViewProfile}>
                                <FaEye className="inline-block mr-2" /> View Profile
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleEditClick}>
                                <FaUserEdit className="inline-block mr-2" /> Edit Profile
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleHelpSupport}>
                                <FaQuestionCircle className="inline-block mr-2" /> Help & Support
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Profile Section */}
            <div className="w-full max-w-lg mx-auto mt-10 p-8 bg-gray-100 rounded-xl shadow-lg">
                {isEditing ? (
                    <div className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-lg">First Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="mname" className="text-lg">Middle Name:</label>
                            <input
                                type="text"
                                id="mname"
                                value={profile.mname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="lname" className="text-lg">Last Name:</label>
                            <input
                                type="text"
                                id="lname"
                                value={profile.lname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="contact" className="text-lg">Contact No:</label>
                            <input
                                type="text"
                                id="contact"
                                value={profile.contact}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="address" className="text-lg">Address:</label>
                            <input
                                type="text"
                                id="address"
                                value={profile.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <button onClick={handleSaveClick} className="mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-full shadow-lg hover:from-green-500 hover:to-green-700">
                            Save Changes
                        </button>
                    </div>
                ) : viewMode === 'viewProfile' ? (
                    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                        <h3 className="text-2xl font-semibold text-gray-800">View Profile</h3>
                        <p className="mt-4"><strong>First Name:</strong> {profile.name}</p>
                        <p><strong>Middle Name:</strong> {profile.mname || 'N/A'}</p>
                        <p><strong>Last Name:</strong> {profile.lname}</p>
                        <p><strong>Contact No:</strong> {profile.contact}</p>
                        <p><strong>Address:</strong> {profile.address}</p>
                    </div>
                ) : viewMode === 'helpSupport' ? (
                    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                        <h3 className="text-2xl font-semibold text-gray-800">Help and Support</h3>
                        <p className="mt-4">For assistance, please contact us at:</p>
                        <p><strong>Support Line:</strong> +123-456-7890</p>
                    </div>
                ) : (
                    <div className="mt-4">
                        <p>Select an option from the dropdown to proceed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileContainer;