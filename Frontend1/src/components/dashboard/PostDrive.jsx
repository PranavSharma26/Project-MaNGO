import { useState } from 'react';
import axios from "axios";
// const socket = io("http://localhost:4000");

import socket from "/src/socket";  // Adjust path if needed


function PostDriveForm() {
  const [driveData, setDriveData] = useState({
    drive_name: '',
    description: '',
    drive_type: '',
    start_date: '',
    end_date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/post-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(driveData),
      });

      if (response.ok) {
      
        alert('Drive posted successfully');
        // ngo_id (retrieving from localStorage)
        const ngo_id = localStorage.getItem("ngo_id");
        console.log("NGO ID:", ngo_id);

      // Fetch NGO details (first name, last name) using the ngo_id
      const userResponse = await axios.get(
        `http://localhost:4000/api/users/${ngo_id}`
      );
      const { first_name, last_name } = userResponse.data;
      const fullName = `${first_name} ${last_name}`;

      console.log(fullName);
      // now emitt notification to server with ngo name who posted this drive

        socket.emit("DriveNotification", {
            senderName: fullName,                // the NGO who posted this drive
            user_id : ngo_id,
        })
        setDriveData({
          drive_name: '',
          description: '',
          drive_type: '',
          start_date: '',
          end_date: '',
        }); // Reset form fields
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post drive');
      }
    } catch (error) {
      console.error('Error posting drive:', error);
      alert(error.message);
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post a Drive</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium">Drive Name</label>
          <input
            type="text"
            value={driveData.drive_name}
            onChange={(e) => setDriveData({ ...driveData, drive_name: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
            placeholder="E.g., Food Drive"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Description</label>
          <textarea
            value={driveData.description}
            onChange={(e) => setDriveData({ ...driveData, description: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
            placeholder="Provide a description of the drive"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Drive Type</label>
          <select
            value={driveData.drive_type}
            onChange={(e) => setDriveData({ ...driveData, drive_type: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          >
            <option value="">Select Type</option>
            <option value="Charity marathon">Charity marathon</option>
            <option value="Food drive">Food drive</option>
            <option value="Clothing donation">Clothing donation</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">Start Date</label>
          <input
            type="date"
            value={driveData.start_date}
            onChange={(e) => setDriveData({ ...driveData, start_date: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium">End Date</label>
          <input
            type="date"
            value={driveData.end_date}
            onChange={(e) => setDriveData({ ...driveData, end_date: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
            required
          />
        </div>

        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Post Drive
        </button>
      </form>
    </div>
  );
}

export default PostDriveForm;
