import React from 'react';
import { Waves, Dumbbell, Car, Leaf, Wifi, Bell } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const AmenitiesAndServices = () => {
  const amenities = [
    {
      name: "Swimming Pool",
      description: "Olympic-sized pool with a stunning ocean view",
      icon: Waves
    },
    {
      name: "Fitness Center",
      description: "State-of-the-art gym equipment and fitness classes",
      icon: Dumbbell
    },
    {
      name: "Valet Parking",
      description: "Convenient valet parking service for all guests",
      icon: Car
    },
    {
      name: "Spa & Wellness",
      description: "Relaxing treatments and massages for ultimate rejuvenation",
      icon: Leaf
    },
    {
      name: "Free Wi-Fi",
      description: "High-speed internet access throughout the property",
      icon: Wifi
    },
    {
      name: "Concierge Service",
      description: "24/7 concierge to assist with all your needs",
      icon: Bell
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Amenities & Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {amenities.map((amenity, index) => (
          <Card key={index}>
            <div className="p-4">
              <h2 className="text-xl font-bold flex items-center mb-2">
                {<amenity.icon className="mr-2 h-6 w-6" />}
                {amenity.name}
              </h2>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AmenitiesAndServices;