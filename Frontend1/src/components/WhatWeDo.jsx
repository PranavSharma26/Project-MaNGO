import React from 'react';
import { NavLink } from 'react-router-dom'; // Import Link
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function WhatWeDo() {
  const { role } = useContext(AuthContext); // Get user role

  return (
    <div className="p-4 md:p-8 bg-gray-100 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What We Do</h1>
      <p className="text-base md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
        We are committed to making a positive impact by connecting resources to those in need. 
        Our focus areas include education, health, and sustainability.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <NavLink 
          to="/services/education" // Use Link instead of div with onClick
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
        >
          <img src="whatwedo1.png" alt="Education" className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Education</h2>
          <p className="text-sm md:text-base text-gray-600">
            We provide access to educational resources and opportunities to those who need them most.
          </p>
        </NavLink>

        <NavLink 
          to="/services/health" // Use Link instead of div with onClick
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
        >
          <img src="whatwedo2.png" alt="Health" className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Health</h2>
          <p className="text-sm md:text-base text-gray-600">
            Our efforts focus on improving healthcare access and supporting communities with medical supplies.
          </p>
        </NavLink>

        <NavLink 
          to="/services/sustainability" // Use Link instead of div with onClick
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
        >
          <img src="whatwedo3.png" alt="Sustainability" className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Sustainability</h2>
          <p className="text-sm md:text-base text-gray-600">
            We are dedicated to environmental sustainability through projects aimed at reducing waste and promoting clean energy.
          </p>
        </NavLink>
      </div>
    </div>
  );
}

export default WhatWeDo;