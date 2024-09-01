import React from 'react'
import Course from '../Components/Course'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import list from '../../public/list.json'
function Courses() {
    console.log(list);
  return (
    <>
    <Navbar/>
    <div className="min-h-screen">
    <Course/>
    </div>
    <Footer/>
    </>
  )
}

export default Courses
