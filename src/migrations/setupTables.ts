
import { supabase } from '@/integrations/supabase/client';

/**
 * This script creates all the necessary tables for the Severino IA Central app.
 * Run this script once to initialize the database schema.
 */
export async function setupDatabase() {
  try {
    // Create profiles table
    const { error: profilesError } = await supabase.rpc('create_profiles_table');
    if (profilesError) {
      console.error('Error creating profiles table:', profilesError);
    } else {
      console.log('Profiles table created successfully');
    }
    
    // Create notes table
    const { error: notesError } = await supabase.rpc('create_notes_table');
    if (notesError) {
      console.error('Error creating notes table:', notesError);
    } else {
      console.log('Notes table created successfully');
    }
    
    // Create tasks table
    const { error: tasksError } = await supabase.rpc('create_tasks_table');
    if (tasksError) {
      console.error('Error creating tasks table:', tasksError);
    } else {
      console.log('Tasks table created successfully');
    }
    
    // Create links table
    const { error: linksError } = await supabase.rpc('create_links_table');
    if (linksError) {
      console.error('Error creating links table:', linksError);
    } else {
      console.log('Links table created successfully');
    }
    
    // Create ideas table
    const { error: ideasError } = await supabase.rpc('create_ideas_table');
    if (ideasError) {
      console.error('Error creating ideas table:', ideasError);
    } else {
      console.log('Ideas table created successfully');
    }
    
    // Create prompts table
    const { error: promptsError } = await supabase.rpc('create_prompts_table');
    if (promptsError) {
      console.error('Error creating prompts table:', promptsError);
    } else {
      console.log('Prompts table created successfully');
    }
    
    // Create chips table
    const { error: chipsError } = await supabase.rpc('create_chips_table');
    if (chipsError) {
      console.error('Error creating chips table:', chipsError);
    } else {
      console.log('Chips table created successfully');
    }
    
    // Create settings table
    const { error: settingsError } = await supabase.rpc('create_settings_table');
    if (settingsError) {
      console.error('Error creating settings table:', settingsError);
    } else {
      console.log('Settings table created successfully');
    }
    
    console.log('Database setup completed');
    
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}
