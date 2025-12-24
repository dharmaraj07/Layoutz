import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHero } from '@/hooks/useAuth';
import { Hero } from '@/types/heroImage';

const HeroSection = () => {
  const [heros, setHeros] = useState<Hero[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const { data: heroData, isLoading: heroLoading, isError: heroError } = useHero();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set hero data
  useEffect(() => {
    if (heroData && Array.isArray(heroData)) {
      const sortedDesc = [...heroData].reverse();
      setHeros(sortedDesc);
    }
  }, [heroData]); 

  // Filter and select images based on type and device
  const filteredHero = heros
  .filter((hero) => hero.type === 'main')
  .map((hero) => {
    const mobileImg = hero.mobileImage?.[1] || hero.mobileImage?.[0];
    const desktopImg = hero.image?.[0];
    const imageUrl = isMobile ? mobileImg : desktopImg;

    return {
      id: hero._id,
      imageUrl: imageUrl || '/fallback.jpg', // use fallback if none
      link: hero.link,
    };
  });

  // Preload images and auto-slide
  useEffect(() => {
    if (!filteredHero.length) return;

    const preloadImages = async () => {
      const promises = filteredHero.map(({ imageUrl }) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = imageUrl;
          img.onload = resolve;
        });
      });
      await Promise.all(promises);
      setImagesLoaded(true);
    };

    preloadImages();

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % filteredHero.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredHero]);

  if (heroLoading) return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-housing-50 to-housing-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-housing-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-housing-800 font-medium">Loading amazing properties...</p>
      </div>
    </div>
  );
  if (heroError) return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="text-center space-y-4 px-4">
        <div className="text-6xl">🏠</div>
        <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
        <p className="text-gray-600 max-w-md">We're having trouble loading the hero section. Please refresh the page or try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-3 bg-housing-700 text-white rounded-lg hover:bg-housing-800 transition-colors focus:outline-none focus:ring-2 focus:ring-housing-500 focus:ring-offset-2"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  const activeItem = filteredHero[currentImage];

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      {/* Hero background slideshow */}
      <div className="absolute inset-0 z-0">
        {filteredHero.map(({ imageUrl, link, id }, index) => (
          <div
            key={id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${
              currentImage === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => navigate(encodeURI(activeItem.link))}
            role="button"
            tabIndex={currentImage === index ? 0 : -1}
            aria-label={`View property ${index + 1} of ${filteredHero.length}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(encodeURI(activeItem.link));
              }
            }}
          />
        ))}
        {/* Optional: gradient overlay */}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50" role="group" aria-label="Slideshow navigation">
        {imagesLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="flex justify-center space-x-3 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
          >
            {filteredHero.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 ${
                  currentImage === index 
                    ? 'w-8 h-2 bg-white' 
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1} of ${filteredHero.length}`}
                aria-current={currentImage === index ? 'true' : 'false'}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center space-x-3 bg-gray-300/70 backdrop-blur-sm px-6 py-3 rounded-full animate-pulse" aria-hidden="true">
            {filteredHero.map((_, index) => (
              <div key={index} className="w-4 h-1.5 bg-white/30 rounded-full" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
