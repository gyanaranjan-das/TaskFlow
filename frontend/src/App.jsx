import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Bio from './Pages/Bio'
import Projects from './Pages/Projects'
import Blog from './Pages/Blog'
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Bio' element={<Bio />} />
        <Route path='/Projects' element={<Projects />} />
        <Route path='/Blog' element={<Blog />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
