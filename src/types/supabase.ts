export interface SupabaseProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

export interface SupabaseSettings {
  id: string;
  openai_api_key?: string;
  evolution_api_key?: string;
  webhook_url?: string;
  webhook_evolution_url?: string;
  enable_notifications?: boolean;
  auto_save?: boolean;
}

export interface SupabaseNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date?: string;
  created_at: string;
  updated_at: string;
}
