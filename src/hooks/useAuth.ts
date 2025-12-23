// hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import { fetchAuthUser, getProperties } from '../services/propertyService';
import { getCustomer } from '@/services/customerService';
import { getVisit } from '@/services/visitService';
import { getEnq } from '@/services/enqService';
import { getHero } from '@/services/heroImage';
import { getAgents } from '@/services/agentService';

export const useAuth = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: fetchAuthUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useProps = () => {
    return useQuery({
      queryKey: ['props'],
      queryFn: getProperties,
      retry: false,
      refetchOnWindowFocus: false,
    });
  };

  export const useCust = () => {
    return useQuery({
      queryKey: ['custs'],
      queryFn: getCustomer,
      retry: false,
      refetchOnWindowFocus: false,
    });
  };


  export const useVisit = () => {
    return useQuery({
      queryKey: ['visit'],
      queryFn: getVisit,
      retry: false,
      refetchOnWindowFocus: false,
    });
  };

  export const useEnq = () => {
    return useQuery({
      queryKey: ['enq'],
      queryFn: getEnq,
      retry: false,
      refetchOnWindowFocus: false,
    });
  };



  export const useHero = () => {
    return useQuery({
      queryKey: ['hero'],
      queryFn: getHero,
      retry: false,
      refetchOnWindowFocus: false,
    });
  };

  export const useAgents = () => {
    return useQuery({
      queryKey: ['agents'],
      queryFn: getAgents,
      retry: false,
      refetchOnWindowFocus: false,
    });
  };