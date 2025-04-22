
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import logo from '../image/logo.png';  
import connect from '../image/connect.png';  
import {ScheduleVisitDialog} from './ScheduleVisitDialog';
import carside from '@/image/carside.png'








const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const [isNavVisible, setIsNavVisible] = useState(true);

useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 50);

    if (currentScrollY > lastScrollY) {
      // scrolling down
      setIsNavVisible(false);
    } else {
      // scrolling up
      setIsNavVisible(true);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  const handleContactClick = () => {
    toast({
      title: "Contact Request Received",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ',
                    isScrolled ? "backdrop shadow-sm " : "bg-white",

        
        )}
      >
      <div className="relative overflow-hidden bg-housing-700 mb-0 mt-0 z-10">
        <div className="flex w-max animate-marquee-center gap-[10px] items-center ml-[550px]">
          <img src="https://res.cloudinary.com/ddetplmdz/image/upload/v1744824808/carside_qt2dhd.webp" alt="Moving Car" className="w-15 h-10 mb-.5 mt-1 object-contain" />
          <div className="absolute text-l text-housing-100 whitespace-nowrap ml-[210px]">
            <span className="text-sm hidden md:inline-block">
              ENQUIRE NOW FOR A FREE SITE VISIT - +91-76393-02976
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  isDropdown?: boolean;
}

const NavItem = ({ href, label, isActive = false, isDropdown = false }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "relative px-3 py-2 font-medium text-sm transition-colors group",
        isActive 
          ? "text-housing-600" 
          : "text-housing-800 hover:text-housing-600"
      )}
    >
      <span className="flex items-center">
        {label}
        {isDropdown && <ChevronDown className="ml-1 w-4 h-4" />}
      </span>
      <span 
        className={cn(
          "absolute bottom-0 left-0 h-0.5 bg-housing-600 transition-all duration-300",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}
      ></span>
    </Link>
  );
};

interface MobileNavItemProps {
  href: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const MobileNavItem = ({ href, label, onClick, isActive = false }: MobileNavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "text-2xl font-heading font-medium transition-colors",
        isActive ? "text-housing-600" : "text-housing-800"
      )}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Header;
