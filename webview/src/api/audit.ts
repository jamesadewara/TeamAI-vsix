import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const auditAPI = {
  getLogs: async (projectSlug: string, token: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/audit/projects/${projectSlug}/logs/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};