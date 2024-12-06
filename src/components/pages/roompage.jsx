import React, {useState, useMemo, useEffect} from 'react';
import { Bed, Wifi, Coffee, Bath, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getAllRoomsWithFutureBookings } from '../utils/ApiFunctions.js';

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
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedBranch, setSelectedBranch] = useState('all');
    const navigate = useNavigate();

  const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
  };

  const handleBookNow = () => {
    if (isLoggedIn()) {
      navigate('/booking');
    } else {
      navigate('/login', { state: { from: '/rooms' } });
    }
  };

  useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAllRoomsWithFutureBookings();
                setRooms(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

  // const filteredAndSortedRooms = useMemo(() => {
  //     return rooms
  //         .filter((room) =>
  //             room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //             (selectedBranch === 'all' || room.branch === selectedBranch)
  //         )
  //         .sort((a, b) =>
  //             sortOrder === 'asc' ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight
  //         );
  // }, [searchTerm, sortOrder, selectedBranch]);

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
          {rooms.map((room) => (
              <Card key={room.id}>
                <img
                    src={room.photo}
                    alt={room.roomType}
                    className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{room.roomType}</h2>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <p className="text-3xl font-bold mb-4 text-blue-600">${room.pricePerNight} <span className="text-sm font-normal text-gray-500">/ night</span></p>
                  <div className="flex flex-wrap gap-2 mb-6">
                  {/*  {rooms.service.map((amenity, i) => (*/}
                  {/*      <span key={i} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center">*/}
                  {/*  {amenity === "King Bed" || amenity === "2 Queen Beds" ? <Bed className="inline mr-1 h-4 w-4" /> :*/}
                  {/*      amenity === "Free Wi-Fi" ? <Wifi className="inline mr-1 h-4 w-4" /> :*/}
                  {/*          amenity === "Coffee Maker" || amenity === "Mini Bar" ? <Coffee className="inline mr-1 h-4 w-4" /> :*/}
                  {/*              amenity === "En-suite Bathroom" || amenity === "Jacuzzi" ? <Bath className="inline mr-1 h-4 w-4" /> : null}*/}
                  {/*        {amenity}*/}
                  {/*</span>*/}
                  {/*  ))}*/}
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

