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
      setHeros(heroData);
    }
  }, [heroData]);

  // Filter and select images based on type and device
  const filteredHero = heros
  .filter((hero) => hero.type === 'investment')
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

  if (heroLoading) return <div>Loading hero section...</div>;
  if (heroError) return <div>Failed to load hero section.</div>;

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
            onClick={() => navigate(link)}
          />
        ))}
        {/* Optional: gradient overlay */}
      </div>

      {/* Slide indicators */}
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
                aria-label={`Go to slide ${index + 1}`}
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
