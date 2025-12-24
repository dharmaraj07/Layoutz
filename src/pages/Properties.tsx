import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProps } from '../hooks/useAuth';
import Header from '@/components/Header';

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [listingType, setListingType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const {
    data: propsData,
    isLoading: propsLoading,
    isError: propsError,
  } = useProps();

  // 🔹 Unique property types from propsData
  const uniquePropertyTypes = Array.from(
    new Set((propsData || [])
      .map((p) => p.type)
      .filter((type) => !!type))
  ).sort();

  useEffect(() => {
    if (propsData && Array.isArray(propsData)) {
      setProperties(propsData);
      setFilteredProperties(propsData);
    }
  }, [propsData]);

  useEffect(() => {
    let filtered = properties;

    if (searchQuery) {
      filtered = filtered.filter((property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (propertyType !== 'all') {
      filtered = filtered.filter((property) => property.type === propertyType);
    }

    if (listingType !== 'all') {
      filtered = filtered.filter((property) =>
        listingType === 'sale' ? property.forSale : !property.forSale
      );
    }
    if (selectedCity !== 'all') {
    filtered = filtered.filter((property) =>
    property.city.trim().toLowerCase() === selectedCity
  );
}

    setFilteredProperties(filtered);
  }, [searchQuery, propertyType, selectedCity,listingType, properties]);

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('all');
    setListingType('all');
    setSelectedCity('all'); 
  };
const uniqueCities = Array.from(
  new Set((propsData || [])
    .map((p) => p.city.trim().toLowerCase())
    .filter((city) => !!city))
).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Header />
      <main className="flex-grow">
        <div className="bg-background py-20">
          <div className="container max-w-7xl mx-auto px-4 pt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold">All Properties</h1>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 w-full" role="search" aria-label="Property search and filters">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <Input 
                  placeholder="Search properties by title, location, or type..."
                  className="pl-10 bg-white border-2 border-gray-300 shadow-sm hover:border-housing-400 focus:border-housing-600 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search properties"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Dynamic Property Type Filter */}
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full sm:w-[200px] pl-10 bg-white/50 border-2 border-gray-300 shadow-sm">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Property Type</SelectLabel>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniquePropertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Listing Type Filter */}
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="w-full sm:w-[200px] pl-10 bg-white/50 border-2 border-gray-300 shadow-sm">
                    <SelectValue placeholder="Listing Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Listing Type</SelectLabel>
                      <SelectItem value="all">All Listings</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {(searchQuery || propertyType !== 'all' || listingType !== 'all') && (
                  <Button variant="outline" onClick={clearFilters} className='pl-10 bg-white/50 border-2 border-gray-300 shadow-sm'>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

           {/*   City Selector */}
              <div className="flex flex-wrap justify-center gap-3 my-8" role="group" aria-label="Filter by city">
                <Button
                  variant={selectedCity === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCity('all')}
                  className="min-w-[100px] transition-all hover:scale-105"
                  aria-pressed={selectedCity === 'all'}
                >
                  All Cities
                </Button>
                {uniqueCities.map((city) => (
                  <Button
                    key={city}
                    variant={selectedCity === city ? 'default' : 'outline'}
                    onClick={() => setSelectedCity(city)}
                    className="min-w-[100px] capitalize transition-all hover:scale-105"
                    aria-pressed={selectedCity === city}
                  >
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </Button>
                ))}
              </div>
            {/* Loading, Error, or Properties Grid */}
            {propsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-16 h-16 border-4 border-housing-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-center text-lg font-medium text-housing-800">Discovering amazing properties for you...</p>
              </div>
            ) : propsError ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-red-50 rounded-xl border border-red-200 px-6">
                <div className="text-6xl">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-900">Unable to Load Properties</h3>
                <p className="text-center text-gray-600 max-w-md">We're experiencing technical difficulties. Please try refreshing the page.</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Refresh Page
                </Button>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property._id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-background/50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">No properties found</h3>
                {searchQuery || propertyType !== 'all' || listingType !== 'all' || selectedCity !== 'all' ? (
                  <>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      We couldn't find any properties matching your criteria. Try adjusting your filters.
                    </p>
                    <Button variant="default" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground max-w-md mx-auto">
                    There are no properties available at the moment. Please check back later.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
