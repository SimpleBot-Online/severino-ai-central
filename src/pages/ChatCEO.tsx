import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Copy, CheckCheck, Terminal, ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/Layout/AppLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  text: string;
  isUser: boolean;
  id: number;
}

interface ChatTab {
  id: string;
  name: string;
  messages: Message[];
  initialized: boolean;
}

interface ChatStore {
  tabs: ChatTab[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  addTab: () => void;
  removeTab: (id: string) => void;
  addMessage: (tabId: string, message: Message) => void;
  setTabInitialized: (tabId: string) => void;
}

const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      tabs: [{ id: "1", name: "Main Terminal", messages: [], initialized: false }],
      activeTabId: "1",
      setActiveTabId: (id) => set({ activeTabId: id }),
      addTab: () => set((state) => {
        const newId = (state.tabs.length + 1).toString();
        return {
          tabs: [...state.tabs, { id: newId, name: `Terminal ${newId}`, messages: [], initialized: false }],
          activeTabId: newId,
        };
      }),
      removeTab: (id) => set((state) => ({
        tabs: state.tabs.filter((tab) => tab.id !== id),
        activeTabId: state.activeTabId === id ? "1" : state.activeTabId,
      })),
      addMessage: (tabId, message) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === tabId
            ? { ...tab, messages: [...tab.messages, message] }
            : tab
        ),
      })),
      setTabInitialized: (tabId) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === tabId
            ? { ...tab, initialized: true }
            : tab
        ),
      })),
    }),
    {
      name: 'severino-chat-storage',
    }
  )
);

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 25); // Adjust speed here
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayText}</span>;
}

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      iniciarIntro();
    }
  }, [initialized]);

  const iniciarIntro = async () => {
    const delays = [500, 2000, 3000];
    const msgs = [
      "Estabelecendo conexão segura...",
      "Acesso concedido. Entrando na rede subterrânea...",
      "E aí! Aqui é o Severino, o CEO. Me diz aí o que tu precisa!",
    ];

    for (let i = 0; i < msgs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, delays[i]));
      appendMessage(msgs[i], false);
    }
  };

  const appendMessage = (content, isUser) => {
    setMessages((prev) => [...prev, { text: content, isUser }]);
  };

  const sendMessage = useCallback(async (message: string) => {
    const now = Date.now();
    if (sendingRef.current || !message.trim() || now - lastTimestampRef.current < 1000) {
      // If already sending or it's been less than 1 second since last message, queue it
      messageQueueRef.current.push(message);
      return;
    }

    try {
      sendingRef.current = true;
      lastTimestampRef.current = now;
      setIsTyping(true);
      
      const payload = JSON.stringify({ mensagem: message });
      const response = await fetch(
        "https://gen.simplebot.online/webhook/b8f10f59-0108-43f1-afce-e782eda6ebe0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );

      const text = await response.text();
      interface ApiResponse {
        output?: string;
        mensagem?: string;
        message?: string;
        resposta?: string;
        response?: string;
      }
      let responseData: ApiResponse | string = text;

      try {
        responseData = JSON.parse(text) as ApiResponse;
      } catch (e) {
        console.warn('Failed to parse response as JSON:', e);
      }

      if (!response.ok) {
        throw new Error(
          `Erro ${response.status}: ${
            typeof responseData === "string"
              ? responseData
              : JSON.stringify(responseData)
          }`
        );
      }

      const botResponse = typeof responseData === 'string' 
        ? responseData
        : responseData.output ||
          responseData.mensagem ||
          responseData.message ||
          responseData.resposta ||
          responseData.response;

      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      
      if (botResponse) {
        appendMessage(botResponse, false);
      } else {
        appendMessage("Desculpe, não consegui processar sua mensagem.", false);
      }

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setIsTyping(false);
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive",
      });
      appendMessage(
        "Desculpe, ocorreu um erro ao processar sua mensagem.",
        false
      );
    } finally {
      sendingRef.current = false;
      
      // Process next message in queue if any
      if (messageQueueRef.current.length > 0) {
        const nextMessage = messageQueueRef.current.shift();
        if (nextMessage) {
          setTimeout(() => sendMessage(nextMessage), 1000);
        }
      }
    }
  }, [appendMessage, toast]);

  const handleSend = useCallback(async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || isTyping) return;
    
    appendMessage(trimmed, true);
    setNewMessage("");
    await sendMessage(trimmed);
  }, [newMessage, isTyping, appendMessage, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isTyping) {
        handleSend();
      }
    }
  };

  return (
    <div className={`relative flex h-screen items-center justify-center bg-black font-[Orbitron] text-pink-500`}>
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] bg-[length:100%_100%] opacity-20" />
      <div className="relative z-10 flex h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl border-2 border-pink-500 bg-[#0d0d0d] shadow-[0_0_25px_#ff007f]">
        <div className="border-b-2 border-pink-500 bg-black px-4 py-3 text-center text-lg font-bold text-pink-500">
          Severino, CEO
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-[#1a1a1a]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message max-w-[80%] break-words rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.isUser
                  ? "ml-auto bg-pink-500 text-white"
                  : "bg-cyan-300 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="animate-pulse text-cyan-300 text-sm">Severino digitando...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 border-t-2 border-pink-500 p-5">
          <textarea
            rows={1}
            className="flex-1 resize-none rounded-md border-2 border-cyan-300 bg-black p-3 text-pink-500 placeholder:text-pink-400 focus:outline-none"
            placeholder="Manda aí tua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ height: "auto", overflow: "hidden" }}
          />
          <button
            onClick={handleSend}
            className="rounded-md bg-pink-500 px-4 py-2 font-semibold text-white transition-all hover:bg-cyan-300 hover:text-black"
          >
            Enviar
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
