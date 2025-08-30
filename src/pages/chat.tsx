import React, { useRef, useState } from 'react'
import { ApiError, GoogleGenAI } from '@google/genai';
import InputContainer from '../components/InputContainer';
import AssistantMessage from '../components/AssistantMessage';
import UserMessage from '../components/UserMessage';
import WelcomeScreen from '../components/WelcomeScreen';
import { useModelContext } from '../context/ModelContext';
import { aiModels, systemPrompts } from '../../constants';
import HistoryAndSave from '../components/HistoryAndSave';
import { TooltipProvider } from '../components/ui/tooltip';
import type { MessageType, ConfigType } from '../types/types';


function Chat() {

  const chatEndRef = useRef<HTMLDivElement | null>(null);       // Used to scroll to the bottom of the chat
  const [messages, setMessages] = useState<MessageType[]>([]);  // Stores the chat messages
  const [input, setInput] = useState('');                       // Stores the user's input 
  const { selectedModel, apiKey, selectedMode } = useModelContext();

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
      scrollToBottom();
  }, [messages]);


  // Function to handle form submission (core of the logic)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim()) return;  // Do nothing if input is empty

    // Create a new message object for the user's input 
    const newMessage: MessageType = {
      type: 'user',
      content: input,
      timestamp: new Date(),
      model: selectedModel,
    };

    // Add the new message to the messages state and reset the input field
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // If the user has not entered their API key, show an error message
    if (apiKey.length === 0){
      setMessages(prev => [...prev, { type: "assistant" as const, content: "An error occured. Please check your API key", timestamp: new Date(), model: "Error", mode: "Error", thoughts: ""}])
      return
    }

    // Prepare the history for the API request
    // Convert messages to the format expected by the Google GenAI API
    const history = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model', // 'assistant' maps to 'model' for the API
      parts: [{ text: msg.content }],
    }));


    // This is where the error prone part starts
    try {

      // Init the client with the API key
      const ai = new GoogleGenAI({ apiKey: apiKey });

      const systemInstruction = systemPrompts[selectedMode.toLowerCase() as keyof typeof systemPrompts] || systemPrompts.assistant;

      // Set the configuration for the model
      const config: ConfigType = {
          responseMimeType: 'text/plain',
          thinkingConfig: {
              includeThoughts: false,
              thinkingBudget: 0, // Default to 0 unless using Gemini 2.5 models
          },
          systemInstruction: [
              {
                  text: systemInstruction
              }
          ]
      };

      // If it is a reasoning model, set the thinking config
      if ( aiModels.find(m => m.slug === selectedModel && m.reasoning) ) {
          if (!config.thinkingConfig) {
              config.thinkingConfig = { includeThoughts: true, thinkingBudget: selectedModel === 'gemini-2.5-flash-reasoning' ? 2058 : 6174 };
          } else {
              config.thinkingConfig.includeThoughts = true; // Enable thoughts for Gemini 2.5 models
              config.thinkingConfig.thinkingBudget = selectedModel === 'gemini-2.5-flash-reasoning' ? 2058 : 6174; // Set thinking budget based on model
          }
      }

      const model = selectedModel.includes('reasoning') ? selectedModel.slice(0, -10) : selectedModel;

      // Prepare the contents for the API request
      const contents = [...history,
        {
          role: 'user',
          parts: [
            {
              text: input,
            },
          ],
        },
      ];

      // Add a loading message to the chat
      // This will be replaced with the actual response from the model
      setMessages(prev => [
        ...prev,
        { type: 'assistant' as const, content: 'Loading...', timestamp: new Date(), model: selectedModel, mode: selectedMode as string },
      ]);


      // Generate the content stream
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      // Complex shit. Basically if the model is thinking add the thinking data else add the answer
      let text = ''
      let thoughts = '';
      let reasoningData = ''
      for await (const chunk of response) {
        const candidates = chunk.candidates;
        if (candidates && candidates[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (!part.text) continue;
            else if (part.thought){
              thoughts = part.text.split('\n')[0] || '';
              reasoningData += part.text || "";
              console.log('Thoughts:', thoughts);
            } else {
              text += chunk.text || '';
            }

            if (text.length > 0) {
              setMessages(prev => {
                prev[prev.length - 1].content = text;
                prev[prev.length - 1].thoughts = reasoningData;
                return [...prev];
              });
            } else if (thoughts.length > 0) {
              setMessages(prev => {
                prev[prev.length - 1].content = thoughts;
                return [...prev];
              });
            }
          }
        }

    }

    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = String(error.message);

        // If the error is related to the API key, show a specific error message
        setMessages(prev => {
          prev[prev.length - 1] = { type: "assistant" as const, content: errorMessage , timestamp: new Date(), model: "Error"};
          return [...prev]
        });
        return
      }

      // If the error is not an ApiError, log it and show a generic error message
      console.error('Unexpected error:', error);
      setMessages(prev => {
        prev[prev.length - 1] = { type: "assistant" as const, content: "Unexpected error occurred", timestamp: new Date(), model: "Error"};
        return [...prev]
      });
      return
    }
  }


  return (
    <TooltipProvider>
      <main className='bg-neutral-950 flex flex-row overflow-x-hidden'>
        <div className='flex-1 max-w-xl w-full mx-auto h-screen flex flex-col overflow-x-hidden'>
          <HistoryAndSave messages={messages} setMessages={setMessages}/>

          <div className='flex-1  max-h-screen overflow-y-auto px-2 pb-8 mt-2'>
            { messages.length === 0 ? <WelcomeScreen /> : messages?.map((message, index) => message.type === 'user' ? (
              <UserMessage key={index} content={message.content} chatEndRef={chatEndRef} />
            ) : (
              <AssistantMessage key={index} content={message.content} model={message.model} chatEndRef={chatEndRef}
              mode={message.mode as string} thoughts={message.thoughts as string} />
            ))}
          </div>
          <InputContainer value={input} onChange={(e) => setInput(e.target.value)} onSubmit={handleSubmit} />
        </div>
      </main>
    </TooltipProvider>
  )
}

export default Chat