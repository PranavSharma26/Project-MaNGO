import React from 'react';

function Gallery() {
  return (
    <div className="p-6 text-center">
      {/* Heading and One-liner */}
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Gallery</h1>
      <p className="text-sm md:text-lg text-gray-600 mb-8">
        A collection of moments that define our journey.
      </p>

      {/* Responsive Image Collage */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="col-span-2 row-span-2">
          <img
            src="gallery1.png"
            alt="Gallery Image 1"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="hidden md:block">
          <img
            src="gallery2.png"
            alt="Gallery Image 2"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="col-span-2">
          <img
            src="gallery3.png"
            alt="Gallery Image 3"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="lg:col-span-1">
          <img
            src="gallery4.png"
            alt="Gallery Image 4"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="lg:col-span-1">
          <img
            src="gallery5.png"
            alt="Gallery Image 5"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Gallery;
