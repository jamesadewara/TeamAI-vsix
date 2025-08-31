export type PermissionMode = "suggest_first" | "auto_action";

export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar: string | null;
  is_verified: boolean;
  date_joined: string;
}

export interface UserSettings {
  default_permission_mode?: PermissionMode;
  github_username?: string;
  github_pat?: string;
}

export interface AuthResponse {
  user: User;
  refresh: string;
  access: string;
}

export interface Project {
  id: string;
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
  id: string;
  project: string;
  provider: string;
  name: string;
  default_branch: string;
  remote_url: string;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface AISession {
  id: string;
  name: string;
  project: number;
  created_at: string;
}

export interface ChatThread {
  id?: string;
  project?: string;
  role?: string;
  title?: string;
  created_by?: User;
  participants?: string[];
  participant_count?: number;
  message_count?: number;
  last_message?: {
    content: string;
    sender_type: string;
    created_at: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  thread: string;
  sender_user: string | null;
  sender_agent_role: string | null;
  sender_type: string;
  content: string;
  meta: Record<string, any>;
  action_refs: any[];
  sender_details: User | { role: string } | null;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  private: boolean;
}

export interface GitHubIntegration {
  id: string;
  repo_name: string;
  repo_url: string;
  connected_at: string;
  sync_enabled: boolean;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  password2: string;
  display_name?: string;
}
