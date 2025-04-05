import React, { useEffect, useRef, useState } from "react";
import AppLayout from '../components/Layout/AppLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { text: "Olá! Como posso ajudar você hoje?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [selectedBot, setSelectedBot] = useState("bot1");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const appendMessage = (content, isUser) => {
    setMessages((prev) => [...prev, { text: content, isUser }]);
  };

  const sendMessage = async (message) => {
    try {
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
      let responseData = text;

      try {
        responseData = JSON.parse(text);
      } catch (e) {}

      if (!response.ok) {
        throw new Error(
          `Erro ${response.status}: ${
            typeof responseData === "string"
              ? responseData
              : JSON.stringify(responseData)
          }`
        );
      }

      const botResponse =
        responseData.output ||
        responseData.mensagem ||
        responseData.message ||
        responseData.resposta ||
        responseData.response;

      if (botResponse) {
        appendMessage(botResponse, false);
      } else {
        appendMessage("Desculpe, não consegui processar sua mensagem.", false);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      appendMessage(
        "Desculpe, ocorreu um erro ao processar sua mensagem.",
        false
      );
    }
  };

  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    appendMessage(trimmed, true);
    setNewMessage("");
    await sendMessage(trimmed);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout>
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1f1f1f] to-black font-[Orbitron]">
        <div className="flex h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#0e0e0e] shadow-[0_0_40px_#0ff]">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-cyan-400/30 bg-[#101010] px-5 py-4 text-cyan-300">
            <h2 className="text-sm font-semibold tracking-widest">CYBERCHAT</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-cyan-300 hover:text-pink-400">
                  {selectedBot.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#111] text-cyan-300 border border-cyan-400/20">
                <DropdownMenuRadioGroup value={selectedBot} onValueChange={setSelectedBot}>
                  <DropdownMenuRadioItem value="bot1">Bot 1</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bot2">Bot 2</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bot3">Bot 3</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 text-sm tracking-wide rounded-lg ${
                  msg.isUser
                    ? "ml-auto bg-gradient-to-br from-pink-500 to-pink-700 text-white"
                    : "bg-gradient-to-br from-cyan-500 to-cyan-700 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="flex gap-2 border-t border-cyan-400/30 p-4">
            <textarea
              rows={1}
              className="flex-1 resize-none rounded-md border border-cyan-300/40 bg-[#0e0e0e] p-3 text-cyan-200 placeholder:text-cyan-400 focus:outline-none"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className="rounded-md bg-pink-500 px-4 py-2 font-bold text-white transition-all hover:bg-cyan-400 hover:text-black"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
