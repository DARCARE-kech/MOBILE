
import { ChatMessage, ChatThread } from "@/types/chat";

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
