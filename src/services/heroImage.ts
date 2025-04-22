
import { Hero } from '@/types/heroImage';
import {baseURL} from '../content/url'




// Get all properties from localStorage
export const getHero = async (): Promise<Hero[]> => {
  const res = await fetch(`${baseURL}/api/hero/getHero`, {
    credentials: 'include', // if you're using cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const images = await res.json();
  if (!res.ok) throw new Error('Failed to fetch Images');
  return images;

};


// Add a new property
export const addHero = async (images: Omit<Hero, '_id'>) => {
  const res = await fetch(`${baseURL}/api/hero/heros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(images),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to add Images');
  return res.json();
};

// Update an existing property
export const updateHero = async (images: Hero) => {
  const res = await fetch(`${baseURL}/api/hero/updateHero/${images._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(images),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update Images');
  return res.json();
};

// Delete a property
export const deleteHero = async (_id: string) => {
  const res = await fetch(`${baseURL}/api/hero/deleteHero/${_id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete Images');
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