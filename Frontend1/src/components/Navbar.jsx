import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getClassName = ({ isActive }) =>
    `text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-gray-200' : ''
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (Left) */}
          <div className="flex-shrink-0">
  <NavLink to="/" className="text-xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 text-transparent bg-clip-text">
    MaNGO
  </NavLink>
</div>


          {/* Desktop Menu (Middle) */}
          <div className="hidden md:flex flex-grow justify-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={getClassName}>Home</NavLink>
              <NavLink to="/how-it-works" className={getClassName}>How it Works</NavLink>
              <NavLink to="/what-we-do" className={getClassName}>What We Do</NavLink>
              <NavLink to="/gallery" className={getClassName}>Gallery</NavLink>
              <NavLink to="/about-us" className={getClassName}>About Us</NavLink>
            </div>
          </div>

          {/* Login and Register Buttons (Right) */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `bg-pink-600 text-white hover:bg-pink-500 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-pink-500' : ''
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `bg-cyan-500 text-white hover:bg-cyan-400 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-cyan-400' : ''
                }`
              }
            >
              Register
            </NavLink>
          </div>

          {/* Hamburger Menu Icon (Mobile) */}
          <div className="flex md:hidden">
            <button onClick={toggleMenu} type="button" className="text-black hover:text-gray-800 focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </NavLink>
            <NavLink
              to="/what-we-do"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              What We Do
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `block text-black hover:bg-gray-200 hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              About Us
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `block w-full bg-pink-600 text-white hover:bg-pink-500 px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-pink-500' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `block w-full bg-cyan-500 text-white hover:bg-cyan-400 px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-cyan-400' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Login
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
