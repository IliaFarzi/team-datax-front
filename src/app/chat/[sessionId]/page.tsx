"use client";

import { useParams } from "next/navigation";
import {
  ArrowUp,
  CirclePlus,
  Copy,
  Pencil,
  RefreshCw,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Cookies from "js-cookie";
import Image from "next/image";
import { Button } from "@/components/Button";

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");
  const [loadingDots, setLoadingDots] = useState(".");
  const [user, setUser] = useState("شما");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    setUser(Cookies.get("user_name") || "شما");
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = localStorage.getItem(`chat_${sessionId}`);
      if (storedMessages) {
        try {
          const parsed = JSON.parse(storedMessages) as Message[];
          setMessages(parsed);
          return;
        } catch (error) {
          console.error("Error parsing messages:", error);
        }
      }

      try {
        const response = await fetch(
          `${apiBaseUrl}/Chat/get_history/${sessionId}`
        );
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        const history = data.messages || [];
        setMessages(history);
        localStorage.setItem(`chat_${sessionId}`, JSON.stringify(history));
      } catch (error) {
        console.error("Error fetching history:", error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [sessionId, apiBaseUrl]);

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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    if (editRef.current) {
      editRef.current.style.height = "auto";
      editRef.current.style.height = `${Math.min(
        editRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [editInput]);

  const handleSubmit = async (e: React.FormEvent, refreshIndex?: number) => {
    e.preventDefault();
    const trimmedInput =
      refreshIndex !== undefined
        ? messages[refreshIndex - 1].content
        : input.trim();
    if (!trimmedInput) return;

    setIsLoading(true);

    let newMessages: Message[];
    if (refreshIndex !== undefined) {
      newMessages = [...messages.slice(0, refreshIndex)];
    } else {
      newMessages = [
        ...messages,
        { role: "user", content: trimmedInput } as Message,
      ];
    }

    setMessages(newMessages);
    if (refreshIndex === undefined) setInput("");

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
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantContent =
        data.content ||
        data.response ||
        data.message ||
        "جوابی از سمت ایجنت نیومد!";
      const words = assistantContent.split(" ");
      let currentMessage = "";
      let wordIndex = 0;

      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentMessage += (wordIndex > 0 ? " " : "") + words[wordIndex];
          setMessages([
            ...newMessages,
            { role: "assistant", content: currentMessage } as Message,
          ]);
          wordIndex++;
        } else {
          clearInterval(streamInterval);
          setIsLoading(false);
          const finalMessages: Message[] = [
            ...newMessages,
            { role: "assistant", content: assistantContent } as Message,
          ];
          setMessages(finalMessages);
          localStorage.setItem(
            `chat_${sessionId}`,
            JSON.stringify(finalMessages)
          );
        }
      }, 100 + Math.random() * 50);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "خطا در دریافت پاسخ از سرور!",
        } as Message,
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

  const handleEdit = (index: number, content: string) => {
    setEditingIndex(index);
    setEditInput(content);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditInput("");
  };

  const handleConfirmEdit = async (index: number) => {
    const trimmedInput = editInput.trim();
    if (!trimmedInput) return;

    setIsLoading(true);

    const newMessages: Message[] = [...messages.slice(0, index)];
    newMessages.push({ role: "user", content: trimmedInput });

    setMessages(newMessages);
    setEditingIndex(null);
    setEditInput("");

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
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantContent =
        data.content ||
        data.response ||
        data.message ||
        "جوابی از سمت ایجنت نیومد!";
      const words = assistantContent.split(" ");
      let currentMessage = "";
      let wordIndex = 0;

      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentMessage += (wordIndex > 0 ? " " : "") + words[wordIndex];
          setMessages([
            ...newMessages,
            { role: "assistant", content: currentMessage } as Message,
          ]);
          wordIndex++;
        } else {
          clearInterval(streamInterval);
          setIsLoading(false);
          const finalMessages: Message[] = [
            ...newMessages,
            { role: "assistant", content: assistantContent } as Message,
          ];
          setMessages(finalMessages);
          localStorage.setItem(
            `chat_${sessionId}`,
            JSON.stringify(finalMessages)
          );
        }
      }, 100 + Math.random() * 50);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "خطا در دریافت پاسخ از سرور!",
        } as Message,
      ]);
      setIsLoading(false);
    }
  };

  const handleRefresh = (index: number, e: React.MouseEvent) => {
    if (index > 0 && messages[index - 1].role === "user") {
      handleSubmit(e as unknown as React.FormEvent, index);
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
                  {msg.role === "user" ? (
                    <Image
                      src="/images/user.png"
                      height={36}
                      width={36}
                      alt="userImage"
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/images/datax.png"
                      height={36}
                      width={36}
                      alt="dataxImage"
                      className="rounded-full"
                    />
                  )}
                </div>
                <span className="text-sm font-semibold">
                  {msg.role === "user" ? user : "دیتاکس"}
                </span>
              </div>

              <div className="max-w-[90%] break-words px-3 py-2 text-sm rounded-lg">
                {editingIndex === index && msg.role === "user" ? (
                  <>
                    <textarea
                      ref={editRef}
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleConfirmEdit(index);
                        }
                      }}
                      className="w-full min-h-9 px-2 py-2 text-sm border border-[#E4E4E7] rounded-lg resize-none overflow-auto text-right outline-none max-h-[200px]"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={"ghost"}
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-sm h-8 w-15 "
                      >
                        انصراف
                      </Button>
                      <Button
                        onClick={() => handleConfirmEdit(index)}
                        className="px-3 py-1 text-sm h-8 w-15 "
                      >
                        تایید
                      </Button>
                    </div>
                  </>
                ) : (
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      p: ({ children }) => (
                        <p className="text-sm leading-6 text-gray-800">
                          {children}
                        </p>
                      ),
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <pre className="bg-[#2F2F2F] p-4 rounded-xl text-sm font-mono leading-relaxed text-white shadow-sm border border-[#3A3A3A]">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code
                            className="bg-[#E5E7EB] px-1.5 py-0.5 rounded-md text-sm font-mono text-gray-800"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mt-3 mb-2 text-gray-900">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-semibold mt-2 mb-1 text-gray-900">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-sm text-gray-800 my-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-sm text-gray-800 my-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="my-1">{children}</li>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-blue-600 hover:underline hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>

              {!(editingIndex === index && msg.role === "user") && (
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

                  {msg.role === "user" && (
                    <button
                      onClick={() => handleEdit(index, msg.content)}
                      className="inline-flex items-center gap-1 opacity-90 hover:opacity-100 transition-all duration-200"
                      aria-label="ویرایش پیام"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  {msg.role === "assistant" && (
                    <button
                      onClick={(e) => handleRefresh(index, e)}
                      className="inline-flex items-center gap-1 opacity-90 hover:opacity-100 transition-all duration-200"
                      aria-label="رفرش پیام"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
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
          className="flex flex-col items-center fixed bottom-5 w-[92%] md:w-[800px] h-auto"
        >
          <div className="flex items-center w-full bg-white border border-[#E4E4E7] rounded-2xl px-3">
            <button
              type="button"
              className="inline-flex items-center justify-center h-6 w-6 rounded-full text-white"
            >
              <CirclePlus className="w-5 h-5 text-slate-400" />
            </button>

            <textarea
              ref={inputRef}
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
              className="flex items-center w-full min-h-9 px-2 py-4 text-sm border-none resize-none text-right outline-none overflow-auto max-h-[200px]"
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
