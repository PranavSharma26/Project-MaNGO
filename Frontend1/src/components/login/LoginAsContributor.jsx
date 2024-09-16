// components/LoginAsContributor.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 

function LoginAsContributor() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/login/contributor", userInfo);
      const { token } = response.data;

      if (token) {
        login(token); 
        console.log(response.data.message);
        navigate('/dashboard/contributor');
      } else {
        console.error("No token received");
      }
    } catch (error) {
      console.error("Error logging in:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login as Contributor</h2>
        
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

export default LoginAsContributor;
