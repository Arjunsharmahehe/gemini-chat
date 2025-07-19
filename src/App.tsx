import React, { useRef, useState } from 'react'
import { ApiError, GoogleGenAI } from '@google/genai';
import InputContainer from './components/InputContainer';
import AssistantMessage from './components/AssistantMessage';
import UserMessage from './components/UserMessage';
import WelcomeScreen from './components/WelcomeScreen';
import { useModelContext } from './context/ModelContext';
import { systemPrompts } from '../constants';

type MessageType = {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  mode?: string;
  thoughts?: string;
}


function App() {

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const { selectedModel, apiKey, selectedMode } = useModelContext();

  const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
      scrollToBottom();
  }, [messages]);


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim()) return;

    const newMessage: MessageType = {
      type: 'user',
      content: input,
      timestamp: new Date(),
      model: selectedModel,
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    if (apiKey.length === 0){
      setMessages(prev => [...prev, { type: "assistant" as const, content: "An error occured. Please check your API key", timestamp: new Date(), model: "Error", mode: "Error", thoughts: ""}])
      return
    }

    const history = messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model', // 'assistant' maps to 'model' for the API
      parts: [{ text: msg.content }],
}));


    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });

      const config = {
        responseMimeType: 'text/plain',
        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: selectedModel === 'gemini-2.5-flash' ? 2058 : 6174, // Adjust thinking budget based on model
        }
      };
      
      const systemPrompt = systemPrompts[selectedMode.toLowerCase() as keyof typeof systemPrompts] || systemPrompts.assistant;

      const model = selectedModel as string;

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

      let firstInput = contents[0]?.parts[0]?.text || '';
      if (firstInput.length > 0) {
        firstInput = firstInput.split('||||||')[0].trim()
      }

      contents[0].parts[0].text = systemPrompt + '\n\n||||||\n\n' + firstInput

      setMessages(prev => [
        ...prev,
        { type: 'assistant' as const, content: 'Loading...', timestamp: new Date(), model: selectedModel, mode: selectedMode as string },
      ]);

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let text = ''
      let thoughts = '';
      for await (const chunk of response) {
        const candidates = chunk.candidates;
        if (candidates && candidates[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (!part.text) continue;
            else if (part.thought){
              thoughts += part.text || '';
              console.log('Thoughts:', thoughts);
            } else {
              text += chunk.text || '';
            }

            if (text.length > 0) {
              setMessages(prev => {
                prev[prev.length - 1].content = text;
                prev[prev.length - 1].thoughts = thoughts;
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
        const errorMessage = error.message;
        console.log('API Error:', errorMessage);
        console.log('Error: ', error);
        const errorObject = JSON.parse(errorMessage);
        console.log('Parsed Error:', errorObject);
        setMessages(prev => {
          prev[prev.length - 1] = { type: "assistant" as const, content: errorObject.message , timestamp: new Date(), model: "Error"};
          return [...prev]
        });
        return
      }
      setMessages(prev => {
        prev[prev.length - 1] = { type: "assistant" as const, content: "Unexpected error occurred", timestamp: new Date(), model: "Error"};
        return [...prev]
      });
      return
    }
  }


  return (
    <main className='bg-neutral-950 flex flex-row'>
      <div className='flex-1 max-w-xl w-full mx-auto h-screen flex flex-col'>
        <div className='flex-1  max-h-screen overflow-y-auto px-2 mt-6 pb-8'>
          { messages.length === 0 ? <WelcomeScreen /> : messages?.map((message, index) => message.type === 'user' ? (
            <UserMessage key={`${message.timestamp.toISOString()}-${index}`} content={message.content} model={message.model} timestamp={message.timestamp} chatEndRef={chatEndRef} />
          ) : (
            <AssistantMessage key={`${message.timestamp.toISOString()}-${index}`} content={message.content} model={message.model} timestamp={message.timestamp} chatEndRef={chatEndRef}
            mode={message.mode as string} thoughts={message.thoughts as string} />
          ))}
        </div>
        <InputContainer value={input} onChange={(e) => setInput(e.target.value)} onSubmit={handleSubmit} />
      </div>
    </main>
  )
}

export default App



