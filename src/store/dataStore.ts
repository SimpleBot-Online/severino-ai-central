import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface Settings {
  id?: string;
  openaiApiKey?: string;
  webhookUrl?: string;
  evolutionApiKey?: string;
  webhookEvolutionUrl?: string;
  assistantId?: string;
  theme?: 'dark' | 'light';
  language?: 'pt' | 'en';
  enableNotifications?: boolean;
  autoSave?: boolean;
  user_id?: string;
}

interface ChipInstance {
  id: string;
  name: string;
  phone: string;
  status: 'inactive' | 'active' | 'heating';
}

interface SettingsStore {
  settings: Settings;
  loading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => void;
  fetchSettings: (userId: string) => Promise<void>;
}

interface ChipInstancesStore {
  instances: ChipInstance[];
  addInstance: (name: string, phone: string) => void;
  updateInstance: (id: string, updates: Partial<ChipInstance>) => void;
  deleteInstance: (id: string) => void;
  heatChip: (id: string, apiKey: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: {
        openaiApiKey: '',
        webhookUrl: 'https://gen.simplebot.online/webhook/a1b8ac76-841d-4412-911a-7f22ff0d73ff/chat',
        evolutionApiKey: '',
        webhookEvolutionUrl: '',
        assistantId: '',
        theme: 'dark',
        language: 'pt',
        enableNotifications: false,
        autoSave: true,
        user_id: '',
      },
      loading: false,
      updateSettings: (newSettings: Partial<Settings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      fetchSettings: async (userId: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (error) {
            console.error('Error fetching settings:', error);
          }

          if (data) {
            set({ settings: data });
          }
        } catch (error) {
          console.error('Unexpected error fetching settings:', error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'severino-settings-storage',
    }
  )
);

export const useChipInstancesStore = create<ChipInstancesStore>((set, get) => ({
  instances: [],
  addInstance: (name: string, phone: string) => {
    const newInstance: ChipInstance = {
      id: Date.now().toString(),
      name,
      phone,
      status: 'inactive',
    };
    set((state) => ({ instances: [...state.instances, newInstance] }));
  },
  updateInstance: (id: string, updates: Partial<ChipInstance>) => {
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, ...updates } : instance
      ),
    }));
  },
  deleteInstance: (id: string) => {
    set((state) => ({
      instances: state.instances.filter((instance) => instance.id !== id),
    }));
  },
  heatChip: async (id: string, apiKey: string) => {
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, status: 'heating' } : instance
      ),
    }));

    try {
      const instance = get().instances.find((instance) => instance.id === id);
      if (!instance) {
        throw new Error('Instance not found');
      }

      const apiUrl = `https://evolutionapi.com/api/start-instance?key=${apiKey}&number=${instance.phone}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        set((state) => ({
          instances: state.instances.map((instance) =>
            instance.id === id ? { ...instance, status: 'active' } : instance
          ),
        }));
      } else {
        set((state) => ({
          instances: state.instances.map((instance) =>
            instance.id === id ? { ...instance, status: 'inactive' } : instance
          ),
        }));
        console.error('Failed to heat chip:', data.message);
        throw new Error(data.message || 'Failed to heat chip');
      }
    } catch (error) {
      set((state) => ({
        instances: state.instances.map((instance) =>
          instance.id === id ? { ...instance, status: 'inactive' } : instance
        ),
      }));
      console.error('Error heating chip:', error);
      throw error;
    }
  },
}));
