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

  useEffect(() => {
    // Fetch properties from localStorage
    const fetchProperties = async () => {
      const allProperties = await getProperties();
      // Filter to show only featured properties or up to 5 properties if none are featured
      const featuredProps = allProperties.filter(p => p.featured);
      
      if (featuredProps.length > 0) {
        setProperties(featuredProps.slice(0, 5)); // Show up to 5 featured properties
      } else {
        setProperties(allProperties.slice(0, 5)); // Show up to 5 properties if none are featured
      }
    };

    fetchProperties();

    // Add event listener to refresh properties when localStorage changes
    const handleStorageChange = () => {
      fetchProperties();
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for when properties are updated via the Admin page
    window.addEventListener('propertiesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propertiesUpdated', handleStorageChange);
    };
  }, []);

  return (
    <section 
      id="properties" 
      className="py-20 md:py-28 bg-secondary/30"
      ref={ref}
    >
      <div className="container px-4 md:px-6 ">
        <div className={cn(
          "flex flex-col md:flex-row justify-center  items-center md:items-end mb-12 transition-all duration-700 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className='flex flex-col justify-center text-center items-center'>
            <div className='flex flex-col items-center'>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">Your Home. Your Dream. Your Choice</h2>
            <h3 className="text-medium   mb-4 ">Choose your plot from India's Largest Real Estate Developer</h3></div>
          </div>

        </div>
        <div className='flex flex-col justify-end text-center items-end'>
        <Button variant="outline" className="mt-6 md:mt-0 group" onClick={() => window.location.href = '/properties'}>
            View All Properties
            <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          </div>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {properties.map((property, index) => (
              <PropertyCard
                key={property._id}
                {...property}
                className={cn(
                  "transition-all duration-700 transform",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-16",
                  // Stagger the animations
                  isVisible && {
                    'transition-delay-100': index === 0,
                    'transition-delay-200': index === 1,
                    'transition-delay-300': index === 2,
                    'transition-delay-400': index === 3,
                    'transition-delay-500': index === 4,
                  }
                )}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-background/50 rounded-lg border border-dashed">
            <p className="text-muted-foreground">No properties available. Add some in the admin panel.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/admin'}>
              Go to Admin Panel
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;