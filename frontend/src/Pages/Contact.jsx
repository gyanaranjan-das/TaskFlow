import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      name: "",
      email: "",
      message: ""
    })
  }
  return (
    <section className='min-h-screen bg-black text-white '>
      <div>
        <h2 className='font-nevera regular text-left mb-5 text-2xl ml-6'>LET'S CONNECT</h2>
        <p className='font-manrope regular mb-4 p-4 ml-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, aut?</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-5xl mx-auto px-4 mt-8">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="flex-1 min-w-[200px] bg-white text-black px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-manrope regular placeholder:text-gray-500 text-lg"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="flex-1 min-w-[200px] bg-white text-black px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-manrope regular placeholder:text-gray-500 text-lg"
        />
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-500 transition px-10 py-4 rounded-lg text-white font-bold tracking-wide shadow-md min-w-[160px] text-lg font-reross quadratic"
        >
          Subscribe
        </button>
      </form>
      {/* Footer Navigation and Social Icons Example Section */}
      <div className="mt-16 flex flex-col items-center w-full">
        {/* Navigation Bar */}
        <nav className="flex gap-6 mb-8">
          <button className="bg-orange-600 text-white px-5 py-2 rounded font-bold font-reross quadratic">HOME</button>
          <button className="text-orange-600 font-bold font-reross quadratic">BIO</button>
          <button className="text-orange-600 font-bold font-reross quadratic">MUSIC</button>
          <button className="text-orange-600 font-bold font-reross quadratic">VIDEO</button>
          <button className="text-orange-600 font-bold font-reross quadratic">BOOKING</button>
        </nav>
        {/* Social Icons Row */}
        <div className="flex gap-6">
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-600 text-orange-600 text-2xl">
            <i className="fab fa-spotify"></i>
          </span>
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-600 text-orange-600 text-2xl">
            <i className="fab fa-soundcloud"></i>
          </span>
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-600 text-orange-600 text-2xl">
            <i className="fab fa-instagram"></i>
          </span>
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-600 text-orange-600 text-2xl">
            <i className="fab fa-youtube"></i>
          </span>
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-600 text-orange-600 text-2xl">
            <i className="fab fa-facebook"></i>
          </span>
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-600 text-orange-600 text-2xl">
            <i className="fab fa-tiktok"></i>
          </span>
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-600 text-orange-600 text-2xl">
            <i className="fas fa-undo"></i>
          </span>
        </div>
      </div>
    </section>
  )
}

export default Contact
