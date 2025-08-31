export type PermissionMode = "suggest_first" | "auto_action";

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  avatar: string | null;
  is_verified: boolean;
  date_joined: string;
}

export interface UserSettings {
  default_permission_mode: PermissionMode;
  github_username: string;
  github_pat: string;
}

export interface AuthResponse {
  user: User;
  refresh: string;
  access: string;
}

export interface Project {
  id?: string;
  name?: string;
  slug?: string; 
  description?: string;
  visibility?: string;
  default_permission_mode?: PermissionMode; 
  created_at?: string;
  updated_at?: string;
  client?: User; 
  member_count?: number; 
  is_member?: boolean; 
  user_role?: string; 
}

export interface ProjectMembership {
  id?: string;
  project?: string;
  user?: string;
  user_details: User;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Repository {
  id: number;
  project: number;
  provider: string;
  name: string;
  default_branch: string;
  remote_url: string;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface AISession {
  id: number;
  name: string;
  project: number;
  created_at: string;
}

export interface ChatThread {
  id: number;
  title: string;
  project: number;
  created_at: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  password2: string;
  display_name?: string;
}
