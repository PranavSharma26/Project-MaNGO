import React from 'react';
import { FaDonate, FaHandHoldingHeart, FaDollarSign } from 'react-icons/fa';

function ContributorDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-black">Welcome,</span> 
        <span className="text-blue-600"> to the </span>
        <span className="text-pink-600">Heart</span>
        <span className="text-blue-600"> of </span>
        <span className="text-pink-600">Meaningful</span>
        <span className="text-blue-600"> Change</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        
        {/* Donate Resource */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-blue-600 transition duration-300 cursor-pointer">
          <FaDonate className="text-4xl" />
          <div>
            <h2 className="text-2xl font-semibold">Donate Resource</h2>
            <p className="text-sm">Help by donating items like food or clothes.</p>
          </div>
        </div>
        
        {/* Give Service */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-blue-600 transition duration-300 cursor-pointer">
          <FaHandHoldingHeart className="text-4xl" />
          <div>
            <h2 className="text-2xl font-semibold">Give Service</h2>
            <p className="text-sm">Offer your time for activities or sessions.</p>
          </div>
        </div>
        
        {/* Donate Amount */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-blue-600 transition duration-300 cursor-pointer">
          <FaDollarSign className="text-4xl" />
          <div>
            <h2 className="text-2xl font-semibold">Donate Amount</h2>
            <p className="text-sm">Contribute money directly to NGOs.</p>
          </div>
        </div>
        
      </div>

      {/* Additional Dynamic Content */}
      <div className="mt-12 w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-black">
          How Your Contributions Make an Impact
        </h2>
        <p className="text-base mb-4 text-blue-800">
          Every contribution, be it resources, services, or money, helps NGOs meet their goals and create lasting change.
        </p>
        
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Example Impact Section 1 */}
          <div className="bg-gray-200 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-pink-500">Success Stories</h3>
            <p className="text-sm">Discover how your contributions are making a difference.</p>
          </div>

          {/* Example Impact Section 2 */}
          <div className="bg-gray-200 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-pink-500">Upcoming Events</h3>
            <p className="text-sm">Stay informed about events and ways to get involved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributorDashboard;
