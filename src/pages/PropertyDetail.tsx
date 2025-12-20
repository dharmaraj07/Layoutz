import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Navbar from '@/components/NavBar';
import { PropertyEnquiry } from '@/components/PropertyEnquiry';
import PropertyHeroSection from '@/components/PropertyHeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import rera from '@/icons/icon1.png.webp';
import area from '@/icons/icon2.png.webp';
import unit from '@/icons/icon3.png.webp';
import size from '@/icons/icon4.png.webp';
import config from '@/icons/icon5.png.webp';
import price from '@/icons/icon6.png.webp';
import avenue from '@/image/avenue.png';
import cctv from '@/image/cctv.png';
import compound from '@/image/compund.png';
import drinageS from '@/image/drinage.png';
import electricityIcon from '@/image/electricity.jpeg';
import maintenance from '@/image/maintenance.png';
import readytoconstruct from '@/image/ready construct.png';
import road from '@/image/road.png';
import streetL from '@/image/streetlight.png';
import water from '@/image/waterconnection.png';
import { Property } from '@/types/property';
import { Bus, CheckCircle2, ChevronLeft, ChevronRight, GraduationCap, Hospital, MapPin, Minus, Phone, Plus, School, Utensils, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProps } from '../hooks/useAuth';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [properties, setProperties] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { data: propsData, isLoading, isError } = useProps();
  const [index, setIndex] = useState(0);
  const { title } = useParams<{ title: string }>();
  const decodedTitle = decodeURIComponent(title || '');
  const extractYouTubeID = (url: string): string | null => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
};


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
    { name: "Compound Wall", img: compound },
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
const categorizedLandmarks = {
  School: property.schools,
  College: property.college,
  Transit: property.transit,
  Hospital:property.hospital,
  Restaurants: property.restaurants,
};

const iconsMap = {
  School: <School className="h-4 w-4 text-primary" />,
  Transit: <Bus className="h-4 w-4 text-primary" />,
  College: <GraduationCap className="h-4 w-4 text-primary" />,
  Hospital: <Hospital className="h-4 w-4 text-primary" />,
  Restaurants: <Utensils className="h-4 w-4 text-primary" />,
};

const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const openSlideshow = (index) => {
    setActiveImageIndex(index);
    setIsSlideshowOpen(true);
  };

  const closeSlideshow = () => {
    setIsSlideshowOpen(false);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === property.propimage.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? property.propimage.length - 1 : prev - 1
    );
  };

  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Header />
      <PropertyHeroSection propertyId= {property._id}/>
       {/* Container for Item Section */}
  <div className="relative px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 md:-mt-10 lg:-mt-12">
    {/* This ensures grid is stacked vertically on mobile and flexed on larger screens */}
    <div className="bg-housing-700 rounded-xl shadow-lg max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center text-white">
        {/* Item 1 */}
        <div>
          <img src={config} className="mx-auto mb-2 h-8 sm:h-10" alt="Configurations" />
          <p className="font-bold mb-1 text-sm sm:text-base">Configurations</p>
          <p className="text-xs sm:text-sm">{property.residential ? "Residential Plots" : "Commercial Plots"}</p>
        </div>

        {/* Item 2 */}
        <div>
          <img src={area} className="mx-auto mb-2 h-8 sm:h-10" alt="Area" />
          <p className="font-bold mb-1 text-sm sm:text-base">Area</p>
          <p className="text-xs sm:text-sm">{property.projectArea} Acres</p>
        </div>

        {/* Item 3 */}
        <div>
          <img src={unit} className="mx-auto mb-2 h-8 sm:h-10" alt="Units" />
          <p className="font-bold mb-1 text-sm sm:text-base">No of Units</p>
          <p className="text-xs sm:text-sm">{property.totalPlots} Units</p>
        </div>

        {/* Item 4 */}
        <div>
          <img src={rera} className="mx-auto mb-2 h-8 sm:h-10" alt="RERA ID" />
          <p className="font-bold mb-1 text-sm sm:text-base">RERA ID</p>
          <p className="text-xs sm:text-sm">{property.reraID}</p>
        </div>

        {/* Item 5 */}
        <div>
          <img src={size} className="mx-auto mb-2 h-8 sm:h-10" alt="Size" />
          <p className="font-bold mb-1 text-sm sm:text-base">Available Size</p>
          <p className="text-xs sm:text-sm">{property.sqft} Sq.Ft Onwards</p>
        </div>

        {/* Item 6 */}
        <div>
          <img src={price} className="mx-auto mb-2 h-8 sm:h-10" alt="Price" />
          <p className="font-bold mb-1 text-sm sm:text-base">Plot Price</p>
          <p className="text-xs sm:text-sm">Rs {(property.sqft * property.plotElitePrice / 100000).toLocaleString()} Lakhs Onwards*</p>
        </div>
      </div>

      {/* Disclaimer Section */}
      <p className="text-white text-xs sm:text-sm mt-4 pl-2 sm:pl-4 leading-snug">
        <span className="font-semibold">NA*</span> - This project was approved before the implementation of the RERA act. Hence, RERA registration is not applicable.
      </p>
    </div>
  </div>

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
        <section className="pt-10 pb-10 bg-gray-100">
          <div className="container mx-auto px-4">
          <div className="flex flex-col justify-center items-center">
                <h1 className="text-3xl text-center max-w-5xl font-bold mb-4">
                  {property.title}– Secure Villa Plot Community Near {property.location}
                </h1>
                <p className="text-gray-700 max-w-5xl text-center mb-6">
                {property.title} is located at {property.location}. The Secured community is packed with world-class amenities for those seeking the best of everything.
                </p>
                </div>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column */}
              <div className="lg:w-1/2 text-center lg:text-left">

                <div className="relative h-[400px] md:h-[420px] bg-black rounded-lg overflow-hidden">
                    {property.youtubelink ?(

                      <div className="my-6 w-full max-w-3xl mx-auto">
                        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${extractYouTubeID(property.youtubelink)}?rel=0`}
                            title="Property Video Tour"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      </div>
                    ):( 
                    <img
                      src={property.propimage[activeImageIndex] || property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />)}
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:w-1/2">
                  <h2 className="text-2xl font-semibold mb-4">{property.title} Highlights</h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    {property.highlight?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <section className="pt-10 pb-10 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-2">
                <h3 className="text-3xl">PRICE TABLE</h3>
                <p className="text-gray-700 mt-2">
                  <span className="text-xl/2 ">D Layoutz Price: Rs. {property.plotElitePrice} /Sq.ft Onwards*</span>
                </p>
              </div>  

             {/* Mobile Table - optimized for small screens */}
              <div className="block lg:hidden w-full max-w-md mx-auto bg-housing-700 p-4 rounded shadow text-white text-sm space-y-4">
                {/* Type */}
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="font-medium">Type</span>
                  <span>{property.residential ? "Residential Plots" : "Commercial Plots"}</span>
                </div>

                {/* Plot Size */}
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="font-medium">Plot Size</span>
                  <span>{property.sqft} Sq.ft Onwards</span>
                </div>

                {/* Elite Plot Pricing */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-white/80 mb-2">Plots - Elite</p>
                  <div className="flex justify-between">
                    <span>Rate/Sq.Ft</span>
                    <span>Rs {property.plotElitePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span>Rs {(property.sqft * property.plotElitePrice / 100000).toLocaleString()} Lakhs Onwards*</span>
                  </div>
                </div>

                {/* Premium Plot Pricing */}
                {!!property.plotPremiumPrice && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-white/80 mb-2">Plots - Premium</p>
                  <div className="flex justify-between">
                    <span>Rate/Sq.Ft</span>
                    <span>Rs {property.plotPremiumPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span>Rs {(property.sqft * property.plotPremiumPrice / 100000).toLocaleString()} Lakhs Onwards*</span>
                  </div>
                </div>
                            )}
              </div>


              {/* Desktop Table */}
              <div className="hidden lg:block w-full max-w-5xl mx-auto bg-white border rounded-lg shadow overflow-hidden mt-8">
                <ul className="grid grid-cols-4 text-center font-semibold bg-housing-700 text-white py-2">
                  <li>Type</li>
                  <li>Plot Size</li>
                  <li>Rate Per Sq.Ft</li>
                  <li>Price</li>
                </ul>
                <ul className="grid grid-cols-4 text-center font-bold text-gray-700 py-4 border-t">
                  <li>Plots - Elite</li>
                  <li>{property.sqft} Sq.ft Onwards</li>
                  <li>Rs {property.plotElitePrice} /Sq.ft</li>
                  <li>Rs {(property.sqft * property.plotElitePrice/100000).toLocaleString()} Lakhs Onwards*</li>
                </ul>
                {!!property.plotPremiumPrice && (
                  <ul className="grid grid-cols-1 sm:grid-cols-4 text-center font-bold text-gray-700 py-2 sm:py-4 border-t text-[12px] sm:text-base gap-y-2">
                    <li className="hidden sm:block">Plots - Premium</li>
                    <li>{property.sqft} Sq.ft onwards</li>
                    <li>Rs {property.plotPremiumPrice} /Sq.ft</li>
                    <li>
                      Rs {(property.sqft * property.plotPremiumPrice / 100000).toLocaleString()} Lakhs Onwards*
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </section>
        
        {/* Property Gallery */}
        <div className="container px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold uppercase text-housing-700">Gallery</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        <div className="flex flex-row justify-center  gap-6">
          {property.propimage.slice(0, 10).map((img, index) => (
            <div
              key={index}
              className={`relative h-48 bg-muted rounded-lg overflow-hidden cursor-pointer border-2 ${
                activeImageIndex === index ? "border-primary" : "border-transparent"
              }`}
              onClick={() => openSlideshow(index)}
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

      {/* 🖼️ Slideshow Modal */}
      {isSlideshowOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
          {/* Close Button */}
          <button
            onClick={closeSlideshow}
            className="absolute top-4 right-4 text-white"
          >
            <X size={32} />
          </button>

          {/* Flex Container for Image + Arrows */}
          <div className="flex items-center justify-center gap-20  max-w-4xl w-full">
            {/* Left Arrow */}
            <button onClick={prevImage} className="text-white hover:text-gray-300">
              <ChevronLeft size={36} />
            </button>

            {/* Image */}
            <img
              src={property.propimage[activeImageIndex]}
              alt={`Slide ${activeImageIndex + 1}`}
              className="max-h-[80vh] w-auto rounded-lg shadow-lg object-contain"
            />

            {/* Right Arrow */}
            <button onClick={nextImage} className="text-white hover:text-gray-300">
              <ChevronRight size={36} />
            </button>
          </div>
        </div>
      )}
    </div>
{/* Why Choose Section */}
<section className="bg-housing-800 text-white py-10">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold uppercase mb-6 text-center">
      Why should you choose {property.title}?
    </h2>
    <div className="space-y-5 text-xl leading-relaxed">
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Proximity to public transportation areas and workplaces:</p>
        <p className="font-semibold/4">
          The location of D Layoutz  is close to public transport areas, entertainment avenues, and educational institutes.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-regular">Secured Community, Secure Life:</p>
        <p>
          With 24/7 CCTV surveillance and state-of-the-art infrastructure, your family will start their chapter rest assured with a top-tier quality of living. 
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold">State-of-the-art Infrastructure:</p>
        <p>
          Find features like blacktop roads and LED street lights. There is also the availability of internal roads, street lights, and 24×7 CCTV security. Design your dream house your way with the help of expert guidance that comes as a part of added services when you associate yourself with D Layoutz.
        </p>
      </div>
    </div>
  </div>
</section>

        {/* Property Details Tabs */}
        <div className="container px-4 py-8">

{/* 
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
              </div> */}
             



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
            <div className="rounded-lg border mt-4 bg-white-100">  
              <h3 className="text-2xl font-medium mb-6 mt-6 pl-10 text-center">Property Key Amenities</h3>
              <div className="grid  bg-white-100 md:grid-cols-4 gap-x-0 gap-y-0">
                {propertyAmenities.map((amenity, index) => (
                  <Card 
                    key={index}
                    className=" flex items-center justify-center bg-white-100 "
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      
                      <img
                        src={amenity.img}
                        alt={amenity.name}
                        className="w-55 h-50 mb-3 rounded-xl "
                      />
                      <div className="font-medium text-1.5xl">{amenity.name}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>  
              
            <div className="bg-muted rounded-lg mb-6 mt-6 border">
  <h3 className="text-2xl text-center mb-4 mt-4 font-semibold">
    LIFE AROUND {property.title}
  </h3>

  {/* Grid container with responsive column and order */}
  <div className="grid grid-cols-1 lg:[grid-template-columns:2fr_1fr] gap-4 px-4 lg:px-6">

    {/* Landmarks Section (appears first on mobile) */}
    <div className="order-1 lg:order-2">
      <h4 className="font-bold mb-4 text-lg text-center">Nearby Landmarks</h4>
      <ul className="space-y-4">
        {Object.entries(categorizedLandmarks).map(([category, items]) => (
          <li
            key={category}
            className="bg-black/30 border border-muted p-4 rounded-lg shadow-sm transition hover:shadow-md font-bold"
          >
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full text-left font-bold"
            >
              <div className="flex items-center gap-3">
                {iconsMap[category as keyof typeof iconsMap]}
                <span className="font-medium text-base">{category}</span>
              </div>
              {openCategory === category ? (
                <Minus className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Plus className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {openCategory === category && (
              <ul className="mt-3 ml-1 text-medium text-black-foreground space-y-1 list-disc list-inside">
                {items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>

    {/* Map Section */}
    <div className="order-2 lg:order-1">
      <iframe
        src={property.mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "350px" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Property Location Map"
      ></iframe>
    </div>
  </div>

              </div>
              
    </div>



        
        {/* Contact & Enquire Section */}
        <div className="container px-4 py-10 bg-housing-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Interested in this property?</h2>
              <p className="text-muted-foreground mb-6">
                Contact us today to schedule a visit or to learn more about this property.
                Our real estate professionals are ready to assist you with all your needs.
              </p>
              <div className="flex w-[145px]  bg-primary border rounded-lg">
                <PropertyEnquiry>
                <button

                >
                </button>
              </PropertyEnquiry>

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
                    <div className="font-medium">+91 7639302976</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">Pillanallur, Rasipuram, Namakkal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
       
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;