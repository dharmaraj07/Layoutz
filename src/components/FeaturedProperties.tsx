
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { motion } from 'framer-motion';

const properties = [
  {
    id: "1",
    title: "Garden Villa Premium",
    location: "Namakkal, Gurusamypalaiyam",
    price: "2,00,00,000",
    bedrooms: 8,
    bathrooms: 10,
    area: "3,600 sq ft",
    type: "For Sale",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
  },
  {
    id: "2",
    title: "Garden Villa",
    location: "Namakkal, Gurusamypalaiyam",
    price: "80,00,000",
    bedrooms: 2,
    bathrooms: 3,
    area: "3,600 sq ft",
    type: "For Sale",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: '3',
    title: 'Elegant Villa with Pool',
    location: 'Beverly Hills, LA',
    price: '$5,200,000',
    bedrooms: 5,
    bathrooms: 4,
    area: '4,500 sq ft',
    type: 'Villa',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
  },
];

const FeaturedProperties = () => {
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div >
            <span className="inline-block px-3 py-1 bg-housing-100 text-housing-800 text-xs uppercase tracking-wider rounded-full mb-4">
              Featured Properties
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900">
              Discover Our Premium Properties
            </h2>
            <p className="text-gray-600 max-w-3xl">
              Explore our handpicked selection of premium properties in exclusive locations among our listing.
            </p>
          </div>
          <a
            href="/properties"
            className="inline-flex items-center mt-6 md:mt-0 text-housing-700 font-medium hover:text-housing-800 transition-colors"
          >
            View All Properties
            <ChevronRight className="ml-1 w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {properties.map((property) => (
            <motion.div key={property.id} variants={item}>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
