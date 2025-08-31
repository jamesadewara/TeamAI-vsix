import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const chatAPI = {
  getMessages: async (projectSlug: string, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/chat/projects/${projectSlug}/threads/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  sendMessage: async (projectSlug: string, messageData: any, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/projects/${projectSlug}/threads/`,
      messageData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getAIResponse: async (projectSlug: string, message: string, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/ai/projects/${projectSlug}/respond/`,
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};