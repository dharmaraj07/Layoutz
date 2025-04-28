
export interface Property {
    _id: string;
    title: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    mobileImage:string;
    image: string;
    propimage:string[];
    featured?: boolean;
    forSale: boolean;
    type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'villa' | 'plots';
    reraID:string;
    plotPremiumPrice:number,
    plotElitePrice:number,
    projectArea:string;
    totalPlots:number;
    approved:boolean;
    mapSrc:string;
    schools:string[];
    highlight:string[];
    college:string[];
    transit:string[];
    hospital:string[];
    restaurants:string[];
    youtubelink: string;
    residential:boolean;
  }
  