import React, { useState, useMemo } from 'react';
import { Bed, Wifi, Coffee, Bath, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Card = ({ children, className }) => (
    <motion.div
        className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
);

const Button = ({ children, className, onClick }) => (
    <button
        className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ${className}`}
        onClick={onClick}
    >
      {children}
    </button>
);

const Select = ({ options, value, onChange, className }) => (
    <div className="relative">
      <select
          value={value}
          onChange={onChange}
          className={`appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500 ${className}`}
      >
        {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
);

const RoomPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const navigate = useNavigate();

  // Cập nhật hàm kiểm tra đăng nhập để sử dụng token
  const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token; // Trả về true nếu token tồn tại, false nếu không
  };

  const handleBookNow = () => {
    if (isLoggedIn()) {
      // Nếu đã đăng nhập, chuyển đến trang đặt phòng
      navigate('/booking');
    } else {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      navigate('/login', { state: { from: '/rooms' } });
    }
  };

  const rooms = [
    {
      name: "Deluxe King Room",
      description: "Spacious room with a king-size bed and city view",
      price: 250,
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      amenities: ["King Bed", "Free Wi-Fi", "Coffee Maker", "En-suite Bathroom"],
      branch: "Downtown"
    },
    {
      name: "Ocean View Suite",
      description: "Luxurious suite with panoramic ocean views",
      price: 450,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      amenities: ["King Bed", "Free Wi-Fi", "Mini Bar", "Jacuzzi"],
      branch: "Beachfront"
    },
    {
      name: "Family Room",
      description: "Perfect for families, with two queen beds",
      price: 350,
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2057&q=80",
      amenities: ["2 Queen Beds", "Free Wi-Fi", "Kids Play Area", "Kitchenette"],
      branch: "Suburban"
    }
  ];

  const filteredAndSortedRooms = useMemo(() => {
    return rooms
        .filter((room) =>
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedBranch === 'all' || room.branch === selectedBranch)
        )
        .sort((a, b) =>
            sortOrder === 'asc' ? a.price - b.price : b.price - a.price
        );
  }, [searchTerm, sortOrder, selectedBranch]);

  const branches = ['all', ...new Set(rooms.map(room => room.branch))];

  return (
      <div className="container mx-auto px-4 py-8 font-sans">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Our Accommodations
        </h1>
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Button className="bg-gray-600 hover:bg-gray-700">
              Back to Home page
            </Button>
          </Link>
        </div>
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select
              options={[
                { value: 'asc', label: 'Price: Low to High' },
                { value: 'desc', label: 'Price: High to Low' },
              ]}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full md:w-auto"
          />
          <Select
              options={branches.map(branch => ({ value: branch, label: branch === 'all' ? 'All Branches' : branch }))}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full md:w-auto"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedRooms.map((room, index) => (
              <Card key={index}>
                <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{room.name}</h2>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <p className="text-3xl font-bold mb-4 text-blue-600">${room.price} <span className="text-sm font-normal text-gray-500">/ night</span></p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.map((amenity, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                    {amenity === "King Bed" || amenity === "2 Queen Beds" ? <Bed className="inline mr-1 h-4 w-4" /> :
                        amenity === "Free Wi-Fi" ? <Wifi className="inline mr-1 h-4 w-4" /> :
                            amenity === "Coffee Maker" || amenity === "Mini Bar" ? <Coffee className="inline mr-1 h-4 w-4" /> :
                                amenity === "En-suite Bathroom" || amenity === "Jacuzzi" ? <Bath className="inline mr-1 h-4 w-4" /> : null}
                          {amenity}
                  </span>
                    ))}
                  </div>
                  <Button className="w-full text-lg" onClick={handleBookNow}>Book Now</Button>
                </div>
              </Card>
          ))}
        </div>
      </div>
  );
}

export default RoomPage;

