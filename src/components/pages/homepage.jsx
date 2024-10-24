import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Coffee, Wifi, Utensils, Dumbbell, ChevronLeft, ChevronRight, Calendar, Users, MapPin, IceCream, Award, UserCheck } from 'lucide-react'
import Navbar from './navbar';
import Footer from './footer';
import '../style-pages/home-page.css';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const [animationStep, setAnimationStep] = useState(0)
  const images = [
    'https://ik.imagekit.io/0ofixtqpt/hotel-1.jpg?updatedAt=1685544839614',
    'https://ik.imagekit.io/0ofixtqpt/hotel-2.jpg?updatedAt=1685544839738',
    'https://ik.imagekit.io/0ofixtqpt/hotel-3.jpg?updatedAt=1685544839496'
  ]

  const branches = [
    { name: 'Ha Noi', image: 'https://ik.imagekit.io/0ofixtqpt/hanoi.jpg?updatedAt=1685544839000' },
    { name: 'Ho Chi Minh City', image: 'https://ik.imagekit.io/0ofixtqpt/hcmc.jpg?updatedAt=1685544839100' },
    { name: 'Da Nang', image: 'https://ik.imagekit.io/0ofixtqpt/danang.jpg?updatedAt=1685544839200' },
    { name: 'Nha Trang', image: 'https://ik.imagekit.io/0ofixtqpt/nhatrang.jpg?updatedAt=1685544839300' },
  ]

  const salesData = [
    { year: 1950, scoops: '100k', years: 1, customers: 1000 },
    { year: 1980, scoops: '500k', years: 30, customers: 10000 },
    { year: 2000, scoops: '1M', years: 50, customers: 100000 },
    { year: 2023, scoops: '5M+', years: 73, customers: 1000000 },
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

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prevStep) => (prevStep + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
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
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-extrabold mb-4 animate-fade-in-down hero-text">
            Discover Luxury at Its Finest
          </h1>
          <p className="text-2xl mb-8 animate-fade-in-up hero-text">
            Indulge in unparalleled comfort and world-class hospitality
          </p>
          <Link
            to="/booking"
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 animate-pulse hover:animate-none cta-button"
          >
            Book Your Escape Now
          </Link>
        </div>
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-all duration-300 image-slider-button"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-all duration-300 image-slider-button"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section id="branches" className={`mb-16 scroll-mt-20 transition-all duration-1000 ${isVisible.branches ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Exquisite Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {branches.map((branch) => (
              <div key={branch.name} className="relative overflow-hidden rounded-lg shadow-lg branch-card group">
                <img className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110" src={branch.image} alt={branch.name} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link to={`/branch/${branch.name.toLowerCase().replace(' ', '-')}`} className="text-white text-lg font-semibold bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300">
                    Explore {branch.name}
                  </Link>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-xl mb-2">{branch.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="featured-rooms" className={`mb-16 transition-all duration-1000 ${isVisible['featured-rooms'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Featured Accommodations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Deluxe Suite', image: 'https://ik.imagekit.io/0ofixtqpt/room-1.jpg?updatedAt=1685544839372' },
              { name: 'Ocean View Room', image: 'https://ik.imagekit.io/0ofixtqpt/room-2.jpg?updatedAt=1685544839399' },
              { name: 'Family Suite', image: 'https://ik.imagekit.io/0ofixtqpt/room-3.jpg?updatedAt=1685544839516' },
            ].map((room) => (
              <div key={room.name} className="bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <img className="h-64 w-full object-cover" src={room.image} alt={room.name} />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Link to="/booking" className="text-white text-lg font-semibold bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-2xl mb-2">{room.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Experience luxury redefined in our meticulously designed accommodations.</p>
                  <p className="text-blue-600 font-semibold text-lg">From $299/night</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className={`mb-16 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Unparalleled Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Coffee, title: 'Premium Amenities', description: 'Indulge in our carefully curated selection of top-tier facilities.' },
              { icon: Wifi, title: 'High-Speed Wi-Fi', description: 'Stay connected with complimentary high-speed internet access.' },
              { icon: Utensils, title: 'Gourmet Dining', description: 'Savor exquisite culinary creations from world-renowned chefs.' },
              { icon: Dumbbell, title: 'State-of-the-Art Fitness', description: 'Maintain your regimen in our cutting-edge fitness center.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4 feature-icon" />
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="ice-cream-history" className={`mb-16 transition-all duration-1000 ${isVisible['ice-cream-history'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img className="h-48 w-full object-cover md:w-48 history-image" 
                     src="https://ik.imagekit.io/0ofixtqpt/ice-cream-history.jpg?updatedAt=1685544839800"
                     alt="Vintage ice cream parlor" />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">Our Sweet Legacy</div>
                <h2 className="block mt-1 text-3xl leading-tight font-bold text-gray-900">A Scoop of History: Our Ice Cream Journey</h2>
                <p className="mt-2 text-gray-600">
                  Since 1950, Luxury Stays has been delighting guests with our signature ice cream. What started as a small parlor in Ha Noi has grown into a beloved tradition across all our locations. Our secret? A perfect blend of premium ingredients and a dash of nostalgia in every scoop.
                </p>
                <div className="mt-4 flex items-center">
                  <IceCream className="h-8 w-8 text-blue-600 mr-2 ice-cream-icon" />
                  <span className="text-lg font-semibold text-gray-800">70+ Years of Sweet Memories</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-8 py-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-semibold text-gray-600">Ice Cream Scoops Served</div>
                <div className="flex space-x-2">
                  {salesData.map((data, index) => (
                    <div
                      key={data.year}
                      className={`w-3 h-3 rounded-full ${
                        index === animationStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transaction-animation"
                  style={{ width: `${(animationStep + 1) * 25}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">{salesData[animationStep].year}</span>
                <span className="text-sm font-bold text-blue-600">{salesData[animationStep].scoops} Scoops</span>
              </div>
            </div>
          </div>
        </section>

        <section id="company-growth" className={`mb-16 transition-all duration-1000 ${isVisible['company-growth'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-lg shadow-xl overflow-hidden growth-card">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Growth Over the Years</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="growth-metric">
                  <div className="flex items-center mb-4">
                    <Award className="text-green-500 growth-icon" />
                    <h3 className="text-xl font-semibold text-gray-800">Years of Service</h3>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full progress-bar-bg">
                    <div
                      className="h-full rounded-full progress-bar"
                      style={{ width: `${(salesData[animationStep].years / 73) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">{salesData[animationStep].year}</span>
                    <span className="text-sm font-bold text-green-600">{salesData[animationStep].years} Years</span>
                  </div>
                </div>
                <div className="growth-metric">
                  <div className="flex items-center mb-4">
                    <UserCheck className="text-yellow-500 growth-icon" />
                    <h3 className="text-xl font-semibold text-gray-800">Satisfied Customers</h3>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full  progress-bar-bg">
                    <div
                      className="h-full rounded-full progress-bar"
                      style={{ width: `${(Math.log(salesData[animationStep].customers) / Math.log(1000000)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">{salesData[animationStep].year}</span>
                    <span className="text-sm font-bold text-yellow-600">{salesData[animationStep].customers.toLocaleString()} Customers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="map" className={`mb-16 transition-all duration-1000 ${isVisible.map ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Prime Location</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0968023192!2d105.84774731476343!3d21.028811785994613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2s!4v1623159856186!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Luxury Stays Location"
            ></iframe>
          </div>
        </section>

        <section id="sitemap" className={`mb-16 transition-all duration-1000 ${isVisible.sitemap ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Explore Our World</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 text-blue-600">Main Pages</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600  hover:text-blue-600 transition-colors duration-300">Home</Link></li>
                <li><Link to="/rooms" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Accommodations</Link></li>
                <li><Link to="/dining" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Dining Experiences</Link></li>
                <li><Link to="/amenities" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Amenities & Services</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-blue-600">Our Locations</h3>
              <ul className="space-y-2">
                {branches.map((branch) => (
                  <li key={branch.name}>
                    <Link to={`/branch/${branch.name.toLowerCase().replace(' ', '-')}`} className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                      {branch.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-blue-600">Guest Services</h3>
              <ul className="space-y-2">
                <li><Link to="/booking" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Reserve Your Stay</Link></li>
                <li><Link to="/special-offers" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Exclusive Offers</Link></li>
                <li><Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Frequently Asked Questions</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Contact Concierge</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-blue-600">About Luxury Stays</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Our Legacy</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Join Our Team</Link></li>
                <li><Link to="/press" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Press & Media</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Privacy & Terms</Link></li>
              </ul>
            </div>
          </div>
        </section>

        <section id="cta" className={`bg-blue-600 text-white py-16 px-4 rounded-lg transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Elevate Your Stay with Luxury</h2>
            <p className="text-xl mb-8">Immerse yourself in opulence and create unforgettable memories.</p>
            <Link
              to="/booking"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg inline-block cta-button"
            >
              Begin Your Luxurious Journey
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage