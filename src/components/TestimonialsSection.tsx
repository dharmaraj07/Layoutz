
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Homeowner',
    quote: 'GSquare Housing made our dream of owning a beachfront property a reality. Their knowledge of the market and personalized approach exceeded our expectations.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Property Investor',
    quote: 'The team at GSquare has consistently found me exceptional investment opportunities. Their insight into market trends and property values has been invaluable.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'First-time Buyer',
    quote: 'As first-time homebuyers, we were nervous about the process. GSquare guided us every step of the way, making it smooth and stress-free. We couldn\'t be happier with our new home!',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80',
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-housing-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-housing-100 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-housing-100 rounded-full transform -translate-x-1/3 translate-y-1/3 opacity-70"></div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 bg-housing-100 text-housing-800 text-xs uppercase tracking-wider rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900">
            What Our Clients Say
          </h2>
          <p className="text-gray-600">
            Discover why our clients choose Layoutz Housing for their real estate needs. 
            Hear their experiences and success stories.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 light-glass"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                <div className="md:w-1/3">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-housing-600 rounded-full flex items-center justify-center text-white">
                      <Quote className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <blockquote className="text-xl md:text-2xl font-heading text-gray-800 mb-6">
                    "{testimonials[current].quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div>
                      <div className="font-bold text-gray-900">{testimonials[current].name}</div>
                      <div className="text-housing-600">{testimonials[current].role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-housing-200 flex items-center justify-center text-housing-700 hover:bg-housing-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    current === index
                      ? 'bg-housing-600 scale-125'
                      : 'bg-housing-300 hover:bg-housing-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-housing-200 flex items-center justify-center text-housing-700 hover:bg-housing-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
