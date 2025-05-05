
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
    const messageStep = output?.data?.find(
      (step: any) => step?.step_details?.message_creation?.message_id
    );

    const messageId = messageStep?.step_details?.message_creation?.message_id;

    if (!messageId) {
      console.warn("No assistant message ID found in step");
      return '';
    }

    console.log("Fetching message content from OpenAI for ID:", messageId);

    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!response.ok) {
      console.error("Error fetching message from OpenAI:", await response.text());
      throw new Error("Failed to fetch message content");
    }

    const data = await response.json();
    console.log("Got full message data from OpenAI:", data);
    
    // Extract the text content from the response
    if (data.content && Array.isArray(data.content)) {
      const textContent = data.content.find((c: any) => c.type === "text");
      const text = textContent?.text?.value || '';
      console.log("Extracted text content:", text);
      return text;
    } else {
      console.warn("Message content has unexpected format:", data);
      return '';
    }
  } catch (error) {
    console.error("Error extracting assistant output:", error);
    return '';
  }
};
