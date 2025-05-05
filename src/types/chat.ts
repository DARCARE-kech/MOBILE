
import { Enums } from '@/integrations/supabase/types';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id?: string;
  thread_id?: string;
  user_id?: string;
  content: string;
  sender: 'user' | 'assistant' | 'bot' | 'admin';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  timestamp?: string;
}

export interface Thread {
  id: string;
  created_at: number;
  metadata?: Record<string, any>;
}

export interface MessageContent {
  type: 'text';
  text: {
    value: string;
    annotations: any[];
  };
}

export interface MessageResponse {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  role: 'user' | 'assistant';
  content: MessageContent[];
  file_ids: string[];
  assistant_id: string;
  run_id: string;
  metadata: Record<string, any>;
}

export interface RunResponse {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  assistant_id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'requires_action';
  started_at: number | null;
  completed_at: number | null;
  model: string;
  instructions: string | null;
  tools: any[];
  metadata: Record<string, any>;
}

// Add the missing AdminMessage interface
export interface AdminMessage {
  id: string;
  user_id: string;
  category: Enums<'admin_message_category'>;
  message: string;
  image_url?: string | null;
  status: Enums<'admin_message_status'>;
  created_at: string;
}

// Add a ChatThread interface to match the database schema
export interface ChatThread {
  id: string;
  user_id: string;
  thread_id: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
}
