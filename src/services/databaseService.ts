
import { supabase } from '@/integrations/supabase/client';
import { 
  SupabaseNote, 
  SupabaseTask, 
  SupabaseLink, 
  SupabaseIdea, 
  SupabasePrompt, 
  SupabaseChip, 
  SupabaseProfile, 
  SupabaseSettings 
} from '@/types';

// Function to initialize user data (create default settings, etc.)
export async function initializeUserData(userId: string) {
  // Check if the user already has settings
  const { data: existingSettings } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (!existingSettings) {
    // Create default settings
    await supabase
      .from('settings')
      .insert({
        user_id: userId,
        theme: 'dark',
        language: 'pt'
      });
  }
  
  return { success: true };
}

// Function to get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as SupabaseProfile;
}

// Function to update user profile
export async function updateUserProfile(userId: string, profileData: Partial<SupabaseProfile>) {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
  
  return { success: true };
}

// Function to get user settings
export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user settings:', error);
    // If no settings exist, create default settings
    if (error.code === 'PGRST116') {
      const { success } = await initializeUserData(userId);
      if (success) {
        return getUserSettings(userId);
      }
    }
    return null;
  }
  
  return data as SupabaseSettings;
}

// Function to update user settings
export async function updateUserSettings(userId: string, settingsData: Partial<SupabaseSettings>) {
  const { error } = await supabase
    .from('settings')
    .update({
      ...settingsData,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error updating user settings:', error);
    return { success: false, error };
  }
  
  return { success: true };
}

// Notes CRUD operations
export async function getNotes(userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
  
  return data as SupabaseNote[];
}

export async function getNote(noteId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single();
    
  if (error) {
    console.error('Error fetching note:', error);
    return null;
  }
  
  return data as SupabaseNote;
}

export async function createNote(userId: string, note: { title: string; content: string }) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      title: note.title,
      content: note.content
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating note:', error);
    return { success: false, error };
  }
  
  return { success: true, data: data as SupabaseNote };
}

export async function updateNote(noteId: string, note: { title?: string; content?: string }) {
  const { error } = await supabase
    .from('notes')
    .update({
      ...note,
      updated_at: new Date().toISOString()
    })
    .eq('id', noteId);
    
  if (error) {
    console.error('Error updating note:', error);
    return { success: false, error };
  }
  
  return { success: true };
}

export async function deleteNote(noteId: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);
    
  if (error) {
    console.error('Error deleting note:', error);
    return { success: false, error };
  }
  
  return { success: true };
}

// Tasks CRUD operations
export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  
  return data as SupabaseTask[];
}

export async function createTask(userId: string, task: { title: string; description?: string; due_date?: string; status?: 'pending' | 'in-progress' | 'completed' }) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: task.title,
      description: task.description || null,
      due_date: task.due_date || null,
      status: task.status || 'pending'
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating task:', error);
    return { success: false, error };
  }
  
  return { success: true, data: data as SupabaseTask };
}

export async function updateTask(taskId: string, task: { title?: string; description?: string; due_date?: string; status?: 'pending' | 'in-progress' | 'completed' }) {
  const { error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', taskId);
    
  if (error) {
    console.error('Error updating task:', error);
    return { success: false, error };
  }
  
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
    
  if (error) {
    console.error('Error deleting task:', error);
    return { success: false, error };
  }
  
  return { success: true };
}

// Define similar CRUD operations for links, ideas, prompts, and chips

// Function to check and create database tables (should be called once during app initialization)
export async function checkAndCreateDatabaseStructure() {
  try {
    // Get the list of tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (error) {
      console.error('Error checking database tables:', error);
      return false;
    }
    
    // Check if required tables exist
    const tableNames = data.map(item => item.table_name);
    const requiredTables = ['profiles', 'notes', 'tasks', 'links', 'ideas', 'prompts', 'chips', 'settings'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.warn('Missing tables:', missingTables);
      // Import and run the setup script if tables are missing
      const { setupDatabase } = await import('@/migrations/setupTables');
      await setupDatabase();
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in database structure check:', error);
    return false;
  }
}
