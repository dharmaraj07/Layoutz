
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <section className="px-4 py-20 md:py-28 bg-housing-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNi41NzEgNS4yOWMtLjI5My0uMTkzLS42ODktLjE1Mi0uOTM3LjA5NmwtMy41NzEgMy41NzFhLjc1Ljc1IDAgMDAgMCAxLjA2MWwzLjU3MSAzLjU3MWEuNzUxLjc1MSAwIDAwMS4wNjEgMGwzLjU3MS0zLjU3MWEuNzUuNzUgMCAwMDAtMS4wNjFsLTMuNTcxLTMuNTcxYS43NS43NSAwIDAwLS4xMjQtLjA5NnoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-housing-100 text-lg mb-8 max-w-lg">
              Connect with our real estate experts and start your journey to finding the perfect property. 
              We're here to guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-housing-800 font-medium rounded-md transition-all hover:bg-housing-50 hover:shadow-lg"
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="/properties" 
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md transition-all hover:bg-white/10"
              >
                Browse Properties
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true, margin: '-100px' }}
            className="relative"
          >
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get in Touch</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-housing-500 focus:border-housing-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-housing-500 focus:border-housing-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-housing-500 focus:border-housing-500 transition-all"
                    placeholder="+91 7639302976 "
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-housing-500 focus:border-housing-500 transition-all"
                    placeholder="I'm interested in..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-housing-700 hover:bg-housing-800 text-white font-medium rounded-md transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Decoration elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-housing-600 rounded-xl -z-10 opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-housing-800 rounded-lg -z-10 opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
