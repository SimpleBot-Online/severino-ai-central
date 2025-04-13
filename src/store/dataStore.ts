import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  Note, Task, UsefulLink, Idea, ChatMessage, Prompt, ChipInstance, Settings,
  Client, FinancialRecord, ClientStatus, ClientCategory
} from '../types';

// Notes Store
interface NotesState {
  notes: Note[];
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
}

const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (title, content) => {
        const newNote: Note = {
          id: uuidv4(),
          title,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'admin'
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
      },
      updateNote: (id, title, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, title, content, updatedAt: new Date() } : note
          ),
        }));
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
    }),
    { name: 'severino-notes-storage' }
  )
);

// Tasks Store
interface TasksState {
  tasks: Task[];
  addTask: (title: string, description: string, dueDate: Date) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
}

const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, description, dueDate) => {
        const newTask: Task = {
          id: uuidv4(),
          title,
          description,
          dueDate,
          status: 'pending',
          createdAt: new Date(),
          userId: 'admin'
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },
      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
    }),
    { name: 'severino-tasks-storage' }
  )
);

// Useful Links Store
interface LinksState {
  links: UsefulLink[];
  addLink: (title: string, url: string, description: string, category: string) => void;
  updateLink: (id: string, updates: Partial<UsefulLink>) => void;
  deleteLink: (id: string) => void;
}

const useLinksStore = create<LinksState>()(
  persist(
    (set) => ({
      links: [],
      addLink: (title, url, description, category) => {
        const newLink: UsefulLink = {
          id: uuidv4(),
          title,
          url,
          description,
          category,
          createdAt: new Date(),
          userId: 'admin'
        };
        set((state) => ({ links: [newLink, ...state.links] }));
      },
      updateLink: (id, updates) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updates } : link
          ),
        }));
      },
      deleteLink: (id) => {
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        }));
      },
    }),
    { name: 'severino-links-storage' }
  )
);

// Ideas Store
interface IdeasState {
  ideas: Idea[];
  addIdea: (title: string, description: string, category: string) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
}

const useIdeasStore = create<IdeasState>()(
  persist(
    (set) => ({
      ideas: [],
      addIdea: (title, description, category) => {
        const newIdea: Idea = {
          id: uuidv4(),
          title,
          description,
          category,
          createdAt: new Date(),
          userId: 'admin'
        };
        set((state) => ({ ideas: [newIdea, ...state.ideas] }));
      },
      updateIdea: (id, updates) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id ? { ...idea, ...updates } : idea
          ),
        }));
      },
      deleteIdea: (id) => {
        set((state) => ({
          ideas: state.ideas.filter((idea) => idea.id !== id),
        }));
      },
    }),
    { name: 'severino-ideas-storage' }
  )
);

// Chat Store
interface ChatState {
  messages: ChatMessage[];
  addMessage: (sender: string, content: string) => void;
  clearMessages: () => void;
  sendWebhookMessage: (content: string, webhookUrl: string) => Promise<void>;
}

const useChatStore = create<ChatState>()(persist((set) => ({
  messages: [],
  addMessage: (sender, content) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender,
      content,
      timestamp: new Date(),
      userId: 'admin'
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },
  clearMessages: () => {
    set({ messages: [] });
  },
  sendWebhookMessage: async (content, webhookUrl) => {
    try {
      const userMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'user',
        content,
        timestamp: new Date(),
        userId: 'admin'
      };
      set((state) => ({ messages: [...state.messages, userMessage] }));

      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: uuidv4(),
          sender: 'CEO',
          content: `Response to: ${content}`,
          timestamp: new Date(),
          userId: 'admin'
        };
        set((state) => ({ messages: [...state.messages, botResponse] }));
      }, 1000);
    } catch (error) {
      console.error('Webhook send failed:', error);
    }
  },
}), { name: 'severino-chat-storage' }));

// Prompts Store
interface PromptsState {
  prompts: Prompt[];
  addPrompt: (title: string, content: string, category: string) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  generateWithOpenAI: (prompt: string, apiKey: string) => Promise<string>;
}

const usePromptsStore = create<PromptsState>()(
  persist(
    (set) => ({
      prompts: [],
      addPrompt: (title, content, category) => {
        const newPrompt: Prompt = {
          id: uuidv4(),
          title,
          content,
          category,
          createdAt: new Date(),
          userId: 'admin'
        };
        set((state) => ({
          prompts: [newPrompt, ...state.prompts]
        }));
      },
      updatePrompt: (id, updates) => {
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === id ? { ...prompt, ...updates } : prompt
          ),
        }));
      },
      deletePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
        }));
      },
      generateWithOpenAI: async (prompt, apiKey) => {
        try {
          return `Generated response for prompt: ${prompt}`;
        } catch (error) {
          console.error('Failed to generate with OpenAI:', error);
          return 'Failed to generate response. Please check your API key.';
        }
      },
    }),
    {
      name: 'severino-prompts-storage',
      version: 1,
    }
  )
);

// Chip Instances Store
interface ChipInstancesState {
  instances: ChipInstance[];
  addInstance: (name: string, phone: string) => void;
  updateInstance: (id: string, updates: Partial<ChipInstance>) => void;
  deleteInstance: (id: string) => void;
  heatChip: (id: string, apiKey: string) => Promise<void>;
}

const useChipInstancesStore = create<ChipInstancesState>()(
  persist(
    (set) => ({
      instances: [],
      addInstance: (name, phone) => {
        const newInstance: ChipInstance = {
          id: uuidv4(),
          name,
          phone,
          status: 'inactive',
          createdAt: new Date(),
          userId: 'admin'
        };
        set((state) => ({ instances: [newInstance, ...state.instances] }));
      },
      updateInstance: (id, updates) => {
        set((state) => ({
          instances: state.instances.map((instance) =>
            instance.id === id ? { ...instance, ...updates } : instance
          ),
        }));
      },
      deleteInstance: (id) => {
        set((state) => ({
          instances: state.instances.filter((instance) => instance.id !== id),
        }));
      },
      heatChip: async (id, apiKey) => {
        try {
          set((state) => ({
            instances: state.instances.map((instance) =>
              instance.id === id ? { ...instance, status: 'heating' } : instance
            ),
          }));
          setTimeout(() => {
            set((state) => ({
              instances: state.instances.map((instance) =>
                instance.id === id ? { ...instance, status: 'active' } : instance
              ),
            }));
          }, 2000);
        } catch (error) {
          console.error('Failed to heat chip:', error);
          set((state) => ({
            instances: state.instances.map((instance) =>
              instance.id === id ? { ...instance, status: 'inactive' } : instance
            ),
          }));
        }
      },
    }),
    { name: 'severino-chip-instances-storage' }
  )
);

// Settings Store
const useSettingsStore = create<{
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}>()(
  persist(
    (set) => ({
      settings: {
        openaiApiKey: '',
        webhookUrl: '',
        evolutionApiKey: '',
        webhookEvolutionUrl: '',
        theme: 'dark',
        language: 'pt',
        enableNotifications: false,
        autoSave: true,
        useSupabase: false,
        userId: 'admin'
      },
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }));
      },
    }),
    {
      name: 'severino-settings-storage',
      version: 1
    }
  )
);

// Clients Store
interface ClientsState {
  clients: Client[];
  addClient: (name: string, status: ClientStatus, category: ClientCategory, data?: Partial<Client>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientsByStatus: (status: ClientStatus) => Client[];
}

const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      addClient: (name, status, category, data = {}) => {
        const newClient: Client = {
          id: uuidv4(),
          name,
          status,
          category,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'admin',
          ...data
        };
        set((state) => ({ clients: [newClient, ...state.clients] }));
      },
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates, updatedAt: new Date() } : client
          ),
        }));
      },
      deleteClient: (id) => {
        if (!id) {
          console.error('deleteClient called with invalid id');
          return;
        }

        console.log('deleteClient called with id:', id);
        const clientsBefore = get().clients;
        console.log('Current clients before deletion:', clientsBefore);

        // Find the client to be deleted (for validation)
        const clientToDelete = clientsBefore.find(client => client.id === id);
        if (!clientToDelete) {
          console.error('Client not found with id:', id);
          return;
        }

        set((state) => {
          const filteredClients = state.clients.filter((client) => client.id !== id);
          console.log('Filtered clients after deletion:', filteredClients);
          console.log('Deletion successful:', clientsBefore.length > filteredClients.length);
          return { clients: filteredClients };
        });
      },
      getClientsByStatus: (status) => {
        return get().clients.filter(client => client.status === status);
      },
    }),
    { name: 'severino-clients-storage' }
  )
);

// Financial Records Store
interface FinancialRecordsState {
  records: FinancialRecord[];
  addRecord: (clientId: string, description: string, amount: number, type: 'income' | 'expense', date: Date) => void;
  updateRecord: (id: string, updates: Partial<FinancialRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByClient: (clientId: string) => FinancialRecord[];
}

const useFinancialRecordsStore = create<FinancialRecordsState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (clientId, description, amount, type, date) => {
        const newRecord: FinancialRecord = {
          id: uuidv4(),
          clientId,
          description,
          amount,
          type,
          date,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'admin'
        };
        set((state) => ({ records: [newRecord, ...state.records] }));
      },
      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id ? { ...record, ...updates, updatedAt: new Date() } : record
          ),
        }));
      },
      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },
      getRecordsByClient: (clientId) => {
        return get().records.filter(record => record.clientId === clientId);
      },
    }),
    { name: 'severino-financial-records-storage' }
  )
);

// Export all stores
export {
  useNotesStore,
  useTasksStore,
  useLinksStore,
  useIdeasStore,
  useChatStore,
  usePromptsStore,
  useChipInstancesStore,
  useSettingsStore,
  useClientsStore,
  useFinancialRecordsStore
};
