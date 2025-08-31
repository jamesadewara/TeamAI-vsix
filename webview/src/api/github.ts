import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const githubAPI = {
  getIntegrations: async (projectSlug: string, token: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/integrations/projects/${projectSlug}/github-links/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getRepos: async (token: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/integrations/github/repos/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  connectRepo: async (projectSlug: string, repoData: any, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/integrations/projects/${projectSlug}/github-links/`,
      repoData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  disconnectRepo: async (projectSlug: string, integrationId: number, token: string) => {
    await axios.delete(
      `${API_BASE_URL}/api/integrations/projects/${projectSlug}/github-links/${integrationId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  syncRepos: async (projectSlug: string, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/integrations/projects/${projectSlug}/github-sync/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  updateIntegration: async (projectSlug: string, integrationId: number, updateData: any, token: string) => {
    const response = await axios.patch(
      `${API_BASE_URL}/api/integrations/projects/${projectSlug}/github-links/${integrationId}/`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};