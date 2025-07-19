import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown'
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function UserMessage({ content, model, timestamp, chatEndRef }: { content: string; model?: string; timestamp: Date; chatEndRef: React.RefObject<HTMLDivElement | null> }) {
  
  // Define the markdown components styling for rendering
  const markdownComponents: Components = {
    h1: ({ node, ...props }) => <h1 className='text-xl font-bold mt-4 mb-3' {...props} />,

    h2: ({ node, ...props }) => <h2 className='text-lg font-medium mt-4 mb-2' {...props} />,
 
    p: ({ node, ...props }) => <p className='mb-2 text-sm font-normal' {...props} />,

    ul: ({ node, ...props }) => <ul className='text-sm list-disc list-inside pl-4 mb-2' {...props} />,

    ol: ({ node, ...props }) => <ol className='text-sm list-decimal list-inside pl-4 mb-2' {...props} />,

    code: ({ node, ...props }) => <code className='text-sm font-thin bg-neutral-800 text-neutral-300 rounded-sm px-1 py-[1px] font-mono' {...props} />,

    pre: ({ node, ...props }) => <pre className='text-sm bg-neutral-900 rounded-md border-2 border-purple-950 p-3 my-2 overflow-x-auto' {...props} />,
  };
  
  // Basic ahh copy functionality
  const [ isCopied, setIsCopied ] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }).catch(err => {
      console.error('Failed to copy message: ', err);
    });

  }
  
  return (
    <div ref={chatEndRef} className='px-4 py-3 ml-auto w-fit max-w-[400px] min-w-[200px] text-neutral-50 bg-neutral-900 rounded-l-2xl rounded-b-2xl mb-4'>
      
      {/* Header */}
      <div className='text-xs flex items-center justify-between mb-2'>
        <span className="font-semibold">User</span>
        <span className="text-neutral-600">to: {model}</span>
      </div>

      {/* Main content */}
      <ReactMarkdown components={markdownComponents}>
          {content}
      </ReactMarkdown>

      {/* Footer with timestamp and copy button */}
      <div className='text-xs text-neutral-600 flex items-center justify-between mt-2'>
        <span>{timestamp.toLocaleTimeString()}</span>

        {isCopied ? (
          <Check className="size-4 text-neutral-100"/>
        ) : (
          <Copy className="size-4 hover:text-neutral-200 duration-150 ease-in transition-colors" onClick={handleCopy} />
        )}
      </div>

    </div>
  )
}