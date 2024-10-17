import React, { useEffect, useState } from 'react';

function HealthServices() {
    const [services, setServices] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/service/health');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // Filter for only available services
                const availableServices = data.filter(service => service.status === 'available');
                setServices(availableServices);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken); // Set the token in state
    }, []);

    // Function to handle booking the service
    const handleBookService = async (service_id) => {
        const confirmBooking = window.confirm("Are you sure you want to book this service?");
        if (!confirmBooking) return; // Exit if user cancels
        
        if (!token) {
            alert('You must be logged in to book a service.'); // Check for token
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/book-service/${service_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the error message from the response
                throw new Error(`Failed to book the service: ${errorText}`);
            }

            const result = await response.json();

            // Update the services list to remove the booked service
            setServices((prev) => prev.filter((service) => service.service_id !== service_id));
            alert('Service booked successfully!');
        } catch (error) {
            console.error('Error booking service:', error.message);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Health Services</h1>
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-blue-500 mb-4">Available Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {services.length === 0 ? (
                        <p>No available services posted yet.</p>
                    ) : (
                        services.map((service) => (
                            <div key={service.service_id} className="bg-blue-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                                <h3 className="text-lg font-semibold text-gray-800">Service Type: {service.service_type}</h3>
                                <p className="text-gray-600 mb-2">Description: {service.description}</p>
                                <p className="text-gray-500">Status: {service.status}</p>
                                <p className="text-gray-500">Posted by: {service.user_id}</p>
                                <p className="text-gray-500">Name: {service.user_name}</p>
                                <p className="text-gray-500">Timestamp: {service.timestamp}</p>

                                <button
                                    onClick={() => handleBookService(service.service_id)}
                                    className="mt-4 py-2 px-4 bg-pink-600 text-white rounded-full hover:bg-blue-500 transition duration-300"
                                >
                                    Book
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default HealthServices;
