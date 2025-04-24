import React, { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { PropertyEnquiryDialog } from '@/components/PropertyEnquiryDialog';
import { toast } from "@/hooks/use-toast";
import { PropertyEnquiry } from '../PropertyEnquiry';

export function FloatingContactButtons() {
  const [isDialing, setIsDialing] = useState(false);
  
  const handleCall = () => {
    // Set the phone number you want to call
    const phoneNumber = "+917639302976"; // Replace with your actual phone number
    
    // Show dialing indicator
    setIsDialing(true);
    
    // Create a link to initiate a phone call
    window.location.href = `tel:${phoneNumber}`;
    
    // Reset dialing status after a short delay
    setTimeout(() => {
      setIsDialing(false);
      
      // Show a toast message
      toast({
        title: "Calling...",
        description: "Connecting you to our property experts.",
      });
    }, 1000);
  };
  
  return (
    <div className="fixed right-0  top-1/3 z-50 flex flex-col gap-2 opacity-80">
      <a 
        href="https://wa.me/+917639302976?text=I'm%20interested%20in%20learning%20more%20about%20your%20properties"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-l-lg hover:bg-green-600 transition-colors shadow-md flex"
        aria-label="Connect on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.6 6.32A8.78 8.78 0 0 0 12.23 4c-4.83 0-8.75 3.92-8.75 8.73 0 1.54.4 3.04 1.15 4.36l-1.22 4.47 4.56-1.2a8.63 8.63 0 0 0 4.29 1.1h.01c4.82 0 8.74-3.93 8.74-8.74 0-2.33-.91-4.53-2.56-6.18zm-5.38 13.5h-.01a7.2 7.2 0 0 1-3.67-1l-.26-.16-2.74.72.73-2.65-.17-.28a7.26 7.26 0 0 1-1.11-3.84c0-4.02 3.28-7.3 7.31-7.3a7.3 7.3 0 0 1 7.3 7.31c0 4.02-3.27 7.3-7.3 7.3zm4-5.38c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.15.22-.57.72-.7.86-.13.14-.26.16-.48.05-.67-.33-1.39-.6-1.95-1.42-.14-.25-.03-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.11-.5-1.2-.69-1.65-.18-.43-.37-.37-.5-.38h-.44c-.15 0-.4.06-.6.28-.22.23-.82.8-.82 1.96 0 1.15.84 2.27.96 2.43.12.15 1.66 2.53 4.01 3.55.56.24 1 .39 1.34.5.56.18 1.08.15 1.48.09.45-.07 1.38-.57 1.58-1.12.2-.55.2-1.01.14-1.11-.06-.1-.22-.16-.44-.28z" />
        </svg>&nbsp; WhatsApp
      </a>
      
      <PropertyEnquiry>
      <button
        className="bg-primary text-white p-3 flex rounded-l-lg hover:bg-primary/90 transition-colors shadow-md"
        aria-label="Enquire Now"
      >
      </button>
    </PropertyEnquiry>
      
      <button 
        onClick={handleCall}
        className={`bg-blue-500 text-white p-3 rounded-l-lg flex hover:bg-blue-600 transition-colors shadow-md ${isDialing ? 'animate-pulse' : ''}`}
        aria-label="Call Now"
      > 
        <Phone className="h-6 w-6" />&nbsp; CallNow
      </button>
    </div>
  );
}
