"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/common/Loader";
import axiosInstance from "@/services/axios";
import { useMutation } from "@tanstack/react-query";
import { Copy, Volume2, Send, Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/common/Button";
import ReactMarkdown from "react-markdown";

interface Message {
  type: "bot" | "user";
  content: string;
  isNew?: boolean;
}

const ChatPage = () => {
  const { profileData } = useAuth();
  const userId = profileData?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(3);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fetchChatHistory = async (currentLimit: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/chat-history", {
        params: { user_id: userId, limit: currentLimit },
      });

      const data = response.data.data;
      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      const newMessages = data
        .map((entry: any) => ([
          { type: "user", content: entry.query, isNew: false },
          { type: "bot", content: entry.response, isNew: false }
        ]))
        .flat();

      setMessages(prev => [...newMessages, ...prev]);
      if (data.length < currentLimit) setHasMore(false);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChatHistory(limit);
    }
  }, [userId]);

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    const newLimit = limit + 10;
    setLimit(newLimit);
    await fetchChatHistory(newLimit);
  };

  const sendMessage = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (message: string) => {
      await sendingChat(message);
    },
    onSettled: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
  });

  const sendingChat = async (message: string) => {
    setMessages(prev => [...prev, { type: "user", content: message, isNew: true }]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId }),
    });

    if (!response.ok) {
      console.error("Failed to fetch chat response");
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullBotMessage = "";

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      const lines = chunkText.split("\n").filter(line => line.startsWith("data: "));
      
      for (const line of lines) {
        const jsonString = line.replace(/^data: /, "");
        try {
          const parsedData = JSON.parse(jsonString);
          fullBotMessage = parsedData.message.content.parts[0];
          
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.type === "bot") {
              return [...prev.slice(0, -1), { type: "bot", content: fullBotMessage, isNew: true }];
            }
            return [...prev, { type: "bot", content: fullBotMessage, isNew: true }];
          });
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent | null, question?: string) => {
    if (e) e.preventDefault();
    if (!question && message.trim() === "") return;

    const finalMessage = question || message;
    setMessage("");
    sendMessage.mutate(finalMessage);
  };

  const handleSpeechToggle = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        toast.success("Voice input captured!");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Speech recognition failed.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }

    setIsListening(!isListening);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-125px)]">
      <ChatSidebar
        onPromptClick={(prompt: any) => handleSubmit(null, prompt.query)}
      />
      <div className="flex-1 rounded-xl bg-white shadow-sm h-full relative py-3">
        <ChatMessages
          messages={messages}
          loading={loading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="absolute bottom-6 left-6 right-6"
        >
          <div className="absolute left-6 top-2">
            <Button
              variant="secondary"
              type="button"
              className={`p-2 rounded-lg transition-colors ${
                isListening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={handleSpeechToggle}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>
          <div className="flex items-end gap-1.5 pl-4 md:gap-2">
            <div className="flex min-w-0 flex-1 flex-col">
              <input
                ref={inputRef}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message to ChatBOT"
                className="w-full px-20 py-3 pr-28 border rounded-lg focus:outline-none focus:ring-0"
                disabled={sendMessage.isPending}
              />
            </div>
          </div>
          <div className="absolute right-2 top-2">
            <Button
              variant="primary"
              isLoading={loading}
              className="p-2 btn-primary text-white rounded-lg transition-colors"
              onClick={() => handleSubmit()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;