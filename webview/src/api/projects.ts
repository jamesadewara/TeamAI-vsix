import api from "./auth";
import type { Project, ProjectMembership, Repository } from "../types";

export const projectsAPI = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get("/api/projects/");
    return response.data?.results || [];
  },

  getProject: async (slug: string): Promise<Project> => {
    const response = await api.get(`/api/projects/${slug}/`);
    return response.data;
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const response = await api.post("/api/projects/", projectData);
    return response.data;
  },

  updateProject: async (
    slug: string,
    projectData: Partial<Project>
  ): Promise<Project> => {
    const response = await api.put(`/api/projects/${slug}/`, projectData);
    return response.data;
  },

  deleteProject: async (slug: string): Promise<void> => {
    await api.delete(`/api/projects/${slug}/`);
  },

  getProjectMembers: async (slug: string): Promise<ProjectMembership[]> => {
    const response = await api.get(`/api/projects/${slug}/members/`);
      return response.data?.results || [];
  },

  addProjectMember: async (
    slug: string,
    memberData: { user: number; role: string }
  ): Promise<ProjectMembership> => {
    const response = await api.post(
      `/api/projects/${slug}/members/`,
      memberData
    );
    return response.data;
  },

  updateProjectMember: async (
    slug: string,
    memberId: number,
    role: string
  ): Promise<ProjectMembership> => {
    const response = await api.patch(
      `/api/projects/${slug}/members/${memberId}/`,
      { role }
    );
    return response.data;
  },

  removeProjectMember: async (
    slug: string,
    memberId: number
  ): Promise<void> => {
    await api.delete(`/api/projects/${slug}/members/${memberId}/`);
  },

  getProjectRepositories: async (slug: string): Promise<Repository[]> => {
    const response = await api.get(`/api/projects/${slug}/repositories/`);
    return response.data;
  },

  addProjectRepository: async (
    slug: string,
    repoData: Partial<Repository>
  ): Promise<Repository> => {
    const response = await api.post(
      `/api/projects/${slug}/repositories/`,
      repoData
    );
    return response.data;
  },

  updateProjectRepository: async (
    slug: string,
    repoId: number,
    repoData: Partial<Repository>
  ): Promise<Repository> => {
    const response = await api.put(
      `/api/projects/${slug}/repositories/${repoId}/`,
      repoData
    );
    return response.data;
  },

  deleteProjectRepository: async (
    slug: string,
    repoId: number
  ): Promise<void> => {
    await api.delete(`/api/projects/${slug}/repositories/${repoId}/`);
  },
};
