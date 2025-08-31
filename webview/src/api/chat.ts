import api from "./auth";
import type { ChatThread, ChatMessage } from "../types";

export const chatAPI = {
  getThreads: async (projectId: string): Promise<ChatThread[]> => {
    const response = await api.get(`/api/chat/projects/${projectId}/threads/`);
    console.log(response.data);
    return response.data?.results || [];
  },

  createThread: async (
    projectId: string,
    threadData: {
      project: string;
      title: string;
      participants: string[];
      role?: string;
    }
  ): Promise<ChatThread> => {
    const response = await api.post(
      `/api/chat/projects/${projectId}/threads/`,
      threadData
    );
    return response.data;
  },

  getMessages: async (threadId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/api/chat/threads/${threadId}/messages/`);
    return response.data?.results || [];
  },

  sendMessage: async (
    threadId: string,
    messageData: { content: string }
  ): Promise<ChatMessage> => {
    const response = await api.post(
      `/api/chat/threads/${threadId}/messages/`,
      messageData
    );
    return response.data;
  },

  askAgent: async (threadId: string, message: string): Promise<ChatMessage> => {
    const response = await api.post(
      `/api/chat/threads/${threadId}/messages/ask_agent/`,
      { message }
    );
    return response.data;
  },
};
