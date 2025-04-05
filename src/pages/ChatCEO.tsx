import { useEffect, useRef, useState } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const sendMessage = async (message) => {
    try {
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

      setTimeout(() => {
        setIsTyping(false);
        if (botResponse) {
          appendMessage(botResponse, false);
        } else {
          appendMessage("Desculpe, não consegui processar sua mensagem.", false);
        }
      }, 1500);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setIsTyping(false);
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
    </div>
  );
}
