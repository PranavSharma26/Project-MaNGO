import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import bellIcon from '../assets/image.png';  // Import the bell icon image
// import { io } from "socket.io-client";
import socket from "/src/socket";  // Adjust path if needed


const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [hasUnread, setHasUnread] = useState(false); // Track if there are unread notifications

  useEffect(() => {
    // Define the handler functions
    const handleResourcePosted = (data) => {
      console.log("Incoming data:", data); // Log the incoming data
  
      const personName = data.name; // Adjust this according to the actual property that holds the name
      const type = data.typeOfContributor;
      let notificationMessage = "";
  
      if (type === 1) {
        notificationMessage = `A new resource has been posted by ${personName}`;
      } else if (type === 2) {
        notificationMessage = `A new service has been posted by ${personName}`;
      } else {
        notificationMessage = `A new donation has been made by ${personName}`; // Optional else block
      }
  
      // Prepend new notifications instead of appending
      setNotifications((prevNotifications) => [notificationMessage, ...prevNotifications]);
      setHasUnread(true); // Mark notifications as unread when a new one arrives
    };
  
    const handleDriveNotification = (data) => {
      console.log("Drive notification data:", data); // Log the incoming data for drive notification
      
      const personName = data.name;
      const driveNotificationMessage = `An event drive has been generated by ${personName}`;
  
      // Prepend the new drive notification
      setNotifications((prevNotifications) => [driveNotificationMessage, ...prevNotifications]);
      setHasUnread(true); // Mark notifications as unread
    };
  
    // Listen for new resource postings
    socket.on('resource_posted', handleResourcePosted);
  
    // Listen for DriveNotification event
    socket.on('Notification_generated', handleDriveNotification);
  
    // Clean up the socket connection and remove event listeners when the component is unmounted
    return () => {
      socket.off('resource_posted', handleResourcePosted);
      socket.off('Notification_generated', handleDriveNotification);
      socket.disconnect();
    };
  }, []);
  
  

  // Toggle the dropdown visibility and mark notifications as read
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setHasUnread(false); // Mark all notifications as read
  };

  const getClassName = ({ isActive }) =>
    `text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200' : ''}`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 text-transparent bg-clip-text">
              MaNGO
            </NavLink>
          </div>

          <div className="hidden md:flex flex-grow justify-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={getClassName}>Home</NavLink>
              <NavLink to="/how-it-works" className={getClassName}>How it Works</NavLink>
              <NavLink to="/what-we-do" className={getClassName}>What We Do</NavLink>
              <NavLink to="/gallery" className={getClassName}>Gallery</NavLink>
              <NavLink to="/about-us" className={getClassName}>About Us</NavLink>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Bell icon for notifications */}
            <div className="relative">
              <button
                onClick={toggleDropdown} // Toggle dropdown visibility and mark as read
                className="focus:outline-none"
              >
                <img src={bellIcon} alt="Bell Icon" className="h-6 w-6" />
                {/* Notification badge */}
                {hasUnread && (
                  <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showDropdown && (
  <div className="absolute right-0 mt-2 w-[30rem] bg-white shadow-lg rounded-lg py-2 max-h-64 overflow-y-auto">
    {notifications.length > 0 ? (
      notifications.map((notification, index) => (
        <div key={index} className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 flex justify-between items-center">
          <span>{notification}</span>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => showNotificationDetails(notification)} // Handle the click event
          >
            Details
          </button>
        </div>
      ))
    ) : (
      <div className="px-4 py-2 text-sm text-gray-700">
        No new notifications
      </div>
    )}
  </div>
)}







            </div>

            {isLoggedIn ? (
              <>
                <NavLink to="/profile" className="text-gray-700 hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="bg-red-600 text-white hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `bg-pink-600 text-white hover:bg-pink-500 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-pink-500' : ''}`}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `bg-cyan-500 text-white hover:bg-cyan-400 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-cyan-400' : ''}`}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-black hover:text-gray-800 focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-200' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-200' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </NavLink>
            <NavLink
              to="/what-we-do"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-200' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              What We Do
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-200' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-200' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  className="block w-full text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full bg-red-600 text-white hover:bg-red-500 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `block w-full bg-pink-600 text-white hover:bg-pink-500 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-pink-500' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `block w-full bg-cyan-500 text-white hover:bg-cyan-400 px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-cyan-400' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
