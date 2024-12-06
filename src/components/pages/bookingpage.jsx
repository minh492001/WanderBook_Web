import React, { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Bed, CreditCard, ChevronRight, ChevronLeft, Moon, Shield, Clock, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../styles/booking-page.css'
import { getRoomTypes ,getAllBranches } from '../utils/ApiFunctions.js';
import { bookRoom, getRoomsByBranchIdAndState} from '../utils/ApiFunctions.js'


const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    branch: '',
    roomType: '',
    selectedRoom: null,
  })
  const [errors, setErrors] = useState({})
  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const totalGuests = bookingData.adults + bookingData.children
  const [rooms, setRooms] = useState([]); // Khai báo biến rooms
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleBranchChange = async (selectedBranchId) => {
    setBookingData((prev) => ({ ...prev, branch: selectedBranchId })); // Cập nhật giá trị branch trong bookingData
    await fetchRooms(selectedBranchId, 'OPEN'); // Gọi hàm fetch với trạng thái OPEN
  };


  const fetchRooms = async (branchId, state) => {
    setLoading(true);
    try {
      const roomsData = await getRoomsByBranchIdAndState(branchId, state); // Gọi API để lấy phòng
      setRooms(roomsData); // Cập nhật danh sách phòng
    } catch (error) {
      console.error('Error fetching rooms:', error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();  // Gọi hàm getAllBranches
        if (Array.isArray(data)) {
          setBranches(data);  // Cập nhật state với dữ liệu branches
        } else {
          console.error('Expected an array of branches');
          setBranches([]);  // Nếu không phải array, set branches là mảng rỗng
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        setBranches([]);  // Nếu có lỗi, set branches là mảng rỗng
      }
    };

    fetchBranches();  // Gọi hàm fetch khi component mount
  }, []);
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const data = await getRoomTypes();  // Gọi hàm fetch dữ liệu loại phòng
        if (Array.isArray(data)) {
          setRoomTypes(data);  // Cập nhật state với dữ liệu loại phòng
        } else {
          console.error('Expected an array of room types');
          setRoomTypes([]);  // Nếu dữ liệu không phải là mảng, set mảng rỗng
        }
      } catch (error) {
        console.error('Error fetching room types:', error);
        setRoomTypes([]);  // Nếu có lỗi, set mảng rỗng
      }
    };

    fetchRoomTypes();  // Gọi hàm fetch khi component mount
  }, []);


  const submitBooking = async () => {
    // Kiểm tra xem phòng đã được chọn chưa
    if (!bookingData.selectedRoom) {
      console.error('Selected room is not defined');
      return; // Dừng lại nếu selectedRoom không tồn tại
    }

    // Lấy userId từ sessionStorage
    const userIdString = sessionStorage.getItem('id'); // Giả sử 'id' là khóa bạn đã lưu userId

    // Kiểm tra xem userId có tồn tại không
    if (!userIdString) {
      console.error('User ID is not defined');
      return; // Dừng lại nếu userId không tồn tại
    }

    // Chuyển đổi userId từ chuỗi sang số nguyên
    const userId = parseInt(userIdString, 10); // Chuyển đổi thành số nguyên

    // Kiểm tra xem việc chuyển đổi có thành công không
    if (isNaN(userId)) {
      console.error('User ID is not a valid number');
      return; // Dừng lại nếu userId không phải là một số hợp lệ
    }

    const newBookingData = {
      userId: userId, // Sử dụng userId đã chuyển đổi
      roomId: bookingData.selectedRoom.id, // Truy cập id chỉ khi selectedRoom tồn tại
      checkInTimestamp: new Date(bookingData.checkInDate).getTime(),
      checkOutTimestamp: new Date(bookingData.checkOutDate).getTime(),
      adultsCount: bookingData.adults,
      childrenCount: bookingData.children,
      totalGuests: bookingData.adults + bookingData.children,
      notes: bookingData.notes || '',
      serviceIds: bookingData.serviceIds || [],
      status: 'PENDING'
    };

    console.log('New Booking Data:', newBookingData); // Log dữ liệu để kiểm tra

    try {
      const response = await bookRoom(newBookingData); // Gọi hàm bookRoom với newBookingData
      console.log('Booking successful:', response);
    } catch (error) {
      console.error('Error during booking:', error.message); // Hiển thị thông báo lỗi
    }
  };

  const handleIncrement = (field) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: Math.min(prev[field] + 1, field === 'adults' ? 4 : 5)
    }))
  }
  const handleDecrement = (field) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: Math.max(prev[field] - 1, field === 'adults' ? 1 : 0)
    }))
  }
  useEffect(() => {
    validateForm()
  }, [bookingData])
  const handleInputChange = (e) => {
    const { name, value } = e.target
    let updatedValue = value

    if (name === 'adults' || name === 'children') {
      updatedValue = Math.max(0, Math.min(parseInt(value) || 0, name === 'adults' ? 4 : 5))
    }

    setBookingData((prev) => ({ ...prev, [name]: updatedValue }))
  }
  const validateForm = () => {
    let newErrors = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!bookingData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required'
    } else if (new Date(bookingData.checkInDate) < today) {
      newErrors.checkInDate = 'Check-in date cannot be in the past'
    }

    if (!bookingData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required'
    } else if (new Date(bookingData.checkOutDate) <= new Date(bookingData.checkInDate)) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date'
    }

    if (bookingData.adults + bookingData.children > 9) {
      newErrors.guests = 'Total guests cannot exceed 9'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleNextStep = () => {
    if (validateForm()) {
      setStep((prevStep) => prevStep + 1)
    }
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
                        className={`form-input ${errors.checkInDate ? 'border-red-500' : ''}`}
                        value={bookingData.checkInDate}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
                  {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="checkOutDate" className="form-label">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="form-icon" />
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        className={`form-input ${errors.checkOutDate ? 'border-red-500' : ''}`}
                        value={bookingData.checkOutDate}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
                  {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>}
                </div>
              </div>
            </>
        )
      case 2:
        return (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Number of Guests</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="form-group">
                  <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                  <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                    <button
                        type="button"
                        onClick={() => handleDecrement('adults')}
                        className="flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 border-r border-gray-300 h-12 w-12 flex items-center justify-center transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={bookingData.adults <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                        type="number"
                        id="adults"
                        name="adults"
                        value={bookingData.adults}
                        className="flex-grow bg-white text-gray-700 font-medium text-center text-lg h-12 w-full focus:outline-none"
                        readOnly
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('adults')}
                        className="flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 border-l border-gray-300 h-12 w-12 flex items-center justify-center transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={bookingData.adults >= 4}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                  <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                    <button
                        type="button"
                        onClick={() => handleDecrement('children')}
                        className="flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 border-r border-gray-300 h-12 w-12 flex items-center justify-center transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={bookingData.children <= 0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                        type="number"
                        id="children"
                        name="children"
                        value={bookingData.children}
                        className="flex-grow bg-white text-gray-700 font-medium text-center text-lg h-12 w-full focus:outline-none"
                        readOnly
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('children')}
                        className="flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 border-l border-gray-300 h-12 w-12 flex items-center justify-center transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={bookingData.children >= 5}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="totalGuests" className="block text-sm font-medium text-gray-700 mb-2">Total Guests</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="number"
                        id="totalGuests"
                        value={totalGuests}
                        className="bg-gray-100 text-gray-700 font-medium border border-gray-300 rounded-lg h-12 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                    />
                  </div>
                </div>
              </div>
              {errors.guests && <p className="text-red-500 text-sm mt-4">{errors.guests}</p>}
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
                    <MapPin className="form-icon"/>
                    <select
                        id="branch"
                        name="branch"
                        className="form-input"
                        value={bookingData.branch}
                        onChange={(e) => handleBranchChange(e.target.value)} // Gọi hàm khi chọn chi nhánh
                        required
                    >
                      <option value="">Select a branch</option>
                      {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}> {/* Sử dụng ID làm giá trị */}
                            {branch.branchName}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="roomType" className="form-label">Room Type</label>
                  <div className="relative">
                    <Bed className="form-icon"/>
                    <select
                        id="roomType"
                        name="roomType"
                        className="form-input"
                        value={bookingData.roomType}
                        onChange={handleInputChange}
                        required
                    >
                      <option value="">Select a room type</option>
                      {roomTypes.map((roomType) => (
                          <option key={roomType} value={roomType}>
                            {roomType} {/* Hiển thị tên loại phòng */}
                          </option>
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
                {loading ? (
                    <p>Loading rooms...</p> // Hiển thị thông báo loading nếu đang fetch dữ liệu
                ) : rooms.length === 0 ? (
                    <p>No available rooms.</p> // Thông báo nếu không có phòng nào
                ) : (
                    rooms.map((room) => (
                        <div key={room.id} className="room-card">
                          <img
                              src="/placeholder.svg?height=200&width=300"
                              alt={`${room.roomNumber} Room`}
                              className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{room.roomNumber} Room</h3>
                            <p className="text-gray-600 mb-4">
                              Luxurious {room.type ? room.type.toLowerCase() : 'unknown'} room with all amenities
                            </p>
                            <button
                                onClick={() => {
                                  setBookingData((prev) => ({ ...prev, selectedRoom: room })); // Cập nhật thông tin phòng đã chọn
                                  handleNextStep(); // Chuyển sang bước tiếp theo
                                }}
                                className="btn-primary w-full"
                            >
                              Select Room
                            </button>
                          </div>
                        </div>
                    ))
                )}
              </div>
            </>
        );
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
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="booking-container">
          <h1 className="booking-title">
            Book Hotel In <span className="text-indigo-600">Grand Lusso Hotel</span>
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
                  <button
                      onClick={submitBooking} // Gọi hàm submitBooking khi nhấn nút
                      className="btn-primary ml-auto"
                      disabled={isSubmitting} // Vô hiệu hóa nút khi đang xử lý yêu cầu
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'} {/* Hiển thị trạng thái */}
                    <ChevronRight className="inline-block ml-2"/>
                  </button>
              )}
            </div>
          </form>


        </div>
      </div>
  )
}

export default BookingPage

