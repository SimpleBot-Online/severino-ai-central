export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  userId: string;
}

export interface UsefulLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  createdAt: Date;
  userId: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
  userId: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  userId: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  userId: string;
}

export interface ChipInstance {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'heating';
  createdAt: Date;
  userId: string;
}

export interface Settings {
  openaiApiKey: string;
  webhookUrl: string;
  evolutionApiKey: string;
  theme: 'dark' | 'light';
  language: 'pt' | 'en';
  enableNotifications: boolean;
  autoSave: boolean;
  userId: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupabaseNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SupabaseTask {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  user_id: string;
}

export interface SupabaseLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  created_at: string;
  user_id: string;
}

export interface SupabaseIdea {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  created_at: string;
  user_id: string;
}

export interface SupabasePrompt {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  user_id: string;
}

export interface SupabaseChip {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'heating';
  created_at: string;
  user_id: string;
}

export interface SupabaseProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseSettings {
  id: string;
  openai_api_key: string | null;
  webhook_url: string | null;
  evolution_api_key: string | null;
  theme: 'dark' | 'light';
  language: 'pt' | 'en';
  enable_notifications: boolean;
  auto_save: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
