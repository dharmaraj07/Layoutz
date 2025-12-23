export interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  stats?: {
    totalEnquiries: number;
    convertedEnquiries: number;
    activeEnquiries: number;
    enquiries: any[];
  };
}
