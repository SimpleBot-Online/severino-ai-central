import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
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
      addTab: () =>
        set((state) => {
          const newId = (state.tabs.length + 1).toString();
          return {
            tabs: [
              ...state.tabs,
              {
                id: newId,
                name: `Terminal ${newId}`,
                messages: [],
                initialized: false,
              },
            ],
            activeTabId: newId,
          };
        }),
      removeTab: (id) =>
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.id !== id),
          activeTabId: state.activeTabId === id ? "1" : state.activeTabId,
        })),
      addMessage: (tabId, message) =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === tabId
              ? { ...tab, messages: [...tab.messages, message] }
              : tab
          ),
        })),
      setTabInitialized: (tabId) =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, initialized: true } : tab
          ),
        })),
    }),
    {
      name: "severino-chat-storage",
    }
  )
);

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayText}</span>;
}

export default function Chatbot() {
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    addTab,
    removeTab,
    addMessage,
    setTabInitialized,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageSound = useRef(new Audio("/message.mp3"));
  const sendingRef = useRef(false);
  const lastTimestampRef = useRef(0);
  const messageQueueRef = useRef<string[]>([]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const messages = useMemo(() => activeTab?.messages || [], [activeTab?.messages]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom, isTyping]);

  const appendMessage = useCallback(
    (content: string, isUser: boolean) => {
      const newMessage = { text: content, isUser, id: Date.now() };
      addMessage(activeTabId, newMessage);
      if (!isUser) {
        messageSound.current.play().catch(() => {
          // Ignore audio play errors
        });
      }
      setTimeout(scrollToBottom, 100);
    },
    [activeTabId, addMessage, scrollToBottom]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      const now = Date.now();
      if (
        sendingRef.current ||
        !message.trim() ||
        now - lastTimestampRef.current < 1000
      ) {
        messageQueueRef.current.push(message);
        return;
      }

      try {
        sendingRef.current = true;
        lastTimestampRef.current = now;
        setIsTyping(true);

        const cachedResponse = sessionStorage.getItem(
          `chat_response_${message.trim()}`
        );
        if (cachedResponse) {
          console.log("Using cached response");
          await new Promise((resolve) => setTimeout(resolve, 800));
          setIsTyping(false);
          appendMessage(cachedResponse, false);
          return;
        }

        const payload = JSON.stringify({ mensagem: message });
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Falha na comunicação com o servidor.");
        }

        const responseData = await response.json();
        const botResponse =
          typeof responseData === "string"
            ? responseData
            : responseData.output ||
              responseData.mensagem ||
              responseData.message ||
              responseData.resposta ||
              responseData.response;

        if (botResponse) {
          sessionStorage.setItem(`chat_response_${message.trim()}`, botResponse);
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
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
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
        appendMessage(
          "Desculpe, ocorreu um erro ao processar sua mensagem.",
          false
        );
      } finally {
        sendingRef.current = false;

        if (messageQueueRef.current.length > 0) {
          const nextMessage = messageQueueRef.current.shift();
          if (nextMessage) {
            setTimeout(() => sendMessage(nextMessage), 1000);
          }
        }
      }
    },
    [appendMessage, toast]
  );

  const handleSend = useCallback(async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || isTyping) return;

    appendMessage(trimmed, true);
    setNewMessage("");
    await sendMessage(trimmed);
  }, [newMessage, isTyping, appendMessage, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isTyping) {
          handleSend();
        }
      }
    },
    [handleSend, isTyping]
  );

  return (
    <AppLayout>
      <div className="flex h-screen bg-black">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-track-severino-dark scrollbar-thumb-severino-pink/50 h-[calc(100vh-200px)]">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`group flex animate-fadeIn ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[80%] rounded px-3 py-2 ${
                    msg.isUser
                      ? "bg-cyan-500/20 text-gray-100 border border-cyan-500/50"
                      : "bg-cyan-500/10 text-gray-100 border border-cyan-500/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "select-none",
                        msg.isUser ? "text-cyan-500" : "text-cyan-500"
                      )}
                    >
                      {msg.isUser ? ">" : "$"}
                    </span>
                    {msg.isUser ? (
                      <span>{msg.text}</span>
                    ) : (
                      <TypewriterText text={msg.text} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-cyan-500/50 bg-cyber-dark/90 p-4">
            <div className="flex gap-2 items-center font-mono">
              <span className="text-cyan-500 select-none">{">"}</span>
              <textarea
                rows={1}
                className="flex-1 bg-transparent border-none text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-0 resize-none"
                placeholder="Digite seu comando..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                style={{ minHeight: "24px", maxHeight: "120px" }}
              />
              <Button
                onClick={handleSend}
                className="shrink-0 bg-gradient-to-r from-severino-pink to-cyan-500 text-white hover:opacity-90"
                disabled={isTyping || !newMessage.trim()}
              >
                Executar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
