
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Building, RotateCcw,DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from './ui/select';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { toast } from './ui/use-toast';

interface ProjectSearchProps {
  onSearch?: (searchParams: {
    searchQuery: string;
    propertyType: string;
    location: string;
    budget: string;
  }) => void;
  className?: string;
}

const ProjectSearch = ({ onSearch, className }: ProjectSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = { searchQuery, propertyType, location, budget };
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('q', searchQuery);
      if (propertyType) queryParams.append('type', propertyType);
      if (location) queryParams.append('location', location);
      if (budget) queryParams.append('budget', budget);
      
      navigate(`/properties?${queryParams.toString()}`);
    }
    
    toast({
      title: "Search applied",
      description: "Filtering properties based on your criteria",
    });
  };

  const handleReset = () => {
    // Reset all form fields
    setSearchQuery('');
    setPropertyType('');
    setLocation('');
    setBudget('');
    
    // If onSearch provided, trigger search with empty params
    if (onSearch) {
      onSearch({ searchQuery: '', propertyType: '', location: '', budget: '' });
    } else {
      // Navigate to properties page without query params
      navigate('/properties');
    }
    
    toast({
      title: "Filters reset",
      description: "Showing all available properties",
    });
  };


  return (
    <section className="py-1 px-4 md:px-2 bg-transparent">
      <div className="max-w-7.5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          viewport={{ once: true, margin: '-100px' }}
          className="bg-transparent shadow-xl rounded-xl overflow-hidden"
        >
          <div className="p-6 md:p-1 bg-gradient-to-r from-housing-700/70 to-housing-900/70 ">
            <h2 className="text-2xl md:text-2xl font-heading font-bold text-white mb-1 text-center">
              Property Search
            </h2> 
          </div>
          
          <form onSubmit={handleSearch} className="p-4 md:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 bg-white bg-opacity-50">
            <div className="space-y-2">

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Keywords, Property name, ID..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="property-type" className="w-full">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location" className="w-full">
                  <SelectValue placeholder="Any Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miami">Miami, FL</SelectItem>
                  <SelectItem value="new-york">New York, NY</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
                  <SelectItem value="chicago">Chicago, IL</SelectItem>
                  <SelectItem value="houston">Houston, TX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">

              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger id="budget" className="w-full">
                  <SelectValue placeholder="Any Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500000">Under $500,000</SelectItem>
                  <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="1000000-2000000">$1,000,000 - $2,000,000</SelectItem>
                  <SelectItem value="2000000-5000000">$2,000,000 - $5,000,000</SelectItem>
                  <SelectItem value="5000000+">$5,000,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2 bg-housing-700 hover:bg-housing-800 text-white font-medium rounded-md transition-all hover:shadow-lg w-full "
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </button>
           

            </div>
            <div>
                 <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="inline-flex items-center justify-center px-6 py-2 text-housing-700 border border-housing-700 hover:bg-housing-100 font-medium rounded-md transition-all w-full "
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectSearch;
