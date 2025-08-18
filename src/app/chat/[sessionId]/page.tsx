"use client";

import { useParams } from "next/navigation";
import { ArrowUp, CirclePlus, Copy, RefreshCw, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loadingDots, setLoadingDots] = useState(".");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_${sessionId}`);
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages) as Message[];
        setMessages(parsed);
      } catch (error) {
        console.error("Error parsing messages:", error);
      }
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingDots((dots) => (dots.length < 3 ? dots + "." : "."));
    }, 300);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setIsLoading(true);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmedInput },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(`${apiBaseUrl}/Chat/send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          content: trimmedInput,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const assistantContent = data.content; // فرض بر این است که API فیلد content برمی‌گرداند

      // شبیه‌سازی استریم کلمه‌به‌کلمه
      const words = assistantContent.split(" ");
      let currentMessage = "";
      let wordIndex = 0;

      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentMessage += (wordIndex > 0 ? " " : "") + words[wordIndex];
          setMessages([
            ...newMessages,
            { role: "assistant", content: currentMessage },
          ]);
          wordIndex++;
        } else {
          clearInterval(streamInterval);
          setIsLoading(false);
          localStorage.setItem(
            `chat_${sessionId}`,
            JSON.stringify([
              ...newMessages,
              { role: "assistant", content: assistantContent },
            ])
          );
        }
      }, 100 + Math.random() * 50); // سرعت متغیر برای حس طبیعی
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "خطا در دریافت پاسخ از سرور!" },
      ]);
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }

      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between bg-background">
      <div className="max-w-[832px] w-full px-4 py-8 flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto space-y-6 px-2 mb-8">
          {messages.length === 0 && (
            <p className="text-center text-gray-500">هیچ پیامی یافت نشد.</p>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-200 text-xs font-medium">
                  {msg.role === "user" ? "شما" : "هوش"}
                </div>
                <span className="text-sm font-semibold">
                  {msg.role === "user" ? "کاربر" : "هوش مصنوعی"}
                </span>
              </div>

              <div className="max-w-[90%] break-words px-3 py-2 text-sm rounded-lg">
                <p className="text-sm leading-6">{msg.content}</p>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs">
                <button
                  onClick={() => handleCopy(msg.content, index)}
                  className={`copy-button inline-flex items-center gap-1 opacity-90 hover:opacity-100 transition-all duration-200 ${
                    copiedIndex === index ? "copied" : ""
                  }`}
                  aria-label="کپی پیام"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 check-icon text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => {
                    console.log("refresh clicked for message:", index);
                  }}
                  className="inline-flex items-center gap-1 opacity-90 hover:opacity-100 transition-all duration-200"
                  aria-label="رفرش پیام"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col text-right">
              <div className="max-w-[90%] px-3 py-2 text-sm rounded-lg">
                <p className="text-sm leading-6">در حال تایپ{loadingDots}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center fixed bottom-5 w-98 md:w-[800px] h-auto"
        >
          <div className="flex items-center w-full bg-white border border-[#E4E4E7] rounded-2xl px-3">
            <button
              type="button"
              className="inline-flex items-center justify-center h-6 w-6 rounded-full text-white"
            >
              <CirclePlus className="w-5 h-5 text-slate-400" />
            </button>

            <textarea
              rows={1}
              placeholder="پیام خود را بنویسید..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              className="flex items-center w-full min-h-9 px-2 py-4 text-sm border-none resize-none text-right outline-none"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                input.trim() && !isLoading
                  ? "bg-[#18181B] text-white"
                  : "bg-[#18181B] text-white opacity-50 cursor-default"
              }`}
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
