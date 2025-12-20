














import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './lib/animations';

// Testimonial data - expanded to 15 entries
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "First-time Homebuyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "Homescape made finding my dream home so simple. Their agents were responsive and really understood what I was looking for. I couldn't be happier with my new place!"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Investor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "As someone who's purchased multiple properties, I appreciate Homescape's efficiency and market knowledge. They've helped me secure properties with great ROI potential."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Luxury Homeowner",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "The attention to detail when showing high-end properties was impressive. Homescape understood my specific requirements and only showed me homes that matched my criteria."
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Relocated for Work",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4,
    feedback: "Relocating to a new city was stressful, but Homescape made the housing part easy. They found me a great place in my preferred neighborhood within my budget."
  },
  {
    id: 5,
    name: "Jennifer Martinez",
    role: "Home Seller",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "Selling my home was a breeze with Homescape. They handled everything professionally and got me more than my asking price!"
  },
  {
    id: 6,
    name: "Robert Thompson",
    role: "Real Estate Investor",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "I've been investing in real estate for years, and Homescape consistently delivers the best service when looking for new properties to add to my portfolio."
  },
  {
    id: 7,
    name: "Linda Evans",
    role: "First-time Seller",
    avatar: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "I was nervous about selling my first home, but the team at Homescape guided me through every step. The process was smooth and they found a buyer within weeks!"
  },
  {
    id: 8,
    name: "Thomas Wright",
    role: "Commercial Investor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4,
    feedback: "Homescape helped me diversify my portfolio with commercial properties. Their market analysis and property suggestions were spot on."
  },
  {
    id: 9,
    name: "Amanda Torres",
    role: "Vacation Home Buyer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "Finding the perfect vacation property was my goal, and Homescape exceeded my expectations. They found me a beachfront property that was within my budget."
  },
  {
    id: 10,
    name: "James Peterson",
    role: "Downsizing Homeowner",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "After the kids moved out, we needed to downsize. Homescape found us the perfect smaller home while getting us a great price for our old property."
  },
  {
    id: 11,
    name: "Sophia Kim",
    role: "Urban Apartment Buyer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4,
    feedback: "When looking for my downtown loft, Homescape showed me several options that matched my lifestyle needs. They made city living accessible and exciting."
  },
  {
    id: 12,
    name: "Daniel Garcia",
    role: "New Construction Buyer",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "I wanted a new construction home, and Homescape connected me with developers who had fantastic floor plans. They negotiated upgrades that would have cost me thousands."
  },
  {
    id: 13,
    name: "Rachel Williams",
    role: "Single-Parent Homebuyer",
    avatar: "https://images.unsplash.com/photo-1546539782-6fc531453083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "As a single mom, finding a safe home in a good school district was my priority. Homescape understood this and found the perfect neighborhood for my family."
  },
  {
    id: 14,
    name: "Christopher Lee",
    role: "Real Estate Flipper",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4,
    feedback: "I flip houses for a living, and Homescape has been instrumental in finding properties with great potential. Their market insights have helped maximize my profits."
  },
  {
    id: 15,
    name: "Nicole Johnson",
    role: "Retirement Community Buyer",
    avatar: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "When it was time to move to a retirement community, Homescape made the transition seamless. They found me a vibrant community that matched my active lifestyle."
  }
];

// Video testimonial data
const videoTestimonials = [
  {
    id: 1,
    name: "Mark Davidson",
    role: "Real Estate Investor",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "Homescape's team provided incredible market insights that helped me make informed investment decisions.",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    videoId: "dQw4w9WgXcQ",
    duration: "3:42"
  },
  {
    id: 2,
    name: "Sophia Anderson",
    role: "Family Home Buyer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
    feedback: "Moving with three children seemed impossible, but Homescape found us our perfect family home in just two weeks.",
    thumbnail: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    videoId: "dQw4w9WgXcQ",
    duration: "4:15"
  }
];

// Component to display a star rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={cn(
            "h-5 w-5", 
            i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300 stroke-gray-300"
          )} 
        />
      ))}
    </div>
  );
};

// Component for a testimonial card
const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  return (
    <Card 
      key={testimonial.id} 
      className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="bg-[#FFC107]/10 p-6">
          <div className="mb-4 flex">
            <StarRating rating={testimonial.rating} />
          </div>
          <p className="text-sm text-gray-700 flex-grow min-h-[120px]">
            "{testimonial.feedback}"
          </p>
        </div>
        
        <div className="mt-auto bg-white p-6 border-t border-gray-100 flex items-center">
          <Avatar className="h-12 w-12 border-2 border-amber-500/20 mr-4">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-foreground">{testimonial.name}</h3>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for a video testimonial card
const VideoTestimonialCard = ({ testimonial }: { testimonial: any }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <Card 
      key={testimonial.id} 
      className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="bg-[#FFC107]/10 p-6 pb-3">
          <div className="mb-4 flex">
            <StarRating rating={testimonial.rating} />
          </div>
          <p className="text-sm text-gray-700 mb-3">
            "{testimonial.feedback}"
          </p>
        </div>
        
        <div className="px-6 pb-3 pt-0 bg-[#FFC107]/10">
          <div className="relative cursor-pointer rounded-lg overflow-hidden" onClick={() => setShowVideo(true)}>
            {!showVideo ? (
              <>
                <img 
                  src={testimonial.thumbnail} 
                  alt={`${testimonial.name} video testimonial`} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <Play className="h-8 w-8 text-amber-500 fill-amber-500" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {testimonial.duration}
                </div>
              </>
            ) : (
              <div className="pt-[56.25%] relative">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1`}
                  title={`${testimonial.name} video testimonial`}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-auto bg-white p-6 border-t border-gray-100 flex items-center">
          <Avatar className="h-12 w-12 border-2 border-amber-500/20 mr-4">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-foreground">{testimonial.name}</h3>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialsSection = () => {
  const [sectionRef, isSectionVisible] =useScrollAnimation(0.1);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerPage = 12;
  const totalPages = Math.ceil((testimonials.length + videoTestimonials.length) / itemsPerPage);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  // Combine testimonials with video testimonials for paging
  const allTestimonials = [...testimonials, ...videoTestimonials];
  const displayedItems = allTestimonials.slice(
    activeIndex * itemsPerPage,
    (activeIndex + 1) * itemsPerPage
  );

  return (
    <section id="testimonials" className="py-20 bg-[#f9f9f9]">
      <div 
        ref={sectionRef}
        className={cn(
          "container px-4 md:px-6 transition-all duration-1000 transform",
          isSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#333] relative inline-block mb-2">
            <span className="relative z-10">Trusted By Thousands of Happy Customers</span>
            <span className="absolute bottom-0 left-0 h-[8px] w-full bg-[#FFC107]/30 -z-10"></span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Hear what our clients have to say about their experiences with Homescape.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Testimonials Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              <div className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedItems.map(item => (
                  "videoId" in item ? 
                    <VideoTestimonialCard key={`video-${item.id}`} testimonial={item} /> : 
                    <TestimonialCard key={`review-${item.id}`} testimonial={item} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  activeIndex === i ? "w-8 bg-[#FFC107]" : "w-2 bg-gray-300"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;