import React, { useEffect, useState } from 'react';

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
                            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                                Request
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClothResources;
