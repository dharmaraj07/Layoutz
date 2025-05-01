import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import logo from '../image/logo.png';
import { ScheduleVisitDialog } from './ScheduleVisitDialog';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

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
      setIsNavVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const handleContactClick = () => {
    toast({
      title: 'Contact Request Received',
      description: "We'll get back to you within 24 hours.",
    });
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        isScrolled ? 'backdrop shadow-sm' : 'bg-transparent',
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

<nav className="relative z-50 max-w-8xl mx-4 mt-10 pt-2 md:mx-20 flex h-20 items-center justify-between px-4 bg-white border shadow-lg rounded-b-lg">
  {/* Logo - centered on mobile */}
  <div className="absolute inset-x-0 flex justify-center md:static md:justify-start">
    <Link
      to="/"
      className="text-2xl md:text-4xl flex items-center font-heading font-bold text-housing-800 gap-3 hover:scale-105 transition-transform"
    >
      <img src={logo} alt="Logo" className="w-10 h-10" />
      <span className="-mx-2">Layoutz</span>
    </Link>
  </div>

  {/* Hamburger for mobile - visible only on mobile */}
  <div className="md:hidden ml-auto z-50">
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-housing-800 p-2 z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
  </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 text-base font-bold">
          <NavItem href="/" label="Home" isActive={isActive('/')} />
          <NavItem href="/properties" label="Properties" isActive={isActive('/properties')} />
          <NavItem href="/investor" label="Investor" isActive={isActive('/investor')} />
          <NavItem href="/about" label="About" isActive={isActive('/about')}  />
          <NavItem href="/contact" label="Contact" isActive={isActive('/contact')} />
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="tel:+91 7639302976"
            className="flex items-center text-sm text-housing-800 hover:text-housing-600 transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            <span>+91 7639302976</span>
          </a>
          <ScheduleVisitDialog />
        </div>



        {/* Mobile Menu */}
        <div  
  className={cn(
    'fixed top-0 right-0 h-full w-72 max-w-full bg-white shadow-lg z-100 transition-all duration-300 ease-in-out md:hidden',
    isOpen ? 'translate-x-0' : 'translate-x-full'
  )}
>
        {isOpen && (
          <div className="md:hidden absolute top-full -left-0 w-full bg-white shadow-md transition-all duration-300 z-40">
            <div className="flex flex-col px-6 py-4 space-y-4">
              <MobileNavItem 
                href="/" 
                label="Home" 
                onClick={() => setIsOpen(false)} 
                isActive={isActive('/')}
              />
              <MobileNavItem 
                href="/properties" 
                label="Properties" 
                onClick={() => setIsOpen(false)} 
                isActive={isActive('/properties')}
              />
              <MobileNavItem 
                href="/investor" 
                label="Investor" 
                onClick={() => setIsOpen(false)} 
                isActive={isActive('/investor')}
              />
              <MobileNavItem 
                href="/about" 
                label="About Us" 
                onClick={() => setIsOpen(false)} 
                isActive={isActive('/about')}
              />
              <MobileNavItem 
                href="/contact" 
                label="Contact Us" 
                onClick={() => setIsOpen(false)} 
                isActive={isActive('/contact')}
              />
              <div className="pt-4">
                <ScheduleVisitDialog />
              </div>
            </div>
          </div>
        )}
        </div>
      </nav>
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
        'relative px-3 py-2 font-bold text-lg transition-colors group',
        isActive ? 'text-housing-600' : 'text-housing-800 hover:text-housing-600'
      )}
    >
      <span className="flex items-center">
        {label}
        {isDropdown && <ChevronDown className="ml-1 w-4 h-4" />}
      </span>
      <span
        className={cn(
          'absolute bottom-0 left-0 h-0.5 bg-housing-600 transition-all duration-300',
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
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
      onClick={onClick}
      className={cn(
        'text-lg font-heading font-medium transition-colors',
        isActive ? 'text-housing-600' : 'text-housing-800 hover:text-housing-600'
      )}
    >
      {label}
    </Link>
  );
};

export default NavBar;
