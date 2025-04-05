import { useEffect, useRef, useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Olá! Como posso ajudar você hoje?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

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
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-[#0f0f0f] to-black font-[Montserrat] px-4">
      <div className="flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-pink-500 bg-[#121212] shadow-[0_0_30px_#ff007f66]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm shadow-md transition-all ${
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
        <div className="flex items-end gap-2 border-t border-pink-500 bg-[#121212] p-4">
          <textarea
            rows={1}
            className="flex-1 resize-none rounded-lg border border-cyan-300 bg-black px-4 py-3 text-sm text-pink-400 placeholder:text-pink-400 focus:border-pink-500 focus:outline-none"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ height: "auto", overflow: "hidden" }}
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-cyan-300 hover:text-black"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
