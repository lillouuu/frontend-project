"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "How can I improve my LinkedIn visibility?",
  "What should I post this week?",
  "How do I build a strong manager profile?",
  "Why is my score only 63?",
];

const mockReplies: Record<string, string> = {
  default: "Based on your current audit results, here's what I'd recommend focusing on first: your manager profile is empty, which is the single biggest lever you have right now. Completing it could move your score from 63 to around 85. Want me to guide you through what to write for each section?",
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = mockReplies[text] ?? mockReplies.default;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex h-screen flex-col bg-white font-sans">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 px-8 py-5">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Workspace / AI Assistant</p>
          <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
          <p className="mt-1 text-sm text-slate-500">I know your company, your audit score, and your goals.</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Clear chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4fa]">
              <Sparkles className="h-7 w-7 text-[#4a7aa8]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Ask me anything about your LinkedIn strategy</h2>
            <p className="mt-2 text-sm text-slate-400">I know your company, your audit score, and your goals.</p>

            <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xl">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="mr-3 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4fa]">
                    <Sparkles className="h-3.5 w-3.5 text-[#4a7aa8]" />
                  </div>
                )}
                <div className={`max-w-sm rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0f1c33] text-white"
                    : "border border-slate-100 bg-slate-50 text-slate-800"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="mr-3 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4fa]">
                  <Sparkles className="h-3.5 w-3.5 text-[#4a7aa8]" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 px-8 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-[#4a7aa8] focus-within:ring-1 focus-within:ring-[#4a7aa8]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
              placeholder="Ask about your LinkedIn strategy..."
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#0f1c33] text-white disabled:opacity-40 hover:bg-[#1a2f50]"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            The assistant knows your company profile, audit results and goals.
          </p>
        </div>
      </div>
    </div>
  );
}