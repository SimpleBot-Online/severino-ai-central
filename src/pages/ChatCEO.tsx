import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Copy, CheckCheck, Terminal, Plus, X, Edit, Save, Check, ChevronDown, Menu, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/Layout/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  updateTabName: (tabId: string, name: string) => void;
  clearMessages: (tabId: string) => void;
}

const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      tabs: [{ id: "1", name: "Terminal Principal", messages: [], initialized: false }],
      activeTabId: "1",
      setActiveTabId: (id) => set({ activeTabId: id }),
      addTab: () => set((state) => {
        const newId = (state.tabs.length + 1).toString();
        return {
          tabs: [...state.tabs, { id: newId, name: `Terminal ${newId}`, messages: [], initialized: false }],
          activeTabId: newId,
        };
      }),
      removeTab: (id) => set((state) => {
        // Don't remove the last tab
        if (state.tabs.length <= 1) return state;
        
        // Find the previous tab or the first tab if we're removing the first
        const currentIndex = state.tabs.findIndex(tab => tab.id === id);
        const newActiveId = currentIndex > 0 
          ? state.tabs[currentIndex - 1].id 
          : (state.tabs.length > 1 ? state.tabs.find(t => t.id !== id)?.id : state.tabs[0].id);
        
        return {
          tabs: state.tabs.filter((tab) => tab.id !== id),
          activeTabId: state.activeTabId === id ? newActiveId : state.activeTabId,
        };
      }),
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
      updateTabName: (tabId, name) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === tabId
            ? { ...tab, name }
            : tab
        ),
      })),
      clearMessages: (tabId) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === tabId
            ? { ...tab, messages: [], initialized: false }
            : tab
        ),
      })),
    }),
    {
      name: 'severino-chat-storage',
    }
  )
);

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset when text changes
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Use a variable interval to type faster for longer texts
      const typingSpeed = text.length > 100 ? 10 : 20;
      
      intervalRef.current = window.setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);
      
      return () => {
        if (intervalRef.current !== null) {
          clearTimeout(intervalRef.current);
        }
      };
    } else if (onComplete) {
      // Slight delay before calling onComplete
      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 100);
      
      return () => clearTimeout(completeTimeout);
    }
  }, [currentIndex, text, onComplete]);

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
    updateTabName,
    clearMessages,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageSound = useRef(typeof Audio !== 'undefined' ? new Audio("/message.mp3") : null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editedTabName, setEditedTabName] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  const messages = useMemo(() => activeTab?.messages || [], [activeTab?.messages]);

  // Handle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (chatContainerRef.current?.requestFullscreen) {
        chatContainerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error(err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(err));
      }
    }
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fixed scroll to bottom function with better behavior
  const scrollToBottom = useCallback((force = false) => {
    if (!autoScroll && !force) return;
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, [autoScroll]);

  // Monitor scroll position to determine if auto-scroll should be enabled/disabled
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // If user has scrolled up more than 200px, disable auto-scroll
      // If user has scrolled to bottom, enable auto-scroll
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isScrolledToBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Scroll when tab changes
  useEffect(() => {
    scrollToBottom(true);
    // Close mobile menu when changing tabs
    setIsMobileMenuOpen(false);
  }, [activeTabId, scrollToBottom]);

  // Focus input when tab changes
  useEffect(() => {
    if (textareaRef.current && !isTyping) {
      textareaRef.current.focus();
    }
  }, [activeTabId, isTyping]);

  const initializingRef = useRef<{ [key: string]: boolean }>({});

  const appendMessage = useCallback((content: string, isUser: boolean) => {
    const newMessage = { text: content, isUser, id: Date.now() };
    addMessage(activeTabId, newMessage);
    
    if (!isUser && messageSound.current) {
      messageSound.current.play().catch(() => {
        // Ignore audio playback errors
      });
    }

    // Force scroll to bottom when appending messages
    setTimeout(() => scrollToBottom(true), 100);
  }, [activeTabId, addMessage, scrollToBottom]);

  const iniciarIntro = useCallback(async () => {
    if (initializingRef.current[activeTabId]) return;
    initializingRef.current[activeTabId] = true;

    const delays = [500, 1500, 2000];
    const msgs = [
      "Estabelecendo conexão segura...",
      "Acesso concedido. Entrando na rede subterrânea...",
      "E aí! Aqui é o Severino, o CEO. Me diz aí o que tu precisa!",
    ];

    try {
      for (let i = 0; i < msgs.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, delays[i]));
        appendMessage(msgs[i], false);
      }
      setTabInitialized(activeTabId);
    } finally {
      initializingRef.current[activeTabId] = false;
    }
  }, [appendMessage, activeTabId, setTabInitialized]);

  useEffect(() => {
    if (activeTab && !activeTab.initialized && !initializingRef.current[activeTabId]) {
      iniciarIntro();
    }
  }, [activeTab, activeTabId, iniciarIntro]);

  const copyMessage = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast({
        title: "Mensagem copiada!",
        duration: 2000,
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar mensagem",
        variant: "destructive",
      });
    }
  };

  const sendMessageRef = useRef<boolean>(false);
  const sendingRef = useRef(false);
  const lastTimestampRef = useRef(0);
  const messageQueueRef = useRef<string[]>([]);

  const sendMessage = useCallback(async (message: string) => {
    const now = Date.now();
    if (sendingRef.current || !message.trim() || now - lastTimestampRef.current < 1000) {
      // Add to queue if already sending or if less than 1 second since last message
      messageQueueRef.current.push(message);
      return;
    }

    try {
      sendingRef.current = true;
      lastTimestampRef.current = now;
      setIsTyping(true);
      setAutoScroll(true); // Enable auto-scroll when sending a new message

      // Check if we have a cached response for this message
      const cachedResponse = sessionStorage.getItem(`chat_response_${message.trim()}`);
      if (cachedResponse) {
        console.log('Using cached response');
        await new Promise(resolve => setTimeout(resolve, 800)); // Small delay to seem natural
        setIsTyping(false);
        appendMessage(cachedResponse, false);
        return;
      }

      const payload = JSON.stringify({ mensagem: message });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

      try {
        const response = await fetch(
          "https://gen.simplebot.online/webhook/b8f10f59-0108-43f1-afce-e782eda6ebe0",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: payload,
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

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
            `Error ${response.status}: ${
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

        // Store response in cache for future use
        if (botResponse) {
          sessionStorage.setItem(`chat_response_${message.trim()}`, botResponse);
        }

        await new Promise(resolve => setTimeout(resolve, 400));
        setIsTyping(false);

        if (botResponse) {
          appendMessage(botResponse, false);
        } else {
          appendMessage("Desculpe, não consegui processar sua mensagem.", false);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('A solicitação demorou muito tempo. Por favor, tente novamente.');
        }
        throw fetchError;
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

      // Process next message in the queue if there is one
      if (messageQueueRef.current.length > 0) {
        const nextMessage = messageQueueRef.current.shift();
        if (nextMessage) {
          setTimeout(() => sendMessage(nextMessage), 1000);
        }
      }
    }
  }, [appendMessage, toast, setIsTyping, setAutoScroll]);

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
    } else if (e.key === "Enter" && e.shiftKey) {
      // Allow line breaks with Shift+Enter
      setNewMessage(prev => prev + "\n");
    }
  }, [handleSend, isTyping]);

  const startEditingTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setEditingTabId(tabId);
      setEditedTabName(tab.name);
    }
  };

  const saveTabName = () => {
    if (editingTabId && editedTabName.trim()) {
      updateTabName(editingTabId, editedTabName.trim());
      setEditingTabId(null);
    }
  };

  // Handle scroll to bottom button
  const handleScrollToBottom = () => {
    scrollToBottom(true);
    setAutoScroll(true);
  };

  // Reset current chat
  const handleResetChat = () => {
    if (window.confirm("Tem certeza que deseja limpar este terminal? Isso irá reiniciar a conversa.")) {
      clearMessages(activeTabId);
      iniciarIntro();
    }
  };

  // Auto-adjust textarea height
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage, adjustTextareaHeight]);

  // Accessibility improvements
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingTabId) {
          setEditingTabId(null);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editingTabId, isMobileMenuOpen]);

  return (
    <AppLayout>
      <div 
        ref={chatContainerRef}
        className={cn(
          "relative flex flex-col w-full h-screen md:h-[calc(100vh-2rem)] p-2 md:p-4 overflow-hidden bg-cyber-dark",
          isFullscreen && "fixed inset-0 z-50"
        )}
      >
        {/* Animated cyberpunk background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark to-cyber-dark/80" />
          <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmYzgxMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]" className="absolute inset-0 opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full transform translate-x-1/2 translate-y-1/2 animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col h-full w-full max-w-7xl mx-auto overflow-hidden rounded-lg border border-cyan-500/50 bg-gradient-to-b from-black/95 to-cyber-dark/95 backdrop-blur-md shadow-lg shadow-cyan-500/20">
          <div className="border-b border-cyan-500/50 bg-black/80 px-2 sm:px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-cyan-400" />
                <h2 className="text-base sm:text-lg font-mono font-bold text-cyan-400 tracking-wide">
                  SEVERINO CEO TERMINAL v4.0
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-cyan-500/30 hover:border-cyan-500/80 bg-black/60 text-cyan-400 hover:bg-cyan-950/30"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Sair do modo de tela cheia" : "Entrar no modo de tela cheia"}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex border-cyan-500/30 hover:border-cyan-500/80 bg-black/60 text-cyan-400 hover:bg-cyan-950/30"
                  onClick={() => addTab()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Novo
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden border-cyan-500/30 hover:border-cyan-500/80 bg-black/60 text-cyan-400 hover:bg-cyan-950/30"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Abrir menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden border-b border-cyan-500/50 bg-black/90 p-3 animate-fadeIn">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-cyan-500/30 hover:border-cyan-500/80 bg-black/60 text-cyan-400 hover:bg-cyan-950/30"
                  onClick={() => {
                    addTab();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> Novo Terminal
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-cyan-500/30 hover:border-cyan-500/80 bg-black/60 text-cyan-400 hover:bg-cyan-950/30"
                  onClick={() => {
                    handleResetChat();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center">
                    <X className="h-4 w-4 mr-2" /> Limpar Terminal
                  </span>
                </Button>
              </div>
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <p className="text-xs text-cyan-400/70 text-center">Terminais disponíveis</p>
                <div className="mt-2 flex flex-col space-y-1">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "justify-between border hover:bg-cyan-950/30",
                        tab.id === activeTabId
                          ? "border-cyan-500/70 bg-black/70 text-cyan-400"
                          : "border-cyan-500/30 bg-black/40 text-cyan-400/70"
                      )}
                      onClick={() => {
                        setActiveTabId(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span className="truncate max-w-[180px]">{tab.name}</span>
                      {tabs.length > 1 && tab.id === activeTabId && (
                        <X 
                          className="h-3 w-3 text-cyan-400/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTab(tab.id);
                          }}
                        />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Tabs 
            value={activeTabId} 
            onValueChange={setActiveTabId}
            className="flex flex-col flex-grow min-h-0"
          >
            <div className="hidden sm:flex border-b border-cyan-500/30 bg-black/60 px-2 py-1 overflow-x-auto">
              <TabsList className="h-9 bg-transparent p-0 flex space-x-1">
                {tabs.map((tab) => (
                  <div key={tab.id} className="flex items-center relative group">
                    <TabsTrigger
                      value={tab.id}
                      className={cn(
                        "px-4 py-1.5 rounded-t-md rounded-b-none border border-b-0 transition-all",
                        tab.id === activeTabId
                          ? "border-cyan-500/70 bg-black text-cyan-400"
                          : "border-cyan-500/30 bg-black/40 text-cyan-400/70 hover:bg-black/60"
                      )}
                    >
                      {editingTabId === tab.id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editedTabName}
                            onChange={(e) => setEditedTabName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black border border-cyan-500 text-cyan-400 px-2 py-0.5 rounded w-32 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                saveTabName();
                              }
                              e.stopPropagation();
                            }}
                            aria-label="Nome do terminal"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-green-500 hover:text-green-400 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveTabName();
                            }}
                            aria-label="Salvar nome"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 max-w-[150px] sm:max-w-[200px]">
                          <span className="truncate">{tab.name}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-cyan-500 hover:text-cyan-400 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTab(tab.id);
                            }}
                            aria-label="Editar nome do terminal"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TabsTrigger>
                    {tabs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-black border border-cyan-500/50 text-cyan-400 opacity-0 group-hover:opacity-100 p-0 hover:bg-red-950"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTab(tab.id);
                        }}
                        aria-label="Fechar terminal"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </TabsList>
              <div className="ml-auto flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-cyan-400/70 hover:text-cyan-400 hover:bg-transparent"
                  onClick={handleResetChat}
                  aria-label="Limpar conversa atual"
                >
                  Limpar
                </Button>
              </div>
            </div>

            {tabs.map((tab) => (
            <TabsContent 
                key={tab.id} 
                value={tab.id}
                className="flex-grow flex flex-col p-0 m-0 outline-none data-[state=active]:flex-grow relative"
              >
                {/* Messages container */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-grow p-3 md:p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-transparent"
                >
                  <div className="flex flex-col space-y-4 pb-4">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex items-start gap-2 animate-fadeIn",
                          message.isUser 
                            ? "justify-end" 
                            : "justify-start"
                        )}
                      >
                        {!message.isUser && (
                          <div className="w-8 h-8 rounded-md flex-shrink-0 overflow-hidden bg-gradient-to-br from-cyan-600 to-cyan-900 flex items-center justify-center text-white font-bold">
                            S
                          </div>
                        )}
                        <div
                          className={cn(
                            "relative group rounded-lg max-w-[85%] p-3",
                            message.isUser
                              ? "bg-gradient-to-r from-cyan-950/70 to-blue-950/70 text-cyan-100 border border-cyan-500/30"
                              : "bg-gradient-to-r from-cyan-950/50 to-cyan-900/40 text-cyan-100 border border-cyan-500/50"
                          )}
                        >
                          {isTyping && index === messages.length - 1 && !message.isUser ? (
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-75"></div>
                              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-150"></div>
                            </div>
                          ) : (
                            <div className="text-sm whitespace-pre-wrap break-words">
                              <TypewriterText 
                                text={message.text} 
                                onComplete={message.isUser ? undefined : () => scrollToBottom()}
                              />
                            </div>
                          )}
                          <button
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyMessage(message.text, index)}
                            aria-label="Copiar mensagem"
                          >
                            {copiedIndex === index ? (
                              <CheckCheck className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-cyan-400/70 hover:text-cyan-400" />
                            )}
                          </button>
                        </div>
                        {message.isUser && (
                          <div className="w-8 h-8 rounded-md flex-shrink-0 overflow-hidden bg-gradient-to-
