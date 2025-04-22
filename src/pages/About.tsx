import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/components/lib/animations';
import { Check, Target, Trophy, Users } from 'lucide-react';
import { InvestmentEnquiry } from '@/components/InvestmentEnquiry';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


const About = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const [imageRef, isImageVisible] = useScrollAnimation(0.2);
  const [statsRef, isStatsVisible] = useScrollAnimation(0.3);

  const stats = [
    {
      number: "10+",
      label: "Years of Excellence",
      icon: <Trophy className="h-6 w-6 text-primary" />
    },
    {
      number: "1000+",
      label: "Happy Customers",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      number: "500+",
      label: "Properties Sold",
      icon: <Target className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col ">
      <NavBar />
      <Header />
    <main className="flex-grow my-100 mt-8 bg-black/30">
    <section id="about" className="py-20 md:py-28 bg-white" ref={ref}>

      <div className="container px-4 md:px-6 mt-12">
        {/* Introduction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div 
            ref={imageRef}
            className={cn(
              "relative rounded-xl overflow-hidden transition-all duration-1000 transform",
              isImageVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}
          >
            <div className="aspect-[4/5] relative">
              <img 
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Interior of a modern architectural home" 
                className="object-cover w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
            </div>
          </div>

          <div className={cn(
            "transition-all duration-1000 delay-300 transform",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          )}>
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent text-xs font-medium uppercase tracking-wider text-accent-foreground">
              About D-Layoutz
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 tracking-tight">
              Building Dreams, Creating Homes Since 2014
            </h2>
            
            <p className="text-muted-foreground mb-8">
              D-Layoutz is more than just a real estate company; we're your partner in finding the perfect home. 
              With over a decade of experience in the luxury real estate market, we've mastered the art of matching 
              exceptional properties with discerning clients.
            </p>

            <div className="grid gap-4 mb-8">
              {[
                "Premium locations in prime areas",
                "Transparent dealings and documentation",
                "Exceptional after-sales service",
                "Dedicated relationship managers"
              ].map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div className="mr-3 shrink-0 mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium">{feature}</p>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-2">
              Learn More About Us
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div 
          ref={statsRef}
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000",
            isStatsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="p-8 rounded-xl bg-card border text-center hover:shadow-lg transition-shadow"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Core Values</h2>
          <p className="text-muted-foreground mb-12">
            At Homescape, our values guide everything we do. We believe in creating lasting relationships 
            built on trust, delivering excellence in every interaction, and maintaining the highest 
            standards of integrity in all our dealings.
          </p>
          <div className='flex justify-center '>
                <InvestmentEnquiry>
                  <button>
                  </button> 
               </InvestmentEnquiry>
            </div>
        </div>
      </div>
 
    </section>
    </main>
    <Footer />
    </div>


  );
};

export default About;