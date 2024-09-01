import React from 'react'
import Cards from './Cards'
import list from '../../public/list.json'
import { Link } from 'react-router-dom'
function Course() {
  return (
    <>
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <div className="mt-28 items-center justify-center text-center">
      <h1 className=" md:text-4xl text-2xl"><span className="text-pink-500">Meet Our Team</span></h1>
      <p className="mt-12 font-bold text-lg ">We are a passionate group of individuals committed to making a difference.
        Our diverse team brings together unique skills and perspectives to create
        innovative solutions. Get to know the people behind our success!</p>
      <Link to="/">
      <button className='mt-6 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 duration-300'>Back</button>
      </Link>
      <div className='mt-12 grid grid-cols-1 md:grid-cols-4'>
        {
          list.map((item)=>(
            <Cards key={item.id} item={item}/>
          ))
        }
      </div>
      </div>
    </div>
    </>
  )
}

export default Course