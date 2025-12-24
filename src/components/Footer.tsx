
import { MapPin, Phone, Mail, Clock, ArrowRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/" className="text-2xl font-heading font-bold mb-6 inline-block">
              D Layoutz<span className="text-housing-400"></span>
            </Link>
            <p className="text-gray-400 mb-6">
              Providing exceptional real estate services and helping clients find their perfect properties since 2015.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Facebook size={18} />} href="https://facebook.com" label="Facebook" />
              <SocialLink icon={<Twitter size={18} />} href="https://twitter.com" label="Twitter" />
              <SocialLink icon={<Instagram size={18} />} href="https://instagram.com" label="Instagram" />
              <SocialLink icon={<Linkedin size={18} />} href="https://linkedin.com" label="LinkedIn" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-housing-600"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/properties" label="Properties" />
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="/careers" label="Careers" />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Property Types
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-housing-600"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/properties?type=apartment" label="Apartments" />
              <FooterLink href="/properties?type=house" label="Houses" />
              <FooterLink href="/properties?type=villa" label="Villas" />
              <FooterLink href="/properties?type=commercial" label="Commercial" />
              <FooterLink href="/properties?type=land" label="Land" />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-housing-600"></span>
            </h3>
            <ul className="space-y-4">
              <ContactItem 
                icon={<MapPin className="w-5 h-5 text-housing-500" />} 
                text="2/640, G K Street, Kondalampatti, Salem - 636010"
              />
              <ContactItem 
                icon={<Phone className="w-5 h-5 text-housing-500" />} 
                text="+91 7639302976"
                href="tel:+917639302976"
              />
              <ContactItem 
                icon={<Mail className="w-5 h-5 text-housing-500" />} 
                text="dharmaraj.mech07@gmail.com"
                href="mailto:dharmaraj.mech07@gmail.com"
              />
              <ContactItem 
                icon={<Clock className="w-5 h-5 text-housing-500" />} 
                text="Mon-Sat: 9AM - 6PM"
              />
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Layoutz Housing. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const SocialLink = ({ icon, href, label }: SocialLinkProps) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-800 hover:bg-housing-700 transition-colors rounded-full flex items-center justify-center text-white"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  href: string;
  label: string;
}

const FooterLink = ({ href, label }: FooterLinkProps) => {
  return (
    <li>
      <a 
        href={href} 
        className="text-gray-400 hover:text-white transition-colors flex items-center"
      >
        <ArrowRight className="w-3 h-3 mr-2" />
        {label}
      </a>
    </li>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

const ContactItem = ({ icon, text, href }: ContactItemProps) => {
  const content = (
    <div className="flex items-start group">
      <div className="flex-shrink-0 mt-1" aria-hidden="true">{icon}</div>
      <div className="ml-3 text-gray-400 group-hover:text-white transition-colors">{text}</div>
    </div>
  );

  if (href) {
    return (
      <li>
        <a 
          href={href} 
          className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-housing-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
          {...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {content}
        </a>
      </li>
    );
  }

  return <li>{content}</li>;
};

export default Footer;
