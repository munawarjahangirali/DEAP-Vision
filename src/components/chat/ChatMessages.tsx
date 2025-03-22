import React, { useEffect, useRef, useState } from "react";
import { TypewriterMessage } from "./TypewriterMessage";
import { Copy, Volume2 } from "lucide-react";

interface Message {
  type: "bot" | "user";
  content: string;
  isNew?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const ChatMessages = ({
  messages,
  loading,
  onLoadMore,
  hasMore,
}: ChatMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const previousScrollHeight = useRef<number>(0);
  const isLoadingMore = useRef(false);
  const scrollRestorationTimeout = useRef<NodeJS.Timeout>();

  // Initial scroll to bottom
  useEffect(() => {
    if (containerRef.current && isInitialLoad && messages.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  // Modified scroll position handling after loading more messages
  useEffect(() => {
    if (containerRef.current && !loading && isLoadingMore.current) {
      // Clear any existing timeout
      if (scrollRestorationTimeout.current) {
        clearTimeout(scrollRestorationTimeout.current);
      }

      // Set timeout to ensure DOM has updated
      scrollRestorationTimeout.current = setTimeout(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          const scrollDiff = newScrollHeight - previousScrollHeight.current;
          containerRef.current.scrollTop = scrollDiff > 0 ? scrollDiff : 0;
          isLoadingMore.current = false;
        }
      }, 100);
    }

    return () => {
      if (scrollRestorationTimeout.current) {
        clearTimeout(scrollRestorationTimeout.current);
      }
    };
  }, [messages, loading]);

  // Scroll to bottom for new messages
  useEffect(() => {
    if (containerRef.current && !isLoadingMore.current) {
      const element = containerRef.current;
      const isScrolledNearBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight < 100;

      if (isScrolledNearBottom || messages[messages.length - 1]?.isNew) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [messages]);

  const handleScroll = () => {
    if (!containerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight } = containerRef.current;

    if (scrollTop === 0) {
      isLoadingMore.current = true;
      previousScrollHeight.current = scrollHeight;
      onLoadMore();
    }
  };

  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);

  const toggleTextToSpeech = (text: string, index: number): void => {
    if (currentPlaying === index) {
      speechSynthesis.cancel();
      setCurrentPlaying(null);
    } else {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.onend = () => setCurrentPlaying(null);
      setCurrentPlaying(index);
      speechSynthesis.speak(speech);
    }
  };

  // Process messages into pairs
  const messageGroups = [];
  for (let i = 0; i < messages.length; i += 2) {
    if (messages[i]) {
      messageGroups.push({
        query: messages[i],
        response: messages[i + 1],
      });
    }
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden custom-scrollbar w-full relative"
    >
      <div className="absolute inset-x-0 px-3 lg:px-6">
        <div className="max-w-full flex flex-col space-y-4">
          {loading && messages.length === 0 ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            messageGroups.map((group, index) => (
              <div key={index} className="space-y-2 w-full flex flex-col">
                {/* User message */}
                {group.query && (
                  <div className="flex justify-end w-full">
                    <div className="p-4 rounded-lg gredient-background text-white max-w-[80%] break-words">
                      <div className="whitespace-pre-line overflow-hidden">
                        {group.query.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bot response */}
                {group.response && (
                  <div className="flex justify-start w-full">
                    <div className="p-4 rounded-lg bg-gray-100 text-gray-700 max-w-[80%] break-words">
                      <div className="overflow-hidden">
                        <TypewriterMessage
                          content={group.response.content}
                          isNew={group.response.isNew}
                        />
                      </div>
                      <div className="flex items-center mt-2 gap-2 flex-wrap">
                        <button className="text-gray-500 bg-gray-200 py-1 px-2 rounded-md hover:text-black flex items-center gap-2">
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </button>
                        <button
                          onClick={() => toggleTextToSpeech(group.response.content, index)}
                          className="text-gray-500 bg-gray-200 py-1 px-2 rounded-md hover:text-black flex items-center gap-2"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span className="text-sm">Speak</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {loading && messages.length > 0 && (
            <div className="text-center text-gray-500 py-2">Loading more...</div>
          )}
        </div>
      </div>
    </div>
  );
};