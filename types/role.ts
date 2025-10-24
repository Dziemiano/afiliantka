export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by?: string;
  role?: Role;
}

export interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  user_metadata: Record<string, any>;
  roles: Role[];
}

export type Permission =
  | "manage_users"
  | "manage_files"
  | "manage_offers"
  | "view_analytics"
  | "view_offers"
  | "view_files";

export const PERMISSIONS: Record<Permission, string> = {
  manage_users: "Manage Users",
  manage_files: "Manage Files",
  manage_offers: "Manage Offers",
  view_analytics: "View Analytics",
  view_offers: "View Offers",
  view_files: "View Files",
};

export const DEFAULT_ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
} as const;
