
import { Enq } from '@/types/enq';
import {baseURL} from '../content/url'



// Get all customer from localStorage
export const getEnq = async (): Promise<Enq[]> => {
  const res = await fetch(`${baseURL}/api/enq/getEnq`, {
    credentials: 'include', // if you're using cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const Enqs = await res.json();
  if (!res.ok) throw new Error('Failed to fetch customer');
  return Enqs;

};

// Save all Enq to localStorage and dispatch an event
export const saveEnq = (enqs: Enq[]): void => {
  localStorage.setItem('enqs', JSON.stringify(enqs));
  
  // Dispatch a custom event that can be listened to by other components
  window.dispatchEvent(new Event('EnqsUpdated'));
};

// Add a new property
export const addEnq = async (enqs: Omit<Enq, '_id'>) => {
  const res = await fetch(`${baseURL}/api/enq/enqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enqs),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to add customer');
  return res.json();
};

// Update an existing property
export const updateEnq = async (id: string, enqs: Partial<Enq>) => {
  const res = await fetch(`${baseURL}/api/enq/updateEnq/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enqs),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update Enq');
  return res.json();
};

export const updateallEnq = async (enqId: string, updatedFields: any) => {
  try {
    const res = await fetch(`${baseURL}/api/enq/updateEnq/${enqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields), // Send the updated fields here, not visitId
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Failed to update Enquiry with ID ${enqId}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating visit:", error);
    throw error;
  }
};


// Delete a property
export const deleteEnq = async (_id: string) => {
  const res = await fetch(`${baseURL}/api/enq/deleteEnq/${_id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete Enq');
  return res.json();
};
  
