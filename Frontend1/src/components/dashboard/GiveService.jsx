import React from 'react';

const GiveService = ({
  serviceDescription,
  selectedNgo,
  ngos,
  handleServiceDescriptionChange,
  handleNgoSelection,
  handleServiceSubmit,
}) => {
  return (
    <div>
      <form onSubmit={handleServiceSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Service Description</label>
          <input
            type="text"
            value={serviceDescription}
            onChange={handleServiceDescriptionChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select NGO</label>
          <select
            value={selectedNgo}
            onChange={handleNgoSelection}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select an NGO</option>
            {ngos.map((ngo) => (
              <option key={ngo.id} value={ngo.id}>
                {ngo.name} - {ngo.address}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-md"
        >
          Donate Service
        </button>
      </form>
    </div>
  );
};

export default GiveService;
