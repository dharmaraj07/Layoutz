export interface Enq {
    _id: string;
    name:string;
    phone:string;
    property: string;
    plotNumber?: string;
    review:string;
    completed:string;
    purchased:string;
    visitDate: Date | string;
    comment:string;
    followUPDate: Date | string;
    createdAt:Date | string;
    invest:boolean;
    assignedAgent?: any;
    status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'purchased' | 'invalid';
}


