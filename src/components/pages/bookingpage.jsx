import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, CreditCard, ChevronRight, Bed, Moon, Hash, Key, Shield, Clock, Gift } from 'lucide-react'

const BookingPage = () => {
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [roomType, setRoomType] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [roomId, setRoomId] = useState('')

  const totalGuests = adults + children

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Booking submitted:', { checkInDate, checkOutDate, adults, children, roomType, confirmationCode, roomId })
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

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="checkInDate" className="form-label">
                Check-in Date
              </label>
              <div className="relative">
                <Calendar className="form-icon" />
                <input
                  type="date"
                  id="checkInDate"
                  className="form-input"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="checkOutDate" className="form-label">
                Check-out Date
              </label>
              <div className="relative">
                <Calendar className="form-icon" />
                <input
                  type="date"
                  id="checkOutDate"
                  className="form-input"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label htmlFor="adults" className="form-label">
                Adults
              </label>
              <div className="relative">
                <Users className="form-icon" />
                <input
                  type="number"
                  id="adults"
                  min="1"
                  className="form-input"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="children" className="form-label">
                Children
              </label>
              <div className="relative">
                <Users className="form-icon" />
                <input
                  type="number"
                  id="children"
                  min="0"
                  className="form-input"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="totalGuests" className="form-label">
                Total Guests
              </label>
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

          <div className="form-group">
            <label htmlFor="roomType" className="form-label">
              Room Type
            </label>
            <div className="relative">
              <Bed className="form-icon" />
              <select
                id="roomType"
                className="form-input"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                required
              >
                <option value="">Select a room type</option>
                <option value="standard">Standard Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Suite</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="confirmationCode" className="form-label">
                Confirmation Code
              </label>
              <div className="relative">
                <Hash className="form-icon" />
                <input
                  type="text"
                  id="confirmationCode"
                  className="form-input"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter confirmation code (if applicable)"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="roomId" className="form-label">
                Room ID
              </label>
              <div className="relative">
                <Key className="form-icon" />
                <input
                  type="text"
                  id="roomId"
                  className="form-input"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID (if known)"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </Link>
              </label>
            </div>
          </div>

          <button type="submit" className="form-submit">
            <span className="flex items-center justify-center">
              <CreditCard className="h-6 w-6 mr-2" />
              Book Now
              <ChevronRight className="ml-2 h-6 w-6" />
            </span>
          </button>
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