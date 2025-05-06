
import { ChatMessage, ChatThread } from "@/types/chat";

export interface UseThreadsReturnType {
  threads: ChatThread[];
  currentThread: ChatThread | null;
  currentThreadId: string | null;
  loadThreads: () => Promise<void>;
  initializeThread: (threadIdToUse?: string) => Promise<ChatThread | null>;
  updateThreadTitle: (threadId: string, title: string) => Promise<boolean>;
  deleteThread: (threadId: string) => Promise<boolean>;
  setCurrentThread: (thread: ChatThread | null) => void;
  setCurrentThreadId: (threadId: string | null) => void;
}

export interface UseChatbotReturnType {
  messages: ChatMessage[];
  threads: ChatThread[];
  currentThread: ChatThread | null;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  loadThreads: () => Promise<void>;
  switchThread: (threadId: string) => Promise<void>;
  initializeThread: (threadIdToUse?: string) => Promise<ChatThread | null>;
  updateThreadTitle: (threadId: string, title: string) => Promise<boolean>;
  deleteThread: (threadId: string) => Promise<boolean>;
}
