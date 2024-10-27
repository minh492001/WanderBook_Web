import React, { useState } from 'react'
import { Calendar, Users, MapPin, Bed, CreditCard, ChevronRight, ChevronLeft, Moon, Shield, Clock, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../style-pages/booking-page.css'

const BookingPage = () => {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    branch: '',
    roomType: '',
    selectedRoom: null,
  })

  const branches = ['Ha Noi', 'Ho Chi Minh City', 'Da Nang', 'Nha Trang']
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Penthouse']

  const totalGuests = bookingData.adults + bookingData.children

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1)
  }

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Select Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="checkInDate" className="form-label">Check-in Date</label>
                <div className="relative">
                  <Calendar className="form-icon" />
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    className="form-input"
                    value={bookingData.checkInDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="checkOutDate" className="form-label">Check-out Date</label>
                <div className="relative">
                  <Calendar className="form-icon" />
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    className="form-input"
                    value={bookingData.checkOutDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Number of Guests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="adults" className="form-label">Adults</label>
                <div className="relative">
                  <Users className="form-icon" />
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    className="form-input"
                    value={bookingData.adults}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="children" className="form-label">Children</label>
                <div className="relative">
                  <Users className="form-icon" />
                  <input
                    type="number"
                    id="children"
                    name="children"
                    className="form-input"
                    value={bookingData.children}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="totalGuests" className="form-label">Total Guests</label>
                <div className="relative">
                  <Users className="form-icon" />
                  <input
                    type="number"
                    id="totalGuests"
                    className="form-input bg-gray-100"
                    value={totalGuests}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Select Branch and Room Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="branch" className="form-label">Branch</label>
                <div className="relative">
                  <MapPin className="form-icon" />
                  <select
                    id="branch"
                    name="branch"
                    className="form-input"
                    value={bookingData.branch}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="roomType" className="form-label">Room Type</label>
                <div className="relative">
                  <Bed className="form-icon" />
                  <select
                    id="roomType"
                    name="roomType"
                    className="form-input"
                    value={bookingData.roomType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a room type</option>
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )
      case 4:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roomTypes.map((type) => (
                <div key={type} className="room-card">
                  <img src="/placeholder.svg?height=200&width=300" alt={`${type} Room`} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{type} Room</h3>
                    <p className="text-gray-600 mb-4">Luxurious {type.toLowerCase()} room with all amenities</p>
                    <button
                      onClick={() => {
                        setBookingData((prev) => ({ ...prev, selectedRoom: type }))
                        handleNextStep()
                      }}
                      className="btn-primary w-full"
                    >
                      Select Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      case 5:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <div className="form-group">
              <label htmlFor="cardNumber" className="form-label">Card Number</label>
              <div className="relative">
                <CreditCard className="form-icon" />
                <input
                  type="text"
                  id="cardNumber"
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  className="form-input"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv" className="form-label">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  className="form-input"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="booking-container">
        <h1 className="booking-title">
          Book Your <span className="text-indigo-600">Luxury Stay</span>
        </h1>
        <p className="booking-subtitle">
          Experience unparalleled comfort and elegance. Reserve your room now.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="booking-form">
          {renderStep()}
          <div className="flex justify-between mt-8">
            {step > 1 && 
              <button onClick={handlePrevStep} className="btn-secondary">
                <ChevronLeft className="inline-block mr-2" />
                Previous
              </button>
            }
            {step < 5 ? (
              <button onClick={handleNextStep} className="btn-primary ml-auto">
                Next
                <ChevronRight className="inline-block ml-2" />
              </button>
            ) : (
              <button onClick={() => console.log('Booking submitted:', bookingData)} className="btn-primary ml-auto">
                Confirm Booking
                <ChevronRight className="inline-block ml-2" />
              </button>
            )}
          </div>
        </form>

        <div className="why-book">
          <h2 className="why-book-title">Why Book with Us?</h2>
          <div className="why-book-grid">
            <div className="why-book-item">
              <Moon className="why-book-icon text-indigo-500" />
              <h3 className="why-book-item-title">Best Rate Guarantee</h3>
              <p className="why-book-item-description">We promise the best rates, or we'll match and give you 25% off.</p>
            </div>
            <div className="why-book-item">
              <Shield className="why-book-icon text-green-500" />
              <h3 className="why-book-item-title">Secure Booking</h3>
              <p className="why-book-item-description">Your personal and payment information is protected.</p>
            </div>
            <div className="why-book-item">
              <Clock className="why-book-icon text-yellow-500" />
              <h3 className="why-book-item-title">24/7 Support</h3>
              <p className="why-book-item-description">Our support team is available round the clock to assist you.</p>
            </div>
            <div className="why-book-item">
              <Gift className="why-book-icon text-red-500" />
              <h3 className="why-book-item-title">Loyalty Rewards</h3>
              <p className="why-book-item-description">Get exclusive perks and free nights with our loyalty program.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage;