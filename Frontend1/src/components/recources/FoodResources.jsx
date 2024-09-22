import React, { useEffect, useState } from 'react';

const FoodResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/resources/food'); // Adjust the URL as necessary
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

    if (loading) return <p>Loading resources...</p>;
    if (error) return <p>Error fetching resources: {error.message}</p>;

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">Food Resources</h2>
            {resources.length === 0 ? (
                <p>No food resources available.</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Resource Name</th>
                            <th className="border border-gray-300 p-2">Quantity</th>
                            <th className="border border-gray-300 p-2">Unit</th>
                            <th className="border border-gray-300 p-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(resource => (
                            <tr key={resource.resource_id}>
                                <td className="border border-gray-300 p-2">{resource.resource_name}</td>
                                <td className="border border-gray-300 p-2">{resource.quantity}</td>
                                <td className="border border-gray-300 p-2">{resource.unit}</td>
                                <td className="border border-gray-300 p-2">{resource.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FoodResources;
