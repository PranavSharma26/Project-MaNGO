import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';

function LoginAsNgo() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // Initialize useNavigate

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/login/ngo", userInfo);
      console.log('Login successful:', response.data.message);
      // Redirect to NGO dashboard after successful login
      navigate('/dashboard/ngo'); // Redirect to the NGO dashboard
    } catch (error) {
      console.error("Error logging in:", error);
      // Display the error message for clarity
      if (error.response && error.response.status === 401) {
        alert('Invalid email or password.');
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login as NGO</h2>
        
        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            {...register("email", { required: "Email is required" })} 
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            {...register("password", { required: "Password is required" })} 
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <button 
          type="submit" 
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-pink-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginAsNgo;