import React, { useRef, useState } from 'react'
import { GoogleGenAI } from '@google/genai';
import InputContainer from './components/InputContainer';
import AssistantMessage from './components/AssistantMessage';
import UserMessage from './components/UserMessage';
import WelcomeScreen from './components/WelcomeScreen';
import { Menu } from 'lucide-react';
import { useModelContext } from './context/ModelContext';
import { systemPrompts } from '../constants';

type MessageType = {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  mode?: string;
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
      setMessages(prev => [...prev, { type: "assistant" as const, content: "An error occured. Please check your API key", timestamp: new Date(), model: "Error", mode: "Error"}])
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
      };
      
      let systemPrompt = systemPrompts.assistant
      if ( selectedModel === 'gemini-2.0-flash' || selectedModel === 'gemini-2.0-flash-lite'){
        if ( selectedMode === 'Bro' ){
          systemPrompt = systemPrompts.bro
        } else if ( selectedMode === 'Developer' ) {
          systemPrompt = systemPrompts.developer
        } else if ( selectedMode === 'Boyfriend' ) {
          systemPrompt = systemPrompts.boyfriend
        } else if ( selectedMode === 'Girlfriend' ) {
          systemPrompt = systemPrompts.girlfriend
        }
      }

      // config.systemPrompt = [{text: systemPrompt}]

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
      for await (const chunk of response) {
        const chunkText = chunk.text || '';
        text += chunkText;


      setMessages(prev => {
          prev[prev.length - 1].content = text
          return [...prev]
        });

    }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => {
        prev[prev.length - 1] = { type: "assistant" as const, content: "Invalid API key", timestamp: new Date(), model: "Error"};
        return [...prev]
      });
      return
    }
  }

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

  return (
    <main className='bg-neutral-950 flex flex-row'>
      <div className={`p-4 bg-neutral-950 flex items-center justify-start gap-4 ${sidebarOpen ? 'hidden' : 'flex'}`}>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-50" />
          </button>
          <h1 className="text-xl font-semibold text-gray-50">AI Chat</h1>
        </div>
      <div className='flex-1 max-w-xl w-full mx-auto h-screen flex flex-col'>
        <div className='flex-1  max-h-screen overflow-y-auto px-2 mt-6 pb-8'>
          { messages.length === 0 ? <WelcomeScreen /> : messages?.map((message, index) => message.type === 'user' ? (
            <UserMessage key={`${message.timestamp.toISOString()}-${index}`} content={message.content} model={message.model} timestamp={message.timestamp} chatEndRef={chatEndRef} />
          ) : (
            <AssistantMessage key={`${message.timestamp.toISOString()}-${index}`} content={message.content} model={message.model} timestamp={message.timestamp} chatEndRef={chatEndRef}
            mode={message.mode as string} />
          ))}
        </div>
        <InputContainer value={input} onChange={(e) => setInput(e.target.value)} onSubmit={handleSubmit} />
      </div>
    </main>
  )
}

export default App



