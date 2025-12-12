import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  mediaUrl?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: 'individual' | 'group';
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
}

interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  createChat: (chat: Omit<Chat, 'id' | 'unreadCount'>) => void;
  sendMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  addMessage: (chatId: string, message: Message) => void;
  markAsRead: (chatId: string) => void;
}

export const useChatStore = create<ChatState>()(persist(
  (set) => ({
    chats: [],
    messages: {},
    
    createChat: (chat) => set((state) => {
      const newChat: Chat = {
        ...chat,
        id: Date.now().toString(),
        unreadCount: 0
      };
      return {
        chats: [...state.chats, newChat],
        messages: { ...state.messages, [newChat.id]: [] }
      };
    }),

    sendMessage: (chatId, message) => set((state) => {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: 'sent'
      };

      const chatMessages = state.messages[chatId] || [];
      const updatedChats = state.chats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              lastMessage: message.text,
              lastMessageTime: newMessage.timestamp
            }
          : chat
      );

      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, newMessage]
        },
        chats: updatedChats
      };
    }),

    addMessage: (chatId, message) => set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, message]
        }
      };
    }),

    markAsRead: (chatId) => set((state) => ({
      chats: state.chats.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    }))
  }),
  {
    name: 'whatsapp-chats'
  }
));