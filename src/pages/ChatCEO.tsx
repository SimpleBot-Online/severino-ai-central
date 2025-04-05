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
      } catch (e) {
        // Not JSON, keep as text
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
      <div className="flex h-screen items-center justify-center bg-black font-[Montserrat]">
        <div className="flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border-2 border-pink-500 bg-[#1a1a1a] shadow-[0_0_20px_#ff007f]">
          {/* MENU SUPERIOR */}
          <div className="flex items-center justify-between border-b-2 border-pink-500 bg-[#1a1a1a] px-5 py-3 text-pink-500">
            <h2 className="text-sm font-semibold">Chatbot</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-pink-500 hover:text-cyan-300">
                  {selectedBot.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuRadioGroup
                  value={selectedBot}
                  onValueChange={setSelectedBot}
                >
                  <DropdownMenuRadioItem value="bot1">Bot 1</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bot2">Bot 2</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bot3">Bot 3</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* MENSAGENS */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-[#1a1a1a]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message max-w-[80%] break-words rounded-lg px-3 py-2 text-sm ${
                  msg.isUser
                    ? "ml-auto bg-pink-500 text-white"
                    : "bg-cyan-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* CAMPO DE TEXTO */}
          <div className="flex gap-2 border-t-2 border-pink-500 p-5">
            <textarea
              rows={1}
              className="flex-1 resize-none rounded-md border-2 border-cyan-300 bg-[#1a1a1a] p-3 text-pink-500 placeholder:text-pink-400 focus:outline-none"
              placeholder="Digite sua mensagem..."
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
      </div>
    </AppLayout>
  );
}