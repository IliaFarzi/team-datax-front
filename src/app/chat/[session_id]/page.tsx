"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Modal from "@/components/model";
import SendSvg from "../../../../public/Svg/send";

interface Message {
  role: "user" | "assistant" | "loading";
  content: string;
  id?: number;
}

interface SendMessageRequest {
  content: string;
}

export default function ChatPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { session_id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const { register, handleSubmit, reset } = useForm<SendMessageRequest>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!session_id || session_id === "undefined") {
          throw new Error("session id is incorrect.");
        }
        const token = localStorage.getItem("token");
        if (!token) throw new Error("please first log in");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/get_history/${session_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok)
          throw new Error(`error for get history: ${response.status}`);

        const history = await response.json();
        const historyWithIds = history.map((msg: Message, index: number) => ({
          ...msg,
          id: index,
        }));
        setMessages(historyWithIds);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        setErrorMessage(errorMessage);
      }
    };

    if (session_id) fetchHistory();
  }, [session_id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (data: SendMessageRequest) => {
    try {
      if (!session_id || session_id === "undefined") {
        throw new Error("session id is incorrect");
      }
      const token = localStorage.getItem("token");
      if (!token) throw new Error("please first login");

      const userMessage: Message = {
        role: "user",
        content: data.content,
        id: messages.length,
      };
      const loadingMessage: Message = {
        role: "loading",
        content: "دستیار در حال تحلیل کردن",
        id: messages.length + 1,
      };
      setMessages([...messages, userMessage, loadingMessage]);
      reset();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/send_message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ session_id, content: data.content }),
        }
      );

      if (!response.ok)
        throw new Error(`error for send your message: ${response.status}`);

      const result = await response.json();

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.role === "loading" && msg.id === loadingMessage.id
            ? { role: "assistant", content: result.response, id: msg.id }
            : msg
        )
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setErrorMessage(errorMessage);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.role !== "loading")
      );
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100 mt-19">
        {/* Chat Area */}
        <div className="w-full p-4 flex flex-col h-screen pb-40">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4">
            <h1 className="text-center text-[20px] font-semibold italic md:text-2xl">
              به صفحه چت خوش آمدید،چطور میتوانم کمک تان کنم؟
            </h1>
            {messages.map((message) => (
              <div
                key={message.id ?? messages.indexOf(message)}
                className={`flex items-start my-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "user" ? (
                  <>
                    <div
                      className={`p-3 rounded-lg w-[25%] bg-[#4F46E5] text-white`}
                    >
                      {message.content.includes("http") ? (
                        <a
                          href={message.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 underline"
                        >
                          {message.content}
                        </a>
                      ) : (
                        message.content
                      )}
                      <div className="text-xs text-gray-200 mt-1">03:27 PM</div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        U
                      </div>
                    </div>
                  </>
                ) : message.role === "loading" ? (
                  <>
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        SL
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg w-[50%] bg-gray-200 text-left italic text-gray-600`}
                    >
                      <span className="chat-loading-dots">
                        {message.content}
                      </span>{" "}
                      <div className="text-xs text-gray-400 mt-1">
                        در حال بارگذاری...
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        SL
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg w-[50%] bg-white text-left`}
                    >
                      {message.content.includes("http") ? (
                        <a
                          href={message.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {message.content}
                        </a>
                      ) : (
                        message.content
                      )}
                      <div className="text-xs text-gray-400 mt-1">03:27 PM</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col fixed bottom-6 left-5 md:left-80 right-5 md:right-80 p-4 bg-white h-35 border border-[#E2E8F0] rounded-2xl inset-shadow-[#10182808] shadow-2xs"
          >
            <input
              {...register("content", {
                required: "you should write something",
              })}
              placeholder="Message to assistant..."
              className="flex-1 p-2 rounded-lg mr-2 outline-0"
            />
            <div className="self-end">
              <button
                type="submit"
                className="p-2 bg-[#4F46E5] text-white rounded-lg flex items-center gap-3"
              >
                Send
                <SendSvg />
              </button>
            </div>
          </form>
        </div>
        <Modal
          errorMessage={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      </div>
    </>
  );
}
