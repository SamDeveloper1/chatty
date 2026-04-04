import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { MessageInput } from "./MessageInput";
import MessageBubble from "./MessageBubble";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    getMessagesByUserId,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeToMessages,
    isTyping,
    markAsRead,
    
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id).then((messages) => {
      subscribeToMessages();
      markAsRead();

     
    });

    return () => unsubscribeToMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-3 sm:px-4 md:px-6 overflow-y-auto py-4 sm:py-6 md:py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">

            {messages.map((msg) => (
              <MessageBubble key={msg._id} msg={msg} />
            ))}

            {isTyping && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-slate-800 text-slate-200 flex items-center gap-1 py-3 px-4">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput/>
    </>
  );
};

export default ChatContainer;