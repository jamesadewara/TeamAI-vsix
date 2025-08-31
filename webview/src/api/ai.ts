import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const aiAPI = {
  generateCode: async (projectSlug: string, prompt: string, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/ai/projects/${projectSlug}/generate/`,
      { prompt },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  explainCode: async (projectSlug: string, code: string, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/ai/projects/${projectSlug}/explain/`,
      { code },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  refactorCode: async (projectSlug: string, code: string, instructions: string, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/ai/projects/${projectSlug}/refactor/`,
      { code, instructions },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};