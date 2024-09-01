import React from 'react';

function Cards({ item }) {
  console.log(item);
  return (
    <div className="inline-block p-3">
      <div className="card bg-base-100 w-44 h-60 shadow-xl hover:scale-105 duration-200">
        <figure className="w-full h-2/3">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="card-body flex items-center justify-center h-1/3">
          <h2 className="card-title text-center">{item.name}</h2>
        </div>
      </div>
    </div>
  );
}

export default Cards;
