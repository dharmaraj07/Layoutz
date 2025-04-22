
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ProjectSearch from '@/components/ProjectSearch';
import FeaturedProperties from '@/components/FeaturedProperties';
import AboutSection from '@/components/AboutSection';
import AchievementsSection from '@/components/AchievementsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Marquee from '@/components/layout/marquee';
import Header from '@/components/Header';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence mode="wait">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .5}}
        className="min-h-screen flex flex-col"
      >

        <NavBar />
        <Header />
        <main className="flex-grow">
          <HeroSection />
          <AchievementsSection />
          <FeaturedProperties />
          <TestimonialsSection />
          <AboutSection />
          <CallToAction />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
