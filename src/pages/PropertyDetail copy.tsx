import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Home, Bed, Bath, MoveHorizontal, BadgeCheck, Phone, Calendar, ArrowRight, CheckCircle2, MapPin, SquareCode, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { PropertyEnquiryDialog } from '@/components/PropertyEnquiryDialog';
import { Property } from '@/types/property';
import { getProperties } from '@/services/propertyService';
import PropertyCard from '@/components/PropertyCard';
import { useProps } from '../hooks/useAuth';
import electricityIcon from '@/image/electricity.jpeg';
import cctv from '@/image/cctv.png';
import maintenance from '@/image/maintenance.png';
import water from '@/image/waterconnection.png';
import readytoconstruct from '@/image/ready construct.png';
import streetL from '@/image/streetlight.png';
import drinageS from '@/image/drinage.png';
import road from '@/image/road.png';
import avenue from '@/image/avenue.png';


import { cn } from '@/lib/utils';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [properties, setProperties] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  // Mock additional images for the property
  const additionalImages = [
    properties?.image || '',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1470&auto=format&fit=crop'
  ];

  
  const { title } = useParams<{ title: string }>();
  const decodedTitle = decodeURIComponent(title || '');
  const { data: propsData, isLoading, isError } = useProps();

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError || !propsData) return <p className="p-6 text-red-500">Error loading property.</p>;

  const property: Property | undefined = propsData.find(p => p.title === decodedTitle);

  if (!property) return <p className="p-6 text-red-500">Property not found.</p>;
// Mock property facts
const propertyFacts = [
  { label: "Project Area", value: property.projectArea },
  { label: "Total Plots", value: property.totalPlots },
  { label: "Plot Sizes", value: `${property.sqft} Sq.ft`  },
  { label: "DTCP Approved", value: 
  
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-medium font-medium ${
    property.approved ? 'bg-green-100 text-green-900' : 'bg-blue-100 text-blue-800'
  }`}>
    {property.approved ? 'Approved' : 'Pending'}
  </span>},

  
  { label: "Project Status", value: 
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-medium font-medium ${
      property.forSale ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {property.forSale ? 'For Sale' : 'Sold Out'}
    </span>}
   
];

// Mock property features (extended list)
const propertyFeatures = [
  "Modern Kitchen",
  "Air Conditioning",
  "Heating System",
  "High-Speed Internet",
  "Parking Space",
  "Garden Area",
  "Security System",
  "Wooden Flooring",
  "Swimming Pool",
  "Children's Play Area",
  "Community Center",
  "24x7 Security",
  "Gym",
  "Sports Facilities",
  "Landscaped Gardens",
  "Clubhouse"
];

// Mock property amenities with icons
const propertyAmenities = [

    { name: "Electricity Line", img: electricityIcon },
    { name: "Compound Wall", img: avenue },
    { name: "Street Lights", img: streetL},
    { name: "Black Top Roads", img: road },
    { name: "Avenue Trees", img: avenue },
    { name: "Water Connection", img: water },
    { name: "Drainage System", img: drinageS},
    { name: "1 Year Maintenance", img: maintenance },
    { name: "24x7 CCTV Surveillance", img: cctv },
    { name: "Ready to Construct Villa Plots", img: readytoconstruct },
  ];



// Mock property highlights
const propertyHighlights = [
  "Close to Major Schools and Colleges",
  "Near to Hospitals",
  "Proximity to IT Parks",
  "Easy Access to Public Transportation",
  "Near Shopping Malls and Entertainment"
];

 
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Breadcrumb */}
        <div className="container px-4 py-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link to="/properties" className="text-muted-foreground hover:text-primary">Properties</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="font-medium">{property.title}</span>
          </div>
        </div>
        
        {/* Property Hero Section */}
        <div className="bg-gray-50 py-8">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{property.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-lg">{property.location}</span>
                </div>
                
                {property.forSale ? (
                  <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full inline-block font-medium">
                    For Sale
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full inline-block font-medium">
                    For Rent
                  </div>
                )}
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="flex items-center justify-center gap-1 bg-blue-100 border rounded-xl">
               <span className="text-3xl text-gray-500 font-medium mt-2 mb-2">Start at ₹</span>
               <span className="text-4xl font-bold text-primary mt-2 mb-2">{property.price}</span>
              </div>

                <div className="flex gap-2 mt-4">

                  <a 
                    href={`https://wa.me/7639302976?text=I'm%20interested%20in%20${property.title}%20at%20${property.location}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6 6.32A8.78 8.78 0 0 0 12.23 4c-4.83 0-8.75 3.92-8.75 8.73 0 1.54.4 3.04 1.15 4.36l-1.22 4.47 4.56-1.2a8.63 8.63 0 0 0 4.29 1.1h.01c4.82 0 8.74-3.93 8.74-8.74 0-2.33-.91-4.53-2.56-6.18zm-5.38 13.5h-.01a7.2 7.2 0 0 1-3.67-1l-.26-.16-2.74.72.73-2.65-.17-.28a7.26 7.26 0 0 1-1.11-3.84c0-4.02 3.28-7.3 7.31-7.3a7.3 7.3 0 0 1 7.3 7.31c0 4.02-3.27 7.3-7.3 7.3zm4-5.38c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.15.22-.57.72-.7.86-.13.14-.26.16-.48.05-.67-.33-1.39-.6-1.95-1.42-.14-.25-.03-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.11-.5-1.2-.69-1.65-.18-.43-.37-.37-.5-.38h-.44c-.15 0-.4.06-.6.28-.22.23-.82.8-.82 1.96 0 1.15.84 2.27.96 2.43.12.15 1.66 2.53 4.01 3.55.56.24 1 .39 1.34.5.56.18 1.08.15 1.48.09.45-.07 1.38-.57 1.58-1.12.2-.55.2-1.01.14-1.11-.06-.1-.22-.16-.44-.28z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Gallery */}
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative h-[400px] md:h-[500px] bg-muted rounded-lg overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {additionalImages.slice(0, 3).map((img, index) => (
                <div
                  key={index}
                  className={`relative h-32 bg-muted rounded-lg overflow-hidden cursor-pointer border-2 ${
                    activeImageIndex === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={img} 
                    alt={`Property view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Property Quick Facts */}
        <div className="container px-4 py-8 bg-gray-400 border rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Property Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {propertyFacts.map((fact, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-muted-foreground text-sm mb-2">{fact.label}</div>
                <div className="font-bold">{fact.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Property Highlights */}
        <div className="container px-4 py-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-6 text-center">Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 ">
                {propertyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-4">Property Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bedrooms</span>
                  <span className="font-medium">{property.beds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bathrooms</span>
                  <span className="font-medium">{property.baths}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area</span>
                  <span className="font-medium">{property.sqft} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{property.forSale ? 'For Sale' : 'For Rent'}</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Property Details Tabs */}
        <div className="container px-4 py-8">


              <h3 className="text-xl font-medium mb-4">OVERVIEW OF {property.title}</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This beautiful {property.type} in {property.location} offers exceptional living with {property.beds} bedrooms, 
                  {property.baths} bathrooms, and {property.sqft} square feet of space. The property features modern amenities, 
                  spacious rooms, and is conveniently located close to schools, shopping centers, and public transportation.
                </p>
                <p>
                  The well-designed layout includes a lovely kitchen, comfortable living areas, and ample storage space. 
                  Outside, you'll find beautiful landscaping and outdoor space perfect for relaxation or entertainment.
                </p>
                <p>
                  This property represents an excellent opportunity for both investors and homeowners looking for a quality residence
                  in a thriving neighborhood with strong potential for appreciation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {property.type?.toLowerCase() === 'house' && (<Card>
                  <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Bed className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Bedrooms</div>
                        <div className="font-medium">{property.beds}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
                {property.type?.toLowerCase() === 'house' && (<Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Bath className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Bathrooms</div>
                        <div className="font-medium">{property.baths}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500 p-3 rounded-full">
                        <MoveHorizontal className="h-6 w-6 text-white " />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Area</div>
                        <div className="font-medium">{property.sqft} sq.ft</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 p-3 rounded-full">
                        <BadgeCheck className="h-8 w-7 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Approved</div>
                        <div className="font-medium">DTCP & RERA Approved</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>



              {property.type?.toLowerCase() === 'house' && (<><h3 className="text-xl font-medium mb-6">Property Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                {propertyFeatures.slice(0, showAllFeatures ? propertyFeatures.length : 12).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              {propertyFeatures.length > 12 && (
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                >
                  {showAllFeatures ? "Show Less" : "Show All Features"}
                </Button>
              )}
              </>)}

                      {/*   
            <TabsContent value="amenities" className="py-6">
              <h3 className="text-xl font-medium mb-6">Property Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {propertyAmenities.map((amenity, index) => (
                  <Card
                    key={index}
                    className="border-none shadow-sm bg-gray-50 rounded-xl h-50 flex items-center justify-center"
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      
                      <img
                        src={amenity.img}
                        alt={amenity.name}
                        className="w-36 h-35 object-contain mb-3 border rounded-xl object-contain"
                      />
                      <div className="font-medium text-sm">{amenity.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
</TabsContent>
            
            <TabsContent value="location" className="py-6">
              <h3 className="text-xl font-medium mb-4">Location Information</h3>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                <iframe
                  src={property.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location Map"
                ></iframe>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Nearby Landmarks</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span>City Center - 3 km</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span>International Airport - 12 km</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span>Metro Station - 1.5 km</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span>Shopping Mall - 2 km</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span>School - 1 km</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
 */}
        </div>
        
        {/* Contact & Enquire Section */}
        <div className="container px-4 py-12 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Interested in this property?</h2>
              <p className="text-muted-foreground mb-6">
                Contact us today to schedule a visit or to learn more about this property.
                Our real estate professionals are ready to assist you with all your needs.
              </p>
              <div className="space-y-4">
                <PropertyEnquiryDialog 
                  propertyInfo={{ id: property.id, title: property.title, location: property.location }}
                  triggerElement={
                    <Button variant="default" className="w-full">
                      Enquire Now
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">+1 (234) 567-8900</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">123 Real Estate St, Property City</div>
                  </div>
                </div>
                <div className="pt-4">
                  <a 
                    href={`https://wa.me/1234567890?text=I'm%20interested%20in%20${property.title}%20at%20${property.location}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6 6.32A8.78 8.78 0 0 0 12.23 4c-4.83 0-8.75 3.92-8.75 8.73 0 1.54.4 3.04 1.15 4.36l-1.22 4.47 4.56-1.2a8.63 8.63 0 0 0 4.29 1.1h.01c4.82 0 8.74-3.93 8.74-8.74 0-2.33-.91-4.53-2.56-6.18zm-5.38 13.5h-.01a7.2 7.2 0 0 1-3.67-1l-.26-.16-2.74.72.73-2.65-.17-.28a7.26 7.26 0 0 1-1.11-3.84c0-4.02 3.28-7.3 7.31-7.3a7.3 7.3 0 0 1 7.3 7.31c0 4.02-3.27 7.3-7.3 7.3zm4-5.38c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.15.22-.57.72-.7.86-.13.14-.26.16-.48.05-.67-.33-1.39-.6-1.95-1.42-.14-.25-.03-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.11-.5-1.2-.69-1.65-.18-.43-.37-.37-.5-.38h-.44c-.15 0-.4.06-.6.28-.22.23-.82.8-.82 1.96 0 1.15.84 2.27.96 2.43.12.15 1.66 2.53 4.01 3.55.56.24 1 .39 1.34.5.56.18 1.08.15 1.48.09.45-.07 1.38-.57 1.58-1.12.2-.55.2-1.01.14-1.11-.06-.1-.22-.16-.44-.28z" />
                    </svg>
                    Connect via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="container px-4 py-12">
            <h2 className="text-2xl font-bold mb-8">Related Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard 
                      key={relatedProperty.id}
                      id={relatedProperty.id}
                      title={relatedProperty.title}
                      location={relatedProperty.location}
                      price={relatedProperty.price}
                      beds={relatedProperty.beds}
                      baths={relatedProperty.baths}
                      sqft={relatedProperty.sqft}
                      image={relatedProperty.image}
                      featured={relatedProperty.featured}
                      forSale={relatedProperty.forSale}
                      type={relatedProperty.type} _id={''}                />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;