import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from './lib/animations';
import { Customer } from '@/types/customer';
import { useCust } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-start justify-center text-center">
{/*   <div>
  <span className="text-sm font-medium text-black/50 text-gray-800 p-0">Rating: &nbsp; </span>
  </div> */}
  <div className="flex ">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-6 w-5",
          i < rating ? "text-amber-500 fill-amber-500 " : "text-gray-300 stroke-gray-300"
        )}
      />
    ))}
  </div>
  </div>
);

const extractYouTubeID = (url: string): string | null => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
};

const TestimonialsSection = () => {
  const [sectionRef, isSectionVisible] = useScrollAnimation(0.1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { data: custData, isLoading, isError } = useCust();
  const [selectedTestimonial, setSelectedTestimonial] = useState<Customer | null>(null);
  const navigate = useNavigate();

  const itemsPerPage = 12;
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  useEffect(() => {
    if (isError) navigate('/admin/login');
    else if (custData) setCustomers(custData);
  }, [isError, custData, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const displayedItems = customers.slice(
    activeIndex * itemsPerPage,
    (activeIndex + 1) * itemsPerPage
  );

  const handleCardClick = (testimonial: Customer) => {
    setSelectedTestimonial(testimonial);
  };

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
            Don't just take our word for it. Hear what our clients have to say about their experiences with D Layoutz.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              <div className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedItems.map((item) => (
                  <Card
                    key={item._id}
                    className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => handleCardClick(item)}
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="bg-[#FFC107]/10 min-h-[180px] flex items-center justify-center p-0">
                        {item.videolink ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${extractYouTubeID(item.videolink)}?rel=0`}
                            title="Property Video Tour"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-40 rounded-md"
                          ></iframe>
                        ) : (
                          <p className="text-sm p-6 text-gray-700 flex-grow min-h-[120px]">
                            "{item.review}"
                          </p>
                        )}
                      </div>

                      <div className="mt-auto bg-white p-6 border-t border-gray-100 flex items-center">
                        <Avatar className="h-12 w-12 border-2 border-amber-500/20 mr-4">
                          <AvatarImage src={item.img} alt={item.name} />
                          <AvatarFallback>{item.name?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.job}</p>
                        </div>
                        <div className="ml-auto">
                          <StarRating rating={item.rating || 0} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % totalPages)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Popup Dialog */}
      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTestimonial && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={selectedTestimonial.img} alt={selectedTestimonial.name} />
                    <AvatarFallback>{selectedTestimonial.name?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selectedTestimonial.name}</DialogTitle>
                    <DialogDescription>{selectedTestimonial.job}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="my-4">
                {selectedTestimonial.videolink ? (
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${extractYouTubeID(
                      selectedTestimonial.videolink
                    )}?rel=0`}
                    title="Testimonial Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                  ></iframe>
                ) : (
                  <p className="text-gray-700 text-base">
                    "{selectedTestimonial.review}"
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">

                <StarRating rating={selectedTestimonial.rating || 0} />
                <DialogClose asChild>
                  <button className="text-sm px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">
                    Close
                  </button>
                </DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TestimonialsSection;
