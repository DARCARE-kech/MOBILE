
export type MessageSender = 'user' | 'bot' | 'admin';
export type AdminMessageStatus = 'unread' | 'read' | 'responded';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
}

export interface AdminMessage {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  image_url?: string;
  status: AdminMessageStatus;
  created_at: string;
}
