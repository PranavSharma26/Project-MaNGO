import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import WhatWeDo from './components/WhatWeDo';
import Gallery from './components/Gallery';
import AboutUs from './components/AboutUs';
import Login from './components/login/Login';
import Register from './components/register/Register';
import RegisterAsContributor from './components/register/RegisterAsContributor';
import RegisterAsNGO from './components/register/RegisterAsNGO';
import LoginAsContributor from './components/login/LoginAsContributor'; // Import the LoginAsContributor component
import LoginAsNGO from './components/login/LoginAsNGO'; // Import the LoginAsNGO component
<<<<<<< Updated upstream
=======
import NGODashboard from './components/dashboard/NGODashboard'; // Import NGODashboard
import ContributorDashboard from './components/dashboard/ContributorDashboard';
>>>>>>> Stashed changes
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
          
          {/* Login routes */}
          <Route path="/login/contributor" element={<LoginAsContributor />} />
          <Route path="/login/ngo" element={<LoginAsNGO />} />
<<<<<<< Updated upstream
        </Routes>
=======
          
          {/* Dashboard routes */}
          <Route path="/dashboard/ngo" element={<NGODashboard />} /> {/* NGO Dashboard Route */}
          <Route path="/dashboard/contributor" element={<ContributorDashboard />} /> {/* Contributor Dashboard Route */}
          </Routes>
>>>>>>> Stashed changes
      </main>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
}

export default App;
