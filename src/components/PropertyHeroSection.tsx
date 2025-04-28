import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { useProps } from '../hooks/useAuth';

interface PropertyHeroSectionProps {
  propertyId: string;
}

const PropertyHeroSection = ({ propertyId }: PropertyHeroSectionProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const { data: propsData } = useProps();

  // Detect screen size for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Store properties
  useEffect(() => {
    if (propsData) {
      setProperties(propsData);
    }
  }, [propsData]);

  // Find the property with the matching ID
  const selectedProperty = properties.find((prop) => prop._id === propertyId);

  // Determine the appropriate image URL
  const imageUrl = selectedProperty
    ? isMobile
      ? selectedProperty.mobileImage
      : selectedProperty.image
    : '';

  return (
    <section
      className="relative h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional: gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" /> */}

      {/* Optional content overlay */}
      {/* <div className="relative z-20 text-white p-10">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to Layoutz</h1>
        <p className="mt-4 text-lg md:text-xl">Your dream plot, your way.</p>
      </div> */}
    </section>
  );
};

export default PropertyHeroSection;
