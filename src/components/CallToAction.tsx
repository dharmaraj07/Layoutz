
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScheduleVisitDialog } from './ScheduleVisitDialog';
import { PropertyEnquiryDialog } from './PropertyEnquiryDialog';
import { PropertyEnquiry } from './PropertyEnquiry';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const CallToAction = () => {
  return (
    <section className="px-4 py-20 md:py-28 bg-housing-700 relative overflow-hidden ">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNi41NzEgNS4yOWMtLjI5My0uMTkzLS42ODktLjE1Mi0uOTM3LjA5NmwtMy41NzEgMy41NzFhLjc1Ljc1IDAgMDAgMCAxLjA2MWwzLjU3MSAzLjU3MWEuNzUxLjc1MSAwIDAwMS4wNjEgMGwzLjU3MS0zLjU3MWEuNzUuNzUgMCAwMDAtMS4wNjFsLTMuNTcxLTMuNTcxYS43NS43NSAwIDAwLS4xMjQtLjA5NnoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative flex justify-center ">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Find Your Dream Villa Plots?
            </h2>
            <p className="text-housing-100 text-lg mb-8 max-w-lg">
              Connect with our real estate experts and start your journey to finding the perfect property. 
              We're here to guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
            <PropertyEnquiry>
              <button
               aria-label="Enquire Now"
              >
              </button>
            </PropertyEnquiry>
              <div className="bg-primary text-white flex text-medium rounded-r-lg hover:bg-primary/90 transition-colors shadow-md">
              <Link to="/properties">
                <Button>
                  Browse Properties
                </Button>
              </Link>
              </div>
              </div>

          </motion.div>
          
         </div>

    </section>
  );
};

export default CallToAction;
