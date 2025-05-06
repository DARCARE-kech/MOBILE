
import { ChatMessage } from "@/types/chat";

/**
 * Extrait le contenu textuel d'un message OpenAI
 * @param message Message retourné par l'API OpenAI
 * @returns Contenu textuel du message
 */
export const extractMessageContent = (message: any): string => {
  console.log("Extracting content from message:", message);
  if (!message?.content || !Array.isArray(message.content)) return '';
  
  const textContent = message.content.find((item: any) => item.type === 'text');
  const result = textContent?.text?.value || '';
  console.log("Extracted content:", result);
  return result;
};

/**
 * Extracts text from the assistant's run output
 * @param output Output from OpenAI assistant run
 * @returns Extracted text or empty string if not found
 */
export const extractAssistantOutput = async (output: any, threadId: string): Promise<string> => {
  console.log("Extracting assistant output:", output);
  
  try {
    // Instead of looking for specific step details, we'll get the latest messages
    console.log("Fetching latest messages from thread:", threadId);
    
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!response.ok) {
      console.error("Error fetching messages from OpenAI:", await response.text());
      throw new Error("Failed to fetch messages");
    }

    const messagesData = await response.json();
    console.log("Got thread messages from OpenAI:", messagesData);
    
    // Find the latest assistant message
    const assistantMessages = messagesData.data.filter((msg: any) => msg.role === 'assistant');
    
    if (!assistantMessages || assistantMessages.length === 0) {
      console.error("No assistant messages found in thread");
      return '';
    }
    
    // Get the most recent assistant message (first in the array as they're sorted by created_at in descending order)
    const latestMessage = assistantMessages[0];
    
    // Extract the text content from the response
    if (latestMessage.content && Array.isArray(latestMessage.content)) {
      const textContent = latestMessage.content.find((c: any) => c.type === "text");
      const text = textContent?.text?.value || '';
      console.log("Extracted assistant message text:", text);
      return text;
    } else {
      console.warn("Message content has unexpected format:", latestMessage);
      return '';
    }
  } catch (error) {
    console.error("Error extracting assistant output:", error);
    return '';
  }
};
