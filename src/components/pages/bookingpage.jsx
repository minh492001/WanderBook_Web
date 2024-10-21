import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, CreditCard, Mail, Phone, User, Bed, ChevronLeft, ChevronRight, Search, MapPin, Sun, Award, Headphones, Gift, Coffee, Star, Shield } from 'lucide-react'
import Footer from './footer'

const BookingPage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    roomType: '',
    selectedRoom: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const [availableRooms, setAvailableRooms] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', formData)
    setStep(5)
  }

  const goToNextStep = () => {
    setStep(prevStep => Math.min(prevStep + 1, 5))
  }

  const goToPreviousStep = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1))
  }

  useEffect(() => {
    if (step === 3) {
      // Simulate fetching available rooms based on selected dates and room type
      const fetchAvailableRooms = () => {
        const { checkIn, checkOut, roomType } = formData
        const startDate = new Date(checkIn)
        const endDate = new Date(checkOut)
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

        // Simulated room data
        const rooms = [
          { id: 1, name: 'Room 101', price: 150, image: '/placeholder.svg?height=200&width=300' },
          { id: 2, name: 'Room 102', price: 160, image: '/placeholder.svg?height=200&width=300' },
          { id: 3, name: 'Room 103', price: 170, image: '/placeholder.svg?height=200&width=300' },
          { id: 4, name: 'Room 104', price: 180, image: '/placeholder.svg?height=200&width=300' },
        ]

        // Filter rooms based on type and simulate availability
        const filteredRooms = rooms.filter(() => Math.random() > 0.3) // Randomly remove some rooms to simulate availability
        const availableRoomsWithTotalPrice = filteredRooms.map(room => ({
          ...room,
          totalPrice: room.price * nights
        }))

        setAvailableRooms(availableRoomsWithTotalPrice)
      }

      fetchAvailableRooms()
    }
  }, [step, formData])

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((s) => (
        <motion.div
          key={s}
          className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
            s === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: s * 0.1 }}
        >
          {s}
        </motion.div>
      ))}
    </div>
  )

  const pageVariants = {
    initial: { opacity: 0, x: '-100%' },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: '100%' }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  const renderIncentives = () => (
    <div className="bg-blue-50 p-6 rounded-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">Why Book with Luxury Stays?</h3>
      <ul className="space-y-4">
        <li className="flex items-start">
          <Gift className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
          <span>Complimentary welcome package upon arrival</span>
        </li>
        <li className="flex items-start">
          <Coffee className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
          <span>Free breakfast for the duration of your stay</span>
        </li>
        <li className="flex items-start">
          <Star className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
          <span>Access to exclusive amenities and services</span>
        </li>
        <li className="flex items-start">
          <Shield className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
          <span>100% satisfaction guarantee or your money back</span>
        </li>
      </ul>
    </div>
  )

  const renderServices = () => (
    <div className="bg-gray-50 p-6 rounded-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">Our Premium Services</h3>
      <ul className="space-y-2">
        <li>24/7 concierge service</li>
        <li>In-room dining options</li>
        <li>Spa and wellness center access</li>
        <li>Personalized itinerary planning</li>
        <li>Airport transfers</li>
        <li>Childcare services</li>
      </ul>
    </div>
  )

  const renderReputationGuarantee = () => (
    <div className="bg-green-50 p-6 rounded-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">Our Reputation Guarantee</h3>
      <p className="mb-4">
        At Luxury Stays, we pride ourselves on delivering exceptional experiences. Our reputation is built on the satisfaction of our guests, and we stand behind every booking with our ironclad guarantee.
      </p>
      <ul className="space-y-2">
        <li>✓ Best price guarantee</li>
        <li>✓ 24-hour customer support</li>
        <li>✓ Flexible cancellation policies</li>
        <li>✓ Verified guest reviews</li>
      </ul>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Luxury Stays Booking</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 bg-white shadow-lg rounded-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-center mb-6">Book Your Luxury Stay</h2>
            {renderStepIndicator()}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Select Your Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            name="checkIn"
                            id="checkIn"
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            value={formData.checkIn}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            name="checkOut"
                            id="checkOut"
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            value={formData.checkOut}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="guests"
                          id="guests"
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md"
                          value={formData.guests}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        onClick={goToNextStep}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Next: Choose Room Type
                      </motion.button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Choose Room Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Deluxe Suite', 'Ocean View Room', 'Family Suite', 'Penthouse'].map((room, index) => (
                        <motion.div 
                          key={room} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <h4 className="font-semibold text-lg mb-2">{room}</h4>
                          <p className="text-gray-600 mb-4">Experience luxury in our {room.toLowerCase()}.</p>
                          <motion.button
                            onClick={() => {
                              setFormData(prev => ({ ...prev, roomType: room }))
                              goToNextStep()
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Select
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <motion.button
                        onClick={goToPreviousStep}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="inline-block mr-2" />
                        Back
                      </motion.button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Available {formData.roomType}s</h3>
                    {availableRooms.length === 0 ? (
                      <p>No rooms available for the selected dates. Please try different dates.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableRooms.map((room, index) => (
                          <motion.div 
                            key={room.id} 
                            className="border rounded-lg p-4  hover:shadow-md transition-shadow duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <img src={room.image} alt={room.name} className="w-full h-40 object-cover rounded-md mb-4" />
                            <h4 className="font-semibold text-lg mb-2">{room.name}</h4>
                            <p className="text-gray-600 mb-2">Total for stay: ${room.totalPrice}</p>
                            <motion.button
                              onClick={() => {
                                setFormData(prev => ({ ...prev, selectedRoom: room }))
                                goToNextStep()
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Select
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between">
                      <motion.button
                        onClick={goToPreviousStep}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="inline-block mr-2" />
                        Back
                      </motion.button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            required
                            className="focus:ring-blue-500  focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          id="expiryDate"
                          required
                          placeholder="MM/YY"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          id="cvv"
                          required
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.cvv}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={goToPreviousStep}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="inline-block mr-2" />
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Complete Booking
                      </motion.button>
                    </div>
                  </form>
                )}

                {step === 5 && (
                  <div className="text-center">
                    <motion.h2 
                      className="text-2xl font-semibold mb-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Booking Confirmed!
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Thank you for choosing Luxury Stays. We look forward to welcoming you!
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Link
                        to="/"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 inline-block"
                      >
                        Return to Home
                      </Link>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div className="space-y-8">
            {renderIncentives()}
            {renderServices()}
            {renderReputationGuarantee()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BookingPage;