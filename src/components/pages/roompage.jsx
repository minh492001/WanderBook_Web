import React from 'react';
import { Bed, Wifi, Coffee, Bath } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className }) => (
  <button className={`bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 ${className}`}>
    {children}
  </button>
);

const Accommodations = () => {
  const rooms = [
    {
      name: "Deluxe King Room",
      description: "Spacious room with a king-size bed and city view",
      price: "$250",
      image: "https://via.placeholder.com/400x300",
      amenities: ["King Bed", "Free Wi-Fi", "Coffee Maker", "En-suite Bathroom"]
    },
    {
      name: "Ocean View Suite",
      description: "Luxurious suite with panoramic ocean views",
      price: "$450",
      image: "https://via.placeholder.com/400x300",
      amenities: ["King Bed", "Free Wi-Fi", "Mini Bar", "Jacuzzi"]
    },
    {
      name: "Family Room",
      description: "Perfect for families, with two queen beds",
      price: "$350",
      image: "https://via.placeholder.com/400x300",
      amenities: ["2 Queen Beds", "Free Wi-Fi", "Kids Play Area", "Kitchenette"]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Accommodations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <Card key={index}>
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{room.name}</h2>
              <p className="text-gray-600 mb-2">{room.description}</p>
              <p className="text-2xl font-bold mb-4">{room.price} / night</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.map((amenity, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center">
                    {amenity === "King Bed" || amenity === "2 Queen Beds" ? <Bed className="inline mr-1 h-4 w-4" /> :
                     amenity === "Free Wi-Fi" ? <Wifi className="inline mr-1 h-4 w-4" /> :
                     amenity === "Coffee Maker" || amenity === "Mini Bar" ? <Coffee className="inline mr-1 h-4 w-4" /> :
                     amenity === "En-suite Bathroom" || amenity === "Jacuzzi" ? <Bath className="inline mr-1 h-4 w-4" /> : null}
                    {amenity}
                  </span>
                ))}
              </div>
              <Button className="w-full">Book Now</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Accommodations;