import React, { useEffect, useState } from 'react';

function AboutUs() {
  const [list, setList] = useState([]);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch('/list.json')
      .then((response) => response.json())
      .then((data) => setList(data))
      .catch((error) => console.error('Error fetching the JSON file:', error));
  }, []);

  return (
    <>
      {/* Image with "OUR TEAM" text overlay */}
      <div className="relative mt-6">
        <img src="/Ourteam.png" alt="Our Team" className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h2 className="text-white text-4xl font-bold">OUR TEAM</h2>
        </div>
      </div>

      {/* Description about the team */}
      <div className="text-center mt-6">
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          We are a group of enthusiastic students from SGSITS, driven by our love for technology and innovation. Together, we aim to learn, grow, and create projects that make a difference. Our teamwork and dedication fuel our desire to achieve new milestones.
        </p>
      </div>

      {/* Image grid section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
        {list.map((item) => (
          <div key={item.id} className="inline-block p-3">
            <div className="bg-base-100 w-44 h-60 shadow-xl hover:scale-105 duration-200">
              <figure className="w-full h-2/3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="flex items-center justify-center h-1/3">
                <h2 className="text-center">{item.name}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AboutUs;
