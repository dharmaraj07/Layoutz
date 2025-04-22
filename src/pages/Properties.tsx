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

    setFilteredProperties(filtered);
  }, [searchQuery, propertyType, listingType, properties]);

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('all');
    setListingType('all');
  };

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
            <div className="flex flex-col md:flex-row gap-4 mb-8 w-full ">
              <div className="relative flex-grow ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search properties..."
                  className="pl-10 bg-white/50 border-2 border-gray-300 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Loading, Error, or Properties Grid */}
            {propsLoading ? (
              <p className="text-center py-16 text-muted-foreground">Loading properties...</p>
            ) : propsError ? (
              <p className="text-center py-16 text-red-500">Failed to load properties.</p>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property._id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-background/50 rounded-lg border border-dashed">
                <h3 className="text-xl font-medium mb-2">No properties found</h3>
                {searchQuery || propertyType !== 'all' || listingType !== 'all' ? (
                  <p className="text-muted-foreground">
                    Try adjusting your search filters to find what you're looking for.
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    There are no properties available at the moment.
                  </p>
                )}
                {properties.length > 0 && (searchQuery || propertyType !== 'all' || listingType !== 'all') && (
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
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
