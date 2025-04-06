
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
  try {
    // Check if the user already has settings
    const { data: existingSettings, error: settingsCheckError } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (settingsCheckError) {
      console.error('Error checking settings:', settingsCheckError);
      return { success: false, error: settingsCheckError };
    }
    
    if (!existingSettings) {
      // Create default settings
      const { error: createSettingsError } = await supabase
        .from('settings')
        .insert({
          user_id: userId,
          theme: 'dark',
          language: 'pt'
        });
        
      if (createSettingsError) {
        console.error('Error creating settings:', createSettingsError);
        return { success: false, error: createSettingsError };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing user data:', error);
    return { success: false, error };
  }
}

// Function to get user profile
export async function getUserProfile(userId: string) {
  try {
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
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Function to update user profile
export async function updateUserProfile(userId: string, profileData: Partial<SupabaseProfile>) {
  try {
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
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
}

// Function to get user settings
export async function getUserSettings(userId: string) {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
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
  } catch (error) {
    console.error('Error getting user settings:', error);
    return null;
  }
}

// Function to update user settings
export async function updateUserSettings(userId: string, settingsData: Partial<SupabaseSettings>) {
  try {
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
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { success: false, error };
  }
}

// Notes CRUD operations
export async function getNotes(userId: string) {
  try {
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
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
}

export async function getNote(noteId: string) {
  try {
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
  } catch (error) {
    console.error('Error getting note:', error);
    return null;
  }
}

export async function createNote(userId: string, note: { title: string; content: string }) {
  try {
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
  } catch (error) {
    console.error('Error creating note:', error);
    return { success: false, error };
  }
}

export async function updateNote(noteId: string, note: { title?: string; content?: string }) {
  try {
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
  } catch (error) {
    console.error('Error updating note:', error);
    return { success: false, error };
  }
}

export async function deleteNote(noteId: string) {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
      
    if (error) {
      console.error('Error deleting note:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error };
  }
}

// Tasks CRUD operations
export async function getTasks(userId: string) {
  try {
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
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
}

export async function createTask(userId: string, task: { title: string; description?: string; due_date?: string; status?: 'pending' | 'in-progress' | 'completed' }) {
  try {
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
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error };
  }
}

export async function updateTask(taskId: string, task: { title?: string; description?: string; due_date?: string; status?: 'pending' | 'in-progress' | 'completed' }) {
  try {
    const { error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', taskId);
      
    if (error) {
      console.error('Error updating task:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) {
      console.error('Error deleting task:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error };
  }
}

// Function to check and create database tables (called once at app initialization)
export async function checkAndCreateDatabaseStructure() {
  try {
    // Try a simple query to see if we can access the database
    const { error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('Error testing database access:', testError);
      return false;
    }
    
    // Run the setup script to create all tables
    const { setupDatabase } = await import('@/migrations/setupTables');
    const success = await setupDatabase();
    
    return success;
  } catch (error) {
    console.error('Error in database structure check:', error);
    return false;
  }
}

// Define similar CRUD operations for links, ideas, prompts, and chips when needed
