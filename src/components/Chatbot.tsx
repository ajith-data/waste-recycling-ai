import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  language,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  language: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, language }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "Chat failed");
    return;
  }

  if (!resp.body) { onError("No response body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch { /* partial */ }
    }
  }
  onDone();
}

interface ChatbotProps {
  initialContext?: string;
}

export default function Chatbot({ initialContext }: ChatbotProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (initialContext) {
      return [{ role: "assistant", content: initialContext }];
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > allMessages.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev.slice(0, -1).length >= allMessages.length ? prev.slice(0, -1) : prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        language,
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${err}` }]);
          setIsLoading(false);
        },
      });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold">{t("chat.title")}</h3>
      </div>

      <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm text-center px-4">
            <p>👋 {t("chat.placeholder")}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="eco-gradient w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-foreground"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>ul]:mb-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === "user" && (
              <div className="bg-secondary w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-2">
            <div className="eco-gradient w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-accent rounded-xl px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={t("chat.placeholder")}
          disabled={isLoading}
          className="text-sm"
        />
        <Button onClick={send} disabled={isLoading || !input.trim()} size="icon" className="eco-gradient text-primary-foreground flex-shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
