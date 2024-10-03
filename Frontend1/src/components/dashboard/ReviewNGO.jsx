import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewNgo = () => {
  const [selectedNgo, setSelectedNgo] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [ngos, setNgos] = useState([]);
  const navigate = useNavigate();

  const handleStarHover = (star) => {
    setRating(star);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleReviewSubmit = async () => {
    if (!selectedNgo || rating === 0 || !review) {
      alert('Please select an NGO, provide a rating, and write a review.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated.');
        return;
      }

      const response = await axios.post(
        'http://localhost:4000/api/review',
        {
          ngoId: selectedNgo,
          rating,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 200) {
        alert('Review submitted successfully!');
        navigate('/dashboard/contributor');
      } else {
        alert('Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized: Please log in again.');
      } else {
        alert('Failed to submit review.');
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchNgos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ngosforreview');
        if (isMounted) {
          console.log('NGO Data:', response.data);
          if (Array.isArray(response.data)) {
            setNgos(response.data); 
          } else {
            alert('Unexpected data format received from the server.');
          }
        }
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        alert('Failed to load NGOs.');
      }
    };

    fetchNgos();

    return () => {
      isMounted = false; 
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
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
              <option key={ngo.ngo_id} value={ngo.ngo_id}>
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