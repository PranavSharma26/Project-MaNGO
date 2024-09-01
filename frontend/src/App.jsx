import React from 'react'
import Home from './Home/Home'
import { Route, Routes } from 'react-router-dom'
import Courses from './courses/Courses'
import Signup from './Components/Signup'
import Login from './Components/Login'
function App() {
  return (
    <>
    {
    <div className="dark:bg-slate-900  dark:text-white">
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/course' element={<Courses/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/Login' element={<Login />} />
    </Routes>
    </div>
    }
    </>
    
  )
}

export default App
