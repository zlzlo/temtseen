import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content:
      "Сайн байна уу! Би сургуультай холбоотой асуултад тань хариулахад бэлэн байна."
  }
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const messagesRef = useRef<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        window.setTimeout(() => {
          endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        setError(null);
      }

      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    void sendMessage(trimmed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !isLoading) {
        void sendMessage(trimmed);
      }
    }
  };

  async function sendChat(text: string) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }]
      })
    });

    const payload: { reply?: string; error?: string } = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error || "Серверийн алдаа");
    }

    const reply = payload.reply?.trim();
    if (!reply) {
      throw new Error("Missing assistant reply");
    }

    return reply;
  }

  async function sendMessage(content: string) {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content
    };

    const updatedMessages = [...messagesRef.current, userMessage];
    messagesRef.current = updatedMessages;
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const assistantReply = await sendChat(content.trim());
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: assistantReply
      };

      const finalMessages = [...messagesRef.current, assistantMessage];
      messagesRef.current = finalMessages;
      setMessages(finalMessages);
    } catch (error) {
      console.error("Chatbot error", error);
      const errorText =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "Түр алдаа гарлаа. Дараа дахин оролдоно уу.";

      const assistantErrorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content: errorText
      };

      const finalMessages = [...messagesRef.current, assistantErrorMessage];
      messagesRef.current = finalMessages;
      setMessages(finalMessages);
      setError(errorText);
    } finally {
      setIsLoading(false);
      window.setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {isOpen && (
        <div className="pointer-events-auto flex w-[min(22rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
          <div className="flex items-start justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="text-sm font-semibold">Туслах чатбот</p>
              <p className="text-xs text-primary-foreground/80">Онлайнаар танд тусална</p>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              className="rounded-full p-1 text-primary-foreground/80 transition hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label="Цонхыг хаах"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex h-80 flex-col bg-muted/20">
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full",
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                      message.role === "assistant"
                        ? "bg-background text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Бодож байна...</span>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
            <form onSubmit={handleSubmit} className="border-t border-border bg-background p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onFocus={() => setError(null)}
                  onKeyDown={handleKeyDown}
                  placeholder="Асуултаа бичээрэй..."
                  rows={2}
                  className="resize-none text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input.trim().length === 0}
                  className="shrink-0"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="sr-only">Илгээх</span>
                </Button>
              </div>
              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
            </form>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={handleToggle}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-label="Туслах чатбот нээх"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
