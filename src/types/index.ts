
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export interface UsefulLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
}

export interface ChipInstance {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'heating';
  createdAt: Date;
}

export interface Settings {
  openaiApiKey: string;
  webhookUrl: string;
  evolutionApiKey: string;
  theme: 'dark' | 'light';
  language: 'pt' | 'en';
}

// Supabase-specific types for notes
export interface SupabaseNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}
