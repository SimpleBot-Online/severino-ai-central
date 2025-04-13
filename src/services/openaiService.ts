
import { API } from '@/config';
import { useSettingsStore } from '@/store/dataStore';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendChatMessage = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const settings = useSettingsStore.getState().settings;
    
    if (!settings?.openaiApiKey) {
      throw new Error('API Key não configurada');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openaiApiKey}`
      },
      body: JSON.stringify({
        model: API.OPENAI.DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: API.OPENAI.DEFAULT_SYSTEM_MESSAGE
          },
          ...messages
        ],
        temperature: API.OPENAI.DEFAULT_TEMPERATURE,
        max_tokens: API.OPENAI.DEFAULT_MAX_TOKENS
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro ao obter resposta');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
