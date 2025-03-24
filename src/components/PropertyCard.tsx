
import { useState } from 'react';
import { MapPin, Home, Maximize, BedDouble, Bath, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    type: string;
    imageUrl: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="hoverable-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <div className={`${isLoaded ? 'hidden' : 'block'} absolute inset-0 bg-gray-200 animate-shimmer`} />
        <img
          src={property.imageUrl}
          alt={property.title}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute top-4 left-4">
          <span className="inline-block py-1 px-2 text-xs font-medium text-white bg-housing-600 rounded-md">
            {property.type}
          </span>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center text-housing-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.location}</span>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2 text-gray-800">{property.title}</h3>
        <p className="text-housing-700 text-xl font-bold mb-4">{property.price}</p>
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 mb-4">
          <div className="flex items-center text-gray-600">
            <BedDouble className="w-4 h-4 mr-2 text-housing-500" />
            <span className="text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-4 h-4 mr-2 text-housing-500" />
            <span className="text-sm">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Maximize className="w-4 h-4 mr-2 text-housing-500" />
            <span className="text-sm">{property.area}</span>
          </div>
        </div>
        <Link to={`/property-enquiry/${property.id}`}>
          <Button className="w-full bg-housing-600 hover:bg-housing-700 text-white">
            Enquire Now
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
