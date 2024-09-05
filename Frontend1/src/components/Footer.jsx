import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Footer Links */}
          <div className="flex flex-col md:flex-row mb-4 md:mb-0">
            <NavLink to="/" className="text-gray-600 hover:text-gray-900 px-2 py-1 text-sm">Home</NavLink>
            <NavLink to="/how-it-works" className="text-gray-600 hover:text-gray-900 px-2 py-1 text-sm">How It Works</NavLink>
            <NavLink to="/what-we-do" className="text-gray-600 hover:text-gray-900 px-2 py-1 text-sm">What We Do</NavLink>
            <NavLink to="/gallery" className="text-gray-600 hover:text-gray-900 px-2 py-1 text-sm">Gallery</NavLink>
            <NavLink to="/about-us" className="text-gray-600 hover:text-gray-900 px-2 py-1 text-sm">About Us</NavLink>
          </div>
          {/* Footer Contact Info */}
          <div className="text-center md:text-right">
            <p className="text-sm">© 2024 MaNGO. All rights reserved.</p>
            <p className="text-sm">Contact us: <a href="mailto:info@mango.org" className="text-blue-500 hover:underline">info@mango.org</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
