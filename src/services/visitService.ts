
import { Visit } from "@/types/visit";
import {baseURL} from '../content/url'



// Get all customer from localStorage
export const getVisit = async (): Promise<Visit[]> => {
  const res = await fetch(`${baseURL}/api/visit/getVisit`, {
    credentials: 'include', // if you're using cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const visits = await res.json();
  if (!res.ok) throw new Error('Failed to fetch customer');
  return visits;

};

// Save all Visit to localStorage and dispatch an event
export const saveVisit = (visits: Visit[]): void => {
  localStorage.setItem('visits', JSON.stringify(visits));
  
  // Dispatch a custom event that can be listened to by other components
  window.dispatchEvent(new Event('visitsUpdated'));
};

// Add a new property
export const addVisit = async (visits: Omit<Visit, '_id'>) => {
  const res = await fetch(`${baseURL}/api/visit/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visits),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to add customer');
  return res.json();
};

// Update an existing property
export const updateVisit = async (visit: Visit) => {
  const res = await fetch(`${baseURL}/api/visit/updateVisit/${visit._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visit),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update Visit');
  return res.json();
};

export const updateallVisit = async (visitId: string, updatedFields: any) => {
  try {
    const res = await fetch(`${baseURL}/api/visit/updateVisit/${visitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields), // Send the updated fields here, not visitId
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Failed to update visit with ID ${visitId}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating visit:", error);
    throw error;
  }
};


// Delete a property
export const deleteVisit = async (_id: string) => {
  const res = await fetch(`${baseURL}/api/visit/deleteVisit/${_id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete Visit');
  return res.json();
};
  
