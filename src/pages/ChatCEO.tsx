
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Copy, CheckCheck, Terminal, ChevronDown, Plus, X, Edit, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/Layout/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      removeTab: (id) => set((state) => ({
        tabs: state.tabs.filter((tab) => tab.id !== id),
        activeTabId: state.activeTabId === id ? (state.tabs[0]?.id || "1") : state.activeTabId,
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
      updateTabName: (tabId, name) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === tabId
            ? { ...tab, name }
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
      }, 25); // Ajuste a velocidade aqui
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
    updateTabName,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageSound = useRef(new Audio("/message.mp3"));
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editedTabName, setEditedTabName] = useState("");

  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const messages = useMemo(() => activeTab?.messages || [], [activeTab?.messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const initializingRef = useRef<{ [key: string]: boolean }>({});

  const appendMessage = useCallback((content: string, isUser: boolean) => {
    const newMessage = { text: content, isUser, id: Date.now() };
    addMessage(activeTabId, newMessage);
    if (!isUser) {
      messageSound.current.play().catch(() => {
        // Ignorar erros de reprodução de áudio
      });
    }
  }, [activeTabId, addMessage]);

  const iniciarIntro = useCallback(async () => {
    if (initializingRef.current[activeTabId]) return;
    initializingRef.current[activeTabId] = true;

    const delays = [500, 2000, 3000];
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
      // Se já estiver enviando ou se passou menos de 1 segundo desde a última mensagem, coloque na fila
      messageQueueRef.current.push(message);
      return;
    }

    try {
      sendingRef.current = true;
      lastTimestampRef.current = now;
      setIsTyping(true);

      // Verificar se temos uma resposta em cache para esta mensagem
      const cachedResponse = sessionStorage.getItem(`chat_response_${message.trim()}`);
      if (cachedResponse) {
        console.log('Usando resposta em cache');
        await new Promise(resolve => setTimeout(resolve, 800)); // Pequeno atraso para parecer natural
        setIsTyping(false);
        appendMessage(cachedResponse, false);
        return;
      }

      const payload = JSON.stringify({ mensagem: message });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout

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
          console.warn('Falha ao analisar resposta como JSON:', e);
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

        // Armazenar a resposta em cache para uso futuro
        if (botResponse) {
          sessionStorage.setItem(`chat_response_${message.trim()}`, botResponse);
        }

        await new Promise(resolve => setTimeout(resolve, 800));
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

      // Processar a próxima mensagem na fila, se houver
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

  return (
    <AppLayout>
      <div className="relative flex flex-col flex-1 h-[calc(100vh-5rem)] p-4 overflow-hidden bg-cyber-dark">
        {/* Fundo cyberpunk animado */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark to-cyber-dark/80" />
          <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmYzgxMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]" className="absolute inset-0 opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full transform translate-x-1/2 translate-y-1/2 animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col h-full w-full max-w-5xl mx-auto overflow-hidden rounded-lg border border-cyan-500/50 bg-gradient-to-b from-black/95 to-cyber-dark/95 backdrop-blur-md shadow-lg shadow-cyan-500/20">
          <div className="border-b border-cyan-500/50 bg-black/80 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-mono font-bold text-cyan-400 tracking-wide">
                  SEVERINO CEO TERMINAL v3.0
                </h2>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 hover:border-cyan-500/80 bg-black/60 text-cyan-400 hover:bg-cyan-950/30"
                  onClick={() => addTab()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Novo Terminal
                </Button>
              </div>
            </div>
          </div>

          <Tabs 
            value={activeTabId} 
            onValueChange={setActiveTabId}
            className="flex flex-col flex-grow min-h-0"
          >
            <div className="border-b border-cyan-500/30 bg-black/60 px-2 py-1 overflow-x-auto flex">
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
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          {tab.name}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-cyan-500 hover:text-cyan-400 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTab(tab.id);
                            }}
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
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab) => (
              <TabsContent 
                key={tab.id} 
                value={tab.id}
                className="flex-grow flex flex-col p-0 m-0 outline-none data-[state=active]:flex-grow"
              >
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-base scrollbar-thin scrollbar-track-black scrollbar-thumb-cyan-500/50">
                  {tab.messages.map((msg, i) => (
                    <div
                      key={msg.id}
                      className={`group flex animate-fadeIn ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`relative max-w-[90%] rounded-lg px-4 py-3 ${
                          msg.isUser
                            ? "bg-cyan-950/30 text-cyan-50 border border-cyan-500/50 shadow-md shadow-cyan-500/10"
                            : "bg-black/60 text-cyan-50 border border-cyan-500/30 shadow-md shadow-cyan-500/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={cn(
                            "select-none text-lg font-bold",
                            msg.isUser ? "text-cyan-400" : "text-green-500"
                          )}>
                            {msg.isUser ? '>' : '$'}
                          </span>
                          <span className="leading-relaxed tracking-wide">
                            {msg.isUser ? (
                              <span>{msg.text}</span>
                            ) : (
                              <TypewriterText text={msg.text} />
                            )}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -right-10 top-0 opacity-0 transition-opacity group-hover:opacity-100 text-cyan-400 hover:text-cyan-300 hover:bg-transparent"
                          onClick={() => copyMessage(msg.text, i)}
                        >
                          {copiedIndex === i ? (
                            <CheckCheck className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {isTyping && activeTabId === tab.id && (
                    <div className="flex items-center gap-2 text-cyan-400 animate-fadeIn">
                      <span className="text-lg font-bold text-green-500">$</span>
                      <div className="flex space-x-1 mt-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-cyan-500/30 bg-black/70 p-4">
                  <div className="flex gap-3 items-center font-mono">
                    <span className="text-cyan-400 text-lg font-bold select-none">{'>'}</span>
                    <Textarea
                      className="flex-1 bg-black/60 border border-cyan-500/30 focus:border-cyan-500/70 text-cyan-50 placeholder:text-cyan-500/50 focus:outline-none focus:ring-0 resize-none rounded-md px-3 py-2 min-h-[2.5rem] font-sans"
                      placeholder="Digite seu comando..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={isTyping}
                      rows={1}
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                    <Button
                      onClick={handleSend}
                      className="shrink-0 bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-bold hover:opacity-90 border border-cyan-400/50"
                      disabled={isTyping || !newMessage.trim()}
                    >
                      EXECUTAR
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
