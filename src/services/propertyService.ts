
import { Property } from '@/types/property';
import {baseURL} from '../content/url'



export const fetchAuthUser = async () => {
  const res = await fetch(`${baseURL}/api/auth/me`, {
    credentials: 'include', // important if auth uses cookies
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error("Unauthorized"); // ❌ Triggers error state
  }

  return data; // ✅ Return valid user data
};  
// Get all properties from localStorage
export const getProperties = async (): Promise<Property[]> => {
  const res = await fetch(`${baseURL}/api/prop/getProps`, {
    credentials: 'include', // if you're using cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const properties = await res.json();
  if (!res.ok) throw new Error('Failed to fetch properties');
  return properties;

};

// Save all properties to localStorage and dispatch an event
export const saveProperties = (properties: Property[]): void => {
  localStorage.setItem('properties', JSON.stringify(properties));
  
  // Dispatch a custom event that can be listened to by other components
  window.dispatchEvent(new Event('propertiesUpdated'));
};

// Add a new property
export const addProperty = async (property: Omit<Property, '_id'>) => {
  console.log(property)
  try {
    const res = await fetch(`${baseURL}/api/prop/props`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
      credentials: 'include',
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error ${res.status}: ${errorText}`);
      throw new Error(`Failed to add property: ${res.status}`);
    }
  
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Update an existing property
export const updateProperty = async (property: Property) => {
  const res = await fetch(`${baseURL}/api/prop/updateProps/${property._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update property');
  return res.json();
};

// Delete a property
export const deleteProperty = async (_id: string) => {
  const res = await fetch(`${baseURL}/api/prop/deleteProps/${_id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete property');
  return res.json();
};

export const logoutuser = async () => {
  const res = await fetch(`${baseURL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to logout property');
  return res.json();
};