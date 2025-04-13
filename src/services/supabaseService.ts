import { createClient } from '@supabase/supabase-js';
import {
  Note, Task, UsefulLink, Idea, Prompt, ChipInstance,
  Settings, Client, FinancialRecord, ClientStatus, ClientCategory
} from '../types';
import { showSuccess, showError } from './notificationService';

// Initialize Supabase client
const supabaseUrl = 'https://xjiztflszodhvwkomqhf.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// User Authentication
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// Notes CRUD operations
export const getNotes = async (userId: string) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Note[];
};

export const getNote = async (noteId: string) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single();

  if (error) throw error;
  return data as Note;
};

export const createNote = async (userId: string, note: { title: string; content: string }) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        ...note,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }])
      .select();

    if (error) throw error;
    showSuccess('Nota criada', 'Sua nota foi criada com sucesso.');
    return data[0] as Note;
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    showError('Erro ao criar nota', 'Ocorreu um erro ao criar sua nota.');
    throw error;
  }
};

export const updateNote = async (noteId: string, updates: { title?: string; content?: string }) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update({
        ...updates,
        updatedAt: new Date()
      })
      .eq('id', noteId)
      .select();

    if (error) throw error;
    showSuccess('Nota atualizada', 'Sua nota foi atualizada com sucesso.');
    return data[0] as Note;
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    showError('Erro ao atualizar nota', 'Ocorreu um erro ao atualizar sua nota.');
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
    showSuccess('Nota excluída', 'Sua nota foi excluída com sucesso.');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir nota:', error);
    showError('Erro ao excluir nota', 'Ocorreu um erro ao excluir sua nota.');
    throw error;
  }
};

// Tasks CRUD operations
export const getTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Task[];
};

export const getTask = async (taskId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data as Task;
};

export const createTask = async (userId: string, task: { title: string; description?: string; dueDate?: string; status?: 'pending' | 'in-progress' | 'completed' }) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...task,
      userId,
      createdAt: new Date()
    }])
    .select();

  if (error) throw error;
  return data[0] as Task;
};

export const updateTask = async (taskId: string, updates: { title?: string; description?: string; dueDate?: string; status?: 'pending' | 'in-progress' | 'completed' }) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select();

  if (error) throw error;
  return data[0] as Task;
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
  return { success: true };
};

// Settings operations
export const getUserSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, create default settings
      return createDefaultSettings(userId);
    }
    throw error;
  }

  return data as Settings;
};

export const updateUserSettings = async (userId: string, settings: Partial<Settings>) => {
  try {
    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('settings')
      .select('*')
      .eq('userId', userId)
      .single();

    if (!existingSettings) {
      // Create new settings
      const { data, error } = await supabase
        .from('settings')
        .insert([{
          ...settings,
          userId
        }])
        .select();

      if (error) throw error;
      showSuccess('Configurações salvas', 'Suas configurações foram salvas com sucesso.');
      return data[0] as Settings;
    } else {
      // Update existing settings
      const { data, error } = await supabase
        .from('settings')
        .update(settings)
        .eq('userId', userId)
        .select();

      if (error) throw error;
      showSuccess('Configurações salvas', 'Suas configurações foram salvas com sucesso.');
      return data[0] as Settings;
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    showError('Erro ao salvar configurações', 'Ocorreu um erro ao salvar suas configurações.');
    throw error;
  }
};

const createDefaultSettings = async (userId: string) => {
  const defaultSettings: Settings = {
    openaiApiKey: '',
    webhookUrl: '',
    evolutionApiKey: '',
    webhookEvolutionUrl: '',
    theme: 'dark',
    language: 'pt',
    enableNotifications: false,
    autoSave: true,
    userId
  };

  const { data, error } = await supabase
    .from('settings')
    .insert([defaultSettings])
    .select();

  if (error) throw error;
  return data[0] as Settings;
};

// Client CRUD operations
export const getClients = async (userId: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Client[];
};

export const getClientsByStatus = async (userId: string, status: ClientStatus) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('userId', userId)
    .eq('status', status)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Client[];
};

export const createClient = async (userId: string, client: { name: string; status: ClientStatus; category: ClientCategory; [key: string]: any }) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([{
      ...client,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    .select();

  if (error) throw error;
  return data[0] as Client;
};

export const updateClient = async (clientId: string, updates: Partial<Client>) => {
  const { data, error } = await supabase
    .from('clients')
    .update({
      ...updates,
      updatedAt: new Date()
    })
    .eq('id', clientId)
    .select();

  if (error) throw error;
  return data[0] as Client;
};

export const deleteClient = async (clientId: string) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) throw error;
  return { success: true };
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Check if tables exist and create them if they don't
    await createTablesIfNotExist();
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const createTablesIfNotExist = async () => {
  // This would typically be done through Supabase migrations or dashboard
  // For this implementation, we'll assume tables are created in the Supabase dashboard
  console.log('Tables should be created in the Supabase dashboard');
  return { success: true };
};

// Function to migrate data from localStorage to Supabase
export const migrateDataToSupabase = async (userId: string) => {
  try {
    // Get data from localStorage
    const notesData = localStorage.getItem('severino-notes-storage');
    const tasksData = localStorage.getItem('severino-tasks-storage');
    const linksData = localStorage.getItem('severino-links-storage');
    const ideasData = localStorage.getItem('severino-ideas-storage');
    const settingsData = localStorage.getItem('severino-settings-storage');
    const clientsData = localStorage.getItem('severino-clients-storage');

    // Migrate notes
    if (notesData) {
      const notes = JSON.parse(notesData).state.notes;
      for (const note of notes) {
        await supabase.from('notes').insert([{
          ...note,
          userId
        }]);
      }
    }

    // Migrate tasks
    if (tasksData) {
      const tasks = JSON.parse(tasksData).state.tasks;
      for (const task of tasks) {
        await supabase.from('tasks').insert([{
          ...task,
          userId
        }]);
      }
    }

    // Migrate links
    if (linksData) {
      const links = JSON.parse(linksData).state.links;
      for (const link of links) {
        await supabase.from('links').insert([{
          ...link,
          userId
        }]);
      }
    }

    // Migrate ideas
    if (ideasData) {
      const ideas = JSON.parse(ideasData).state.ideas;
      for (const idea of ideas) {
        await supabase.from('ideas').insert([{
          ...idea,
          userId
        }]);
      }
    }

    // Migrate settings
    if (settingsData) {
      const settings = JSON.parse(settingsData).state.settings;
      await supabase.from('settings').insert([{
        ...settings,
        userId
      }]);
    }

    // Migrate clients
    if (clientsData) {
      const clients = JSON.parse(clientsData).state.clients;
      for (const client of clients) {
        await supabase.from('clients').insert([{
          ...client,
          userId
        }]);
      }
    }

    showSuccess('Migração concluída', 'Seus dados foram migrados com sucesso para o banco de dados Supabase.');
    return { success: true };
  } catch (error) {
    console.error('Error migrating data to Supabase:', error);
    showError('Erro na migração', 'Ocorreu um erro ao migrar seus dados para o Supabase.');
    throw error;
  }
};

export default supabase;
