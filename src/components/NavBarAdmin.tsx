
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import logo from '../image/logo.png';  





const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-expo py-4 px-5 md:px-8',
        {
          'bg-white/90 backdrop-blur-md shadow-sm': isScrolled,
          'bg-white': !isScrolled,
        }
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
      
        <Link 
          to="/admin" 
          className="relative z-10 text-2xl md:text-4xl flex items-center font-heading font-bold text-housing-800 transition-all gap-3 hover:scale-105"
        >

          <img src={logo}  alt="L" className="w-10 h-10" />
{/*           <img src={connect}  alt="L" className="w-4 h-2" /> */}
          <span className="inline-block transform transition-transform -mx-2 font-heading duration-300">
          Layoutz          
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavItem href="/admin" label="Property" isActive={isActive('/admin')} />
          <NavItem href="/admin/visits" label="Visits" isActive={isActive('/admin/visits')} />
          <NavItem href="/admin/enquiries" label="Images" isActive={isActive('/admin/enquiries')} />
          <NavItem href="/admin/customer" label="Customers" isActive={isActive('/admin/customer')} />

        </div>

        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="tel:+91 7639302976" 
            className="flex items-center text-sm text-housing-800 hover:text-housing-600 transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            <span>+91 7639302976</span>
          </a>

        </div>

        <button
          className="md:hidden relative z-10 text-housing-800"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile menu */}
        <div
          className={cn(
            'fixed inset-0 bg-white z-0 transform transition-transform duration-300 ease-in-out',
            {
              'translate-x-0': isOpen,
              'translate-x-full': !isOpen,
            }
          )}
        >
          <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
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
            <div className="pt-8">
              <Button
                onClick={handleContactClick}
                className="bg-housing-700 hover:bg-housing-800 text-white rounded-md px-6 py-3 transition-all duration-300"
              >
                Schedule Visit
              </Button>
            </div>
          </div>
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

export default NavBar;
