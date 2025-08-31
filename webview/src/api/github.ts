import api from "./auth";
import type { GitHubRepo, GitHubIntegration } from "../types";

export const githubAPI = {
  getIntegrations: async (projectId: string): Promise<GitHubIntegration[]> => {
    const response = await api.get(
      `/api/integrations/projects/${projectId}/github/`
    );
    return response.data;
  },

  getRepos: async (): Promise<GitHubRepo[]> => {
    const response = await api.get("/api/integrations/github/repos/");
    return response.data;
  },

  connectRepo: async (
    projectId: string,
    repoData: { repo_name: string; repo_url: string }
  ): Promise<GitHubIntegration> => {
    const response = await api.post(
      `/api/integrations/projects/${projectId}/github/`,
      repoData
    );
    return response.data;
  },

  disconnectRepo: async (
    projectId: string,
    integrationId: string
  ): Promise<void> => {
    await api.delete(
      `/api/integrations/projects/${projectId}/github/${integrationId}/`
    );
  },

  syncRepos: async (projectId: string): Promise<void> => {
    await api.post(`/api/integrations/projects/${projectId}/github/sync/`);
  },

  updateIntegration: async (
    projectId: string,
    integrationId: string,
    updateData: Partial<GitHubIntegration>
  ): Promise<GitHubIntegration> => {
    const response = await api.patch(
      `/api/integrations/projects/${projectId}/github/${integrationId}/`,
      updateData
    );
    return response.data;
  },
};
