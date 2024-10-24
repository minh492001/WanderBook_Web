import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, User, LogOut, UserCircle } from 'lucide-react'
import '../style-pages/navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userName, setUserName] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
    }

    window.addEventListener('scroll', handleScroll)

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userName')
    localStorage.removeItem('token') 
    setUserName('')
    setIsUserMenuOpen(false)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center justify-start flex-1">
              <a href="/" className="flex-shrink-0 logo-hover">
                <img className="h-10 w-auto" src="https://ik.imagekit.io/0ofixtqpt/hotel-logo.png?updatedAt=1685544839449" alt="Luxury Stays Logo" />
              </a>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-8">
                  {['Booking', 'About Us', 'Contact'].map((item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase().replace(' ', '-')}`}
                      className={`nav-link ${isScrolled ? 'text-gray-800' : 'text-white'} hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              {userName ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 user-menu px-3 py-2 rounded-full"
                  >
                    <UserCircle className="h-6 w-6" />
                    <span className="font-medium">{userName}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="inline-block mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                      >
                        <LogOut className="inline-block mr-2 h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-section">
                  <Link to="/login" className="auth-link">
                    Login
                  </Link>
                  <div className="auth-separator"></div>
                  <Link to="/register" className="auth-link">
                    Register
                  </Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-md ${isScrolled ? 'text-gray-400 hover:text-gray-500' : 'text-white'} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out`}
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Hotel Booking', 'About Us', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-800 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              {userName ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-800 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full text-left text-gray-800 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-800 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-800 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-300">
          Account logged out successfully
        </div>
      )}
    </>
  )
}

export default Navbar;