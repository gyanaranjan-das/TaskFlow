import React from 'react'
import { Link } from 'react-router-dom'
import LatestUpdates from './LatestUpdates'
import About from './About'
import Projects from './Projects'
import Contact from './Contact'
const Home = () => {
  return (
    <div>
      <section className='relative h-screen flex flex-col justify-center items-center bg-black text-white'>
        <img src="" className='absolute inset-0 w-full object-cover' alt="" />
        <div className='absolute inset-0 bg-black/50'></div>
        <h1 className='relative text-7xl font-bold tracking-widest -translate-y-10 font-nevera regular'>GYANARANJAN DAS</h1>
        <div>
          <Link to='/Bio'
            className='text-white relative text-lg tracking-wide group pb-1 font-reross quadratic'>Learn More
            <span className='absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full'></span></Link>
        </div>
      </section>
      <LatestUpdates />
      <About />
      <Projects />
      <Contact />
    </div>
  )
}

export default Home
