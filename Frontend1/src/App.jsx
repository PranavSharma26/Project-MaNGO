import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import WhatWeDo from './components/WhatWeDo';
import Gallery from './components/Gallery';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/register/Register';
import RegisterAsContributor from './components/register/RegisterAsContributor';
import RegisterAsNGO from './components/register/RegisterAsNGO';
import Footer from './components/Footer'; // Import the Footer component

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          
          {/* Register routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/register/contributor" element={<RegisterAsContributor />} />
          <Route path="/register/ngo" element={<RegisterAsNGO />} />
        </Routes>
      </main>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
}

export default App;
