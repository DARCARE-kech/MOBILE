
import { ChatMessage } from "@/types/chat";

export interface UseMessagesReturnType {
  messages: ChatMessage[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadMessages: (threadId: string) => Promise<ChatMessage[]>;
  sendMessage: (content: string, threadId: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}
