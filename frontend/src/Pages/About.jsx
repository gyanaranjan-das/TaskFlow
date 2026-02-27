import React from 'react'
import { Link } from 'react-router-dom'
const About = () => {
  return (
    <section className='min-h-screen bg-black text-white flex items-center justify-center'>
      <div className='max-w-6xl flex gap-16 px-10 '>
        <div className='flex-1 space-y-6'>
          <h1 className='text-5xl font-bold font-nevera regular'>ABOUT</h1>
          <p className='font-manrope regular'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda molestias ducimus temporibus non quam. A iure minus tenetur sapiente, quasi cumque neque autem porro delectus quia laudantium voluptatibus aliquam dolorem.</p>
          <Link to='/Bio' className='font-reross quadratic'>Find Out More</Link>
        </div>
        <div className='flex-1'>
          <img src=""
            alt=""
            className='w-full rounded-xl object-cover' />
        </div>
      </div>
    </section>
  )
}

export default About
