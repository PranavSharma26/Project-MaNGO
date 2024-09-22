import React from 'react';

function NGODashboard() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white mb-6">
        <h1 className="text-2xl font-bold">NGO Dashboard</h1>
      </nav>

      <div className="flex">
        {/* Left Section: Search Bar */}
        <div className="w-1/4 p-4 bg-white rounded-lg shadow-lg mr-6">
          <h2 className="text-xl font-semibold mb-4">Search</h2>
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
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex gap-6">
            {/* Food Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
              <div className="flex flex-col items-center">
                <img 
                  src="../public/Food.png" 
                  alt="Food" 
                  className="w-32 h-32 object-cover rounded-full mb-4" 
                />
                <h3 className="text-xl font-semibold mb-2">Food</h3>
                <p className="text-gray-600">
                  Manage food donations and requests.
                </p>
              </div>
            </div>

            {/* Clothes Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
              <div className="flex flex-col items-center">
                <img 
                  src="../public/clothe.png" 
                  alt="Clothes" 
                  className="w-32 h-32 object-cover rounded-full mb-4" 
                />
                <h3 className="text-xl font-semibold mb-2">Clothes</h3>
                <p className="text-gray-600">
                  Track clothing donations and requests.
                </p>
              </div>
            </div>

            {/* Other Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
              <div className="flex flex-col items-center">
                <img 
                  src="../public/donate.png" 
                  alt="Other" 
                  className="w-32 h-32 object-cover rounded-full mb-4" 
                />
                <h3 className="text-xl font-semibold mb-2">Other</h3>
                <p className="text-gray-600">
                  Manage other types of donations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NGODashboard;
