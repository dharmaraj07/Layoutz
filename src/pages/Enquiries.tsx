
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Phone, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  comments?: string;
  createdAt: string;
  propertyTitle: string;
  propertyLocation: string;
}

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    // Fetch enquiries from localStorage
    const storedEnquiries = JSON.parse(localStorage.getItem('enquiries') || '[]');
    setEnquiries(storedEnquiries);
    setFilteredEnquiries(storedEnquiries);
  }, []);

  useEffect(() => {
    // Filter enquiries based on search term
    const results = enquiries.filter(enquiry => {
      const searchString = (
        enquiry.name.toLowerCase() + 
        enquiry.propertyTitle.toLowerCase() +
        enquiry.propertyLocation.toLowerCase()
      );
      return searchString.includes(searchTerm.toLowerCase());
    });
    
    setFilteredEnquiries(results);
  }, [searchTerm, enquiries]);

  const handleDelete = (id: string) => {
    const updatedEnquiries = enquiries.filter(enquiry => enquiry.id !== id);
    setEnquiries(updatedEnquiries);
    localStorage.setItem('enquiries', JSON.stringify(updatedEnquiries));
    toast({
      title: "Enquiry deleted",
      description: "The enquiry has been removed from your list."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-32 flex-grow">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
          Property Enquiries
        </h1>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or property..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No enquiries found</h2>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search" : "You haven't made any enquiries yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="border rounded-lg p-5 shadow-sm bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{enquiry.propertyTitle}</h3>
                    <p className="text-muted-foreground text-sm">{enquiry.propertyLocation}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{enquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{enquiry.phone}</span>
                  </div>
                  {enquiry.comments && (
                    <div className="pt-2">
                      <p className="font-medium mb-1">Comments:</p>
                      <p className="text-muted-foreground">{enquiry.comments}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-4 pt-4 border-t">
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(enquiry.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Enquiries;
