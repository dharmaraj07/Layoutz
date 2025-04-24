
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';



const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    'fixed top-0 left-0 right-0 z-50',
    isScrolled ? 'backdrop shadow-sm' : 'bg-white',
    isMobile ? '' : 'transition-all duration-300 ease-out' // disable transition on mobile
  )}
>
<div className="relative overflow-hidden bg-housing-700 mb-0 mt-0 z-10">
  <div
    className={cn(
      'flex gap-[10px] items-center',
      isMobile
        ? 'justify-center w-full px-4 py-2'
        : 'w-max animate-marquee-to-center'
    )}
  >
    <img
      src="https://res.cloudinary.com/ddetplmdz/image/upload/v1744824808/carside_qt2dhd.webp"
      alt="Moving Car"
      className={cn(
        'object-contain',
        isMobile ? 'w-40 h-10 -mx-10' : 'w-15 h-10 mb-0.5 mt-1'
      )}
    />
    <div
      className={cn(
        'text-housing-100 whitespace-nowrap',
        isMobile ? 'text-sm text-center ml-2' : 'ml-[210px]'
      )}
    >
      <span className={cn(isMobile ? 'block text-sm' : 'hidden md:inline-block')}>
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
