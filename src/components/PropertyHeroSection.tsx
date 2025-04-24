import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { useProps } from '../hooks/useAuth';

const PropertyHeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
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

  // Prepare filtered images
  const filteredProps = properties.map((prop) => ({
    imageUrl: isMobile ? prop.mobileImage : prop.image,
  }));

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % filteredProps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [filteredProps.length]);

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      {/* Background image slider */}
      <div className="absolute inset-0 z-0">
        {filteredProps.map(({ imageUrl }, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentImage === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

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
