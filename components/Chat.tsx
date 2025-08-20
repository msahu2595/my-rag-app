"use client";
import { useState } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { query: input });
      const answer = res.data.answer ?? "";

      // Just clean escaped \n
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer.replace(/\\n/g, "\n") },
      ]);
      setInput("");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto mb-2 space-y-2 px-2">
        {messages.map((m, idx) => (
          <MessageBubble key={idx} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="text-zinc-400 italic px-2">Assistant is typing...</div>
        )}
      </div>

      <div className="flex gap-2 p-2 border-t border-zinc-800">
        <input
          placeholder="Ask something...."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-grow bg-black border border-zinc-700 p-2 rounded disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 rounded-2xl disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
