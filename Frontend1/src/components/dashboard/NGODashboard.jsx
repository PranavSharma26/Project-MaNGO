import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
function NGODashboard() {
  const [services, setServices] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const handlePostDrive = () => {
    navigate('/post-drive');
  };
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
  const confirmBooking = window.confirm("Are you sure you want to book this service?");
  if (!confirmBooking) return; // Exit if user cancels
  try {
    const response = await fetch(`http://localhost:4000/api/book-service/${service_id}`, {
      method: 'POST', // Changed from POST to PATCH
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to book the service');
    }

    const result = await response.json();

    // Remove the booked service from the list
    setSearchResults((prevResults) => prevResults.filter(service => service.service_id !== service_id));
    alert('Service booked successfully!');
  } catch (error) {
    console.error('Error booking service:', error.message);
  }
};
  // Function to handle booking the resource
  const handleBookResource = async (resource_id) => {
    const confirmBooking = window.confirm("Are you sure you want to book this resource?");
    if (!confirmBooking) return; // Exit if user cancels

    try {
      const response = await fetch(`http://localhost:4000/api/resources/book/${resource_id}`, {
        method: 'PATCH', // Changed from POST to PATCH
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to book the resource');
      }
      
    
      // Remove the booked resource from the list
      setSearchResults((prevResults) => prevResults.filter(resource => resource.resource_id !== resource_id));
      alert('Resource booked successfully!');
    } catch (error) {
      console.error('Error booking resource:', error.message);
    }
  };

  // Function to handle searching for resources
  const handleSearch = async () => {
    const searchbox = document.getElementById('search-item').value.trim().toUpperCase();
    if (searchbox.length === 0) {
      setSearchResults([]); // Clear search results if searchbox is empty
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/resources/search?search=${searchbox}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch search results`);
      }
      const data = await response.json();
      setSearchResults(data); // Update the state with search results

      // Check if no resources were found
      if (data.length === 0) {
        alert('No matching resources found.'); // Notify the user if no resources are found
      }
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <nav className="flex justify-between items-center mb-4 bg-white p-4 shadow-lg rounded-md">
        <h1 className="text-3xl font-bold">
          <span className="text-blue-600">Where</span> Every <span className="text-pink-500">Contribution</span> <span className="text-blue-600">Counts!</span>
        </h1>
        <button
          onClick={handlePostDrive}
          className="py-2 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out"
        >
          Post a Drive
        </button>
      </nav>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Search Bar */}
        <div className="w-full lg:w-1/4 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-blue-500 mb-4">Search Resources</h2>
          <input
            type="text"
            placeholder="Search by Food, Clothes, Other..."
            className="border border-gray-300 p-3 rounded-md w-full mb-4 focus:border-pink-500"
            onKeyUp={handleSearch}
          />
          <button className="w-full py-3 bg-pink-500 text-white rounded-full hover:bg-blue-500 transition duration-300" onClick={handleSearch}>
            Search
          </button>
  
          {/* Search Results */}
          <div className="mt-6">
            {searchResults.length > 0 ? (
              <div className="grid gap-6">
                {searchResults.map((resource) => (
                  <div key={resource.resource_id} className="bg-gray-50 p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800">Resource: {resource.resource_name}</h3>
                    <p className="text-gray-600">Description: {resource.description}</p>
                    <p className="text-gray-600">Quantity: {resource.quantity}</p>
                    <button
                      onClick={() => handleBookService(resource.resource_id)}
                      className="mt-4 py-2 px-4 bg-pink-600 text-white rounded-full hover:bg-blue-500 transition duration-300"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No matching resources found.</p>
                <img src="/MaNGO_Logo.png" alt="MaNGO Logo" className="mx-auto w-35 h-35" />
              </div>
            )}
          </div>
        </div>
  
        {/* Right Section: Categories */}
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-pink-600 mb-4">Categories</h2>
          <div className="grid grid-cols-1 sm:flex gap-6">
            {[
              { label: 'Food', src: '/Food.png', description: 'Manage food donations and requests.', link: '/resources/food' },
              { label: 'Clothes', src: '/clothe.png', description: 'Track clothing donations and requests.', link: '/resources/clothes' },
              { label: 'Other', src: '/donate.png', description: 'Manage other types of donations.', link: '/resources/other' },
            ].map((category) => (
              <div className="bg-pink-100 p-4 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 flex-1 text-center" key={category.label}>
                <NavLink to={category.link}>
                  <img src={category.src} alt={category.label} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700">{category.label}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </NavLink>
              </div>
            ))}
          </div>
  
          {/* Posted Services */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-blue-500 mb-4">Posted Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.length === 0 ? (
              <p>No services posted yet.</p>
            ) : (
              services.map((service) => (
                <div key={service.service_id} className="bg-blue-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold text-gray-800">Service Type: {service.service_type}</h3>
                  <p className="text-gray-600 mb-2">Description: {service.description}</p>
                  <p className="text-gray-500">Status: {service.status}</p>
                  <p className="text-gray-500">Posted by: {service.user_id}</p>
                  <p className="text-gray-500">Name: {service.user_name}</p>
                  <p className="text-gray-500">Timestamp: {service.timestamp}</p>

                  {service.status === 'available' && (
                    <button
                      onClick={() => handleBookService(service.service_id)}
                      className="mt-4 py-2 px-4 bg-pink-600 text-white rounded-full hover:bg-blue-500 transition duration-300"
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












































