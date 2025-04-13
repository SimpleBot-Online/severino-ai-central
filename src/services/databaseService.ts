
import { Settings } from '@/types';
import { useNotesStore, useTasksStore, useLinksStore, useIdeasStore, usePromptsStore, useChipInstancesStore, useSettingsStore } from '@/store/dataStore';

// Funções simplificadas que usam o Zustand em vez do Supabase

// Função para inicializar dados do usuário (não faz nada, apenas retorna sucesso)
export async function initializeUserData(userId: string) {
  console.log('Inicializando dados para o usuário:', userId);
  return { success: true };
}

// Função para obter perfil do usuário
export async function getUserProfile(userId: string) {
  return {
    id: userId,
    username: 'admin',
    full_name: 'Administrador',
    avatar_url: null,
    updated_at: new Date().toISOString()
  };
}

// Função para atualizar perfil do usuário
export async function updateUserProfile(userId: string, profileData: any) {
  console.log('Atualizando perfil para:', userId, profileData);
  return { success: true };
}

// Função para obter configurações do usuário
export async function getUserSettings(userId: string) {
  const settings = useSettingsStore.getState().settings;
  return settings;
}

// Função para atualizar configurações do usuário
export async function updateUserSettings(userId: string, settingsData: Partial<Settings>) {
  useSettingsStore.getState().updateSettings(settingsData);
  return { success: true };
}

// Operações CRUD para notas
export async function getNotes(userId: string) {
  return useNotesStore.getState().notes;
}

export async function getNote(noteId: string) {
  const notes = useNotesStore.getState().notes;
  return notes.find(note => note.id === noteId) || null;
}

export async function createNote(userId: string, note: { title: string; content: string }) {
  useNotesStore.getState().addNote(note.title, note.content);
  return { success: true };
}

export async function updateNote(noteId: string, note: { title?: string; content?: string }) {
  if (note.title && note.content) {
    useNotesStore.getState().updateNote(noteId, note.title, note.content);
  }
  return { success: true };
}

export async function deleteNote(noteId: string) {
  useNotesStore.getState().deleteNote(noteId);
  return { success: true };
}

// Operações CRUD para tarefas
export async function getTasks(userId: string) {
  return useTasksStore.getState().tasks;
}

export async function getTask(taskId: string) {
  const tasks = useTasksStore.getState().tasks;
  return tasks.find(task => task.id === taskId) || null;
}

export async function createTask(userId: string, task: { title: string; description?: string; due_date?: string; status?: 'pending' | 'in-progress' | 'completed' }) {
  useTasksStore.getState().addTask(task.title, task.description, task.due_date);
  return { success: true };
}

export async function updateTask(taskId: string, task: { title?: string; description?: string; due_date?: string; status?: 'pending' | 'in-progress' | 'completed' }) {
  useTasksStore.getState().updateTask(taskId, task);
  return { success: true };
}

export async function deleteTask(taskId: string) {
  useTasksStore.getState().deleteTask(taskId);
  return { success: true };
}

// Operações CRUD para links
export async function getLinks(userId: string) {
  return useLinksStore.getState().links;
}

export async function getLink(linkId: string) {
  const links = useLinksStore.getState().links;
  return links.find(link => link.id === linkId) || null;
}

export async function createLink(userId: string, link: { title: string; url: string; description?: string; category?: string }) {
  useLinksStore.getState().addLink(link.title, link.url, link.description, link.category);
  return { success: true };
}

export async function updateLink(linkId: string, link: { title?: string; url?: string; description?: string; category?: string }) {
  useLinksStore.getState().updateLink(linkId, link);
  return { success: true };
}

export async function deleteLink(linkId: string) {
  useLinksStore.getState().deleteLink(linkId);
  return { success: true };
}

// Operações CRUD para ideias
export async function getIdeas(userId: string) {
  return useIdeasStore.getState().ideas;
}

export async function getIdea(ideaId: string) {
  const ideas = useIdeasStore.getState().ideas;
  return ideas.find(idea => idea.id === ideaId) || null;
}

export async function createIdea(userId: string, idea: { title: string; description?: string; category?: string }) {
  useIdeasStore.getState().addIdea(idea.title, idea.description || '', idea.category || '');
  return { success: true };
}

export async function updateIdea(ideaId: string, idea: { title?: string; description?: string; category?: string }) {
  useIdeasStore.getState().updateIdea(ideaId, idea);
  return { success: true };
}

export async function deleteIdea(ideaId: string) {
  useIdeasStore.getState().deleteIdea(ideaId);
  return { success: true };
}

// Operações CRUD para prompts
export async function getPrompts(userId: string) {
  return usePromptsStore.getState().prompts;
}

export async function getPrompt(promptId: string) {
  const prompts = usePromptsStore.getState().prompts;
  return prompts.find(prompt => prompt.id === promptId) || null;
}

export async function createPrompt(userId: string, prompt: { title: string; content: string; category?: string }) {
  usePromptsStore.getState().addPrompt(prompt.title, prompt.content, prompt.category || '');
  return { success: true };
}

export async function updatePrompt(promptId: string, prompt: { title?: string; content?: string; category?: string }) {
  usePromptsStore.getState().updatePrompt(promptId, prompt);
  return { success: true };
}

export async function deletePrompt(promptId: string) {
  usePromptsStore.getState().deletePrompt(promptId);
  return { success: true };
}

// Operações CRUD para chips
export async function getChips(userId: string) {
  return useChipInstancesStore.getState().instances;
}

export async function getChip(chipId: string) {
  const chips = useChipInstancesStore.getState().instances;
  return chips.find(chip => chip.id === chipId) || null;
}

export async function createChip(userId: string, chip: { name: string; phone: string }) {
  useChipInstancesStore.getState().addInstance(chip.name, chip.phone);
  return { success: true };
}

export async function updateChip(chipId: string, chip: { name?: string; phone?: string; status?: 'active' | 'inactive' | 'heating' }) {
  useChipInstancesStore.getState().updateInstance(chipId, chip);
  return { success: true };
}

export async function deleteChip(chipId: string) {
  useChipInstancesStore.getState().deleteInstance(chipId);
  return { success: true };
}

// Função para verificar e criar estrutura do banco de dados (simulada)
export async function checkAndCreateDatabaseStructure() {
  // Verificar se os stores do Zustand estão inicializados
  const stores = [
    'severino-notes-storage',
    'severino-tasks-storage',
    'severino-links-storage',
    'severino-ideas-storage',
    'severino-prompts-storage',
    'severino-chip-instances-storage',
    'severino-settings-storage',
    'severino-auth-storage'
  ];

  // Verificar se cada store existe no localStorage
  stores.forEach(storeName => {
    if (!localStorage.getItem(storeName)) {
      // Inicializar o store vazio para garantir que ele exista
      localStorage.setItem(storeName, JSON.stringify({ state: {} }));
    }
  });

  // Simular um pequeno atraso para dar tempo de carregar
  await new Promise(resolve => setTimeout(resolve, 300));

  return true;
}
