
import { Customer } from '@/types/customer';
import {baseURL} from '../content/url'



// Get all customer from localStorage
export const getCustomer = async (): Promise<Customer[]> => {
  const res = await fetch(`${baseURL}/api/cust/getCust`, {
    credentials: 'include', // if you're using cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const customers = await res.json();
  if (!res.ok) throw new Error('Failed to fetch customer');
  return customers;

};

// Save all Customer to localStorage and dispatch an event
export const saveCustomer = (customers: Customer[]): void => {
  localStorage.setItem('customers', JSON.stringify(customers));
  
  // Dispatch a custom event that can be listened to by other components
  window.dispatchEvent(new Event('customersUpdated'));
};

// Add a new property
export const addCustomer = async (customers: Omit<Customer, '_id'>) => {
  const res = await fetch(`${baseURL}/api/cust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customers),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to add customer');
  return res.json();
};

//Bulk Upload

export const addBulkCustomer = async (customers: Omit<Customer, '_id'>[]): Promise<void> => {
  const res = await fetch(`${baseURL}/api/cust/addBulkCust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customers),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to add customer');
  return res.json();
};

// Update an existing property
export const updateCustomer = async (customers: Customer) => {
  const res = await fetch(`${baseURL}/api/cust/updateCust/${customers._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customers),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update Customer');
  return res.json();
};

// Delete a property
export const deleteCustomer = async (_id: string) => {
  const res = await fetch(`${baseURL}/api/cust/deleteCust/${_id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete Customer');
  return res.json();
};
  
