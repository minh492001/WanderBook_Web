import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Coffee, Wifi, Utensils, Dumbbell, ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react'
import Navbar from './navbar'
import Footer from './footer'

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const images = [
    'https://ik.imagekit.io/0ofixtqpt/hotel-1.jpg?updatedAt=1685544839614',
    'https://ik.imagekit.io/0ofixtqpt/hotel-2.jpg?updatedAt=1685544839738',
    'https://ik.imagekit.io/0ofixtqpt/hotel-3.jpg?updatedAt=1685544839496'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-extrabold mb-4 animate-fade-in-down">
            Welcome to Luxury Stays
          </h1>
          <p className="text-2xl mb-8 animate-fade-in-up">
            Experience unparalleled comfort and elegance
          </p>
          <Link
            to="/booking"
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 animate-pulse hover:animate-none"
          >
            Book Now
          </Link>
        </div>
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition-all duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section id="booking" className={`mb-16 scroll-mt-20 transition-all duration-1000 ${isVisible.booking ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Stay</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Where are you going?"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="check-in"
                    id="check-in"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="check-out"
                    id="check-out"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="guests"
                    name="guests"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md"
                  >
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <Link
                  to="/booking"
                  className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg"
                >
                  Search
                </Link>
              </div>
            </form>
          </div>
        </section>

        <section id="featured-rooms" className={`mb-16 transition-all duration-1000 ${isVisible['featured-rooms'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Deluxe Suite', image: 'https://ik.imagekit.io/0ofixtqpt/room-1.jpg?updatedAt=1685544839372' },
              { name: 'Ocean View Room', image: 'https://ik.imagekit.io/0ofixtqpt/room-2.jpg?updatedAt=1685544839399' },
              { name: 'Family Suite', image: 'https://ik.imagekit.io/0ofixtqpt/room-3.jpg?updatedAt=1685544839516' },
            ].map((room, index) => (
              <div key={room.name} className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className="relative">
                  <img className="h-48 w-full object-cover" src={room.image} alt={room.name} />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Link to="/booking" className="text-white text-lg font-semibold bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{room.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-base mb-4">Luxurious comfort with stunning views.</p>
                  <p className="text-blue-600 font-semibold">From $299/night</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className={`mb-16 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Luxury Stays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Coffee, title: 'Premium Amenities', description: 'Enjoy top-notch facilities and services.' },
              { icon: Wifi, title: 'Free Wi-Fi', description: 'Stay connected with high-speed internet.' },
              { icon: Utensils, title: 'Gourmet Dining', description: 'Savor exquisite culinary experiences.' },
              { icon: Dumbbell, title: 'Fitness Center', description: 'Keep up with your workout routine.' },
            ].map((feature, index) => (
              <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className={`bg-blue-600 text-white py-16 px-4 rounded-lg transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Experience Luxury Like Never Before</h2>
            <p className="text-xl mb-8">Book your stay now and indulge in unparalleled comfort and service.</p>
            <Link
              to="/booking"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg inline-block"
            >
              Reserve Your Room
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage;