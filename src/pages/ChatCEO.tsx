
import React, { useEffect, useRef } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useSettingsStore } from '../store/dataStore';
import { Card } from '@/components/ui/card';

// Define type for the chat instance
declare global {
  interface Window {
    createChat: any;
  }
}

const ChatCEO = () => {
  const { settings } = useSettingsStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load n8n chat script
    const loadScript = () => {
      if (!window.createChat) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        script.onload = createChatInstance;
        document.head.appendChild(script);
      } else {
        createChatInstance();
      }
    };

    // Create chat instance
    const createChatInstance = () => {
      if (window.createChat && !chatInstanceRef.current && chatContainerRef.current) {
        // Destroy previous instance if exists
        if (chatInstanceRef.current) {
          try {
            chatInstanceRef.current = null;
          } catch (error) {
            console.error('Error destroying chat instance:', error);
          }
        }

        // Clear container
        if (chatContainerRef.current) {
          chatContainerRef.current.innerHTML = '';
        }

        // Create new instance
        const webhookUrl = settings.webhookUrl || 'https://gen.simplebot.online/webhook/a1b8ac76-841d-4412-911a-7f22ff0d73ff/chat';
        
        chatInstanceRef.current = window.createChat({
          webhookUrl: webhookUrl,
          target: '#n8n-chat',
          mode: 'fullscreen',
          showWelcomeScreen: true,
          initialMessages: [
            'E aí! 👋',
            'Even if u r not ready to the day, it cannot always be night...'
          ],
          i18n: {
            en: {
              title: 'Severino.IA, CEO.',
              subtitle: 'Diga, chefe!',
              footer: 'Powered by JohnLoki',
              getStarted: 'Vai com medo mesmo, mos!',
              inputPlaceholder: 'Digite sua mensagem...',
            }
          }
        });
      }
    };

    // Initialize chat
    loadScript();

    // Cleanup function
    return () => {
      if (chatInstanceRef.current) {
        try {
          chatInstanceRef.current = null;
        } catch (error) {
          console.error('Error cleaning up chat instance:', error);
        }
      }
    };
  }, [settings.webhookUrl]);

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)] animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chat CEO</h1>
        </div>

        <Card className="flex-1 bg-severino-gray border-severino-lightgray overflow-hidden flex flex-col">
          <div ref={chatContainerRef} id="n8n-chat" className="w-full h-full"></div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ChatCEO;
