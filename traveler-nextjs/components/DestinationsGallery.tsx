'use client';

import Image from 'next/image';

const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    image: '/assets/images/home/hiking1.jpg',
    description: 'The City of Light',
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: '/assets/images/home/hiking2.jpg',
    description: 'Modern meets traditional',
  },
  {
    id: 3,
    name: 'New York, USA',
    image: '/assets/images/home/hiking3.jpg',
    description: 'The city that never sleeps',
  },
  {
    id: 4,
    name: 'London, UK',
    image: '/assets/images/home/hiking4.jpg',
    description: 'Historic and vibrant',
  },
  {
    id: 5,
    name: 'Bali, Indonesia',
    image: '/assets/images/home/mountain.jpg',
    description: 'Tropical paradise',
  },
  {
    id: 6,
    name: 'Sydney, Australia',
    image: '/assets/images/home/forest.jpg',
    description: 'Harbor city charm',
  },
];

export default function DestinationsGallery() {
  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore Amazing Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover hidden gems and popular destinations around the world
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                <p className="text-sm opacity-90">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
