import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const aiSessionsAPI = {
  getSessions: async (projectSlug: string, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/ai/projects/${projectSlug}/sessions/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createSession: async (projectSlug: string, sessionData: any, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/ai/projects/${projectSlug}/sessions/`, sessionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateSessionStatus: async (projectSlug: string, sessionId: number, statusData: any, token: string) => {
    const response = await axios.patch(
      `${API_BASE_URL}/api/ai/projects/${projectSlug}/sessions/${sessionId}/`,
      statusData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  deleteSession: async (projectSlug: string, sessionId: number, token: string) => {
    await axios.delete(`${API_BASE_URL}/api/ai/projects/${projectSlug}/sessions/${sessionId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};