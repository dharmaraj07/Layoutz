import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { ChevronRight } from 'lucide-react';
import { Property } from '@/types/property';
import { getProperties } from '@/services/propertyService';
import { useScrollAnimation } from './lib/animations';

const FeaturedProperties = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [city, setCity] = useState<string>('All');
  const [allCities, setAllCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const allProperties = await getProperties();
      const featuredProps = allProperties.filter(p => p.featured);
      const limitedProps = (featuredProps.length > 0 ? featuredProps : allProperties).slice(0, 5);
      setProperties(limitedProps);

      // Get unique cities
      const cities = Array.from(new Set(allProperties.map(p => p.city).filter(Boolean)));
      setAllCities(['All', ...cities]);
    };

    fetchProperties();

    const handleStorageChange = () => {
      fetchProperties();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('propertiesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propertiesUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (city === 'All') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => p.city === city));
    }
  }, [city, properties]);

  return (
    <section 
      id="properties" 
      className="py-20 md:py-28 bg-secondary/30"
      ref={ref}
    >
      <div className="container px-4 md:px-6">
        <div className={cn(
          "flex flex-col md:flex-row justify-center items-center md:items-end mb-12 transition-all duration-700 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight text-gray-900">
              Your Home. Your Dream. Your Choice
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              Choose your plot from India's Largest Real Estate Developer
            </p>
          </div>
        </div>

        <div className='flex flex-col justify-end text-center items-end'>
          <Button 
            variant="outline" 
            className="mt-6 md:mt-0 group hover:bg-housing-700 hover:text-white transition-all" 
            onClick={() => window.location.href = '/properties'}
            aria-label="View all available properties"
          >
            View All Properties
            <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
        {/* City Filter Dropdown */}
        <div className="flex flex-wrap gap-3 justify-center mb-6 mt-8" role="group" aria-label="Filter properties by city">
          {allCities.map((c) => (
            <Button
              key={c}
              variant={city === c ? "default" : "outline"}
              onClick={() => setCity(c)}
              className="capitalize min-w-[100px] transition-all hover:scale-105"
              aria-pressed={city === c}
              aria-label={`Filter by ${c}`}
            >
              {c}
            </Button>
          ))}
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property._id}
                {...property}
                className={cn(
                  "transition-all duration-700 transform",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-16"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-background/50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">No properties available</h3>
            <p className="text-muted-foreground mb-6">No properties found in {city}. Try selecting a different city.</p>
            <Button 
              variant="default" 
              onClick={() => setCity('All')}
              className="mb-4"
            >
              Show All Cities
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
