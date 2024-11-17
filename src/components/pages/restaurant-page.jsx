import React from 'react';
import { Clock, Utensils, Wine } from 'lucide-react';

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

const DiningExperiences = () => {
  const restaurants = [
    {
      name: "Ocean View Restaurant",
      description: "Fine dining with panoramic ocean views",
      cuisine: "Seafood & International",
      hours: "7:00 AM - 10:00 PM",
      image: "https://via.placeholder.com/400x300"
    },
    {
      name: "Sunset Lounge",
      description: "Casual dining and cocktails with a view",
      cuisine: "Tapas & Cocktails",
      hours: "4:00 PM - 12:00 AM",
      image: "https://via.placeholder.com/400x300"
    },
    {
      name: "Garden Café",
      description: "Relaxed atmosphere for breakfast and lunch",
      cuisine: "International Buffet",
      hours: "6:30 AM - 3:00 PM",
      image: "https://via.placeholder.com/400x300"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Dining Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((restaurant, index) => (
          <Card key={index}>
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{restaurant.name}</h2>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div className="space-y-2 mb-4">
                <p className="flex items-center">
                  <Utensils className="mr-2 h-4 w-4" />
                  <span className="font-semibold">Cuisine:</span> {restaurant.cuisine}
                </p>
                <p className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="font-semibold">Hours:</span> {restaurant.hours}
                </p>
              </div>
              <Button className="w-full">Make a Reservation</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DiningExperiences;