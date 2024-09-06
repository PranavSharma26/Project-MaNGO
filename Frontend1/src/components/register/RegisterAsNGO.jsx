import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function RegisterAsNGO() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/register/ngo", userInfo);
      console.log("Response:", response.data.message);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register as NGO</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.fullname ? 'border-red-500' : 'border-gray-300'}`}
            {...register("fullname", { required: true })}
          />
          {errors.fullname && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            {...register("email", { required: true })}
          />
          {errors.email && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            {...register("password", { required: true })}
          />
          {errors.password && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterAsNGO;
