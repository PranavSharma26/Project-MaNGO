import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import NGODashboard from './dashboard/NGODashboard';

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      {isLoggedIn ? (
        <NGODashboard /> // Show NGO Dashboard content if logged in
      ) : (
        <div className="max-w-screen-xl mx-auto md:px-10 px-4 flex flex-col md:flex-row items-center my-10">
          <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <div className="space-y-6 md:space-y-12">
              <h1 className="text-3xl md:text-4xl font-bold">
                Turn your surplus into someone's smile{" "}
                <span className="text-pink-500">join us in spreading kindness!!!</span>
              </h1>
              <p className="text-base md:text-xl">
                "Donating helps those in need and makes a positive impact on your community. Your contributions can provide food, shelter, and essential support to people facing difficult times. It's a simple yet powerful way to make a difference, show kindness, and bring hope to others. Every donation counts and helps build a better, more compassionate world."
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img src="/CharityImage.jpg" className="w-full h-auto md:w-[400px] md:h-[400px] object-cover" alt="NGO Image" />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
