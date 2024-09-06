import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">Register</h3>
        <div className="space-y-6">
          {/* Card for Register as Contributor */}
          <Link to="/register/contributor">
            <div className="p-6 border border-gray-300 rounded-lg shadow hover:shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200">
              <h4 className="text-xl font-semibold text-center text-blue-600">Register as Contributor</h4>
              <p className="mt-2 text-gray-600 text-center">Join as a contributor to donate surplus resources.</p>
            </div>
          </Link>

          {/* Card for Register as NGO */}
          <Link to="/register/ngo">
            <div className="p-6 border border-gray-300 rounded-lg shadow hover:shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200">
              <h4 className="text-xl font-semibold text-center text-green-600">Register as NGO</h4>
              <p className="mt-2 text-gray-600 text-center">Register your NGO to receive donations and resources.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
