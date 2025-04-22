import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Property } from '@/types/property';
import { useProps } from '../hooks/useAuth';



const PropertyHeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const { data: propsData, isLoading: propsLoading, isError: propsError } = useProps();


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (propsData) {
      setProperties(propsData);
    }
  }, [propsData]);

    // Prepare filtered props array with imageUrl and link
    const filteredProps = properties.map((properties) => ({
      imageUrl: isMobile ? properties.mobileImage : properties.image
    }));
    console.log(filteredProps)

 
  return (
    <section className="relative h-screen w-screen overflow-hidden ">
      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        {filteredProps.map(({imageUrl}, index) => (
          <div
            key={imageUrl}
            className="absolute inset-0 transition-opacity duration-1000 ease-out-expo"
            style={{
              opacity: currentImage === index ? 1 : 0,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Overlay gradient */}
{/*         <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" /> */}
      </div>


    </section>
  );
};

export default PropertyHeroSection;
