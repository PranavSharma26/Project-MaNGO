import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const DonateResource = () => {
    const [resourceData, setResourceData] = useState({
        resource_name: '',
        resource_type: '',
        quantity: '',
        quantityUnit: 'pieces',
        otherDescription: '',
        description: '',
        consumeTill: '',
        consumeTime: '',
        otherUnit: ''
    });
    const [showDonateForm, setShowDonateForm] = useState(false);
    const [showOtherDescription, setShowOtherDescription] = useState(false);
    const [showOtherUnit, setShowOtherUnit] = useState(false);
    const history = useHistory();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setResourceData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        
        if (name === 'resource_type' && value === 'Others') {
            setShowOtherDescription(true);
        } else {
            setShowOtherDescription(false);
        }

        if (name === 'quantityUnit') {
            setShowOtherUnit(value === 'Other');
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Here you can handle form submission, e.g., API call to save data

        // After successful submission, redirect to DonateResources page
        history.push('/donate-resources');
    };

    return (
        <>
            <button onClick={() => setShowDonateForm(true)}>Donate Resources</button>
            {showDonateForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
                    <form
                        onSubmit={handleFormSubmit}
                        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg relative"
                    >
                        <h2 className="text-3xl font-bold mb-4">Donate Resource</h2>

                        {/* Resource Name Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="resource_name">
                                Resource Name
                            </label>
                            <input
                                type="text"
                                id="resource_name"
                                name="resource_name"
                                value={resourceData.resource_name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        {/* Resource Type Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="resourceType">
                                Resource Type
                            </label>
                            <select
                                id="resourceType"
                                name="resource_type"
                                value={resourceData.resource_type}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select a resource type</option>
                                <option value="Food">Food</option>
                                <option value="Clothes">Clothes</option>
                                <option value="Toys">Toys</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        {/* Other Description Input */}
                        {showOtherDescription && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="otherDescription">
                                    Description of resource type
                                </label>
                                <input
                                    type="text"
                                    id="otherDescription"
                                    name="otherDescription"
                                    value={resourceData.otherDescription}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        )}

                        {/* Quantity and Unit Inputs */}
                        <div className="mb-4 flex gap-2">
                            <div className="w-2/3">
                                <label className="block text-sm font-medium mb-2" htmlFor="quantity">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={resourceData.quantity}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="block text-sm font-medium mb-2" htmlFor="quantityUnit">
                                    Unit
                                </label>
                                <select
                                    id="quantityUnit"
                                    name="quantityUnit"
                                    value={resourceData.quantityUnit}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="pieces">Pieces</option>
                                    <option value="kg">Kg</option>
                                    <option value="litres">Litres</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Other Unit Input */}
                        {showOtherUnit && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="otherUnit">
                                    Specify Unit
                                </label>
                                <input
                                    type="text"
                                    id="otherUnit"
                                    name="otherUnit"
                                    value={resourceData.otherUnit || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        )}

                        {/* Description Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="description">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={resourceData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Conditional Inputs for Food */}
                        {resourceData.resource_type === "Food" && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2" htmlFor="consumeTill">
                                        Consume Till
                                    </label>
                                    <input
                                        type="date"
                                        id="consumeTill"
                                        name="consumeTill"
                                        value={resourceData.consumeTill || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2" htmlFor="consumeTime">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        id="consumeTime"
                                        name="consumeTime"
                                        value={resourceData.consumeTime || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2 bg-pink-500 text-white rounded-md hover:bg-blue-500 transition duration-300"
                        >
                            Post!
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDonateForm(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default DonateResource;
