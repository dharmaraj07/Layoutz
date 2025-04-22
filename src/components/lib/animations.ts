
import { useEffect, useState, useRef, RefObject } from 'react';

export const useScrollAnimation = (threshold = 0.1): [RefObject<HTMLDivElement>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

export const useLazyImage = (src: string): [string, boolean] => {
  const [imageSrc, setImageSrc] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    return () => {
      img.onload = null;
    };
  }, [src]);

  return [imageSrc, imageLoaded];
};

export const useParallax = (speed = 0.5): [RefObject<HTMLDivElement>, number] => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const { top } = ref.current.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (top < windowHeight && top > -ref.current.offsetHeight) {
        // Element is in viewport
        const relativePosition = (top - windowHeight) / (windowHeight + ref.current.offsetHeight);
        setOffset(relativePosition * speed * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset];
};

