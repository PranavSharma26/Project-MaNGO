
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function NGODashboard() {
  const [services, setServices] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')); 

  // Fetch posted services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/service');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Function to handle booking the service
  const handleBookService = async (service_id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/book-service/${service_id}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to book the service');
      }

      const result = await response.json();

      // Remove the booked service from the list
      setServices((prevServices) => prevServices.filter(service => service.service_id !== service_id));

      alert('Service booked successfully!'); 
    } catch (error) {
      console.error('Error booking service:', error);
    }
  };

  return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
          {/* Navbar */}
          <nav className="bg-blue-500 p-4 text-white mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">NGO Dashboard</h1>
          </nav>
    
          <div className="flex flex-col lg:flex-row">
            {/* Left Section: Search Bar */}
            <div className="w-full lg:w-1/4 p-4 bg-white rounded-lg shadow-lg mb-6 lg:mb-0 lg:mr-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Search</h2>
              <input
                type="text"
                placeholder="Search by Food, Clothes, Other..."
                className="border border-gray-300 p-3 rounded-md w-full mb-4"
              />
              <button className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Search
              </button>
            </div>
    
            {/* Right Section: Content Box */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Food Card */}
                <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
                  <NavLink to="/resources/food">
                    <div className="flex flex-col items-center">
                      <img
                        src="/Food.png"
                        alt="Food"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-4"
                      />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Food</h3>
                      <p className="text-gray-600 text-center">
                        Manage food donations and requests.
                      </p>
                    </div>
                  </NavLink>
                </div>
    
                {/* Clothes Card */}
                <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
                  <NavLink to="/resources/clothes">
                    <div className="flex flex-col items-center">
                      <img
                        src="/clothe.png"
                        alt="Clothes"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-4"
                      />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Clothes</h3>
                      <p className="text-gray-600 text-center">
                        Track clothing donations and requests.
                      </p>
                    </div>
                  </NavLink>
                </div>
    
                {/* Other Card */}
                <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
                  <NavLink to="/resources/other">
                    <div className="flex flex-col items-center">
                      <img
                        src="/donate.png"
                        alt="Other"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-4"
                      />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Other</h3>
                      <p className="text-gray-600 text-center">
                        Manage other types of donations.
                      </p>
                    </div>
                  </NavLink>
                </div>
              </div>
    
              {/* Posted Services Section */}
              <div className="mt-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Posted Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.length === 0 ? (
                    <p>No services posted yet.</p>
                  ) : (
                    services.map((service) => (
                      <div key={service.service_id} className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Service Type: {service.service_type}</h3>
                        <p className="text-gray-600 mb-4">Description: {service.description}</p>
                        <p className="text-gray-500">Status: {service.status}</p>
                        <p className="text-gray-500">Posted by:  {service.user_id}</p>
                        <p className="text-gray-500">Name:  {service.user_name}</p>
                        <p className="text-gray-500">Timestamp: {service.timestamp}</p> 
    
                        {/* Book button: Only show if status is 'available' */}
                         {service.status === 'available' && (
                          <button
                            onClick={() => handleBookService(service.service_id)}
                            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                          Book
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    export default NGODashboard;
    
    
    
    
    
    
    
    
    
    
    