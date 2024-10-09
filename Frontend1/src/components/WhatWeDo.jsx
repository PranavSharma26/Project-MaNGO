import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function WhatWeDo() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleButtonClick = () => {
    navigate('/dashboard/contributor'); // Redirect to the register page
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 text-center">
      {/* Heading Section */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        What We Do
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
        We are committed to making a positive impact by connecting resources to those in need. Our focus areas include education, health, and sustainability.
      </p>

      {/* Focus Areas Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Area 1 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img 
            src="whatwedo1.png" 
            alt="Education" 
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full mx-auto mb-4" 
          />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Education</h2>
          <p className="text-sm md:text-base text-gray-600">
            We provide access to educational resources and opportunities to those who need them most, empowering individuals for a brighter future.
          </p>
        </div>

        {/* Area 2 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img 
            src="whatwedo2.png" 
            alt="Health" 
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full mx-auto mb-4" 
          />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Health</h2>
          <p className="text-sm md:text-base text-gray-600">
            Our efforts focus on improving healthcare access and supporting communities with essential medical supplies.
          </p>
        </div>

        {/* Area 3 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img 
            src="whatwedo3.png" 
            alt="Sustainability" 
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-full mx-auto mb-4" 
          />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Sustainability</h2>
          <p className="text-sm md:text-base text-gray-600">
            We are dedicated to environmental sustainability through our projects aimed at reducing waste and promoting clean energy.
          </p>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="mt-12 bg-blue-500 text-white p-6 rounded-lg max-w-xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Mission</h3>
        <p className="text-base md:text-lg mb-6">
          Whether you want to volunteer, donate, or simply spread the word, every action helps us create a better world.
        </p>
        <button 
          className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
          onClick={handleButtonClick} // Added onClick handler
        >
          Get Involved
        </button>
      </div>
    </div>
  );
}

export default WhatWeDo;
