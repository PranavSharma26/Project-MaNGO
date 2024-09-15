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
import LoginAsContributor from './components/login/LoginAsContributor';
import LoginAsNGO from './components/login/LoginAsNGO';
import NGODashboard from './components/dashboard/NGODashboard';
import ContributorDashboard from './components/dashboard/ContributorDashboard';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './components/Logout'; // Import Logout component
import { AuthProvider } from './components/context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <AuthProvider>
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
            <Route path="/register" element={<Register />} />
            <Route path="/register/contributor" element={<RegisterAsContributor />} />
            <Route path="/register/ngo" element={<RegisterAsNGO />} />
            <Route path="/login/contributor" element={<LoginAsContributor />} />
            <Route path="/login/ngo" element={<LoginAsNGO />} />
            <Route path="/dashboard/ngo" element={<ProtectedRoute component={NGODashboard} />} />
            <Route path="/dashboard/contributor" element={<ProtectedRoute component={ContributorDashboard} />} />
            <Route path="/logout" element={<Logout />} /> {/* Add a route for logout */}
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
