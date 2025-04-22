import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useHero } from '@/hooks/useAuth'; // Assuming you're using this hook
import { Hero } from '@/types/heroImage';

const HeroSection = () => {
  const [heros, setHeros] = useState<Hero[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const { data: heroData, isLoading: heroLoading, isError: heroError } = useHero();

  // Detect mobile on mount + resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set heroes from API
  useEffect(() => {
    if (heroData && Array.isArray(heroData)) {
      setHeros(heroData);
    }
  }, [heroData]);

  // Prepare filtered hero array with imageUrl and link
  const filteredHero = heros.filter((hero) => hero.type === 'main').map((hero) => ({
    imageUrl: isMobile ? hero.mobileImage[1] : hero.image[0],
    link: hero.link,
    id:hero._id

  }));
 
  console.log(filteredHero)
  // Preload images and setup slideshow
  useEffect(() => {
    if (!filteredHero.length) return;

    const preloadImages = () => {
      const promises = filteredHero.map(({ imageUrl }) => {

        
        return new Promise((resolve) => {
          const img = new Image();  
          img.src = imageUrl;
          img.onload = resolve;
        });
      });
      Promise.all(promises).then(() => setImagesLoaded(true));
    };

    preloadImages();

    const intervalId = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % filteredHero.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [filteredHero]);

  if (heroLoading) return <div>Loading hero section...</div>;
  if (heroError) return <div>Failed to load hero data.</div>;

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0 z-40">
        {filteredHero.map(({ imageUrl, link, id}, index) => (

          <div
            key={filteredHero[currentImage].id}
            className="absolute inset-0 transition-opacity duration-1000 ease-out-expo cursor-pointer"
            style={{
              opacity: currentImage === index ? 1 : 0,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1,
            }}
            onClick={() => {
              console.log(
                'Navigating to:',
                filteredHero[currentImage].link,
                'ID:',
                filteredHero[currentImage].id
              );
              navigate(filteredHero[currentImage].link);
            }}
          />
        ))}
        {/* Gradient overlay */}
        <div className=" bg-gradient-to-r from-black/50 to-transparent z-10" />
      </div>


      {/* Slide indicator container */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        {imagesLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="flex justify-center space-x-3 bg-black/50 px-4 py-2 rounded-full"
          >
            {filteredHero.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-4 h-1.5 rounded-full transition-all duration-300 ${
                  currentImage === index ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`View slide ${index + 1}`}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center space-x-3 bg-gray-300/70 px-4 py-2 rounded-full animate-pulse">
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
