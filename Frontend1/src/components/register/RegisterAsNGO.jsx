// import React from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Link } from 'react-router-dom';

// function RegisterAsNGO() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [emailError, setEmailError] = React.useState(""); // State for email error
//   const [contactError, setContactError] = React.useState(""); // State for contact error
//   const navigate = useNavigate(); // useNavigate hook for navigation

//   const onSubmit = async (data) => {
//     const userInfo = {
//       user_id: Date.now() + 'N', // Generate a unique ID for the NGO
//       user_type: 'N',
//       first_name: data.first_name,
//       middle_name: data.middle_name,
//       last_name: data.last_name,
//       contact: data.contact,
//       email: data.email,
//       password: data.password,
//       address: data.address,
//       city: data.city,
//     };

//     try {
//       const response = await axios.post("http://localhost:4000/api/register", userInfo);
//       console.log("Response:", response.data.message);

//       // Clear previous errors on successful registration
//       setEmailError("");
//       setContactError("");

//       // Redirect to the home page on successful registration
//       navigate("/");
//     } catch (err) {
//       console.error("Error:", err.response ? err.response.data : err.message);

//       // Clear previous field-specific errors
//       setEmailError("");
//       setContactError("");

//       // Check if the error is related to the email or contact field
//       if (err.response && err.response.data) {
//         if (err.response.data.field === "email") {
//           setEmailError(err.response.data.message); // Show the message below email
//         } else if (err.response.data.field === "contact") {
//           setContactError(err.response.data.message); // Show the message below contact
//         }
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center">Register as NGO</h2>
//         <div className="mb-4">
//           <label className="block text-gray-700">First Name</label>
//           <input
//             type="text"
//             placeholder="Enter your first name"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("first_name", { required: true })}
//           />
//           {errors.first_name && <span className="text-sm text-red-500">This field is required</span>}
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Middle Name</label>
//           <input
//             type="text"
//             placeholder="Enter your middle name (optional)"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.middle_name ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("middle_name")}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Last Name</label>
//           <input
//             type="text"
//             placeholder="Enter your last name"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("last_name", { required: true })}
//           />
//           {errors.last_name && <span className="text-sm text-red-500">This field is required</span>}
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Contact</label>
//           <input
//             type="text"
//             placeholder="Enter your contact number"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.contact || contactError ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("contact", { required: true })}
//           />
//           {errors.contact && <span className="text-sm text-red-500">This field is required</span>}
//           {contactError && <span className="text-sm text-red-500">{contactError}</span>} {/* Display contact error */}
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.email || emailError ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("email", { required: true })}
//           />
//           {errors.email && <span className="text-sm text-red-500">This field is required</span>}
//           {emailError && <span className="text-sm text-red-500">{emailError}</span>} {/* Display email error */}
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("password", { required: true })}
//           />
//           {errors.password && <span className="text-sm text-red-500">This field is required</span>}
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Address</label>
//           <input
//             type="text"
//             placeholder="Enter your address"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("address")}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">City</label>
//           <input
//             type="text"
//             placeholder="Enter your city"
//             className={`w-full px-3 py-2 border rounded-md outline-none ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
//             {...register("city", { required: true })}
//           />
//           {errors.city && <span className="text-sm text-red-500">This field is required</span>}
//         </div>
//         <div>
//           <p className="mb-2">
//             <Link to="/login/ngo" className="text-blue-500 hover:underline">
//                 Already have an account?
//             </Link>
//           </p>
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

// export default RegisterAsNGO;




























































import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function RegisterAsNGO() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [emailError, setEmailError] = React.useState(""); // State for email error
  const [contactError, setContactError] = React.useState(""); // State for contact error
  const navigate = useNavigate(); // useNavigate hook for navigation

  const onSubmit = async (data) => {
    const userInfo = {
      user_id: Date.now() + 'N', // Generate a unique ID for the NGO
      user_type: 'N',
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      contact: data.contact,
      email: data.email,
      password: data.password,
      address: data.address,
      city: data.city,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/register", userInfo);
      console.log("Response:", response.data.message);

      // Clear previous errors on successful registration
      setEmailError("");
      setContactError("");

      // Redirect to the home page on successful registration
      navigate("/");
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);

      // Clear previous field-specific errors
      setEmailError("");
      setContactError("");

      // Check if the error is related to the email or contact field
      if (err.response && err.response.data) {
        if (err.response.data.field === "email") {
          setEmailError("Email is already registered"); // Show the message for already registered email
        } else if (err.response.data.field === "contact") {
          setContactError(err.response.data.message); // Show the message below contact
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register as NGO</h2>
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
            {...register("first_name", { required: true })}
          />
          {errors.first_name && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Middle Name</label>
          <input
            type="text"
            placeholder="Enter your middle name (optional)"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.middle_name ? 'border-red-500' : 'border-gray-300'}`}
            {...register("middle_name")}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
            {...register("last_name", { required: true })}
          />
          {errors.last_name && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact</label>
          <input
            type="text"
            placeholder="Enter your contact number"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.contact || contactError ? 'border-red-500' : 'border-gray-300'}`}
            {...register("contact", {
              required: true,
              pattern: {
                value: /^[0-9]{10}$/, // Validate 10 digit number
                message: "Contact must be a 10-digit number"
              }
            })}
          />
          {errors.contact && <span className="text-sm text-red-500">{errors.contact.message}</span>}
          {contactError && <span className="text-sm text-red-500">{contactError}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.email || emailError ? 'border-red-500' : 'border-gray-300'}`}
            {...register("email", {
              required: true,
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Email must be a valid @gmail.com address"
              }
            })}
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          {emailError && <span className="text-sm text-red-500">{emailError}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            {...register("password", {
              required: true,
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                message: "Password must be at least 8 characters long and contain letters, numbers, and special characters"
              }
            })}
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            placeholder="Enter your address"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            {...register("address")}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            placeholder="Enter your city"
            className={`w-full px-3 py-2 border rounded-md outline-none ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            {...register("city", { required: true })}
          />
          {errors.city && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <div>
          <p className="mb-2">
            <Link to="/login/ngo" className="text-blue-500 hover:underline">
              Already have an account?
            </Link>
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterAsNGO;
