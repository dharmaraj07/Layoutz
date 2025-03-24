
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProjectSearch from './ProjectSearch';

const images = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1775&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1692&q=80',
];

const HeroSection = () => {

  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload images
    const preloadImages = () => {
      const imagePromises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
        });
      });

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      });
    };

    preloadImages();

    // Set up slideshow timer
    const intervalId = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (

    <section className="relative h-screen/50% w-full overflow-hidden">
      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        
        {images.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-out-expo"
            style={{
              opacity: currentImage === index ? 1 : 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
      </div>
        
      {/* Content */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto my-20 px-4 md:px-8 flex flex-col justify-center">
      <ProjectSearch />
        {imagesLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="max-w-2xl"
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-housing-600 text-white text-xs uppercase tracking-wider rounded-full mb-4">
                Premium Real Estate
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-4">
              Find Your Perfect Place to Call Home
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg">
              Discover exceptional properties in the most desirable locations. We help you find the perfect home that meets your lifestyle and aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="/properties"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-housing-800 font-medium rounded-md transition-all hover:shadow-lg"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md transition-all hover:bg-white/10"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-2xl animate-pulse">
            <div className="h-10 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="h-20 bg-gray-300 rounded mb-4"></div>
            <div className="h-16 bg-gray-300 rounded mb-4"></div>
            <div className="h-12 w-40 bg-gray-300 rounded"></div>
          </div>
        )}

        {/* Slide indicators */}
        <div className="relative  bottom-12 left-4 md:left-8 flex justify-center space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentImage === index ? 'bg-white scale-100' : 'bg-white/50 scale-100'
              }`}
              aria-label={`View slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
