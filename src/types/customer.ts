
export interface Customer {
    _id: string;
    name: string;
    job: string;
    img: string;
    review: string;
    rating: number;
    videolink: string;
    phone:string;
    location:string;
    property:string;
    plotNum:string;
    custType:'enquiry' | 'purchase' | 'justvisit';
    visitDate:Date | string;
    nextVisitDate:Date | string;
  }
  