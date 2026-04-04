export type User = {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  is_verified: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  last_login: Date | null;
};

export type ActionLog = {
  id: number;
  user_id: number;
  action_type: string;
  action_details?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: Date | null;
};

export enum ActionType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  FAILED_LOGIN = 'FAILED_LOGIN',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  API_CALL = 'API_CALL',
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
