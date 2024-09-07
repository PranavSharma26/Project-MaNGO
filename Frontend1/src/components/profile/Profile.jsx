import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user information
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://your-backend-url/api/profile');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Redirect to login if not authenticated
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://your-backend-url/api/logout');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {user ? (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Name:</h3>
            <p>{user.fullname}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Email:</h3>
            <p>{user.email}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
