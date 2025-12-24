
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const features = [
    'Premium Properties in Prime Locations',
    'Experienced Real Estate Professionals',
    'Personalized Property Search',
    'Transparent Process & Documentation',
    'Excellent After-Sales Support',
    'Legal Assistance & Financial Guidance',
  ];

  return (
    <section className="py-20 px-4 md:px-8 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80"
                  alt="Luxury real estate office"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute top-1/2 -right-8 transform translate-x-1/4 -translate-y-1/4 w-64 h-64 rounded-full bg-housing-100 -z-10"></div>
              <div className="absolute bottom-0 left-0 transform translate-x-1/4 translate-y-1/4 w-32 h-32 rounded-lg bg-housing-200 -z-10"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true, margin: '-100px' }}
            className="lg:pl-8"
          >
            <span className="inline-block px-3 py-1 bg-housing-100 text-housing-800 text-xs uppercase tracking-wider rounded-full mb-4">
              About D Layoutz 
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900">
              We Help You Find The Perfect Home
            </h2>
            <p className="text-gray-600 mb-8">
              At D Layout , we believe that finding the perfect home is about more than just square footage and location. It's about discovering a space that resonates with your lifestyle, aspirations, and vision for the future.
            </p>
            <p className="text-gray-600 mb-8">
              With over 10 years of experience in the real estate market, our team of dedicated professionals is committed to providing exceptional service and guidance throughout your property journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-housing-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 bg-housing-700 hover:bg-housing-800 text-white font-medium rounded-md transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-housing-500 focus:ring-offset-2"
              aria-label="Learn more about D Layoutz"
            >
              Learn More About Us
            </a>
            <a
              href="/investor"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Investment enquiry for properties"
            >
              For Investment Enquire Now
            </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
