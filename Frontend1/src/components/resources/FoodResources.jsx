import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from "/src/socket";
const FoodResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/resources/food');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setResources(data);
            } catch (error) {
                setError(error);
                console.error('Error fetching resources:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const handleBook = async (resourceId, resourceName) => {
        const confirmBooking = window.confirm('Are you sure you want to book this resource?');
        if (!confirmBooking) return;

         // ngo_id (retrieving from localStorage)
         const ngo_id = localStorage.getItem("ngo_id");
         console.log("NGO ID:", ngo_id); 
     

        try {
             // Step 1: Fetch user details (first name, last name) using the user_id
             const userResponse = await axios.get(
                `http://localhost:4000/api/users/${ngo_id}`
            );
            const { first_name, last_name } = userResponse.data;
            const fullName = `${first_name} ${last_name}`;

            const response = await fetch(`http://localhost:4000/api/resources/book/${resourceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to book the resource');
            }

               // Parse the response to get user_id
               const data = await response.json();
               const { user_id } = data;
   
               console.log(`provider Id : ${user_id}`);

            // Remove the booked resource from the list
            setResources(prevResources => prevResources.filter(resource => resource.resource_id !== resourceId));

            // Emit notification to server using socket.io
            socket.emit("booked_resource", {
                resourceId: resourceId,
                resourceName: resourceName, // Sending resource name as well
                ngoName: fullName,
                user_id: user_id, // user_id of the person who posted the resource
            });
    
            console.log("Booking and notification sent successfully");
        } catch (error) {
            console.error('Error booking resource:', error);
            setError(error);
        }
    };

    if (loading) return <p className="text-center">Loading resources...</p>;
    if (error) return <p className="text-red-500 text-center">Error fetching resources: {error.message}</p>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="relative mb-8">
                <h2 
                    className="text-4xl font-bold text-gray-800 py-4 px-6 rounded-lg shadow-lg inline-block" 
                    style={{ 
                        backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/015/942/510/large_2x/wooden-texture-background-brown-wood-texture-old-wood-texture-for-add-text-or-work-design-for-backdrop-product-top-view-wood-food-table-free-photo.JPG")', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat', 
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)'  // Better readability
                    }}
                >
                    Food Resources
                </h2>
            </div>
            {resources.length === 0 ? (
                <p className="text-center text-xl text-gray-500">No food resources available.</p>
            ) : (
                <div className="bg-green-100 p-8 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map(resource => (
                            <div 
                                key={resource.resource_id} 
                                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-transform duration-500 transform hover:scale-103"
                            >
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{resource.resource_name}</h3>
                                <p className="text-gray-700 mb-2">Quantity: <span className="font-medium">{resource.quantity} {resource.unit}</span></p>
                                <p className="text-gray-600 mb-4">{resource.description}</p>
                                
                                {/* Directions Button */}
                                <button 
                                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 mt-2"
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${resource.location}`, '_blank')}
                                >
                                    Directions
                                </button>
                                
                                <button 
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-colors duration-200 mt-2"
                                    onClick={() => handleBook(resource.resource_id, resource.resource_name)} // Pass resource name along with id
                                    >
                                    Book
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );       
};

export default FoodResources;
