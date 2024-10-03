import React from 'react';

const DonateAmount = ({
  amount,
  selectedNgo,
  ngos,
  setAmount,
  setSelectedNgo,
  handleAmountSubmit,
}) => {
  return (
    <div>
      <form onSubmit={handleAmountSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Donation Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select NGO</label>
          <select
            value={selectedNgo}
            onChange={(e) => setSelectedNgo(e.target.value)}
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
          className="w-full py-2 bg-pink-500 text-white rounded-md"
        >
          Donate Amount
        </button>
      </form>
    </div>
  );
};

export default DonateAmount;
