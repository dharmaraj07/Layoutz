import { baseURL } from '@/content/url';
import { Agent } from '@/types/agent';

export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await fetch(`${baseURL}/api/agent`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

export const getAgentById = async (id: string): Promise<Agent> => {
  try {
    const response = await fetch(`${baseURL}/api/agent/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch agent');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching agent:', error);
    throw error;
  }
};

export const createAgent = async (agent: Omit<Agent, '_id' | 'createdAt' | 'updatedAt'>): Promise<Agent> => {
  try {
    const response = await fetch(`${baseURL}/api/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(agent),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create agent');
    }
    return data;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<Agent> => {
  try {
    const response = await fetch(`${baseURL}/api/agent/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update agent');
    }
    return data;
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${baseURL}/api/agent/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete agent');
    }
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw error;
  }
};

export const assignEnquiryToAgent = async (enquiryId: string, agentId: string): Promise<any> => {
  try {
    const response = await fetch(`${baseURL}/api/agent/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ enquiryId, agentId }),
    });
    if (!response.ok) {
      throw new Error('Failed to assign enquiry');
    }
    return await response.json();
  } catch (error) {
    console.error('Error assigning enquiry:', error);
    throw error;
  }
};
