import React from 'react'
import { Link } from 'react-router-dom'

const LatestUpdates = () => {
  return (
    <section className='min-h-screen bg-black text-white flex items-center justify-center'>
      <div className='max-w-6xl w-full flex gap-16 px-10'>
        <div className='flex-1'>
          <img src={"/src/assets/ChatGPT Image Feb 27, 2026, 06_15_59 AM.png"}
            alt="Latest update preview"
            className='w-full border-2 rounded-xl object-cover ' />
        </div>
        <div className='flex-1 space-y-6'>
          <h2 className='text-5xl font-bold font-nevera regular'>Latest Updates</h2>
          <div className='flex flex-col p-4 gap-7'>
            <p className='rounded border-2 p-6 font-manrope regular'>My latest track is out now.</p>
            <p className='rounded border-2 p-6 font-manrope regular'>Known for atmospheric productions.</p>
            <p className='rounded border-2 p-6 font-manrope regular'>Blends indie and techno.</p>
          </div>
          <div>
            <Link to='/Projects'
              className='text-white relative text-lg tracking-wide group pb-1 font-reross quadratic'>View My Projects
              <span className='absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full'></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LatestUpdates
