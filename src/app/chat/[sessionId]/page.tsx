"use client";

import { useParams } from "next/navigation";
import {
  ArrowUp,
  CirclePlus,
  Copy,
  Pencil,
  RefreshCw,
  Check,
  Square,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Cookies from "js-cookie";
import { Button } from "@/components/Button";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
  const [user, setUser] = useState("شما");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const currentStreamInterval = useRef<NodeJS.Timeout | null>(null);
  const manuallyTriggeredRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [credit, setCredit] = useState<number | null>(null);
  const [isCreditZeroModalOpen, setIsCreditZeroModalOpen] = useState(false);

  const readCredit = () => {
    const raw = localStorage.getItem("userCredit");
    if (raw === null) {
      setCredit(null);
      setIsCreditZeroModalOpen(false);
      return;
    }
    const num = Number(raw);
    if (!isNaN(num)) {
      setCredit(num);
      setIsCreditZeroModalOpen(num <= 0);
    } else {
      setCredit(null);
      setIsCreditZeroModalOpen(false);
    }
  };

  useEffect(() => {
    readCredit();
    window.addEventListener("storage", readCredit);
    window.addEventListener("creditUpdated", readCredit as EventListener);
    return () => {
      window.removeEventListener("storage", readCredit);
      window.removeEventListener("creditUpdated", readCredit as EventListener);
    };
  }, []);

  const remainderCredit = credit ?? 500;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    setUser(Cookies.get("user_name") || "شما");

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
          `${apiBaseUrl}/chat/get_history/${sessionId}`
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

  const handleGetResponse = useCallback(
    async (content: string, refreshIndex?: number) => {
      const trimmedInput = content.trim();
      if (!trimmedInput) return;

      setIsLoading(true);

      let baseMessages: Message[] = [];

      setMessages((prev) => {
        if (refreshIndex !== undefined) {
          baseMessages = prev.slice(0, refreshIndex);
          return baseMessages;
        } else {
          const last = prev[prev.length - 1];
          if (last && last.role === "user" && last.content === trimmedInput) {
            baseMessages = prev;
            return prev;
          } else {
            baseMessages = [...prev, { role: "user", content: trimmedInput }];
            return baseMessages;
          }
        }
      });

      try {
        const response = await fetch(`${apiBaseUrl}/chat/send_message`, {
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

        if (currentStreamInterval.current) {
          clearInterval(currentStreamInterval.current);
          currentStreamInterval.current = null;
        }

        currentStreamInterval.current = setInterval(() => {
          if (wordIndex < words.length) {
            currentMessage += (wordIndex > 0 ? " " : "") + words[wordIndex];
            setMessages(() => [
              ...baseMessages,
              { role: "assistant", content: currentMessage } as Message,
            ]);
            wordIndex++;
          } else {
            if (currentStreamInterval.current) {
              clearInterval(currentStreamInterval.current);
              currentStreamInterval.current = null;
            }
            setIsLoading(false);
            const finalMessages: Message[] = [
              ...baseMessages,
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
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "خطا در دریافت پاسخ از سرور!",
          } as Message,
        ]);
        setIsLoading(false);
      }
    },
    [sessionId, apiBaseUrl]
  );

  useEffect(() => {
    if (manuallyTriggeredRef.current) return;
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "user" &&
      !isLoading
    ) {
      handleGetResponse(messages[messages.length - 1].content);
    }
  }, [messages, isLoading, handleGetResponse]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    if (remainderCredit <= 0) {
      console.warn("کاربر تلاش به ارسال پیام کرده اما اعتبار تمام شده.");
      return;
    }

    const trimmedInput = input.trim();
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

    manuallyTriggeredRef.current = true;
    setMessages(newMessages);
    setInput("");

    try {
      await handleGetResponse(trimmedInput, refreshIndex);
    } finally {
      manuallyTriggeredRef.current = false;
    }
  };

  const handleStopGeneration = () => {
    if (currentStreamInterval.current) {
      clearInterval(currentStreamInterval.current);
      currentStreamInterval.current = null;
    }
    setIsLoading(false);
    localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
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

    try {
      console.log("Sending to /edit_message:", {
        session_id: sessionId,
        message_index: index,
        new_content: trimmedInput,
      });
      const response = await fetch(`${apiBaseUrl}/edit_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          message_index: index,
          new_content: trimmedInput,
        }),
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const newMessages = data.messages || [];
      setMessages(newMessages);
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(newMessages));

      if (
        newMessages.length > 0 &&
        newMessages[newMessages.length - 1].role === "assistant"
      ) {
        const assistantContent = newMessages[newMessages.length - 1].content;
        const words = assistantContent.split(" ");
        let currentMessage = "";
        let wordIndex = 0;
        const baseMessages = newMessages.slice(0, -1);

        if (currentStreamInterval.current) {
          clearInterval(currentStreamInterval.current);
          currentStreamInterval.current = null;
        }

        currentStreamInterval.current = setInterval(() => {
          if (wordIndex < words.length) {
            currentMessage += (wordIndex > 0 ? " " : "") + words[wordIndex];
            setMessages([
              ...baseMessages,
              { role: "assistant", content: currentMessage },
            ]);
            wordIndex++;
          } else {
            if (currentStreamInterval.current) {
              clearInterval(currentStreamInterval.current);
              currentStreamInterval.current = null;
            }
            setMessages(newMessages);
          }
        }, 100 + Math.random() * 50);
      }
    } catch (error) {
      console.error("Error editing message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "خطا در ویرایش پیام و دریافت پاسخ!" },
      ]);
    } finally {
      setIsLoading(false);
      setEditingIndex(null);
      setEditInput("");
    }
  };

  const handleRefresh = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (index > 0 && messages[index - 1].role === "user") {
      const userMessage = messages[index - 1].content;
      handleGetResponse(userMessage, index);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between bg-background">
      <div className="h-12 w-full fixed top-0 z-50 bg-white border-b md:hidden flex items-center  px-6">
        <SidebarTrigger />
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="border rounded-sm py-0.5 px-1"
        >
          <path
            d="M18.0001 4.99982C17.7401 4.99982 17.4901 4.89982 17.2901 4.70982C16.9001 4.31982 16.9001 3.68982 17.2901 3.29982L20.2901 0.299824C20.6801 -0.0901758 21.3101 -0.0901758 21.7001 0.299824C22.0901 0.689824 22.0901 1.31982 21.7001 1.70982L18.7001 4.70982C18.5001 4.90982 18.2501 4.99982 17.9901 4.99982H18.0001Z"
            fill="#71717A"
          />
          <path
            d="M1.00006 21.9998C0.740059 21.9998 0.490059 21.8998 0.290059 21.7098C-0.0999414 21.3198 -0.0999414 20.6898 0.290059 20.2998L3.29006 17.2998C3.68006 16.9098 4.31006 16.9098 4.70006 17.2998C5.09006 17.6898 5.09006 18.3198 4.70006 18.7098L1.70006 21.7098C1.50006 21.9098 1.25006 21.9998 0.990059 21.9998H1.00006Z"
            fill="#71717A"
          />
          <path
            d="M7.00006 20.9998C6.13006 20.9998 5.26006 20.6698 4.59006 19.9998L1.99006 17.3998C1.34006 16.7498 0.990059 15.8998 0.990059 14.9898C0.990059 14.0798 1.35006 13.2298 1.99006 12.5898L4.29006 10.2898C4.68006 9.89982 5.31006 9.89982 5.70006 10.2898L11.7001 16.2898C12.0901 16.6798 12.0901 17.3098 11.7001 17.6998L9.40006 19.9998C8.73006 20.6698 7.86006 20.9998 6.99006 20.9998H7.00006ZM5.00006 12.4098L3.41006 13.9998C3.14006 14.2698 3.00006 14.6198 3.00006 14.9898C3.00006 15.3598 3.14006 15.7198 3.41006 15.9798L6.01006 18.5798C6.55006 19.1298 7.44006 19.1298 7.99006 18.5798L9.59006 16.9798L5.00006 12.3898V12.4098Z"
            fill="#71717A"
          />
          <path
            d="M6.50006 13.4998C6.24006 13.4998 5.99006 13.3998 5.79006 13.2098C5.40006 12.8198 5.40006 12.1898 5.79006 11.7998L8.29006 9.29982C8.68006 8.90982 9.31006 8.90982 9.70006 9.29982C10.0901 9.68983 10.0901 10.3198 9.70006 10.7098L7.20006 13.2098C7.00006 13.4098 6.75006 13.4998 6.49006 13.4998H6.50006Z"
            fill="#71717A"
          />
          <path
            d="M9.50006 16.4998C9.24006 16.4998 8.99006 16.3998 8.79006 16.2098C8.40006 15.8198 8.40006 15.1898 8.79006 14.7998L11.2901 12.2998C11.6801 11.9098 12.3101 11.9098 12.7001 12.2998C13.0901 12.6898 13.0901 13.3198 12.7001 13.7098L10.2001 16.2098C10.0001 16.4098 9.75006 16.4998 9.49006 16.4998H9.50006Z"
            fill="#71717A"
          />
          <path
            d="M17.0001 11.9998C16.7401 11.9998 16.4901 11.8998 16.2901 11.7098L10.2901 5.70982C9.90006 5.31982 9.90006 4.68982 10.2901 4.29982L12.5901 1.99982C13.2401 1.34982 14.0901 0.999824 15.0001 0.999824C15.9101 0.999824 16.7601 1.35982 17.4001 1.99982L20.0001 4.59982C21.3301 5.93982 21.3301 8.08982 20.0001 9.41982L17.7001 11.7198C17.5001 11.9198 17.2501 12.0098 16.9901 12.0098L17.0001 11.9998ZM12.4101 4.99982L17.0001 9.58982L18.5901 7.99982C19.1401 7.44982 19.1401 6.56982 18.5901 6.01982L15.9901 3.41982C15.7201 3.14982 15.3701 3.00982 15.0001 3.00982C14.6301 3.00982 14.2801 3.15982 14.0101 3.41982L12.4101 5.01982V4.99982Z"
            fill="#71717A"
          />
        </svg>
      </div>
      <div className="max-w-[832px] w-full px-4 pt-4 pb-8 flex flex-col flex-1 ">
        <div className="flex-1 overflow-y-auto space-y-6 px-2 mb-8">
          {messages.length === 0 && (
            <p className="text-center text-gray-500">هیچ پیامی یافت نشد.</p>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-200 text-xs font-medium">
                  {msg.role === "user" ? (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z"
                        fill="#18181B"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18 11.3332C16.6193 11.3332 15.5 12.4525 15.5 13.8332C15.5 15.2139 16.6193 16.3332 18 16.3332C19.3807 16.3332 20.5 15.2139 20.5 13.8332C20.5 12.4525 19.3807 11.3332 18 11.3332ZM13.8333 13.8332C13.8333 11.532 15.6988 9.6665 18 9.6665C20.3012 9.6665 22.1667 11.532 22.1667 13.8332C22.1667 16.1344 20.3012 17.9999 18 17.9999C15.6988 17.9999 13.8333 16.1344 13.8333 13.8332ZM12.5537 20.887C13.3351 20.1056 14.3949 19.6666 15.5 19.6666H20.5C21.6051 19.6666 22.6649 20.1056 23.4463 20.887C24.2277 21.6684 24.6667 22.7282 24.6667 23.8333V25.5C24.6667 25.9602 24.2936 26.3333 23.8334 26.3333C23.3731 26.3333 23 25.9602 23 25.5V23.8333C23 23.1703 22.7366 22.5344 22.2678 22.0655C21.7989 21.5967 21.1631 21.3333 20.5 21.3333H15.5C14.8369 21.3333 14.201 21.5967 13.7322 22.0655C13.2633 22.5344 12.9999 23.1703 12.9999 23.8333V25.5C12.9999 25.9602 12.6268 26.3333 12.1666 26.3333C11.7064 26.3333 11.3333 25.9602 11.3333 25.5V23.8333C11.3333 22.7282 11.7722 21.6684 12.5537 20.887Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z"
                        fill="black"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.0633 8C22.4903 8.47141 25.0738 10.1938 26.8137 13.1669C28.454 16.4988 28.3932 19.8016 26.6314 23.0753C24.8208 25.952 22.2171 27.573 18.8202 27.9383C17.4423 27.9383 16.0645 27.9383 14.6866 27.9383C14.6866 25.75 14.6866 23.5616 14.6866 21.3733C16.9056 21.3934 19.1142 21.3731 21.3125 21.3125C21.3125 19.0836 21.3125 16.8547 21.3125 14.6258C19.0836 14.6258 16.8547 14.6258 14.6258 14.6258C14.5652 16.8241 14.5449 19.0327 14.5651 21.2517C12.3767 21.2517 10.1884 21.2517 8 21.2517C8 16.8344 8 12.4172 8 8C11.6878 8 15.3755 8 19.0633 8Z"
                        fill="white"
                      />
                    </svg>
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
                        className="px-3 py-1 text-sm h-8 w-15"
                      >
                        انصراف
                      </Button>
                      <Button
                        onClick={() => handleConfirmEdit(index)}
                        className="px-3 py-1 text-sm h-8 w-15"
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

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={!isLoading ? handleSubmit : (e) => e.preventDefault()}
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
                if (!isMobile && e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              className="flex items-center w-full min-h-9 px-2 py-4 text-sm border-none resize-none text-right outline-none overflow-auto max-h-[200px]"
              disabled={isLoading || remainderCredit <= 0}
            />

            {isLoading ? (
              <button
                type="button"
                onClick={handleStopGeneration}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors duration-200 shadow-md hover:shadow-lg"
                aria-label="توقف پاسخ"
              >
                <Square className="w-5 h-5" />
              </button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim() || remainderCredit <= 0}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${
                  input.trim() && remainderCredit > 0
                    ? "bg-black text-white hover:bg-gray-800 transition-colors duration-200 shadow-md hover:shadow-lg"
                    : "bg-gray-400 text-white opacity-50 cursor-default"
                }`}
              >
                <ArrowUp className="w-6 h-6" />
              </Button>
            )}
          </div>
        </form>
      </div>

      {isCreditZeroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-[90%] z-60 shadow-lg text-right">
            <h3 className="text-lg font-semibold mb-2">اعتبار به پایان رسید</h3>
            <p className="text-sm text-gray-700 mb-4">
              اعتبار شما به پایان رسیده است. تا زمان شارژ مجدد امکان ارسال پیام
              وجود ندارد.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsCreditZeroModalOpen(false)}
                className="px-3 py-1 rounded bg-gray-100"
              >
                باشه
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
