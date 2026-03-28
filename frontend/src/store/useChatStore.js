import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  isTyping: false,
  

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", String(next));
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, isTyping: false, smartReplies: [] });
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  markAsRead: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    try {
      await axiosInstance.put(`/messages/read/${selectedUser._id}`);
    } catch (error) {
      console.error("[markAsRead] Failed:", error.message);
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      isRead: false,
      reactions: [],
    };

    set((state) => ({ messages: [...state.messages, optimisticMessage] }));
    set({ smartReplies: [] }); // clear suggestions after sending

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== tempId).concat(res.data),
      }));
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  
  // ─── Typing Indicator ─────────────────────────────────────────────────────

  sendTyping: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    if (!socket || !selectedUser) return;
    socket.emit("typing", { receiverId: selectedUser._id });
  },

  sendStopTyping: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    if (!socket || !selectedUser) return;
    socket.emit("stopTyping", { receiverId: selectedUser._id });
  },

  // ─── Emoji Reactions ──────────────────────────────────────────────────────

  reactToMessage: async (messageId, emoji) => {
    const { authUser } = useAuthStore.getState();
    const myId = authUser._id.toString();

    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg._id?.toString() !== messageId) return msg;
        const reactions = msg.reactions || [];
        const existingIndex = reactions.findIndex((r) => r.userId?.toString() === myId);
        let updatedReactions;
        if (existingIndex !== -1) {
          if (reactions[existingIndex].emoji === emoji) {
            updatedReactions = reactions.filter((_, i) => i !== existingIndex);
          } else {
            updatedReactions = reactions.map((r, i) =>
              i === existingIndex ? { ...r, emoji } : r
            );
          }
        } else {
          updatedReactions = [...reactions, { emoji, userId: myId }];
        }
        return { ...msg, reactions: updatedReactions };
      }),
    }));

    try {
      await axiosInstance.post(`/messages/${messageId}/react`, { emoji });
    } catch (error) {
      console.error("[reactToMessage] Failed:", error.message);
      toast.error("Failed to add reaction");
      const { selectedUser } = get();
      if (selectedUser) get().getMessagesByUserId(selectedUser._id);
    }
  },

  // ─── Subscriptions ────────────────────────────────────────────────────────

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStopTyping");
    socket.off("messagesRead");
    socket.off("messageReaction");

    socket.on("newMessage", (newMessage) => {
      const incomingSenderId = newMessage.senderId?.toString();
      const currentUserId = selectedUser._id?.toString();
      if (incomingSenderId !== currentUserId) return;

      const alreadyExists = get().messages.some((m) => m._id === newMessage._id);
      if (alreadyExists) return;

      // Build the updated messages array first
      const updatedMessages = [...get().messages, newMessage];

      // Set messages in store
      set({ messages: updatedMessages });

      get().markAsRead();

     

      if (get().isSoundEnabled) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch((e) => console.log("[Audio] Play failed:", e));
      }
    });

    socket.on("userTyping", ({ senderId }) => {
      if (senderId?.toString() === selectedUser._id?.toString()) {
        set({ isTyping: true });
      }
    });

    socket.on("userStopTyping", ({ senderId }) => {
      if (senderId?.toString() === selectedUser._id?.toString()) {
        set({ isTyping: false });
      }
    });

    socket.on("messagesRead", ({ messageIds }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          messageIds.includes(msg._id?.toString()) ? { ...msg, isRead: true } : msg
        ),
      }));
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id?.toString() === messageId ? { ...msg, reactions } : msg
        ),
      }));
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStopTyping");
    socket.off("messagesRead");
    socket.off("messageReaction");
  },
}));