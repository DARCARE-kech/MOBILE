
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVoiceAssistant = (
  threadId: string | null,
  sendMessage: (content: string) => Promise<void>
) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Toggle listening state
  const toggleListening = async () => {
    if (!threadId) {
      toast({
        title: 'Error',
        description: 'Cannot start voice recording - thread not initialized',
        variant: 'destructive'
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Start recording
  const startListening = async () => {
    try {
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', async () => {
        if (audioChunksRef.current.length === 0) return;
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioToText(audioBlob);
        
        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      });

      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: 'Voice Assistant',
        description: 'Listening...',
      });
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive'
      });
    }
  };

  // Stop recording
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  // Process audio to text using OpenAI's Whisper API via Supabase function
  const processAudioToText = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        if (!reader.result) return;
        
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Call Supabase function to process audio
        const { data, error } = await supabase.functions.invoke('process-voice', {
          body: { 
            audio: base64Audio,
            assistant_id: 'asst_lVVTwlHHW2pHH0gPKYcLmXXz'
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data?.text) {
          setVoiceTranscript(data.text);
          await sendMessage(data.text);
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Error',
        description: 'Could not process voice input',
        variant: 'destructive'
      });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    toggleListening,
    voiceTranscript
  };
};
