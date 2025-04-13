import { useSettingsStore } from '@/store/dataStore';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

// This is a service that connects to the OpenAI API
// In a production environment, you would typically handle this through a backend
// to avoid exposing your API key in the frontend

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const settings = useSettingsStore.getState().settings;
    const apiKey = settings?.openaiApiKey;

    if (!apiKey) {
      return 'API key not found. Please configure it in settings. Go to Settings page and add your OpenAI API key.';
    }

    // Real implementation using OpenAI API
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente útil e amigável que ajuda com suporte técnico e brainstorming. Seja conciso e direto nas respostas.'
            },
            ...messages
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        return `Error from OpenAI API: ${errorData.error?.message || 'Unknown error'}. Please check your API key and settings.`;
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return `Error connecting to OpenAI API. Please check your internet connection and API key configuration.`;
    }

  } catch (error) {
    console.error('Error in OpenAI service:', error);
    return `An unexpected error occurred. Please try again later.`;
  }
}
