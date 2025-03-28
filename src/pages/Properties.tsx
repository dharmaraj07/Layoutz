import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import PropertyCard from '@/components/PropertyCard';
import ProjectPageSearch from '@/components/ProjectPageSearch';


// Sample properties data
const propertiesData = [
  {
    id: "prop1",
    title: "Garden Villa Premium",
    location: "Namakkal, Gurusamypalaiyam",
    price: "2,00,00,000",
    bedrooms: 8,
    bathrooms: 10,
    area: "3,600 sq ft",
    type: "For Sale",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
  },
  {
    id: "prop2",
    title: "Garden Villa",
    location: "Namakkal, Gurusamypalaiyam",
    price: "80,00,000",
    bedrooms: 2,
    bathrooms: 3,
    area: "3,600 sq ft",
    type: "For Sale",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "prop3",
    title: "Oceanfront Villa",
    location: "Malibu, California",
    price: "$3,500,000",
    bedrooms: 5,
    bathrooms: 4,
    area: "4,500 sq ft",
    type: "For Sale",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "prop4",
    title: "Suburban Townhouse",
    location: "San Francisco, California",
    price: "$950,000",
    bedrooms: 3,
    bathrooms: 2.5,
    area: "1,850 sq ft",
    type: "For Rent",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "prop5",
    title: "Luxury Penthouse",
    location: "Miami Beach, Florida",
    price: "$2,750,000",
    bedrooms: 3,
    bathrooms: 3.5,
    area: "3,200 sq ft",
    type: "For Rent",
    imageUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "prop6",
    title: "Country Farmhouse",
    location: "Austin, Texas",
    price: "$1,100,000",
    bedrooms: 4,
    bathrooms: 3,
    area: "3,000 sq ft",
    type: "For Sale",
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProperties, setFilteredProperties] = useState(propertiesData);
  const [activeFilters, setActiveFilters] = useState({
    type: 'Any Type',
    location: 'Any Location',
    budget: 'Any Budget'
  });
  
  const propertiesPerPage = 6;
  
  // Apply initial filtering based on URL search params
  useEffect(() => {
    applyFiltersFromURL();
  }, [searchParams]);

  // Filter properties based on URL search parameters
  const applyFiltersFromURL = () => {
    let filtered = [...propertiesData];
    const newActiveFilters = {
      type: 'Any Type',
      location: 'Any Location',
      budget: 'Any Budget'
    };
    
    // Get search parameters
    const queryText = searchParams.get('q')?.toLowerCase();
    const propertyType = searchParams.get('type');
    const location = searchParams.get('location');
    const budget = searchParams.get('budget');
    
    // Filter by search query (title, location, id)
    if (queryText) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(queryText) || 
        property.location.toLowerCase().includes(queryText) ||
        property.id.toLowerCase().includes(queryText)
      );
    }
    
    // Filter by location
    if (location) {
      filtered = filtered.filter(property => 
        property.location.includes(location)
      );
      newActiveFilters.location = location;
    }
    
    // Filter by budget range
    if (budget) {
      const [min, max] = budget.split('-').map(value => parseInt(value));
      
      if (max) {
        // Price range (e.g., "500000-1000000")
        filtered = filtered.filter(property => {
          const price = parseInt(property.price.replace(/[$,]/g, ''));
          return price >= min && price <= max;
        });
        newActiveFilters.budget = `$${min.toLocaleString()} - $${max.toLocaleString()}`;
      } else {
        // Price minimum (e.g., "5000000+")
        filtered = filtered.filter(property => {
          const price = parseInt(property.price.replace(/[$,]/g, ''));
          return price >= min;
        });
        newActiveFilters.budget = `$${min.toLocaleString()}+`;
      }
    }
    
    // Update active filters state for UI display
    setActiveFilters(newActiveFilters);
    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle search from the ProjectSearch component
  const handleSearch = (searchParams: {
    searchQuery: string;
    propertyType: string;
    location: string;
    budget: string;
  }) => {
    let filtered = [...propertiesData];
    const newActiveFilters = {
      type: 'Any Type',
      location: 'Any Location',
      budget: 'Any Budget'
    };
    
    // Apply text search
    if (searchParams.searchQuery) {
      const query = searchParams.searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) || 
        property.location.toLowerCase().includes(query) ||
        property.id.toLowerCase().includes(query)
      );
    }
    
    // Apply property type filter
    if (searchParams.propertyType) {
      newActiveFilters.type = searchParams.propertyType.charAt(0).toUpperCase() + searchParams.propertyType.slice(1);
    }
    
    // Apply location filter
    if (searchParams.location) {
      filtered = filtered.filter(property => 
        property.location.includes(searchParams.location)
      );
      newActiveFilters.location = searchParams.location;
    }
    
    // Apply budget filter
    if (searchParams.budget) {
      const [min, max] = searchParams.budget.split('-').map(value => parseInt(value));
      
      if (max) {
        // Price range (e.g., "500000-1000000")
        filtered = filtered.filter(property => {
          const price = parseInt(property.price.replace(/[$,]/g, ''));
          return price >= min && price <= max;
        });
        newActiveFilters.budget = `$${min.toLocaleString()} - $${max.toLocaleString()}`;
      } else {
        // Price minimum (e.g., "5000000+")
        filtered = filtered.filter(property => {
          const price = parseInt(property.price.replace(/[$,]/g, ''));
          return price >= min;
        });
        newActiveFilters.budget = `$${min.toLocaleString()}+`;
      }
    }
    
    // Update active filters state for UI display
    setActiveFilters(newActiveFilters);
    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when search is performed
  };
  
  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow pt-20 ">
        {/* Add ProjectSearch component to Properties page */}
        <ProjectPageSearch onSearch={handleSearch} className="pt-8" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-housing-800 mb-4">
                Our Properties
              </h1>
              <p className="text-gray-600 max-w-2xl">
                {filteredProperties.length === propertiesData.length 
                  ? "Explore our extensive collection of exclusive properties."
                  : `Showing ${filteredProperties.length} filtered ${filteredProperties.length === 1 ? 'property' : 'properties'}.`}
              </p>
            </div>
      
          </div>
          
          {/* Display active filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="bg-housing-100 text-housing-800 px-3 py-1 rounded-full text-sm font-medium">
              Type: {activeFilters.type}
            </div>
            <div className="bg-housing-100 text-housing-800 px-3 py-1 rounded-full text-sm font-medium">
              Location: {activeFilters.location}
            </div>
            <div className="bg-housing-100 text-housing-800 px-3 py-1 rounded-full text-sm font-medium">
              Budget: {activeFilters.budget}
            </div>
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-medium text-gray-600 mb-4">No properties found</h3>
              <p className="text-gray-500 mb-8">Try adjusting your search criteria or explore our other listings.</p>
            </div>
          )}
          
          {/* Pagination - only show if there are properties */}
          {filteredProperties.length > 0 && (
            <Pagination className="mt-12">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Properties;