import React from 'react';
import { NavLink } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-[500px] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          
          {/* Card for Contributor Login */}
          <NavLink
            to="/login/contributor"
            className="flex items-center justify-center bg-blue-500 text-white py-4 px-6 rounded-md shadow-md w-full md:w-1/2 mx-2 text-center hover:bg-blue-600 transition duration-300"
          >
            <h3 className="text-lg font-semibold">Login as Contributor</h3>
          </NavLink>

          {/* Card for NGO Login */}
          <NavLink
            to="/login/ngo"
            className="flex items-center justify-center bg-green-500 text-white py-4 px-6 rounded-md shadow-md w-full md:w-1/2 mx-2 text-center hover:bg-green-600 transition duration-300"
          >
            <h3 className="text-lg font-semibold">Login as NGO</h3>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Login;
