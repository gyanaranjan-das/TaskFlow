import { Github, Linkedin } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='flex justify-between p-6 items-center'>
      <div className='flex justify-between gap-8 font-reross quadratic uppercase'>
        <Link to='/'>Home</Link>
        <Link to='/Bio'>Bio</Link>
        <Link to='/Projects'>Projects</Link>
        <Link to='/Blog'>Blog</Link>
      </div>
      <div
        className='absolute left-1/2 -translate-x-1/2 font-bold text-xl'>
        <Link to='/'
          className='font-nevera regular'>Gyanaranjan.</Link>
      </div>
      <div className='flex justify-between gap-6'>
        <a
          href="https://github.com/gyanaranjan-das"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
        </a>

        <a
          href="https://www.linkedin.com/in/gyanaranjan-das/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin />
        </a>
      </div>
    </div>
  )
}

export default Navbar
