import { NavLink } from 'react-router-dom';

function NGODashboard() {
  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">NGO Dashboard</h1>
      </nav>

      <div className="flex flex-col lg:flex-row">
        {/* Left Section: Search Bar */}
        <div className="w-full lg:w-1/4 p-4 bg-white rounded-lg shadow-lg mb-6 lg:mb-0 lg:mr-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Search</h2>
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
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Food Card */}
            <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
              <NavLink to="/resources/food">
                <div className="flex flex-col items-center">
                  <img
                    src="/Food.png"
                    alt="Food"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-4"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Food</h3>
                  <p className="text-gray-600 text-center">Manage food donations and requests.</p>
                </div>
              </NavLink>
            </div>

            {/* Clothes Card */}
            <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
              <NavLink to="/resources/clothes">
                <div className="flex flex-col items-center">
                  <img
                    src="/clothe.png"
                    alt="Clothes"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-4"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Clothes</h3>
                  <p className="text-gray-600 text-center">
                    Track clothing donations and requests.
                  </p>
                </div>
              </NavLink>
            </div>

            {/* Other Card */}
            <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
              <NavLink to="/resources/other">
                <div className="flex flex-col items-center">
                  <img
                    src="/donate.png"
                    alt="Other"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-4"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Other</h3>
                  <p className="text-gray-600 text-center">
                    Manage other types of donations.
                  </p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NGODashboard;
