import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import logo from '../image/logo.png';
import { ScheduleVisitDialog } from './ScheduleVisitDialog';

const NavBarAdmin = () => {
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

<nav className="relative z-50 max-w-8xl mx-4 mt-2 md:mx-20 flex h-20 items-center justify-between px-6 bg-white border-2 border-gray-200 shadow-xl rounded-2xl backdrop-blur-sm bg-white/95">
  {/* Logo */}
  <div className="flex-shrink-0 z-50">
    <Link
      to="/"
      className="text-xl md:text-3xl flex items-center font-heading font-bold text-housing-800 gap-2 md:gap-3 hover:scale-105 transition-transform group"
      aria-label="Layoutz Admin Home"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-housing-600 to-housing-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
        <img src={logo} alt="Layoutz Logo" className="w-6 h-6 md:w-7 md:h-7" />
      </div>
      <span className="bg-gradient-to-r from-housing-700 to-housing-900 bg-clip-text text-transparent">Layoutz</span>
      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">ADMIN</span>
    </Link>
  </div>

  {/* Hamburger for mobile */}
  <div className="md:hidden ml-auto z-50">
        <button
          className="md:hidden text-housing-800 p-2 z-50 hover:bg-housing-50 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
  </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2 text-sm font-semibold">
          <NavItem href="/admin" label="Properties" isActive={isActive('/admin')} exact />
          <NavItem href="/admin/crm" label="CRM" isActive={isActive('/admin/crm')} />
          <NavItem href="/admin/enquiries" label="Gallery" isActive={isActive('/admin/enquiries')} />
          <NavItem href="/admin/customer" label="Customers" isActive={isActive('/admin/customer')} />
          <NavItem href="/admin/whatsapp" label="WhatsApp" isActive={isActive('/admin/whatsapp')} />
        </div>

        {/* Desktop Right Section - Hidden for cleaner look */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/" className="text-sm text-gray-600 hover:text-housing-600 transition-colors font-medium">
            View Site
          </Link>
        </div>



        {/* Mobile Menu */}
        <div
  className={cn(
    'fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-[60] transition-all duration-300 ease-in-out md:hidden border-l-2 border-gray-200',
    isOpen ? 'translate-x-0' : 'translate-x-full'
  )}
  role="dialog"
  aria-modal="true"
  aria-label="Admin navigation menu"
>
        {isOpen && (
          <div className="md:hidden h-full w-full bg-gradient-to-br from-white to-gray-50">
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-housing-600 to-housing-800 rounded-lg flex items-center justify-center">
                    <img src={logo} alt="" className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xl text-housing-800">Admin Panel</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              
              {/* Mobile menu items */}
              <div className="flex flex-col px-6 py-6 space-y-2 flex-1 overflow-y-auto">
                    <MobileNavItem href="/admin" label="Property" onClick={() => setIsOpen(false)}  isActive={isActive('/admin')} />
                    <MobileNavItem href="/admin/crm" label="CRM" onClick={() => setIsOpen(false)}  isActive={isActive('/admin/crm')} />
                    <MobileNavItem href="/admin/enquiries" label="Images" onClick={() => setIsOpen(false)}  isActive={isActive('/admin/enquiries')} />
                    <MobileNavItem href="/admin/customer" label="Customers" onClick={() => setIsOpen(false)}  isActive={isActive('/admin/customer')} />
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
  exact?: boolean;
}

const NavItem = ({ href, label, isActive = false, isDropdown = false, exact = false }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        'relative px-4 py-2 rounded-lg font-semibold transition-all group',
        isActive 
          ? 'bg-housing-600 text-white shadow-md' 
          : 'text-gray-700 hover:bg-housing-50 hover:text-housing-700'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="flex items-center gap-1">
        {label}
        {isDropdown && <ChevronDown className="ml-1 w-4 h-4" />}
      </span>
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
        'text-base font-semibold transition-all py-3 px-4 rounded-xl block',
        isActive 
          ? 'bg-housing-600 text-white shadow-lg' 
          : 'text-gray-700 hover:bg-housing-50 hover:text-housing-700 active:scale-95'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-2 h-2 rounded-full transition-all',
          isActive ? 'bg-white' : 'bg-gray-400'
        )} />
        {label}
      </div>
    </Link>
  );
};

export default NavBarAdmin;
