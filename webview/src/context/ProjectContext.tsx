import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { projectsAPI } from "../api/projects";
import type { Project, ProjectMembership, Repository } from "../types";

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  members: ProjectMembership[];
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProjectMembers: (slug: string) => Promise<void>;
  fetchProjectRepositories: (slug: string) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (slug: string, projectData: Partial<Project>) => Promise<Project>;
  deleteProject: (slug: string) => Promise<void>;
}

const defaultProjectContext: ProjectContextType = {
  projects: [],
  currentProject: null,
  setCurrentProject: () => {},
  members: [],
  repositories: [],
  loading: false,
  error: null,
  fetchProjects: async () => {},
  fetchProjectMembers: async () => {},
  fetchProjectRepositories: async () => {},
  createProject: async () => ({}) as Project,
  updateProject: async () => ({}) as Project,
  deleteProject: async () => {},
};

const ProjectContext = createContext<ProjectContextType>(defaultProjectContext);

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMembership[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await projectsAPI.getProjects();
      console.log(data);
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchProjectMembers = useCallback(async (slug: string) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await projectsAPI.getProjectMembers(slug);
      setMembers(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch project members"
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchProjectRepositories = useCallback(async (slug: string) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await projectsAPI.getProjectRepositories(slug);
      setRepositories(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch project repositories"
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const createProject = useCallback(async (
    projectData: Partial<Project>
  ): Promise<Project> => {
    if (!accessToken) throw new Error("Not authenticated");
    setError(null);
    try {
      const project = await projectsAPI.createProject(projectData);
      await fetchProjects();
      return project;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to create project";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [accessToken, fetchProjects]);

  const updateProject = useCallback(async (
    slug: string,
    projectData: Partial<Project>
  ): Promise<Project> => {
    if (!accessToken) throw new Error("Not authenticated");
    setError(null);
    try {
      const project = await projectsAPI.updateProject(slug, projectData);
      await fetchProjects();
      return project;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to update project";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [accessToken, fetchProjects]);

  const deleteProject = useCallback(async (slug: string): Promise<void> => {
    if (!accessToken) throw new Error("Not authenticated");
    setError(null);
    try {
      await projectsAPI.deleteProject(slug);
      await fetchProjects();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete project";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [accessToken, fetchProjects]);

  useEffect(() => {
    if (accessToken) {
      fetchProjects();
    }
  }, [accessToken, fetchProjects]);

  const value = {
    projects,
    currentProject,
    setCurrentProject,
    members,
    repositories,
    loading,
    error,
    fetchProjects,
    fetchProjectMembers,
    fetchProjectRepositories,
    createProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};