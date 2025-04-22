
import { cn } from '@/lib/utils';
import { useLazyImage } from '@/components/lib/animations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '@/types/property';



type PropertyCardProps = Property & {
  className?: string;
};

const PropertyCard = ({

  image,
  title,
  location,
  price,
  beds,
  baths,
  sqft,
  featured = false,
  forSale = true,
  residential = true,
  type,
  className,
  approved
}: PropertyCardProps) => {
  const [imageSrc, imageLoaded] = useLazyImage(image);

  return (
    <div 
      className={cn(
        "property-card overflow-hidden rounded-xl border bg-card text-card-foreground group shadow-sm",
        featured && "md:co1-2",
        className
      )}
    >
      <div className="flex flex-col">
        <div className="relative overflow-hidden aspect-[16/10]">
          <div 
            className={cn(
              "absolute inset-0 bg-muted/20 backdrop-blur-sm transition-opacity duration-500",
              imageLoaded ? "opacity-0" : "opacity-100"
            )}
          />
          <div 
            className="property-image h-full w-full bg-cover bg-center transition-transform duration-700"
            style={{
              backgroundImage: `url(${imageSrc})`,
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
          {featured && (
            <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary">
              Featured
            </Badge>
          )}


          <Badge className={cn(
            "absolute top-4 left-1/2 transform -translate-x-1/2", 
            residential ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          )}>
            {residential ? 'Residential' : 'Commercial'}
          </Badge>



          {type === 'plots' && (<Badge className={cn(
            "absolute top-4 right-4", 
            forSale ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          )}>
            {forSale ? 'For Sale' : 'Sold Out'}
          </Badge>)}
          {type !== 'plots' && (<Badge className={cn(
            "absolute top-4 right-4", 
            forSale ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          )}>
            {forSale ? 'For Sale' : 'For Rent'}
          </Badge>)}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-medium text-lg md:text-xl mb-1 tracking-tight">{title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mb-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{location}</span>
              </div>
              <div className="text-medium text-muted-foreground capitalize mb-3">
                {type}
              </div>
              
            </div>
 
            <div className="flex items-center gap-1">
               <span className="text-large text-gray-500 font-medium">From ₹</span>
                <span className="text-large font-medium">{price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-4 border-t">
          {type !== 'plots' && (
            <>
            <div className="text-center">
              <p className="text-muted-foreground text-xs mb-1">Beds</p>
              <p className="font-medium">{beds}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs mb-1">Baths</p> 
              <p className="font-medium">{baths}</p>
            </div> </>)}
            <div className="text-center">
              <p className="text-muted-foreground text-xs mb-1">Sq.Ft</p>
              <p className="font-medium">{sqft}</p>
            </div>
            {type === 'plots' && (<div className="text-center">
              <p className="text-muted-foreground text-xs mb-1">DTCP Approved</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          approved ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {approved ? 'Approved' : 'Pending'}
                        </span>
            </div>)}
            {type === 'plots' && ( <div className="text-center">
              <p className="text-muted-foreground text-xs mb-1">Type</p>
              <p className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
            </div>)}
          </div>

          
          <div className="mt-4 pt-4 border-t">
            <Button variant="default" asChild className="w-full">
              <Link to={`/property/${encodeURIComponent(title)}`}>Know More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
