import React, { useEffect, useState } from 'react';

import io from "socket.io-client";
import axios from 'axios'; // Import axios for making HTTP requests

const socket = io("http://localhost:4000");

const ClothResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/resources/clothes');
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

    const handleBook = async (resourceId) => {
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
                ngoName : fullName,
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
        <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Cloth Resources</h2>
            {resources.length === 0 ? (
                <p className="text-center">No clothing resources available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map(resource => (
                        <div key={resource.resource_id} className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105">
                            <h3 className="text-lg font-semibold">{resource.resource_name}</h3>
                            <p className="text-gray-700">Quantity: {resource.quantity} {resource.unit}</p>
                            <p className="text-gray-600">{resource.description}</p>
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => handleBook(resource.resource_id)}>
                                Book
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Ensure to export the component as default
export default ClothResources;
