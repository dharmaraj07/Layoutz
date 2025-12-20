
export interface Visit {

_id: string;
name:string;
phone:string;
property: string;
people:number;
visitDate: Date | string;
status: 'Pending' | 'Confirmed';
createdAt: Date | string;
title:string;
review:string;

}