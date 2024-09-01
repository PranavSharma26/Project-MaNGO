// Login.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Login({ onClose }) {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    toast.info("Login functionality removed.");
    // Implement login logic here if needed
    localStorage.setItem("Users", JSON.stringify({ email: data.email }));
    onClose(); // Close the modal or form
    navigate("/"); // Redirect to home or another appropriate page
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Link
            to="/"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </Link>

          <h3 className="font-bold text-lg">Login</h3>

          {/* Email Input */}
          <div className="mt-4 space-y-2">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-80 px-3 py-1 border rounded-md outline-none"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="mt-4 space-y-2">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-80 px-3 py-1 border rounded-md outline-none"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-around mt-6">
            <button className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200">
              Login
            </button>
            <div>
              Not registered?{" "}
              <Link
                to="/signup"
                className="underline text-blue-500 cursor-pointer"
              >
                Signup
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
