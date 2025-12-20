import React, { useState } from 'react';
import { MapPin, Mail, Phone, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from './NavBar';
import Footer from './Footer';
import Header from './Header';

// Define the office regions structure
const officeRegions = [
  {
    region: "Namakkal",
    offices: [
      {
        city: "Rasipuram",
        address: "100 Wilshire Blvd, Suite 1100",
        state: "California",
        zip: "90401",
        phone: "+1 (310) 555-8765",
        email: "la@homescape.com",
      },
      {
        city: "Valaiyapatti",
        address: "350 Fifth Avenue, 21st Floor",
        state: "New York",
        zip: "10118",
        phone: "+1 (212) 555-4321",
        email: "ny@homescape.com",
      }
    ]
  },
  {
    region: "Salem",
    offices: [
      {
        city: "Vaalapaadi",
        address: "127 Charing Cross Road",
        state: "England",
        zip: "WC2H 0EW",
        phone: "+44 20 7123 4567",
        email: "london@homescape.com",
      },
      {
        city: "Edapaadi",
        address: "24 Rue du Faubourg Saint-Honoré",
        state: "France",
        zip: "75008",
        phone: "+33 1 42 68 53 00",
        email: "paris@homescape.com",
      },
      {
        city: "Mettupatti",
        address: "24 Rue du Faubourg Saint-Honoré",
        state: "France",
        zip: "75008",
        phone: "+33 1 42 68 53 00",
        email: "paris@homescape.com",
      },
      {
        city: "Aathur",
        address: "24 Rue du Faubourg Saint-Honoré",
        state: "France",
        zip: "75008",
        phone: "+33 1 42 68 53 00",
        email: "paris@homescape.com",
      },
    ]
  }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Form submission logic would go here
    console.log('Form data submitted:', formData);
    
    // Show success message
    toast.success("Your message has been sent successfully!");
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <Header />
      
      <main className="flex-grow my-100 mt-8 bg-white">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground md:py-35 h-50">
          <div className="container px-4 md:px-6 mt-20 text-center">
            <h1 className="text-3xl md:text-5xl mt-30 p-4 font-display font-bold ">Get In Touch</h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 p-4">
              We're here to help with all your real estate needs. Reach out to our team for personalized assistance.
            </p>
          </div>
        </section>
        {/* Contact Form and Info */}
        <section className="py-16 md:py-24">
          <div className="flex justify-center px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 items-center">            
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      icon: <MapPin className="h-5 w-5" />,
                      title: "Main Headquarters",
                      details: [
                        "2/640, G K Street, Kondalampatti",
                        "Salem - 636010"
                      ]
                    },
                    {
                      icon: <Mail className="h-5 w-5" />,
                      title: "Email Us",
                      details: [
                        "dharmaraj.mech07@gmail.com",
                      ]
                    },
                    {
                      icon: <Phone className="h-5 w-5" />,
                      title: "Call Us",
                      details: [
                        "+91 7639302976",
                        "Mon-Sat, 9AM to 6PM PST"
                      ]
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="shrink-0 mr-4 bg-primary/10 p-3 rounded-full">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                        <div className="space-y-1">
                          {item.details.map((detail, j) => (
                            <p key={j} className="text-sm text-muted-foreground">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;