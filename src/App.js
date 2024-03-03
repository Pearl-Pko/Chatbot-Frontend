import React from 'react'
import { Routes, Route } from 'react-router'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Home from './pages/Home'
import Help from './pages/Help'

export default function App() {
  return (
    <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/help" element={<Help/>}/>
    </Routes>
  )
}
