
export const storeOpenAIKey = (key: string) => {
  localStorage.setItem('openai_api_key', key);
};

export const getOpenAIKey = () => {
  return localStorage.getItem('openai_api_key') || '';
};

export const storeAssistantId = (id: string) => {
  localStorage.setItem('openai_assistant_id', id);
};

export const getAssistantId = () => {
  return localStorage.getItem('openai_assistant_id') || '';
};
