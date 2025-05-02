
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainHeader from '@/components/MainHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Code2, FileCode, FileJson, MessageSquare, Settings } from 'lucide-react';

const ChatbotInfo: React.FC = () => {
  const { t } = useTranslation();
  
  // List of files related to the chatbot feature
  const chatbotFiles = [
    {
      type: 'screen',
      name: 'Chatbot.tsx',
      description: 'Main chatbot interface screen that displays conversation history and message input',
      icon: <MessageSquare className="h-4 w-4 text-darcare-gold" />
    },
    {
      type: 'screen',
      name: 'ChatHistory.tsx',
      description: 'Screen showing past conversations with the chatbot',
      icon: <MessageSquare className="h-4 w-4 text-darcare-gold" />
    },
    {
      type: 'component',
      name: 'ChatMessage.tsx',
      description: 'Component for rendering individual chat messages with styling for user vs AI',
      icon: <FileCode className="h-4 w-4 text-blue-400" />
    },
    {
      type: 'component',
      name: 'ChatInput.tsx',
      description: 'Component handling user message input with submission logic',
      icon: <FileCode className="h-4 w-4 text-blue-400" />
    },
    {
      type: 'integration',
      name: 'openaiClient.ts',
      description: 'Configuration for the OpenAI API client',
      icon: <Settings className="h-4 w-4 text-green-400" />
    },
    {
      type: 'integration',
      name: 'useChatbot.ts',
      description: 'Hook for managing chatbot state, messages, and API interactions',
      icon: <Code2 className="h-4 w-4 text-purple-400" />
    },
    {
      type: 'helper',
      name: 'chatUtils.ts',
      description: 'Helper functions for formatting messages, handling threads, etc.',
      icon: <FileJson className="h-4 w-4 text-yellow-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-darcare-navy p-4 pt-20 pb-24">
      <MainHeader title={t('chatbot.assistant')} onBack={() => window.history.back()} />
      
      <Card className="bg-darcare-navy border-darcare-gold/20 mb-6">
        <CardHeader>
          <CardTitle className="text-darcare-gold font-serif">{t('chatbot.assistant')} - {t('common.settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-darcare-beige mb-4">
            The chatbot feature is implemented across several files that handle different aspects of functionality:
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="screens" className="border-darcare-gold/20">
              <AccordionTrigger className="text-darcare-gold">Screens</AccordionTrigger>
              <AccordionContent>
                {chatbotFiles.filter(f => f.type === 'screen').map((file, index) => (
                  <div key={index} className="py-2 flex items-start gap-3">
                    {file.icon}
                    <div>
                      <p className="text-darcare-gold font-medium">{file.name}</p>
                      <p className="text-darcare-beige/80 text-sm">{file.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="components" className="border-darcare-gold/20">
              <AccordionTrigger className="text-darcare-gold">Components</AccordionTrigger>
              <AccordionContent>
                {chatbotFiles.filter(f => f.type === 'component').map((file, index) => (
                  <div key={index} className="py-2 flex items-start gap-3">
                    {file.icon}
                    <div>
                      <p className="text-darcare-gold font-medium">{file.name}</p>
                      <p className="text-darcare-beige/80 text-sm">{file.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="integration" className="border-darcare-gold/20">
              <AccordionTrigger className="text-darcare-gold">Integration</AccordionTrigger>
              <AccordionContent>
                {chatbotFiles.filter(f => f.type === 'integration').map((file, index) => (
                  <div key={index} className="py-2 flex items-start gap-3">
                    {file.icon}
                    <div>
                      <p className="text-darcare-gold font-medium">{file.name}</p>
                      <p className="text-darcare-beige/80 text-sm">{file.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="helpers" className="border-darcare-gold/20">
              <AccordionTrigger className="text-darcare-gold">Helpers</AccordionTrigger>
              <AccordionContent>
                {chatbotFiles.filter(f => f.type === 'helper').map((file, index) => (
                  <div key={index} className="py-2 flex items-start gap-3">
                    {file.icon}
                    <div>
                      <p className="text-darcare-gold font-medium">{file.name}</p>
                      <p className="text-darcare-beige/80 text-sm">{file.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotInfo;
