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
  webhookEvolutionUrl: string;
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

export type ClientStatus = 'prospect' | 'lead' | 'negotiation' | 'client' | 'inactive';
export type ClientCategory = 'individual' | 'company' | 'partner';

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  category: ClientCategory;
  notes?: string;
  value?: number;
  nextContactDate?: Date;
  lastContactDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface FinancialRecord {
  id: string;
  clientId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  category?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

