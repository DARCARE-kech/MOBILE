
import { AssistantMessage } from './chat';

export interface ThreadState {
  messages: AssistantMessage[];
  threadId: string | null;
  isLoading: boolean;
}

export interface ThreadResponse {
  thread_id: string;
}

export interface MessageResponse {
  generatedText: string;
  error?: string;
}
