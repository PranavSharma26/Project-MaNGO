import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewNgo = () => {
  const [selectedNgo, setSelectedNgo] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]); // To store fetched NGOs

  const handleStarHover = (star) => {
    setRating(star);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleReviewSubmit = () => {
    // Handle review submit logic here
  };

  useEffect(() => {
    // Fetch NGOs from the backend
    axios.get('/api/ngos')
      .then(response => {
        setNgos(response.data); // Set NGOs in the state
      })
      .catch(error => {
        console.error('Error fetching NGOs:', error);
        alert('Failed to load NGOs.');
      });
  }, []); // Empty dependency array to fetch on component mount


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {/* Heading */}
        <div className="border-b-2 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-center text-blue-600">
            Review an NGO
          </h1>
        </div>

        {/* NGO Selection */}
        <div className="mb-6">
          <label htmlFor="ngo-select" className="block text-pink-600 mb-2">
            Select an NGO
          </label>
          <select
            id="ngo-select"
            value={selectedNgo}
            onChange={(e) => setSelectedNgo(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select an NGO --</option>
            {ngos.map((ngo) => (
              <option key={ngo.id} value={ngo.id}>
                {ngo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-pink-600 mb-2">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => handleStarHover(star)}
                onClick={() => handleStarClick(star)}
                className={`cursor-pointer text-3xl ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Written Review */}
        <div className="mb-6">
          <label htmlFor="review" className="block text-pink-600 mb-2">
            Write your review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit Review
          </button>

          {/* Back to Dashboard */}
          <button
            onClick={() => navigate('/dashboard/contributor')}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewNgo;
